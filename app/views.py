from rest_framework.views import APIView
from .serilizer import VerificationCodeSerializer,LogoutSerializer,ItemAccessSerializer, ItemVersionUploadSerializer, UserSerializer,UserSerializer1, LoginSerializer, ItemSerializer,ItemVersionSerializer, ItemVersionActivitySerializer
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from .models import VerificationCode,Item,ItemAccess,ItemVersionActivity
from django.utils import timezone
from datetime import timedelta
from .models import User, VerificationCode
from .helper_method import generate_otp_code, log_version_task
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .permission import require_access_for_item
from rest_framework import status
from .send_mailer import send_mail

# Create your views here.



class RegisterUser(APIView):
    def post(self, request):
        if not request.data.get('email') or not request.data.get('username') or not request.data.get('password'):
            return Response({"error": "Missing required fields"}, status=400)
        # check username and email exist or not

        if User.objects.filter(email=request.data.get('email')).exists():
            return Response({"error": "Email already exists"}, status=400)

        if User.objects.filter(username=request.data.get('username')).exists():
            return Response({"error": "Username already exists"}, status=400)

        hashed_password=make_password(request.data.get('password'))
        # Create the user and send verification email
        otp_code = generate_otp_code()
        data={
              "email": request.data.get('email'),
              "purpose": "signup_email",
              "code_hash": otp_code,
              "expires_at": timezone.now() + timedelta(minutes=5),
              "meta_json": {"username": request.data.get('username'), "password": hashed_password},
            }


        serilizer=VerificationCodeSerializer(data=data)
        if serilizer.is_valid():
            serilizer.save()
            send_mail(otp_code,serilizer.data["email"])
            return Response({ "id": serilizer.data['id'], "OTP_SENT": True}, status=201)
        else:
            return Response(serilizer.errors, status=400)


class VerifyCode(APIView):
    def post(self, request):
        # Check otp and id exist or not
        otp=request.data.get('otp')
        id=request.data.get('id')
        if not otp or not id:
            return Response({"error": "Missing required fields"}, status=400)
        verification_code = VerificationCode.objects.filter(id=id).first()
        
        try:
            match verification_code.purpose:
                case "signup_email":
                    if not verification_code:
                        return Response({"error": "Invalid OTP"}, status=400)
                    if verification_code.expires_at < timezone.now():
                        return Response({"error": "OTP has expired"}, status=400)
                    if verification_code.consumed_at:
                        return Response({"error": "OTP has already been consumed"}, status=400)        
                    if verification_code.attempts >= 2:
                        return Response({"error": "Maximum attempts reached"}, status=400)
                    if verification_code.code_hash != otp:
                        verification_code.attempts += 1
                        verification_code.save()
                        return Response({"error": "Invalid OTP"}, status=400)
                    if verification_code.code_hash == otp:
                        verification_code.consumed_at = timezone.now()
                        if verification_code.purpose == "signup_email":
                            data={
                                "email": verification_code.email,
                                "username": verification_code.meta_json.get('username'),
                                "password": verification_code.meta_json.get('password'),
                                "email_verified": True,
                                "two_factor_enabled": False,
                            }
                            serilizer=UserSerializer(data=data)
                            if serilizer.is_valid():
                                serilizer.save()
                                verification_code.delete()
                                return Response({"message": "User created successfully"}, status=200)
                            else:
                                return Response(serilizer.errors, status=400)
                
                case "login_2fa":
                    if not verification_code:
                        return Response({"error": "Invalid OTP"}, status=400)
                    if verification_code.expires_at < timezone.now():
                        return Response({"error": "OTP has expired"}, status=400)
                    if verification_code.consumed_at:
                        return Response({"error": "OTP has already been consumed"}, status=400)        
                    if verification_code.attempts >= 2:
                        return Response({"error": "Maximum attempts reached"}, status=400)
                    if verification_code.code_hash != otp:
                        verification_code.attempts += 1
                        verification_code.save()
                        return Response({"error": "Invalid OTP"}, status=400)
                    if verification_code.code_hash == otp:
                        verification_code.consumed_at = timezone.now()
                        verification_code.delete()
                        # return the jwt token
                        user = verification_code.user
                        
                        refresh = RefreshToken.for_user(user)
                        return Response({
                            "token": {
                                "refresh": str(refresh),
                                "access": str(refresh.access_token),
                            }
                        }, status=200)  
        except Exception as e:
            return Response({"error": str(e)}, status=400)
    def put(self, request):
        otp=request.data.get('otp')
        id=request.data.get('id')
        password=request.data.get('password')
        if not otp or not id or not password:
            return Response({"error": "Missing required fields"}, status=400)
        verification_code = VerificationCode.objects.filter(id=id).first()
        try:
            if not verification_code:
                return Response({"error": "Invalid OTP"}, status=400)
            if verification_code.expires_at < timezone.now():
                return Response({"error": "OTP has expired"}, status=400)
            if verification_code.consumed_at:
                return Response({"error": "OTP has already been consumed"}, status=400)
            if verification_code.attempts >= 2:
                return Response({"error": "Maximum attempts reached"}, status=400)
            if verification_code.code_hash != otp:
                verification_code.attempts += 1
                verification_code.save()
                return Response({"error": "Invalid OTP"}, status=400)
            if verification_code.code_hash == otp:
                verification_code.consumed_at = timezone.now()
                user = User.objects.filter(email=verification_code.email).first()
                user.password=make_password(password)
                verification_code.delete()
                user.save()
                return Response({"message": "Password changed successfully"}, status=200)
            return Response({"error": "Invalid OTP"}, status=400)   
        except Exception as e:
            return Response({"error": str(e)}, status=400) 

