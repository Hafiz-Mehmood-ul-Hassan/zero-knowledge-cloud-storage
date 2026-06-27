from rest_framework import serializers as serializer
from .models import VerificationCode, User,Item,ItemVersion,ItemAccess,ItemVersionActivity
from .services import create_item_version
import hashlib, base64
class VerificationCodeSerializer(serializer.ModelSerializer):
    class Meta:
        model = VerificationCode
        fields = '__all__'



class UserSerializer1(serializer.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email','two_factor_enabled','email_verified','password']
        extra_kwargs = {'password': {'write_only': True},
                        'email': {'read_only': True},
                        'email_verified': {'read_only': True},
                        'username': {'read_only': True},
                        }
        def update(self, instance, validated_data):
            password = validated_data.pop("password", None)
            # baki fields update karo
            for attr, value in validated_data.items():
                setattr(instance, attr, value)

            # agar password aya ho to hash kar ke set karo
            if password:
                instance.set_password(password)
            instance.save()
            return instance


class UserSerializer(serializer.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
class ChangePasswordSerializer(serializer.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','password']
    

  
class LoginSerializer(serializer.Serializer):
    
    username = serializer.CharField()
    password = serializer.CharField()


    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        user = User.objects.filter(username=username).first()
        if user is None:
            raise serializer.ValidationError("User does not exist")
        if not user.check_password(password):
            raise serializer.ValidationError("Password is incorrect")
        return attrs



class ItemVersionSerializer(serializer.ModelSerializer):
    class Meta:
        model = ItemVersion
        fields = '__all__'


class LogoutSerializer(serializer.Serializer):
    refresh = serializer.CharField()




class ItemVersionUploadSerializer(serializer.Serializer):
    item_id = serializer.IntegerField()
    ciphertext_b64 = serializer.CharField()
    nonce_b64 = serializer.CharField()
    sha256_cipher = serializer.CharField()
    filename_ct_b64 = serializer.CharField(required=False, allow_blank=True)
    filename_nonce_b64 = serializer.CharField(required=False, allow_blank=True)

    def validate(self, data):
        try:
            ct = base64.b64decode(data["ciphertext_b64"])
            nonce = base64.b64decode(data["nonce_b64"])
        except Exception:
            raise serializer.ValidationError("Invalid base64 for ciphertext/nonce")
        if len(nonce) != 12:
            raise serializer.ValidationError("AES-GCM nonce must be 12 bytes")

        calc = hashlib.sha256(ct).hexdigest()
        if calc.lower() != data["sha256_cipher"].lower():
            raise serializer.ValidationError("Integrity check failed (sha256 mismatch)")

        fct = fnonce = None
        if data.get("filename_ct_b64"):
            try:
                fct = base64.b64decode(data["filename_ct_b64"])
            except Exception:
                raise serializer.ValidationError("Invalid base64 for filename_ct_b64")
        if data.get("filename_nonce_b64"):
            try:
                fnonce = base64.b64decode(data["filename_nonce_b64"])
            except Exception:
                raise serializer.ValidationError("Invalid base64 for filename_nonce_b64")
            if len(fnonce) != 12:
                raise serializer.ValidationError("filename_nonce must be 12 bytes")

        data["_decoded"] = {"ct": ct, "nonce": nonce, "fct": fct, "fnonce": fnonce}
        return data

    def create(self, validated_data):
        d = validated_data["_decoded"]
        return create_item_version(
            item_id=validated_data["item_id"],
            ct=d["ct"],
            nonce=d["nonce"],
            sha256_hex=validated_data["sha256_cipher"],
            cipher="AES-256-GCM",
            filename_ct=d["fct"],
            filename_nonce=d["fnonce"],
        )


class ItemSerializer(serializer.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class ItemAccessSerializer(serializer.ModelSerializer):
    class Meta:
        model = ItemAccess
        fields = '__all__'


class ItemVersionActivitySerializer(serializer.ModelSerializer):
    class Meta:
        model = ItemVersionActivity
        fields = '__all__'