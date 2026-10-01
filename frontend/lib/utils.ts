// =====================================================
// utils.ts  →  funciones chicas que usan varias pantallas
// =====================================================
import { Alert, Platform } from 'react-native';

// Pregunta "¿Seguro?" antes de borrar algo.
// En la web, Alert.alert NO funciona, por eso usamos window.confirm.
export function confirmar(mensaje: string, alAceptar: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(mensaje)) alAceptar();
  } else {
    Alert.alert('Confirmar', mensaje, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Aceptar', onPress: alAceptar },
    ]);
  }
}

// Convierte una fecha guardada (texto) en algo legible: 29-09-2026 14:30
export function formatearFecha(iso: string) {
  const f = new Date(iso);
  const dos = (n: number) => String(n).padStart(2, '0'); // 5 → "05"
  return `${dos(f.getDate())}-${dos(f.getMonth() + 1)}-${f.getFullYear()} ${dos(f.getHours())}:${dos(f.getMinutes())}`;
}
