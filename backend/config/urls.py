# =====================================================
# urls.py (del proyecto)  →  DIRECCIÓN PRINCIPAL
# =====================================================
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),                    # panel de administración
    path('api/', include('estacionamientos.urls')),     # nuestra API: /api/...
]
