from django.contrib.auth.models import User
from rest_framework import generics, permissions, viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import UpdateAPIView
from rest_framework.authentication import TokenAuthentication, SessionAuthentication, BasicAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.http import HttpResponse
from datetime import datetime, timedelta, date
from django.db.models import Q
from django.db.models.functions import Lower, Reverse
import holidays
from .serializers import (
    UserSerializer,
    UserEmpSerializer,
    OficinaSerializer,
    CargoSerializer,
    SupernumerarioSerializer,
    CiudadSerializer,
    SoloEmpleadoSerialer,
    SoloSupernumerarioSerializer,
    ChangePasswordSerializer,
    SolicitudesSeriealizer,
    LoginUserSerializer,
    OficinaSerialier,
    HistoricosolicitudSerializer
)
# Models
from .models import (
    Empleado,
    Cargo,
    Supernumerario,
    Ciudad,
    Solicitud,
    Oficina,
    Historicosolicitud
)
from django.core.mail import send_mail, EmailMessage
import random
import string

class HistoricosolicitudViewSet(viewsets.ModelViewSet):
    queryset = Historicosolicitud.objects.all()
    serializer_class = HistoricosolicitudSerializer

    @action(detail=True, methods=['PUT'])
    def delt(self, request, pk=None):

        histo = Historicosolicitud.objects.get(id=pk)
        try:
            soli = Solicitud.objects.get(id=histo.solicitud.id)
            soli.estado = "C"
            soli.save()
            histo.delete()
            return Response("Eliminado", status=status.HTTP_200_OK)
        except:
            response = {'message': 'estado reqerido no valido'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all().order_by('fecha_solicitud')
    serializer_class = SolicitudesSeriealizer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['estado',]

    @action(detail=True, methods=['PUT'])
    def estado_aceptado(self, request, pk=None):
        if Solicitud.objects.get(id=pk):
            solici = Solicitud.objects.get(id=pk)
            try:
                message = SolicitudMethod(solici)
                serializer = SolicitudesSeriealizer(solici, many=False)
                response = {'message': message, 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
            except:
                response = {'message': 'Verifica tu conexion a internet'}
                return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'solicitud requerida'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['PUT'])
    def estado_cancelado(self, request, pk=None):
        if Solicitud.objects.get(id=pk):
            solici = Solicitud.objects.get(id=pk)
            try:
                if Historicosolicitud.objects.filter(solicitud=solici).exists():
                    histo = Historicosolicitud.objects.get(solicitud=solici)
                    histo.delete()
                    solici.estado = 'C'
                    solici.save()
                else:
                    solici.estado = 'C'
                    solici.save()
                print(solici)
                data = "Fecha de inicio: " + solici.fecha_inicio_vacaciones.strftime(
                    '%Y-%m-%d') + " fecha de finalización: " + solici.fecha_fin_vacaciones.strftime(
                    '%Y-%m-%d')
                subject = 'Tus vacaciones han sido canceladas, por favor solicita una nueva fecha'
                user = User.objects.get(username=solici.user)
                Sendemail(subject, user.email, data)
                serializer = SolicitudesSeriealizer(solici, many=False)
                response = {'message': 'Estado actualizado', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
            except:
                response = {'message': 'Verifica tu conexion a internet'}
                return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'estado reqerido no valido'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

class LogUser(APIView):
    # authentication_classes = (TokenAuthentication, SessionAuthentication)

    def post(self, request, *args, **kwargs):
        try:
            s_token = request.data['Authorization']
            s_token = s_token[6:50]
            token = Token.objects.get(key=s_token)
            user = User.objects.get(id=token.user.id)
            if user.is_superuser:
                response = {'message': 'Admin'}
                user_serializer = LoginUserSerializer(user, many=False)
                sup = Supernumerario.objects.get(user=user)
                # sup_serializer = SupernumerarioSerializer(user, many=False)
                solo_sup_serializer = SoloSupernumerarioSerializer(sup, many=False)
                return Response({'user': user_serializer.data, 'supernumerario': solo_sup_serializer.data},
                                status=status.HTTP_200_OK)
            else:
                if Supernumerario.objects.filter(user=user).exists():
                    sup = Supernumerario.objects.get(user=user)
                    user_serializer = LoginUserSerializer(user, many=False)
                    # user_serializer = SupernumerarioSerializer(user, many=False)
                    solo_sup_serializer = SoloSupernumerarioSerializer(sup, many=False)
                    return Response({'user': user_serializer.data, 'supernumerario': solo_sup_serializer.data},
                                    status=status.HTTP_200_OK)

                else:  # Empleado.objects.filter(user=user).exists():
                    emp = Empleado.objects.get(user=user)
                    empleado_serializer = SoloEmpleadoSerialer(emp, many=False)
                    user_serializer = LoginUserSerializer(user, many=False)
                    return Response({'user': user_serializer.data, 'empleado': empleado_serializer.data},
                                    status=status.HTTP_200_OK)
        except:
            response = {'message': 'User not found'}
            return Response(response, status=status.HTTP_200_OK)

class OficinaData(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data['id']
            print(data)
            oficina = Oficina.objects.get(id=data)
            print(oficina)
            ciudad = Ciudad.objects.get(id=oficina.ciudad.id)
            print(ciudad)
            oficina_serializer = OficinaSerialier(oficina, many=False)
            ciudad_serializer = CiudadSerializer(ciudad, many=False)
            return Response({'ciudad': ciudad_serializer.data, 'oficina': oficina_serializer.data},
                            status=status.HTTP_200_OK)
        except:
            response = {'message': 'not found'}
            return Response(response, status=status.HTTP_200_OK)

class EmpeladoData(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data['username']
            user = User.objects.get(username=data)
            if user.is_superuser:
                response = {'message': 'Admin'}
                user_serializer = LoginUserSerializer(user, many=False)
                return Response({'user': user_serializer.data},
                                status=status.HTTP_200_OK)
            else:
                if Supernumerario.objects.filter(user=user).exists()==True:
                    supernumerario = Supernumerario.objects.get(user=user)
                    user_serializer = LoginUserSerializer(user, many=False)
                    solo_sup_serializer = SoloSupernumerarioSerializer(supernumerario, many=False)
                    historico = Historicosolicitud.objects.filter(supernumerario=supernumerario)
                    historico_serializer = HistoricosolicitudSerializer(historico, many=True)
                    return Response({'user': user_serializer.data, 'supernumerario': solo_sup_serializer.data, 'historico': historico_serializer.data},
                                    status=status.HTTP_200_OK)

                else:
                    emp = Empleado.objects.get(user=user)
                    empleado_serializer = SoloEmpleadoSerialer(emp, many=False)
                    user_serializer = LoginUserSerializer(user, many=False)
                    solicitud = Solicitud.objects.filter(user=user)
                    solicitud_serializer = SolicitudesSeriealizer(solicitud, many=True)
                    return Response({'user': user_serializer.data, 'empleados': empleado_serializer.data, 'solicitud': solicitud_serializer.data},
                                    status=status.HTTP_200_OK)
        except:
            response = {'message': 'User not found'}
            return Response(response, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserEmpViewSet(viewsets.ModelViewSet):
    # queryset = User.objects.all()
    queryset = User.objects.filter(empleados__in=Empleado.objects.all())
    serializer_class = UserEmpSerializer

class UserSuperViewSet(viewsets.ModelViewSet):
    # queryset = User.objects.all()
    queryset = User.objects.filter(empleados__in=Supernumerario.objects.all())
    serializer_class = SupernumerarioSerializer


class CiudadViewSet(viewsets.ModelViewSet):
    queryset = Ciudad.objects.all()
    serializer_class = CiudadSerializer

class OficinaViewSet(viewsets.ModelViewSet):
    queryset = Oficina.objects.all()
    serializer_class = OficinaSerializer

class SuperViewSet(viewsets.ModelViewSet):
    queryset = Supernumerario.objects.all()
    serializer_class = SoloSupernumerarioSerializer


class EmpleadViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = SoloEmpleadoSerialer


class EmpleadoViewSet(generics.ListAPIView):
    serializer_class = SoloEmpleadoSerialer

    def get_queryset(self):
        print(self.request)
        user = self.request.data['username']
        return Empleado.objects.filter(user=user)


class CargoViewSet(viewsets.ModelViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer


class GetAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        try:
            response = super(GetAuthToken, self).post(request, *args, **kwargs)
            token = Token.objects.get(key=response.data['token'])
            print(token)
            user = User.objects.get(id=token.user_id)
            user_serializer = UserSerializer(user, many=False)
            # return Response({'token': token.key, 'user': user_serializer.data})
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        except:
            response = {'message': 'usuario o contraseña no valido'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    authentication_classes = (TokenAuthentication, SessionAuthentication)

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Crea un nuevo token para el usuario
        if hasattr(user, 'auth_token'):
            user.auth_token.delete()
        token, created = Token.objects.get_or_create(user=user)
        # Retorna el nuevo token
        return Response({'token': token.key}, status=status.HTTP_200_OK)


class PasswordEmail(APIView):

    def post(self, request):
        if request.data:
            username = request.data['username']
            try:
                user = User.objects.get(username=username)
                user_email = user.email
                print(user_email)
                password = NewPassword()
                user.set_password(password)
                user.save()
                print(password)
                subject = 'Tu contraseña ha sido cambiada'
                Sendemail(subject, user_email, password)
                response = {'message': 'Message send'}
                return Response(response, status=status.HTTP_200_OK)
            except:
                response = {'message': 'User not found'}
                return Response(response, status=status.HTTP_200_OK)

        else:
            response = {'message': 'need username'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


def Sendemail(subject, email, data):
    try:
        message = data
        email = EmailMessage(subject, message, to=[email])
        email.send()
    except:
        print('Something went wrong...')


def NewPassword(Slength=8):
    LetrasDigitos = string.ascii_letters + string.digits
    return ''.join(random.choice(LetrasDigitos) for i in range(Slength))


def SolicitudMethod(soli):
    users = User.objects.get(username=soli.user)
    empleado = Empleado.objects.get(user=users)
    usercargo = Cargo.objects.get(id=empleado.cargo.id)
    numero = usercargo.empalme
    useroficina = empleado.oficina
    ciudad = useroficina.ciudad

    h = 4

    if usercargo.horario == 'B':
        h = 5

    solifechaini = soli.fecha_inicio_vacaciones
    solifechafin = soli.fecha_fin_vacaciones

    superinicio = Sinicial(numero, solifechaini, h)
    superfin = Sfinal(numero, solifechafin, h)

    existeSuper = exiteSuper(usercargo,ciudad)

    if existeSuper.exists() == True:
        supdispo = 0
        for sups in existeSuper:
            if Historicosolicitud.objects.filter(supernumerario=sups.id).exists() == False:
                supdispo = sups.id
        if supdispo != 0:
            supernum = Supernumerario.objects.filter(id=supdispo).get()
            Historicosolicitud.objects.create(solicitud=soli, supernumerario=supernum, oficina=useroficina,
                                              cargo=usercargo, sup_inicio_vacaciones=superinicio,
                                              sup_fin_vacaciones=superfin)
            empleado.periodos_causados = empleado.periodos_causados - soli.periodos
            empleado.save()

            if users.email:
                VacacionesAceptadas(soli, supernum, superinicio, users)
            if supernum.user.email:
                ReemplazoAsignado(useroficina, superinicio, usercargo, users, supernum)

            soli.estado = 'A'
            soli.save()
            return "Vacaciones asignadas"
        elif (BusquedaSupernumerario(usercargo, superinicio, superfin, ciudad)).exists() == True:
            supernum = (Supernumerario.objects.filter(cargo=usercargo).exclude((Q(
                historicosolicitudes__sup_inicio_vacaciones__gte=superinicio) & Q(
                historicosolicitudes__sup_inicio_vacaciones__lte=superfin)) | (Q(
                historicosolicitudes__sup_fin_vacaciones__gte=superinicio) & Q(
                historicosolicitudes__sup_fin_vacaciones__lte=superfin) )).filter(
                Q(ciudad=ciudad) & Q(historicosolicitudes__sup_inicio_vacaciones__gt=superfin))).order_by(
                Lower('historicosolicitudes__sup_inicio_vacaciones').asc()).first()
            if supernum == None:
                supernum = (Supernumerario.objects.filter(cargo=usercargo).exclude((Q(
                    historicosolicitudes__sup_inicio_vacaciones__gte=superinicio) & Q(
                    historicosolicitudes__sup_inicio_vacaciones__lte=superfin)) | (Q(
                    historicosolicitudes__sup_fin_vacaciones__gte=superinicio) & Q(
                    historicosolicitudes__sup_fin_vacaciones__lte=superfin))).filter(
                    Q(ciudad=ciudad) & Q(historicosolicitudes__sup_fin_vacaciones__lt=superinicio))).order_by(
                    Lower('historicosolicitudes__sup_fin_vacaciones').desc()).first()
                Historicosolicitud.objects.create(solicitud=soli, supernumerario=supernum, oficina=useroficina,
                                                  cargo=usercargo, sup_inicio_vacaciones=superinicio,
                                                  sup_fin_vacaciones=superfin)
                empleado.periodos_causados =  empleado.periodos_causados - soli.periodos
                empleado.save()

                if users.email:
                    VacacionesAceptadas(soli, supernum, superinicio, users)
                if supernum.user.email:
                    ReemplazoAsignado(useroficina, superinicio, usercargo, users, supernum)

                soli.estado = 'A'
                soli.save()
                return "Vacaciones asignadas"
        else:
            return "No hay disponibilidad para la fecha"
    else:
        return "No hay supernumerario para el cargo"

def BusquedaSupernumerario(usercargo, superinicio, superfin, ciudad):
    return Supernumerario.objects.filter(cargo=usercargo).exclude((Q(
                    historicosolicitudes__sup_inicio_vacaciones__gte=superinicio) & Q(
                    historicosolicitudes__sup_inicio_vacaciones__lte=superfin)) | (Q(
                    historicosolicitudes__sup_fin_vacaciones__gte=superinicio) & Q(
                    historicosolicitudes__sup_fin_vacaciones__lte=superfin))).filter(Q(ciudad=ciudad) & (
                    Q(historicosolicitudes__sup_fin_vacaciones__lt=superinicio) | Q(
                    historicosolicitudes__sup_inicio_vacaciones__gt=superfin))) &  Q(estado=1)

def VacacionesAceptadas(soli, supernum, superinicio, users):
    data = "Fecha de inicio: " + soli.fecha_inicio_vacaciones.strftime(
        '%Y-%m-%d') + " fecha de finalización: " + soli.fecha_fin_vacaciones.strftime(
        '%Y-%m-%d') + " el supernumerario asignado es: " + supernum.user.username + " el empalme inicia: " + superinicio.strftime(
        '%Y-%m-%d')
    subject = 'Tus vacaciones han sido aceptadas'
    Sendemail(subject, users.email, data)


def ReemplazoAsignado(useroficina, superinicio, usercargo, users, supernum):
    subject = 'Reemplazo asignado'
    data = "Debes presentarte en la oficina: " + useroficina.nombre + ", para realizar empalme en la fecha: " + superinicio.strftime(
        '%Y-%m-%d') + ", en el cargo de: " + usercargo.nombre + ", reemplazarás a: " + users.username
    Sendemail(subject, supernum.user.email, data)

def exiteSuper(usercargo,ciudad):
    return Supernumerario.objects.filter(Q(cargo=usercargo) & Q(ciudad=ciudad) & Q(estado=1))

def festivos():
    fecha = []
    for date in sorted(holidays.CO(years=datetime.now().year).items()):
        fecha.append(str(date[0]))
    return fecha


def Sinicial(num, solifechaini, h):
    fechas = festivos()
    d = timedelta(days=1)
    test = solifechaini
    SuperInicio = solifechaini
    cont = 0
    test -= d
    SoliIni = str(test)
    IniW = test.weekday()

    while (cont != num):
        if ((IniW > h) | (SoliIni in fechas)):
            test -= d
            SoliIni = str(test)
            IniW = test.weekday()
        else:
            SuperInicio = test
            cont += 1
            test -= d
            SoliIni = str(test)
            IniW = test.weekday()
    return SuperInicio

def Sfinal(num, solifechafin, h):
    fechas = festivos()
    d = timedelta(days=1)
    test = solifechafin
    SuperFin = solifechafin
    cont = 0
    test += d
    SoliIni = str(test)
    IniW = test.weekday()

    while (cont != num):
        if ((IniW > h) | (SoliIni in fechas)):
            test += d
            SoliIni = str(test)
            IniW = test.weekday()
        else:
            SuperFin = test
            cont += 1
            test += d
            SoliIni = str(test)
            IniW = test.weekday()

    return SuperFin


def calendario(fechainicio, fechafin, h):
    fechas = festivos()
    d = timedelta(days=1)
    cont = 0
    IniW = fechainicio.weekday()
    dia = str(fechainicio)
    supercalendario = []

    while (fechainicio <= fechafin):
        if ((IniW > h) | (dia in fechas)):
            fechainicio += d
            dia = str(fechainicio)
            IniW = fechainicio.weekday()
        else:
            supercalendario.append(str(fechainicio))
            cont += 1
            fechainicio += d
            dia = str(fechainicio)
            IniW = fechainicio.weekday()

    return supercalendario
