from rest_framework.authtoken.models import Token
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Empleado,
    Cargo,
    Oficina,
    Supernumerario,
    Ciudad,
    Solicitud,
    Historicosolicitud
)
from django.contrib.auth import password_validation

class CargoEmpeladoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Cargo
        fields = ['id','nombre','empalme','horario']

class OficinaSerialier(serializers.ModelSerializer):
    class Meta:
        model = Oficina
        fields = ['id','nombre','ciudad']

class SoloEmpleadoSerialer(serializers.ModelSerializer):
    oficina = OficinaSerialier(many=False)
    cargo = CargoEmpeladoSerializer(many=False)
    user = serializers.SerializerMethodField(read_only=True)

    def get_user(self, obj):
        return obj.user.username

    class Meta:
        model = Empleado
        fields = ['id','user','fecha_ingreso','periodos_causados','oficina', 'cargo']
        extra_kwargs = {'cargo': {'read_only': True, 'required': False}}

class SolicitudesSeriealizer(serializers.ModelSerializer):
    class Meta:
        model = Solicitud
        fields = ['id', 'user', 'fecha_solicitud', 'fecha_inicio_vacaciones', 'fecha_fin_vacaciones', 'periodos','estado','anexo']
        extra_kwargs = {'estado': {'read_only': True, 'required': False}}

class HistoricosolicitudSerializer(serializers.ModelSerializer):
    oficina = serializers.SerializerMethodField(read_only=True)
    solicitud = serializers.SerializerMethodField(read_only=True)
    cargo = serializers.SerializerMethodField(read_only=True)
    supernumerario = serializers.SerializerMethodField(read_only=True)

    def get_oficina(self, obj):
        return obj.oficina.nombre

    def get_solicitud(self, obj):
        return obj.solicitud.user.username

    def get_supernumerario(self, obj):
        return obj.supernumerario.user.username

    def get_cargo(self, obj):
        return obj.cargo.nombre

    class Meta:
        model = Historicosolicitud
        fields = ['id', 'solicitud','supernumerario', 'oficina', 'cargo', 'sup_inicio_vacaciones', 'sup_fin_vacaciones', 'fecha_confirmacion']

class LoginUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'is_superuser']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = ['id','nombre','empalme','horario']

class CiudadSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Ciudad
        fields = ['id','nombre']

class OficinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oficina
        fields = ['id','nombre','ciudad']

class SoloSupernumerarioSerializer(serializers.ModelSerializer):
    cargo = CargoSerializer(many=True)
    ciudad = CiudadSerializer(many=False)
    class Meta:
        model = Supernumerario
        fields = ['id','user','estado','cargo','ciudad']

    def create(self, validated_data):
        cargo = validated_data.pop('cargo')
        empleados = Supernumerario.objects.create(**validated_data)

        for cargos in cargo:
            cargo_id = cargos.get('id')
            cargo = Cargo.objects.get(id=cargo_id)
            empleados.cargo.add(cargo)
        return empleados

    def update(self, instance, validated_data):
        cargo = validated_data.pop('cargo')
        instance.user = validated_data.get("user", instance.user)
        instance.ciudad = validated_data.get("ciudad", instance.ciudad)
        instance.save()
        instance.cargo.clear()
        for cargos in cargo:
            if "id" in cargos.keys():
                if Cargo.objects.filter(id=cargos["id"]).exists():
                    c = Cargo.objects.get(id=cargos["id"])
                    instance.cargo.add(c)
        return instance

class UserEmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields =['cargo','oficina','fecha_ingreso','periodos_causados']
        extra_kwargs = {'fecha_ingreso': {'write_only': True, 'required': False}, 'periodos_causados': {'write_only': True, 'required': False}}

class UserSupernumerarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supernumerario
        fields =['cargo','ciudad']
        extra_kwargs = {'cargo': {'write_only': True, 'required': False}, 'estado': {'write_only': True, 'required': False}}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','password','first_name','last_name','email','is_superuser']

