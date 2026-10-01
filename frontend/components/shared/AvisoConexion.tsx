// =====================================================
// AvisoConexion.tsx  →  cartel rojo si Django no responde
// =====================================================
import { Text, View } from 'react-native';

import CustomButton from './CustomButton';

type Props = { error: string; alReintentar: () => void };

const AvisoConexion = ({ error, alReintentar }: Props) => {
  if (error === '') return null; // si no hay problema, no mostramos nada

  return (
    <View className="border border-tertiary rounded-2xl p-4 mb-4">
      <Text className="font-work-bold text-tertiary mb-2.5">{error}</Text>
      <CustomButton color="tertiary" onPress={alReintentar}>Reintentar</CustomButton>
    </View>
  );
};
export default AvisoConexion;
