from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Cliente, Servicio, Tecnico, Solicitud

# Serializers existentes


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = "__all__"


class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = "__all__"


class TecnicoSerializer(serializers.ModelSerializer):
    servicios = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Servicio.objects.all()
    )
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Tecnico
        fields = ['id', 'nombre', 'especialidad',
                  'experiencia', 'telefono', 'servicios', 'username']


class SolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitud
        fields = "__all__"
        read_only_fields = ["fecha", "estado"]  # estos no los manda el cliente

# Registro de usuario base


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user

# Registro de cliente


class ClienteRegisterSerializer(serializers.ModelSerializer):
    user = UserRegisterSerializer()
    cedula = serializers.ImageField(required=False)

    class Meta:
        model = Cliente
        fields = ['user', 'telefono', 'cedula']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserRegisterSerializer.create(
            UserRegisterSerializer(), validated_data=user_data)
        cliente = Cliente.objects.create(user=user, **validated_data)
        return cliente

# Registro de técnico


class TecnicoRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    servicios = serializers.PrimaryKeyRelatedField(
        queryset=Servicio.objects.all(), many=True
    )
    cedula = serializers.ImageField(required=False)
    image = serializers.ImageField(required=False)
    trabajos = serializers.ListField(
        child=serializers.ImageField(), required=False, write_only=True
    )

    class Meta:
        model = Tecnico
        fields = [
            "username",
            "email",
            "password",
            "especialidad",
            "experiencia",
            "telefono",
            "servicios",
            "cedula",
            "image",
            "trabajos",
        ]

    def create(self, validated_data):
        trabajos_data = validated_data.pop("trabajos", [])
        username = validated_data.pop("username")
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        # Crear usuario
        user = User.objects.create_user(
            username=username, email=email, password=password)

        # Servicios
        servicios_data = validated_data.pop("servicios", [])

        # Crear técnico
        tecnico = Tecnico.objects.create(user=user, **validated_data)
        tecnico.servicios.set(servicios_data)

        # Guardar trabajos
        for trabajo in trabajos_data:
            tecnico.trabajos.create(image=trabajo)

        return tecnico
