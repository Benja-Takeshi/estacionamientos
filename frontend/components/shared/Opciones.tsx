// =====================================================
// Opciones.tsx  →  fila de "chips" para elegir UNA opción
// =====================================================
// Ejemplo: Libre | Ocupado | Reservado  (se marca el que elegiste)
import { Pressable, Text, View } from 'react-native';

type Props = {
  etiqueta: string;
  opciones: readonly string[]; // lista de textos
  elegida: string; // la opción marcada
  alElegir: (opcion: string) => void; // qué hacer al tocar una
};

const Opciones = ({ etiqueta, opciones, elegida, alElegir }: Props) => (
  <View className="mb-3">
    <Text className="font-work-bold text-primary mb-1.5">{etiqueta}</Text>
    <View className="flex-row flex-wrap">
      {opciones.map((opcion) => {
        const marcada = opcion === elegida;
        return (
          <Pressable
            key={opcion}
            onPress={() => alElegir(opcion)}
            className={`border border-primary rounded-full py-1.5 px-4 mr-2 mb-2 ${marcada ? 'bg-primary' : 'bg-white'}`}
          >
            <Text className={`font-work-medium ${marcada ? 'text-white' : 'text-primary'}`}>{opcion}</Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);
export default Opciones;
