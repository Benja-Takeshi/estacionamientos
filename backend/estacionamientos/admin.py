# =====================================================
# admin.py  →  registra las tablas en el panel de administración
# =====================================================
# Así puedes ver y editar los datos en http://127.0.0.1:8000/admin
from django.contrib import admin

from .models import Comentario, Estacionamiento

admin.site.register(Estacionamiento)
admin.site.register(Comentario)
