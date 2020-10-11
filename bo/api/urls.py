from django.conf.urls import url
from rest_framework import routers
from rest_framework import views
from django.urls import path, include
from .viewsets import (
    UserEmpViewSet,
    GetAuthToken,
    CargoViewSet,
    SuperViewSet,
    CiudadViewSet,
    EmpleadoViewSet,
    UserSuperViewSet,
    PasswordEmail,
    ChangePasswordView,
    SolicitudViewSet,
    HistoricosolicitudViewSet,
    EmpleadViewSet,
    EmpeladoData,
    OficinaViewSet,
    UserViewSet,
    OficinaData,
    LogUser
)

router = routers.DefaultRouter()
router.register('user', UserViewSet)
router.register('empleados', UserEmpViewSet)
router.register('solosuper', SuperViewSet)
router.register('super', UserSuperViewSet)
router.register('cargos', CargoViewSet)
router.register('ciudad', CiudadViewSet)
router.register('oficinas', OficinaViewSet)
router.register('empleado', EmpleadViewSet)
router.register('solicitud', SolicitudViewSet)
router.register('historico', HistoricosolicitudViewSet)

urlpatterns = [
    path('',include(router.urls)),
    path('auth/', GetAuthToken.as_view()),
    path('password/reset', PasswordEmail.as_view()),
    path('password/update', ChangePasswordView.as_view()),
    path('log/', LogUser.as_view()),
    path('empleados/', EmpleadoViewSet.as_view()),
    path('oficinadata/', OficinaData.as_view()),
    path('empleadodata/', EmpeladoData.as_view())
]