class Reset_Password(APIView):
    def post(self, request):
        username=request.data.get('username')
        user=User.objects.filter(username=username).first()
        if user is None:
            return Response({"error": "User does not exist"}, status=400)
        otp_code = generate_otp_code()
        data={
          'user': user.id,
          "email": user.email,
          "purpose": "reset_password",
          "code_hash": otp_code,
          "expires_at": timezone.now() + timedelta(minutes=5),
          "meta_json": {"username": username},
        }
        serilizer=VerificationCodeSerializer(data=data)
        if serilizer.is_valid():
            serilizer.save()
            send_mail(otp_code,user.email)
            return Response({"id":serilizer.data['id'], "OTP_SENT": True, "email": user.email[(user.email.index('@')-2):]}, status=201)
        else:
            return Response(serilizer.errors, status=400)


class LoginView(APIView):
    def post(self, request):
        serilizer=LoginSerializer(data=request.data)
        if serilizer.is_valid():
            
            user=User.objects.filter(username=request.data.get('username'))
            # check 2fa enabled
            if user.first().two_factor_enabled:
                otp_code = generate_otp_code()
                data={
                  'user': user.first().id,
                  "email": user.first().email,
                  "purpose": "login_2fa",
                  "code_hash": otp_code,
                  "expires_at": timezone.now() + timedelta(minutes=5),
                  "meta_json": {"username": request.data.get('username')},
                }
                serilizer=VerificationCodeSerializer(data=data)

                if serilizer.is_valid():
                    serilizer.save()
                    send_mail(otp_code,user.first().email)
                    return Response({"id":serilizer.data['id'], "OTP_SENT": True}, status=201)
                else:
                    return Response(serilizer.errors, status=400)
            else:
                refresh = RefreshToken.for_user(user.first())
                return Response({
                    "token": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }
                }, status=200)
        else:
            return Response(serilizer.errors, status=400)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        s = LogoutSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        try:
            refresh_token = s.validated_data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

