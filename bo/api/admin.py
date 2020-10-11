from django.contrib import admin
from import_export import resources
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import Empleado, Cargo,Supernumerario, Solicitud, Ciudad, BaseEmpleado, Oficina, Historicosolicitud
from import_export.admin import ImportExportModelAdmin

class CargoAdmin(ImportExportModelAdmin):
    list_display = ['nombre','empalme','horario']
    list_filter = ['nombre'] #nice

class CiudadAdmin(ImportExportModelAdmin):
    list_display = ['nombre']
    list_filter = ['nombre'] #nice

class EmpleadoAdmin(ImportExportModelAdmin):
    list_display = ['id','user']

class SolicitudAdmin(ImportExportModelAdmin):
    list_display = ['user','fecha_solicitud','fecha_inicio_vacaciones','fecha_fin_vacaciones','estado']
    list_filter = ['fecha_solicitud'] #nice

class OficinaAdmin(ImportExportModelAdmin):
    list_display = ['nombre','ciudad']
    list_filter = ['nombre'] #nice

class HistoricosolicitudAdmin(ImportExportModelAdmin):
    list_display = ['sup_inicio_vacaciones', 'sup_fin_vacaciones', 'fecha_confirmacion', 'oficina', 'supernumerario', 'cargo']
    list_filter = ['sup_inicio_vacaciones']  # nice

class UserResource(resources.ModelResource):

    class Meta:
        model = User
        fields = ['id','username', 'password', 'first_name', 'last_name', 'email', 'is_superuser']

class UserAdmint(ImportExportModelAdmin, UserAdmin):
    resource_class = UserResource
    skip_unchanged = True
    report_skipped = True
    import_id_fields  = ['id','username', 'password', 'first_name', 'last_name', 'email', 'is_superuser']


admin.site.unregister(User)
admin.site.register(User, UserAdmint)
admin.site.register(Cargo, CargoAdmin)
admin.site.register(Empleado, EmpleadoAdmin)
admin.site.register(BaseEmpleado, EmpleadoAdmin)
admin.site.register(Oficina, OficinaAdmin)
admin.site.register(Ciudad, CiudadAdmin)
admin.site.register(Solicitud, SolicitudAdmin)
admin.site.register(Supernumerario, EmpleadoAdmin)
admin.site.register(Historicosolicitud, HistoricosolicitudAdmin)