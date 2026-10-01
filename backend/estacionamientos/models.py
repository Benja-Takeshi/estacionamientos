# =====================================================
# models.py  →  AQUÍ SE DEFINE QUÉ SE GUARDA EN LA BASE DE DATOS
# =====================================================
# Cada "class" es una tabla, y cada línea dentro es una columna.
# Django crea la base de datos (db.sqlite3) a partir de este archivo.

from django.core.validators import MinValueValidator, RegexValidator
from django.db import models


class Estacionamiento(models.Model):
    # Las opciones posibles del estado: (valor guardado, texto que se muestra)
    ESTADOS = [
        ('Libre', 'Libre'),
        ('Ocupado', 'Ocupado'),
        ('Reservado', 'Reservado'),
    ]

    # ID: lo escribe el usuario (ejemplo "E-01"). primary_key = no se puede repetir.
    # El validador solo deja letras, números, guiones y guion bajo.
    id = models.CharField(
        max_length=20,
        primary_key=True,
        validators=[RegexValidator(r'^[A-Za-z0-9_-]+$', 'El ID solo puede tener letras, números y guiones.')],
        error_messages={'unique': 'Ya existe un estacionamiento con ese ID.'},
    )
    estado = models.CharField(max_length=10, choices=ESTADOS, default='Libre')
    local = models.CharField(max_length=100)
    # Aforo = cantidad máxima de personas. Mínimo 1.
    aforo = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    def __str__(self):
        return f'{self.id} - {self.local}'


class Comentario(models.Model):
    CONDICIONES = [
        ('Buena', 'Buena'),
        ('Regular', 'Regular'),
        ('Mala', 'Mala'),
    ]

    # ForeignKey = "este comentario pertenece a UN estacionamiento".
    # on_delete=CASCADE = si borras el estacionamiento, sus comentarios se borran solos.
    estacionamiento = models.ForeignKey(Estacionamiento, on_delete=models.CASCADE, related_name='comentarios')
    condicion = models.CharField(max_length=10, choices=CONDICIONES, default='Buena')
    texto = models.TextField()
    # auto_now_add = Django pone la fecha y hora actual al crear el comentario
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha', '-id']  # los más nuevos primero

    def __str__(self):
        return f'{self.estacionamiento_id}: {self.texto[:30]}'