class ItemAccessView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, item_id=None):
        
        # check point is owner
        item,role=require_access_for_item(request, item_id)
        if role=='viewer' or role=='editor':
            return Response({"error":"You don't have access to this item"},status=400)
        # check point is owner
        if item.owner_id!=request.user.id:
            return Response({"error":"You don't have access to this item"},status=400)
        
        if item_id:
            items=ItemAccess.objects.filter(item=item_id)
        else:
            return Response({"error":"item_id is required"},status=400)
        serilizer=ItemAccessSerializer(items,many=True)
        for i in serilizer.data:
            username=User.objects.filter(id=i['user']).first().username
            i.update({'username':username})
        
        
        return Response(serilizer.data,status=200)
    def post(self, request):
        
        user=User.objects.filter(username=request.data.get('user')).first()
        request.data.update({'user':user.id})
        if user is None:
            return Response({"error":"User does not exist","success":False},status=400)
        

        item,role=require_access_for_item(request, request.data.get('item'))
        if role=='viewer' or role=='editor':
            return Response({"error":"You don't allow to add this item","success":False},status=400)
        
        if item.owner_id!=request.user.id:
            return Response({"error":"You don't have access to this item","success":False},status=400)
        serilizer=ItemAccessSerializer(data=request.data)
        if serilizer.is_valid():
            serilizer.save()
            log_version_task(user_id=request.data.get('user'),version_id=request.data.get('item'),task="ACCESS_GRANTED")
            return Response({"user":request.data.get('user'),"success":True}, status=201)
        else:
            return Response(serilizer.errors, status=400)
        
    def put(self, request):
        item,role=require_access_for_item(request, request.data.get('item'))
        if role=='viewer' or role=='editor':
            return Response({"error":"You don't allow to add this item","success":False},status=400)
        
        if item.owner_id!=request.user.id:
            return Response({"error":"You don't have access to this item","success":False},status=400)
        access=ItemAccess.objects.filter(item=request.data.get('item'),user=request.data.get('user'))
        try:
            access.update(is_editor=request.data.get('is_editor'),is_viewer=request.data.get('is_viewer'))
            log_version_task(user_id=request.data.get('user'),version_id=request.data.get('item'),task="ACCESS_UPDATED")
            return Response({"user":request.data.get('user'),"success":True}, status=201)
        except:
            return Response({"user":request.data.get('user'),"success":False}, status=400)
        
    def delete(self, request, item_id=None):
        if not item_id:
            return Response({"error":"item_id is required"},status=400)
        
        item,role=require_access_for_item(request, item_id)
        
        if role=='viewer' or role=='editor':
            return Response({"error":"You don't allow to add this item","success":False},status=400)
        
        if item.owner_id!=request.user.id:
            return Response({"error":"You don't have access to this item","success":False},status=400)
        
        delete_item=ItemAccess.objects.filter(item=item_id,user=request.data.get('user'))
        
        if delete_item.exists():
            delete_item.delete()
            # log_version_task(user_id=request.user.id,version_id=item_id,task="ACCESS_REVOKED")
            return Response({"user":request.data.get('user'),"success":True}, status=201)
        else:
            return Response({"user":request.data.get('user'),"success":False}, status=400)



class UserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        users=User.objects.get(id=request.user.id)
        serilizer=UserSerializer1(users)
        return Response(serilizer.data, status=200)
    

    def put(self, request):
        users = User.objects.filter(username=request.user.username).first()
        try:
            if request.data.get('new_password'):
                crunt_password = request.data.get('current_password')
                if not users.check_password(crunt_password):
                    return Response({"error": "Current password is incorrect"}, status=400)
                password = make_password(request.data.get('new_password'))
                
                users.password = password
                users.save()
                return Response({"success": True}, status=200)
        except:
            pass
        serializer = UserSerializer1(users, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)
    def delete(self, request):
        users=User.objects.get(id=request.user.id)
        users.delete()
        return Response({"success":True}, status=200)
    