class UserEmpSerializer(serializers.ModelSerializer):
    empleados = UserEmpleadoSerializer(many=False)
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'is_superuser', 'empleados']
        extra_kwargs = {'password': {'write_only': True, 'required': False}, 'cargo': {'read_only': True, 'required': False}, 'oficina': {'read_only': True, 'required': False}}


    def create(self, validated_data):
        empleado_data = validated_data.pop('empleados')
        user = User.objects.create_user(**validated_data)
        user.empleados = Empleado.objects.create(user=user, **empleado_data)
        user.save()
        Token.objects.create(user=user)
        return user

    def update(self, instance, validated_data):
        empleado_data = validated_data.pop('empleados')

        if validated_data.get('username') != 0:
            instance.username = validated_data.get('username', instance.username)

        if validated_data.get('first_name') != 0:
            instance.first_name = validated_data.get('first_name', instance.first_name)

        if validated_data.get('last_name') != 0:
            instance.last_name = validated_data.get('last_name', instance.last_name)

        if validated_data.get('email') != 0:
            instance.email = validated_data.get('email', instance.last_name)

        if validated_data.get('is_superuser') != 0:
            instance.is_superuser = validated_data.get('is_superuser', instance.last_name)

        instance.save()
        emp =  Empleado.objects.get(user=instance)

        if empleado_data.get('fecha_ingreso') != 0:
            emp.fecha_ingreso = empleado_data.get('fecha_ingreso',emp.fecha_ingreso)

        if empleado_data.get('periodos_causados') != 0:
            emp.periodos_causados = empleado_data.get('periodos_causados',emp.periodos_causados)

        if empleado_data.get('cargo') != 0:
            emp.cargo = empleado_data.get('cargo', emp.cargo)

        if empleado_data.get('oficina') != 0:
            emp.oficina = empleado_data.get('oficina', emp.oficina)

        emp.save()
        return instance

class SupernumerarioSerializer(serializers.ModelSerializer):
    empleados = UserSupernumerarioSerializer(many=False)
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'is_superuser', 'empleados']
        extra_kwargs = {'password': {'write_only': True, 'required': False}, 'cargo': {'read_only': True, 'required': False}, 'ciudad': {'read_only': True, 'required': False}}

    def create(self, validated_data):
        print(validated_data)
        empleado_data = validated_data.pop('empleados')
        user = User.objects.create_user(**validated_data)
        user.save()
        cargo = empleado_data.pop('cargo')
        codigo = empleado_data.get('codigo')
        instance = Supernumerario.objects.create(user=user, **empleado_data)

        for cargos in cargo:
            cargoadd = Cargo.objects.get(nombre=cargos)
            instance.cargo.add(cargoadd)
        Token.objects.create(user=user)
        return user

    def update(self, instance, validated_data):
        empleado_data = validated_data.pop('empleados')

        instance.username = validated_data.get("username", instance.username)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.email = validated_data.get("email", instance.email)

        empSup = Supernumerario.objects.get(user=instance)

        if empleado_data.get('ciudad'):
            empSup.ciudad = empleado_data.get('ciudad', empSup.ciudad)

        instance.save()
        empSup.save()

        if empleado_data.get('cargo'):
            cargo = empleado_data.pop('cargo')
            empSup.cargo.clear()
            for cargos in cargo:
                if Cargo.objects.filter(nombre=cargos).exists():
                    c = Cargo.objects.get(nombre=cargos)
                    empSup.cargo.add(c)
        return instance

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=128, write_only=True, required=True)
    new_password1 = serializers.CharField(max_length=128, write_only=True, required=True)
    new_password2 = serializers.CharField(max_length=128, write_only=True, required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                ('Tu antigua contraseña no es correcta. Ingresa tu actual contraseña')
            )
        return value

    def validate(self, data):
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError({'new_password2': "Las contraseñas no coinciden."})
        password_validation.validate_password(data['new_password1'], self.context['request'].user)
        return data

    def save(self, **kwargs):
        password = self.validated_data['new_password1']
        user = self.context['request'].user
        user.set_password(password)
        user.save()
        return user