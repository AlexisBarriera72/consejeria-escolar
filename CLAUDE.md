@AGENTS.md

# Sistema de diseño de este proyecto

Guía completa: `docs/12-DISENO-FRONTEND.md`. Resumen operativo:

## Identidad — ya decidida, no la reinventes

- **Sensación:** cercano, ordenado, con carácter. Oficina de consejería, no SaaS.
- **Metáfora:** "La Oficina" — tablilla de firmas, pestañas de archivador,
  corcho, pizarra, pared del pasillo. El carácter viene de ahí, no de efectos.
- **Paleta:** tokens de `app/globals.css`. Azul como columna vertebral, un
  acento por sección. Papel cálido `--color-papel`, nunca blanco puro.
- **Tipografía:** Fraunces (titulares) + Source Sans 3 (cuerpo).

## Fuentes de componentes

- Estructura y efectos: Aceternity UI, React Bits
- Elementos sueltos (botones, loaders, toggles): UIverse
- Animaciones: Animista
- Composición y color: Dribbble

**Pega el código, no la URL.** No puedo abrir esas páginas; si solo doy el
nombre, me invento algo parecido de memoria — que es justo el resultado
genérico que se quiere evitar. Para Dribbble: **pega la captura de pantalla**,
sí puedo verlas.

## Animaciones

Seis utilidades listas en `@theme`: `animate-entrada`, `animate-subir`,
`animate-aparecer`, `animate-expandir-letras`, `animate-latido`,
`animate-brillo`.

**Tailwind 4: los keyframes van en `@theme` dentro de `app/globals.css`.**
No existe `tailwind.config.js` y no debe crearse.

## Lo que NO aplica aquí

Modo oscuro, glassmorphism, `border-white/10`, resplandores ambientales.
Se ven muy bien en un portafolio y aquí fallan: `border-white/10` da ~1.2:1
de contraste y WCAG 1.4.11 pide 3:1. Este sitio lo usa gente con baja visión
desde teléfonos baratos. Si un componente viene en oscuro, quédate con su
estructura y su animación, y cámbiale los colores a la paleta.

## Reglas que no se rompen

- Solo `azul-700`, `azul-900`, `rosa-700` y `turquesa-700` aceptan texto blanco.
- Todo lo interactivo lleva hover, active y focus visibles.
- El aro de foco es doble: se ve sobre claro y sobre oscuro.
- Toda animación se apaga con `prefers-reduced-motion` y con Modo Calma.
- `cn()` de `lib/utils.ts` para combinar clases.

## Antes de dar por terminado cualquier cambio visual

```
npm run verificar
```

Contraste + contenido + 29 pruebas + tipos + build + axe-core en 39 rutas.
Un diseño que no pasa esto no es bonito: deja gente fuera.
