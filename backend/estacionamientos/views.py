# =====================================================
# views.py  →  AQUÍ ESTÁ LA LÓGICA DE LA API
# =====================================================
# Un ModelViewSet ya trae listo: listar, crear, ver uno, editar y borrar.
# Por eso hacen falta tan pocas líneas.

from rest_framework import viewsets

from .models import Comentario, Estacionamiento
from .serializers import ComentarioSerializer, EstacionamientoSerializer


class EstacionamientoViewSet(viewsets.ModelViewSet):
    queryset = Estacionamiento.objects.all().order_by('id')
    serializer_class = EstacionamientoSerializer


class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    http_method_names = ['get', 'post', 'delete', 'head', 'options']  # los comentarios no se editan
