"""
URL configuration for VaultX project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from app.views import RegisterUser, VerifyCode, LoginView,LogoutView,ItemAccessView, Reset_Password, UserView,ItemView,ItemVersionView,ItemActivityView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', RegisterUser.as_view()),
    path('verify/', VerifyCode.as_view()),
    path('login/', LoginView.as_view()),
    path('reset_password/', Reset_Password.as_view()),
    path( 'userdetails/', UserView.as_view() ),
    path('items/',ItemView.as_view()),
    path('items/<int:item_id>/',ItemView.as_view()),
    path('itemversions/',ItemVersionView.as_view()),
    path('itemversions/<int:item_id>/',ItemVersionView.as_view()),
    path('logout/',LogoutView.as_view()),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('itemaccess/',ItemAccessView.as_view()),
    path('itemaccess/<int:item_id>/',ItemAccessView.as_view()),
    path('itemactivity/<int:item_id>/',ItemActivityView.as_view()),
]

