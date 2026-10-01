# =====================================================
# tests.py  →  PRUEBAS AUTOMÁTICAS
# =====================================================
# Se ejecutan con:  python manage.py test
# Comprueban que la API haga lo que debe (crear, validar, editar, borrar).

from rest_framework.test import APITestCase

from .models import Comentario, Estacionamiento


class ApiTests(APITestCase):
    def crear(self, **extra):
        datos = {'id': 'E-01', 'estado': 'Libre', 'local': 'Entrada', 'aforo': 25}
        datos.update(extra)
        return self.client.post('/api/estacionamientos/', datos, format='json')

    def test_crear_y_listar(self):
        self.assertEqual(self.crear().status_code, 201)
        lista = self.client.get('/api/estacionamientos/').json()
        self.assertEqual(len(lista), 1)
        self.assertEqual(lista[0]['aforo'], 25)

    def test_id_repetido(self):
        self.crear()
        self.assertEqual(self.crear().status_code, 400)
        self.assertEqual(self.crear(id='e-01').status_code, 400)  # mayúsculas/minúsculas

    def test_aforo_invalido(self):
        self.assertEqual(self.crear(aforo=0).status_code, 400)
        self.assertEqual(self.crear(aforo=-5).status_code, 400)
        self.assertEqual(self.crear(aforo='').status_code, 400)
        self.assertEqual(self.crear(aforo='abc').status_code, 400)

    def test_local_vacio(self):
        self.assertEqual(self.crear(local='   ').status_code, 400)

    def test_estado_invalido(self):
        self.assertEqual(self.crear(estado='Roto').status_code, 400)

    def test_id_con_caracteres_raros(self):
        self.assertEqual(self.crear(id='E 01/x').status_code, 400)

    def test_editar(self):
        self.crear()
        r = self.client.patch('/api/estacionamientos/E-01/', {'estado': 'Ocupado', 'aforo': 40}, format='json')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(Estacionamiento.objects.get(id='E-01').aforo, 40)

    def test_comentarios(self):
        self.crear()
        r = self.client.post('/api/comentarios/', {'estacionamiento': 'E-01', 'condicion': 'Mala', 'texto': 'Hoyo'}, format='json')
        self.assertEqual(r.status_code, 201)
        self.assertEqual(len(self.client.get('/api/comentarios/').json()), 1)
        vacio = self.client.post('/api/comentarios/', {'estacionamiento': 'E-01', 'condicion': 'Mala', 'texto': ' '}, format='json')
        self.assertEqual(vacio.status_code, 400)

    def test_borrar_estacionamiento_borra_sus_comentarios(self):
        self.crear()
        Comentario.objects.create(estacionamiento_id='E-01', texto='x')
        self.assertEqual(self.client.delete('/api/estacionamientos/E-01/').status_code, 204)
        self.assertEqual(Comentario.objects.count(), 0)
