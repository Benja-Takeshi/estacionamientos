// =====================================================
// _layout.tsx  →  ARRANQUE DE LA APP Y NAVEGACIÓN
// =====================================================
// Este archivo hace 2 cosas:
//   1) Carga la fuente (Work Sans)
//   2) Arma la NAVEGACIÓN: un menú de 2 pestañas (una por cada archivo de esta carpeta)
//        index.tsx       → pestaña "Estacionamientos"
//        comentarios.tsx → pestaña "Comentarios"
import { Ionicons } from '@expo/vector-icons';
import { SplashScreen, Tabs } from 'expo-router';
import { useEffect } from 'react';

import { useFonts } from 'expo-font';

import { AZUL } from '@/constants/colores';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'WorkSans-Black': require('../assets/fonts/WorkSans-Black.ttf'),
    'WorkSans-Bold': require('../assets/fonts/WorkSans-Bold.ttf'),
    'WorkSans-Light': require('../assets/fonts/WorkSans-Light.ttf'),
    'WorkSans-Medium': require('../assets/fonts/WorkSans-Medium.ttf'),
  });

  useEffect(() => {
    if (error) throw error;

    // Escondemos la pantalla de carga cuando la fuente está lista
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: AZUL }, // barra de arriba azul...
        headerTintColor: '#FFFFFF', // ...con letras blancas
        headerTitleStyle: { fontFamily: 'WorkSans-Bold' },
        tabBarActiveTintColor: AZUL,
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: { fontFamily: 'WorkSans-Bold', fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Estacionamientos',
          tabBarIcon: ({ color }) => <Ionicons name="car-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="comentarios"
        options={{
          title: 'Comentarios',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses-outline" size={26} color={color} />,
        }}
      />
    </Tabs>
  );
};
export default RootLayout;
