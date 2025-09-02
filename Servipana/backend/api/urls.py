from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, ServicioViewSet, TecnicoViewSet, SolicitudViewSet
from .views import UserRegisterView
from .views import UserLoginView
from .views import ClienteRegisterView, TecnicoRegisterView

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'servicios', ServicioViewSet)
router.register(r'tecnicos', TecnicoViewSet)
router.register(r'solicitudes', SolicitudViewSet)

urlpatterns = [
    path("", include(router.urls)),
    # Endpoint para registro de usuarios
    path("register/", UserRegisterView.as_view(), name="user-register"),
    path("login/", UserLoginView.as_view(), name="user-login"),
    path("register/cliente/", ClienteRegisterView.as_view(),
         name="register_cliente"),
    path("register/tecnico/", TecnicoRegisterView.as_view(),
         name="register_tecnico"),
]
