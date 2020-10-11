from django.contrib import admin
from django.urls import path

from django.conf.urls import include
from rest_framework.authtoken.views import obtain_auth_token
# foto
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('auth/', obtain_auth_token),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)