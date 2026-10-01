// =====================================================
// comentarios.tsx  →  PESTAÑA "Comentarios"
// =====================================================
// Comentarios sobre el estado y las condiciones físicas de un estacionamiento.
// Ejemplo de comentario: "Mala – el pavimento tiene un hoyo grande".

import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import AvisoConexion from '@/components/shared/AvisoConexion';
import Campo from '@/components/shared/Campo';
import CustomButton from '@/components/shared/CustomButton';
import Opciones from '@/components/shared/Opciones';
import { CONDICIONES, Comentario, Condicion, Estacionamiento, llamar } from '@/lib/api';
import { confirmar, formatearFecha } from '@/lib/utils';

// Color de cada condición física
const COLOR_CONDICION = { Buena: 'bg-secondary', Regular: 'bg-primary', Mala: 'bg-tertiary' };

const ComentariosScreen = () => {
  const [estacionamientos, setEstacionamientos] = useState<Estacionamiento[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [errorLista, setErrorLista] = useState('');

  const [seleccionId, setSeleccionId] = useState(''); // estacionamiento elegido
  const [condicion, setCondicion] = useState<Condicion>('Buena');
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');

  // Pide a Django los estacionamientos y los comentarios
  const cargar = async () => {
    const [e, c] = await Promise.all([llamar('GET', '/estacionamientos/'), llamar('GET', '/comentarios/')]);
    if (e.error || c.error) return setErrorLista(e.error || c.error || '');
    setEstacionamientos(e.datos);
    setComentarios(c.datos);
    setErrorLista('');
  };

  // Se ejecuta cada vez que entras a esta pestaña
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  // Si no eligió ninguno (o el elegido fue borrado), usamos el primero de la lista
  const actual = estacionamientos.find((e) => e.id === seleccionId) || estacionamientos[0];

  // Si todavía no existe ningún estacionamiento, avisamos y terminamos aquí
  if (!actual) {
    return (
      <ScrollView className="flex-1 bg-white" contentContainerClassName="p-4 w-full max-w-[600px] self-center">
        <AvisoConexion error={errorLista} alReintentar={cargar} />
        <Text className="font-work-medium text-primary">
          Primero crea un estacionamiento en la pestaña "Estacionamientos" para poder comentarlo.
        </Text>
      </ScrollView>
    );
  }

  // Solo los comentarios del estacionamiento actual
  const delActual = comentarios.filter((c) => c.estacionamiento === actual.id);

  // OJO: estas funciones van DESPUÉS del "if (!actual)" de arriba. Si estuvieran antes,
  // el compilador de React las prepara cuando "actual" aún no existe y la pantalla se cae.
  const guardar = async () => {
    const { error: mensajeError } = await llamar('POST', '/comentarios/', {
      estacionamiento: actual.id,
      condicion,
      texto,
    });
    if (mensajeError) return setError(mensajeError);
    setTexto(''); // limpiamos el cuadro para el próximo comentario
    setError('');
    cargar();
  };

  const eliminar = (c: Comentario) =>
    confirmar('¿Eliminar este comentario?', async () => {
      await llamar('DELETE', `/comentarios/${c.id}/`);
      cargar();
    });

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="p-4 pb-10 w-full max-w-[600px] self-center">
      <AvisoConexion error={errorLista} alReintentar={cargar} />

      {/* ---------- FORMULARIO ---------- */}
      <View className="border border-primary rounded-2xl p-4 mb-5">
        <Text className="font-work-bold text-primary text-lg mb-3">Nuevo comentario</Text>

        <Opciones etiqueta="Estacionamiento" opciones={estacionamientos.map((e) => e.id)} elegida={actual.id} alElegir={setSeleccionId} />
        <Opciones etiqueta="Condición física" opciones={CONDICIONES} elegida={condicion} alElegir={(c) => setCondicion(c as Condicion)} />
        <Campo
          etiqueta="Comentario"
          placeholder="Ejemplo: el pavimento tiene un hoyo cerca de la entrada"
          value={texto}
          onChangeText={setTexto}
          multiline
          numberOfLines={3}
        />

        {error !== '' && <Text className="font-work-medium text-tertiary mb-2.5">{error}</Text>}
        <CustomButton onPress={guardar}>Agregar comentario</CustomButton>
      </View>

      {/* ---------- LISTA ---------- */}
      <Text className="font-work-bold text-primary text-lg mb-1">
        Comentarios de {actual.id} ({delActual.length})
      </Text>
      <Text className="font-work-medium text-primary mb-3">
        Estado actual: {actual.estado} · Local: {actual.local} · Aforo: {actual.aforo}
      </Text>

      {delActual.length === 0 && <Text className="font-work-medium text-primary">Todavía no hay comentarios.</Text>}

      {delActual.map((c) => (
        <View key={c.id} className="border border-primary rounded-2xl p-4 mb-3">
          <View className="flex-row justify-between items-center">
            <View className={`${COLOR_CONDICION[c.condicion]} rounded-full px-3 py-0.5`}>
              <Text className="font-work-bold text-white text-xs">{c.condicion}</Text>
            </View>
            <Text className="font-work-light text-primary text-xs">{formatearFecha(c.fecha)}</Text>
          </View>
          <Text className="font-work-medium text-primary my-3">{c.texto}</Text>
          <CustomButton variant="outlined" color="tertiary" onPress={() => eliminar(c)}>Eliminar</CustomButton>
        </View>
      ))}
    </ScrollView>
  );
};
export default ComentariosScreen;
