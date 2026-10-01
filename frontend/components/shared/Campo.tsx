// =====================================================
// Campo.tsx  →  un cuadro de texto con su título arriba
// =====================================================
// Se usa igual que un TextInput normal, y le agregamos la "etiqueta":
//   <Campo etiqueta="Local" value={local} onChangeText={setLocal} />
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface Props extends TextInputProps {
  etiqueta: string;
  desactivado?: boolean; // true = solo se ve, no se puede escribir
}

const Campo = ({ etiqueta, desactivado = false, ...resto }: Props) => (
  <View className="mb-3">
    <Text className="font-work-bold text-primary mb-1">{etiqueta}</Text>
    <TextInput
      editable={!desactivado}
      placeholderTextColor="#94a3b8"
      className={`border border-primary rounded-xl px-3 py-2.5 font-work-medium text-primary ${desactivado ? 'opacity-50' : ''}`}
      {...resto}
    />
  </View>
);
export default Campo;
