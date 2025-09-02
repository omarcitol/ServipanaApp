from django.contrib import admin
from .models import Tecnico


@admin.register(Tecnico)
class TecnicoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'especialidad', 'telefono',
                    'experiencia')  # estos sí existen
    search_fields = ('nombre', 'especialidad')
