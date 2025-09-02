# views.py
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import Cliente, Servicio, Tecnico, Solicitud
from .serializers import (
    UserRegisterSerializer,
    ClienteRegisterSerializer,
    TecnicoRegisterSerializer,
    ClienteSerializer,
    ServicioSerializer,
    TecnicoSerializer,
    SolicitudSerializer
)

# ---------------------------
# ViewSets CRUD
# ---------------------------


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer


class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer


class TecnicoViewSet(viewsets.ModelViewSet):
    queryset = Tecnico.objects.all()
    serializer_class = TecnicoSerializer
    permission_classes = [AllowAny]  # 🔓 sin autenticación


class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(cliente=self.request.user.cliente)

# ---------------------------
# Registro y Login
# ---------------------------


class UserRegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer


class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            return Response({
                "message": "Login exitoso",
                "username": user.username,
                "email": user.email
            })
        return Response({"error": "Usuario o contraseña incorrectos"}, status=status.HTTP_400_BAD_REQUEST)


class ClienteRegisterView(generics.CreateAPIView):
    serializer_class = ClienteRegisterSerializer


class TecnicoRegisterView(generics.CreateAPIView):
    serializer_class = TecnicoRegisterSerializer
