from django.db import models
from django.contrib.auth.models import User

Horario_choise = (
    ('A','lunes - Viernes'),
    ('B','Lunes - Sabado'),
)

Estado_choises = (
    ('A','Aceptado'),
    ('C','Cancelado'),
    ('E','Espera')
)

def upload_path(instance, filname):
    return '/'.join(['covers', str(instance.user), filname])

class Ciudad(models.Model):
    nombre = models.CharField(max_length=120)

    def __str__(self):
        return str(self.nombre)

    class Meta:
        verbose_name = 'Ciudad'
        verbose_name_plural = 'Ciudades'

class Cargo(models.Model):
    nombre = models.CharField(max_length=50)
    empalme = models.PositiveIntegerField()
    horario = models.CharField(choices=Horario_choise, max_length=1)

    def __str__(self):
        return str(self.nombre)

class Oficina(models.Model):
    nombre = models.CharField(max_length=120)
    ciudad = models.ForeignKey(Ciudad, on_delete=models.CASCADE, related_name="oficinas")

    def __str__(self):
        return str(self.nombre)

    class Meta:
        verbose_name = 'Oficina'
        verbose_name_plural = 'Oficinas'

class BaseEmpleado(models.Model):
    user = models.OneToOneField(User, to_field="username",on_delete=models.CASCADE, related_name="empleados")
    estado = models.BooleanField(default=True)

    def __str__(self):
        empleadoID = str(self.id)
        return str(empleadoID)

    class Meta:
        verbose_name = 'BaseEmpleado'
        verbose_name_plural = 'BaseEmpleados'

class Empleado(BaseEmpleado, models.Model):
    cargo = models.ForeignKey(Cargo, on_delete=models.CASCADE, related_name="empleados", blank=True)
    oficina = models.ForeignKey(Oficina, on_delete=models.CASCADE, related_name="empleados", blank=True)
    fecha_ingreso = models.DateField(auto_now=False, auto_now_add=False)
    periodos_causados = models.PositiveIntegerField()

    class Meta:
        verbose_name = 'Empleado'
        verbose_name_plural = 'Empleados'

class Supernumerario(BaseEmpleado, models.Model):
    cargo = models.ManyToManyField(Cargo, related_name="supernumerarios", blank=True)
    ciudad = models.ForeignKey(Ciudad, on_delete=models.CASCADE, related_name="supernumerarios", blank=True)

    class Meta:
        verbose_name = 'Supernumerario'
        verbose_name_plural = 'Supernumerarios'


class Solicitud(models.Model):
    user = models.ForeignKey(User, to_field="username", on_delete=models.CASCADE, related_name="solicitudes")
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    fecha_inicio_vacaciones = models.DateField(auto_now=False, auto_now_add=False)
    fecha_fin_vacaciones = models.DateField(auto_now=False, auto_now_add=False)
    periodos = models.PositiveIntegerField()
    estado = models.CharField(max_length=1, null=True,choices=Estado_choises, default='E')
    anexo = models.TextField(blank=True)

    def __str__(self):
        superID = str(self.id)
        return str(superID)

    class Meta:
        verbose_name = 'Solicitud'
        verbose_name_plural = 'Solicitudes'

class Historicosolicitud(models.Model):
    solicitud = models.OneToOneField(Solicitud, on_delete=models.CASCADE, related_name="historicosolicitudes")
    supernumerario = models.ForeignKey(Supernumerario, on_delete=models.CASCADE, related_name="historicosolicitudes")
    oficina = models.ForeignKey(Oficina, on_delete=models.CASCADE, related_name="historicosolicitudes")
    cargo = models.ForeignKey(Cargo, on_delete=models.CASCADE, related_name="historicosolicitudes")
    sup_inicio_vacaciones = models.DateField(auto_now=False, auto_now_add=False)
    sup_fin_vacaciones = models.DateField(auto_now=False, auto_now_add=False)
    fecha_confirmacion = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = 'Historico Solicitud'
        verbose_name_plural = 'Historicos Solicitudes'
