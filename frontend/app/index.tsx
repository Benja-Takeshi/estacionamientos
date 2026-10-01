// =====================================================
// index.tsx  →  PESTAÑA "Estacionamientos": CREAR, EDITAR y BORRAR
// =====================================================
// Cada estacionamiento tiene 4 datos: id, estado, local y aforo
// (el aforo es la cantidad de personas que caben).
// Los datos se guardan en Django; esta pantalla solo los pide y los manda.

import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import AvisoConexion from '@/components/shared/AvisoConexion';
import Campo from '@/components/shared/Campo';
import CustomButton from '@/components/shared/CustomButton';
import Opciones from '@/components/shared/Opciones';
import { ESTADOS, Estacionamiento, Estado, llamar } from '@/lib/api';
import { confirmar } from '@/lib/utils';

// Color de cada estado (full strings para que Tailwind los encuentre)
const COLOR_ESTADO = { Libre: 'bg-secondary', Ocupado: 'bg-tertiary', Reservado: 'bg-primary' };

const EstacionamientosScreen = () => {
  // La lista que viene de Django
  const [lista, setLista] = useState<Estacionamiento[]>([]);
  const [errorLista, setErrorLista] = useState(''); // error de conexión

  // Lo que el usuario escribe en el formulario (cada uno es una "memoria" de React)
  const [id, setId] = useState('');
  const [estado, setEstado] = useState<Estado>('Libre');
  const [local, setLocal] = useState('');
  const [aforo, setAforo] = useState('');
  const [error, setError] = useState(''); // error del formulario

  // Si editandoId tiene un valor, el formulario está en modo "editar".
  // Si es null, está en modo "crear".
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // Pide la lista a Django
  const cargar = async () => {
    const { datos, error: mensajeError } = await llamar('GET', '/estacionamientos/');
    if (mensajeError) return setErrorLista(mensajeError);
    setLista(datos);
    setErrorLista('');
  };

  // Se ejecuta cada vez que entras a esta pestaña
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  // Deja el formulario vacío otra vez
  const limpiar = () => {
    setId('');
    setEstado('Libre');
    setLocal('');
    setAforo('');
    setError('');
    setEditandoId(null);
  };

  // Botón "Crear" o "Guardar cambios"
  const guardar = async () => {
    const { error: mensajeError } = editandoId
      ? await llamar('PATCH', `/estacionamientos/${editandoId}/`, { estado, local, aforo }) // PATCH = editar
      : await llamar('POST', '/estacionamientos/', { id: id.trim(), estado, local, aforo }); // POST = crear

    if (mensajeError) return setError(mensajeError); // mostramos el error y NO limpiamos el formulario
    limpiar();
    cargar(); // pedimos la lista de nuevo para ver el cambio
  };

  // Botón "Editar" de una tarjeta: copia sus datos al formulario
  const empezarEdicion = (e: Estacionamiento) => {
    setEditandoId(e.id);
    setId(e.id);
    setEstado(e.estado);
    setLocal(e.local);
    setAforo(String(e.aforo)); // el cuadro de texto necesita texto, no número
    setError('');
  };

  // Botón "Eliminar" de una tarjeta
  const eliminar = (e: Estacionamiento) =>
    confirmar(`¿Eliminar ${e.id} y sus comentarios?`, async () => {
      const { error: mensajeError } = await llamar('DELETE', `/estacionamientos/${e.id}/`);
      if (mensajeError) return setError(mensajeError);
      if (editandoId === e.id) limpiar(); // si lo estabas editando, cerramos el formulario
      cargar();
    });

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="p-4 pb-10 w-full max-w-[600px] self-center">
      <AvisoConexion error={errorLista} alReintentar={cargar} />

      {/* ---------- FORMULARIO ---------- */}
      <View className="border border-primary rounded-2xl p-4 mb-5">
        <Text className="font-work-bold text-primary text-lg mb-3">
          {editandoId ? `Editando ${editandoId}` : 'Nuevo estacionamiento'}
        </Text>

        <Campo etiqueta="ID" placeholder="Ejemplo: E-01" value={id} onChangeText={setId} desactivado={!!editandoId} />
        <Opciones etiqueta="Estado" opciones={ESTADOS} elegida={estado} alElegir={(e) => setEstado(e as Estado)} />
        <Campo etiqueta="Local" placeholder="Ejemplo: Entrada principal" value={local} onChangeText={setLocal} />
        <Campo
          etiqueta="Aforo (cantidad de personas)"
          placeholder="Ejemplo: 25"
          value={aforo}
          onChangeText={(texto) => setAforo(texto.replace(/[^0-9]/g, ''))} // borra todo lo que no sea número
          keyboardType="numeric"
        />

        {/* Si hay un error, lo mostramos en rojo */}
        {error !== '' && <Text className="font-work-medium text-tertiary mb-2.5">{error}</Text>}

        <CustomButton onPress={guardar}>{editandoId ? 'Guardar cambios' : 'Crear estacionamiento'}</CustomButton>
        {editandoId && <CustomButton variant="outlined" onPress={limpiar}>Cancelar</CustomButton>}
      </View>

      {/* ---------- LISTA ---------- */}
      <Text className="font-work-bold text-primary text-lg mb-3">Estacionamientos ({lista.length})</Text>

      {lista.length === 0 && <Text className="font-work-medium text-primary">Aún no hay estacionamientos. ¡Crea el primero arriba!</Text>}

      {/* .map() repite una tarjeta por cada estacionamiento de la lista */}
      {lista.map((e) => (
        <View key={e.id} className="border border-primary rounded-2xl p-4 mb-3">
          <View className="flex-row justify-between items-center">
            <Text className="font-work-bold text-primary text-base">{e.id}</Text>
            <View className={`${COLOR_ESTADO[e.estado]} rounded-full px-3 py-0.5`}>
              <Text className="font-work-bold text-white text-xs">{e.estado}</Text>
            </View>
          </View>
          <Text className="font-work-medium text-primary mt-2">Local: {e.local}</Text>
          <Text className="font-work-medium text-primary mb-3">Aforo: {e.aforo} personas</Text>
          <View className="flex-row gap-2">
            <View className="flex-1"><CustomButton variant="outlined" onPress={() => empezarEdicion(e)}>Editar</CustomButton></View>
            <View className="flex-1"><CustomButton variant="outlined" color="tertiary" onPress={() => eliminar(e)}>Eliminar</CustomButton></View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
export default EstacionamientosScreen;
