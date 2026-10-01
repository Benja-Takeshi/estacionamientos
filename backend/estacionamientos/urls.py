# =====================================================
# urls.py (de la app)  →  LAS DIRECCIONES DE LA API
# =====================================================
# El router crea solo las direcciones:
#   /estacionamientos/        (listar y crear)
#   /estacionamientos/E-01/   (ver, editar y borrar uno)
#   /comentarios/             (listar, crear y borrar comentarios)

from rest_framework.routers import DefaultRouter

from .views import ComentarioViewSet, EstacionamientoViewSet

router = DefaultRouter()
router.register('estacionamientos', EstacionamientoViewSet)
router.register('comentarios', ComentarioViewSet)

urlpatterns = router.urls
