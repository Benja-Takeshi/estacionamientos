// =====================================================
// config.ts  →  DIRECCIÓN DEL SERVIDOR DJANGO
// =====================================================
// La app necesita saber dónde está Django:
//   - En el navegador (web): Django está en el mismo computador.
//   - En el celular: Django está en tu computador, y la app encuentra su IP sola
//     (Expo ya la sabe porque de ahí descargó la app).
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Si la detección automática falla, escribe aquí la IP de tu computador. Ejemplo: '192.168.1.10'
const IP_MANUAL = '';

function direccionDelServidor() {
  if (IP_MANUAL) return IP_MANUAL;

  // Web: la misma dirección desde donde se abrió la página
  if (Platform.OS === 'web') {
    const host = window.location.hostname;
    return host === 'localhost' ? '127.0.0.1' : host;
  }

  // Celular: Expo guarda algo como "192.168.1.10:8081" (la IP del computador + el puerto de Expo)
  const hostUri = Constants.expoConfig?.hostUri ?? (Constants as any).expoGoConfig?.debuggerHost;
  return hostUri ? hostUri.split(':')[0] : '127.0.0.1';
}

// Django siempre usa el puerto 8000
export const API_URL = `http://${direccionDelServidor()}:8000/api`;
