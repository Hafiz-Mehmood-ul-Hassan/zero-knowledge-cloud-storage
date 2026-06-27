# app/acl.py
from django.utils import timezone
from django.db.models import Q
from rest_framework.exceptions import NotFound, PermissionDenied
from .models import Item, ItemVersion, ItemAccess

def _has_active_grant(user_id: int, item_id: int):
    """Return 'editor' | 'viewer' | None based on active grant."""
    now = timezone.now()
    g = (ItemAccess.objects
         .filter(item_id=item_id, user_id=user_id, revoked_at__isnull=True)
         .filter(Q(expires_at__isnull=True) | Q(expires_at__gt=now))
         .only("is_editor", "is_viewer")
         .first())
    if not g:
        return None
    return "editor" if g.is_editor else "viewer"

def require_access_for_item(request, item_id: int, need: str = "view"):
    """
    need: "view" or "edit"
    returns: (item, role) where role in {"owner","editor","viewer"}
    raises: NotFound (no access), PermissionDenied (insufficient)
    """
    user = request.user
    try:
        item = Item.objects.select_related("owner", "current_revision").get(pk=item_id)
    except Item.DoesNotExist:
        # do not reveal item existence
        raise NotFound()

    # owner has full control
    if item.owner_id == user.id:
        return item, "owner"

    role = _has_active_grant(user.id, item.id)
    if role is None:
        raise NotFound()  # hide presence

    if need == "view":
        return item, role
    if need == "edit" and role == "editor":
        return item, role

    # viewer trying to edit, or invalid need
    raise PermissionDenied("You have viewer access — editing is not allowed.")

def require_access_for_version(request, version_id: int, need: str = "view", current_only: bool = True):
    """
    Access for a specific ItemVersion.
    If current_only=True, only the item's current_revision is accessible.
    """
    user = request.user
    try:
        ver = (ItemVersion.objects
               .select_related("item", "item__owner", "item__current_revision")
               .get(pk=version_id))
    except ItemVersion.DoesNotExist:
        raise NotFound()

    item = ver.item

    # if restricting to current only
    if current_only and item.current_revision_id != ver.id:
        # you can use PermissionDenied or NotFound; NotFound hides history
        raise PermissionDenied("Only the current version is accessible.")

    # reuse item-level check
    # (viewer can read, editor/owner can edit)
    if item.owner_id == user.id:
        return ver, "owner"

    role = _has_active_grant(user.id, item.id)
    if role is None:
        raise NotFound()

    if need == "view":
        return ver, role
    if need == "edit" and role == "editor":
        return ver, role

    raise PermissionDenied("You have viewer access — editing is not allowed.")