class ItemView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        items=Item.objects.filter(owner=request.user.id)
        serilizer=ItemSerializer(items,many=True)
        return Response(serilizer.data, status=200)

    def post(self, request):
        data={
            "name": request.data.get('name'),
            "owner": request.user.id,}
        serilizer=ItemSerializer(data=data)
        if serilizer.is_valid():
            serilizer.save()
            log_version_task(user_id=request.user.id,version_id=serilizer.data['id'],task="ITEM_CREATED")
            return Response(serilizer.data, status=201)
        else:
            return Response(serilizer.errors, status=400)
        
    def delete(self, request, item_id=None):
        if not item_id:
            return Response({"error":"item_id is required"},status=400)
        
        item,role=require_access_for_item(request, item_id)
        if role=='viewer' or role=='editor':
            return Response({"error":"You don't allow to add this item","success":False},status=400)
        
        if item.owner_id!=request.user.id:
            return Response({"error":"You don't have access to this item","success":False},status=400)
        
        delete_item=Item.objects.filter(id=item_id)
        if delete_item.exists():
            delete_item.delete()
            return Response({"success":True}, status=201)
        else:
            return Response({"success":False}, status=400)


class ItemVersionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, item_id):
        # 1) Gate: item-level access (owner/editor/viewer)
        item, role = require_access_for_item(request, item_id, need="view")

        # 2) Decide scope: ?scope=all (only for editor/owner). Default: current
        scope = request.query_params.get("scope", "current").lower()
        if role == "viewer":
            scope = "current"  # viewers are restricted to current only

        if scope == "all":
            # editor/owner: list all active versions (newest first)
            qs = (item.versions
                        .filter(deleted_at__isnull=True)
                        .order_by("-version_no"))
            # add role column
            data = ItemVersionSerializer(qs, many=True).data
            data.append(role)
            log_version_task(user_id=request.user.id,version_id=item.id,task="VERSION_VIEWED")
            return Response(data ,status=200)

        # scope == "current" (viewer/editor/owner)
        ver = item.current_revision
        if ver is None:
            # fallback if pointer missing
            ver = (item.versions
                        .filter(deleted_at__isnull=True)
                        .order_by("-version_no")
                        .first())
        if ver is None:
            data = []
            data.append(role)
            return Response(data, status=200)
            

        data = ItemVersionSerializer(ver).data
        # data must be list of length 1
        if not isinstance(data, list):
            data = [data]
            data.append(role)
        log_version_task(user_id=int(request.user.id),version_id=item_id,task="VERSION_VIEWED")
        return Response(data, status=200)

    
    def post(self, request):
        # Access checks
        item_id = request.data.get("item_id")
        item, role = require_access_for_item(request, item_id)
        if role in ("viewer", "editor"):
            return Response({"error": "You don't allow to add this item", "success": False}, status=400)
        if item.owner_id != request.user.id:
            return Response({"error": "You don't have access to this item", "success": False}, status=400)

        # Validate + create
        s = ItemVersionUploadSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        ver = s.save()  # <-- this is the ItemVersion instance

        # Log activity (use ver.id, NOT s.data)
        try:
            log_version_task(user_id=request.user.id, version_id=ver.id, task="VERSION_CREATED")
        except Exception:
            pass  # don't fail the request if logging hiccups

        # Return a small payload (or use a read-serializer if you want more fields)
        return Response(
            {"success": True},
            status=status.HTTP_201_CREATED,
        )    
class ItemActivityView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, item_id=None):
        if not item_id:
            return Response({"error":"item_id is required"},status=400)
        
        item,role=require_access_for_item(request, item_id)
        if role=='viewer' or role=='editor':
            return Response({"error":"You don't allow to add this item","success":False},status=400)
        
        if item.owner_id!=request.user.id:
            return Response({"error":"You don't have access to this item","success":False},status=400)
        
        items=ItemVersionActivity.objects.filter(version=item_id)
        serilizer=ItemVersionActivitySerializer(items,many=True)
        return Response(serilizer.data, status=200)


















