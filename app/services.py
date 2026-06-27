# services.py
from django.db import transaction
from django.db.models import Max
from .models import Item, ItemVersion
from django.utils import timezone

def create_item_version(*, item_id: int, ct: bytes, nonce: bytes, sha256_hex: str,
                        cipher: str = "AES-256-GCM",
                        filename_ct: bytes | None = None,
                        filename_nonce: bytes | None = None) -> ItemVersion:
    if len(nonce) != 12:
        raise ValueError("AES-GCM nonce must be 12 bytes")
    if filename_nonce is not None and len(filename_nonce) != 12:
        raise ValueError("filename_nonce must be 12 bytes")

    with transaction.atomic():
        item = Item.objects.select_for_update().get(pk=item_id)

        prev = item.current_revision
        next_no = (item.versions.aggregate(m=Max("version_no"))["m"] or 0) + 1

        new_ver = ItemVersion.objects.create(
            item=item,
            version_no=next_no,
            previous_version=prev,
            file=ct,
            cipher=cipher,
            cipher_nonce=nonce,
            sha256_cipher=sha256_hex,
            filename_ct=filename_ct,
            filename_nonce=filename_nonce,
        )

        item.current_revision = new_ver
        item.save(update_fields=["current_revision", "updated_at"])

        # ---- PRUNE: keep the newest `version_limit` versions ----
        limit = item.version_limit
        if limit and limit > 0:
            active_qs = item.versions.filter(deleted_at__isnull=True)
            total = active_qs.count()
            if total > limit:
                to_remove = total - limit

                # Oldest first by version_no; collect primary keys (avoid slicing + delete)
                old_ids = list(
                    active_qs.order_by("version_no")
                             .exclude(pk=new_ver.pk)            # paranoia: don’t delete the one we just made
                             .values_list("pk", flat=True)[:to_remove]
                )

                if old_ids:
                    # HARD DELETE (uncomment one of the two blocks)

                    # 1) Hard delete:
                    ItemVersion.objects.filter(pk__in=old_ids).delete()

                    # 2) Or soft delete:
                    # ItemVersion.objects.filter(pk__in=old_ids)\
                    #     .update(deleted_at=timezone.now())

        return new_ver
