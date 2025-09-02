from django.db import models
from django.contrib.auth.models import User


class Cliente(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True, blank=True)
    cedula = models.ImageField(
        upload_to="clientes/cedulas/", blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.user.username


class Servicio(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre


class Tecnico(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    experiencia = models.PositiveIntegerField(default=0)
    cedula = models.ImageField(
        upload_to="clientes/cedulas/", blank=True, null=True)

    # 🔗 Un técnico puede ofrecer varios servicios
    servicios = models.ManyToManyField(Servicio, related_name="tecnicos")

    def __str__(self):
        return self.nombre


class Solicitud(models.Model):
    cliente = models.ForeignKey(
        Cliente, on_delete=models.CASCADE, related_name="solicitudes")
    servicio = models.ForeignKey(
        Servicio, on_delete=models.CASCADE, related_name="solicitudes")
    tecnico = models.ForeignKey(
        Tecnico, on_delete=models.SET_NULL, null=True, blank=True, related_name="solicitudes")
    descripcion = models.TextField(blank=True)   # 👈 aquí
    direccion = models.CharField(max_length=255, blank=True)  # 👈 aquí

    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=[
        ("pendiente", "Pendiente"),
        ("aceptada", "Aceptada"),
        ("rechazada", "Rechazada"),
        ("completada", "Completada"),
    ], default="pendiente")

    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.cliente} pidió {self.servicio} ({self.estado})"


class Trabajo(models.Model):
    tecnico = models.ForeignKey(
        Tecnico, related_name="trabajos", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="trabajos/")
    descripcion = models.TextField(blank=True)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trabajo de {self.tecnico.user.username} - {self.fecha}"
