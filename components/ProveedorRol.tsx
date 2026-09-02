'use client';

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react';
import {
  contarVisitaUnaVez,
  guardarRol,
  instantaneaRol,
  instantaneaServidor,
  olvidarRol,
  suscribirRol,
  type Rol,
} from '@/lib/rol';

type Contexto = {
  rol: Rol | null;
  /** false durante el render del servidor y la hidratación. */
  montado: boolean;
  elegir: (rol: Rol) => void;
  reiniciar: () => void;
};

const CtxRol = createContext<Contexto | null>(null);

/** Suscripción vacía: este valor no cambia nunca durante la vida de la
 *  página. Solo sirve para distinguir "servidor" de "cliente" sin recurrir
 *  a un setState dentro de un efecto. */
const sinCambios = () => () => {};
const enCliente = () => true;
const enServidor = () => false;

export function ProveedorRol({ children }: { children: React.ReactNode }) {
  const rol = useSyncExternalStore(
    suscribirRol,
    instantaneaRol,
    instantaneaServidor,
  );

  // Hace falta separar "todavía no sabemos" de "eligió invitado": con solo
  // `rol === null` el portal parpadearía en cada carga antes de hidratar.
  const montado = useSyncExternalStore(sinCambios, enCliente, enServidor);

  const elegir = useCallback((nuevo: Rol) => {
    guardarRol(nuevo);
    contarVisitaUnaVez(nuevo);
  }, []);
  const reiniciar = useCallback(() => olvidarRol(), []);

  return (
    <CtxRol.Provider value={{ rol, montado, elegir, reiniciar }}>
      {children}
    </CtxRol.Provider>
  );
}

export function useRol(): Contexto {
  const ctx = useContext(CtxRol);
  if (!ctx) throw new Error('useRol necesita estar dentro de <ProveedorRol>');
  return ctx;
}
