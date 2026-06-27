from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import Q

# Create your models here.

class User(AbstractUser):
    """
    Login is with USERNAME (default Django).
    Email is stored for OTP delivery and uniqueness.
    """
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)     # set True after signup email confirm
    two_factor_enabled = models.BooleanField(default=False) # if True, require email OTP after password

    # Optional: helpful display
    def __str__(self):
        return self.username

class VerificationCode(models.Model):
    PURPOSE_SIGNUP = "signup_email"
    PURPOSE_LOGIN_2FA = "login_2fa"
    PURPOSE_RESET = "reset_password"

    PURPOSE_CHOICES = [
        (PURPOSE_SIGNUP, "Signup Email"),
        (PURPOSE_LOGIN_2FA, "Login 2FA"),
        (PURPOSE_RESET, "Reset Password"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name="verification_codes"
    )
    email = models.EmailField()
    purpose = models.CharField(max_length=32, choices=PURPOSE_CHOICES)
    code_hash = models.CharField(max_length=64)             # OTP ka hash
    expires_at = models.DateTimeField()
    consumed_at = models.DateTimeField(null=True, blank=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    meta_json = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.purpose} for {self.email}"
    

class Item(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="items")
    name = models.CharField(max_length=255)  # PLAINTEXT filename (UI)
    current_revision = models.ForeignKey("ItemVersion", null=True, blank=True,
                                         on_delete=models.SET_NULL, related_name="+")
    version_limit = models.PositiveIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["owner", "-updated_at"])]

    def __str__(self):
        return f"Item {self.name} (owner={self.owner_id})"


class ItemVersion(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="versions")
    version_no = models.PositiveIntegerField()  # 1..N (unique per item)
    previous_version = models.ForeignKey("self", null=True, blank=True,
                                         on_delete=models.SET_NULL, related_name="next_versions")

    # File content (ciphertext)
    file = models.BinaryField()
    cipher = models.CharField(max_length=32, default="AES-256-GCM")
    cipher_nonce = models.BinaryField()              # 12 bytes
    sha256_cipher = models.CharField(max_length=64)  # exact hex length

    # Encrypted filename (per-version)
    filename_ct = models.BinaryField(null=True, blank=True)
    filename_nonce = models.BinaryField(null=True, blank=True)  # 12 bytes if used

    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["item", "version_no"], name="uq_item_version_no"),
        ]
        indexes = [models.Index(fields=["item", "deleted_at", "version_no"])]
        ordering = ["item_id", "version_no"]

    def clean(self):
        if self.cipher.upper().startswith("AES") and self.cipher_nonce and len(self.cipher_nonce) != 12:
            raise ValidationError("AES-GCM nonce must be 12 bytes.")
        if self.sha256_cipher and len(self.sha256_cipher) != 64:
            raise ValidationError("sha256_cipher must be a 64-char hex string.")
        if self.filename_nonce and len(self.filename_nonce) != 12:
            raise ValidationError("filename_nonce must be 12 bytes.")

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"ItemVersion item={self.item_id} v{self.version_no}"
    

class ItemAccess(models.Model):
    """
    Minimal ACL:
      - One active grant per (item, user)
      - Exactly one role true (editor XOR viewer)
      - Owner is NOT represented here (use Item.owner)
    """
    item = models.ForeignKey("app.Item", on_delete=models.CASCADE, related_name="access_list")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="item_accesses")

    # roles (exactly one must be true)
    is_editor = models.BooleanField(default=False)
    is_viewer = models.BooleanField(default=True)

    # lifecycle
    expires_at = models.DateTimeField(null=True, blank=True)
    revoked_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # exactly one role true: (editor XOR viewer)
        constraints = [
            models.CheckConstraint(
                name="chk_one_role_editor_xor_viewer",
                check=(Q(is_editor=True, is_viewer=False) | Q(is_editor=False, is_viewer=True)),
            ),
            # only one ACTIVE grant per (item,user)
            models.UniqueConstraint(
                fields=["item", "user"],
                condition=Q(revoked_at__isnull=True),
                name="uq_active_item_user",
            ),
        ]
        indexes = [
            models.Index(fields=["item", "user"]),
            models.Index(fields=["user"]),                # "shared with me" lists
            models.Index(fields=["item", "is_editor"]),   # quick edit checks
        ]

    def __str__(self):
        role = "editor" if self.is_editor else "viewer"
        return f"Access(item={self.item_id}, user={self.user_id}, role={role})"

    @property
    def is_active(self):
        from django.utils import timezone
        if self.revoked_at is not None:
            return False
        return (self.expires_at is None) or (self.expires_at > timezone.now())


class ItemVersionActivity(models.Model):
    version = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name="activities",
        db_index=True,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,   # user delete ho to log rahe
        null=True, blank=True,
        db_index=True,
    )
    task = models.CharField(max_length=40)  # e.g. "VERSION_CREATED", "CT_DOWNLOADED"
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=["version", "-created_at"]),
            models.Index(fields=["user", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.task} v{self.version_id} by {self.user_id} @ {self.created_at}"
