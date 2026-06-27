import random
from .models import ItemVersionActivity, User,Item


def generate_otp_code():
    return str(random.randint(100000, 999999))

# print(generate_otp_code())

def log_version_task(*, user_id: int | None, version_id: int, task: str) -> ItemVersionActivity:
    """
    Minimal logger: sirf version, user, task store karta hai; time auto set hota hai.
    Usage: log_version_task(user_id=request.user.id, version_id=ver.id, task="VERSION_CREATED")
    """
    version = Item.objects.only("id").get(id=version_id)
    user = None
    if user_id is not None:
        user = User.objects.only("id").get(id=user_id)
    return ItemVersionActivity.objects.create(version=version, user=user, task=task)