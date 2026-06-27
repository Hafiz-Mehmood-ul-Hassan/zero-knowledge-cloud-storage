from django.contrib import admin
from .models import User, VerificationCode,Item,ItemVersion,ItemAccess,ItemVersionActivity

admin.site.register(User)
admin.site.register(VerificationCode)
admin.site.register(Item)
admin.site.register(ItemAccess)
admin.site.register(ItemVersion)
admin.site.register(ItemVersionActivity)


# Register your models here.
