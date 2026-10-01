# =====================================================
# serializers.py  →  CONVIERTE DATOS ENTRE LA BASE DE DATOS Y JSON
# =====================================================
# Un serializer hace dos cosas:
#   1) Convierte un objeto de la base de datos en JSON (para enviarlo a la app)
#   2) Revisa que el JSON que llega de la app sea válido antes de guardarlo

from rest_framework import serializers

from .models import Comentario, Estacionamiento


class EstacionamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estacionamiento
        fields = ['id', 'estado', 'local', 'aforo']

    # Se ejecuta automáticamente al recibir el campo "id"
    def validate_id(self, valor):
        # No permitir "e-01" si ya existe "E-01" (mayúsculas y minúsculas cuentan igual)
        if Estacionamiento.objects.filter(id__iexact=valor).exists():
            raise serializers.ValidationError('Ya existe un estacionamiento con ese ID.')
        return valor


class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = ['id', 'estacionamiento', 'condicion', 'texto', 'fecha']
        read_only_fields = ['fecha']  # la fecha la pone Django, no la app
