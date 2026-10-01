// =====================================================
// api.ts  →  LA ÚNICA FORMA EN QUE LA APP HABLA CON DJANGO
// =====================================================
// También guarda los tipos de datos y las opciones (estados y condiciones).

import { API_URL } from '@/constants/config';

// Los estados posibles de un estacionamiento
export const ESTADOS = ['Libre', 'Ocupado', 'Reservado'] as const;
// Las condiciones físicas posibles en un comentario
export const CONDICIONES = ['Buena', 'Regular', 'Mala'] as const;

// Así se ve un estacionamiento y un comentario cuando llegan desde Django
export type Estado = (typeof ESTADOS)[number];
export type Condicion = (typeof CONDICIONES)[number];
export type Estacionamiento = { id: string; estado: Estado; local: string; aforo: number };
export type Comentario = { id: number; estacionamiento: string; condicion: Condicion; texto: string; fecha: string };

// Nombres bonitos para mostrar los errores ("aforo" → "Aforo")
const ETIQUETAS: Record<string, string> = {
  id: 'ID', estado: 'Estado', local: 'Local', aforo: 'Aforo', texto: 'Comentario', condicion: 'Condición',
};

// Django responde los errores así: { aforo: ['Asegúrese de que...'] }
// Esta función lo convierte en un texto simple: "Aforo: Asegúrese de que..."
function textoDeError(datos: any): string {
  return Object.entries(datos)
    .map(([campo, mensajes]) => {
      const texto = ([] as string[]).concat(mensajes as any).join(' ');
      return campo === 'detail' ? texto : `${ETIQUETAS[campo] || campo}: ${texto}`;
    })
    .join(' ');
}

// Hace un pedido a Django. Siempre devuelve { datos, error }:
//   - si salió bien: datos con la respuesta y error = null
//   - si salió mal:  error con un texto explicando qué pasó
export async function llamar(metodo: string, ruta: string, cuerpo?: object) {
  try {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });

    if (respuesta.status === 204) return { datos: null as any, error: null as string | null }; // 204 = borrado correcto
    const datos = await respuesta.json();

    if (!respuesta.ok) return { datos: null as any, error: textoDeError(datos) }; // Django dijo que hay un error
    return { datos: datos as any, error: null as string | null };
  } catch {
    // no hubo conexión con Django
    return { datos: null as any, error: 'No se pudo conectar con el servidor. ¿Está corriendo Django?' };
  }
}
