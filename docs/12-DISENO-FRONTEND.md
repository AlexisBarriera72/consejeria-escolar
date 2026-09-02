# Cómo pedir frontend que no salga genérico

Sistema para trabajar con Claude Code usando Dribbble, Animista, UIverse,
React Bits y Aceternity UI como fuente.

---

## Lo que de verdad causa el "quedó horrible"

No es falta de gusto del modelo. Es que **"que se vea bien" no contiene
ninguna decisión.** Sin una dirección escrita, lo que sale es el promedio de
todo el CSS de internet — que es exactamente gris, centrado y plano.

La solución no es pedir "más bonito". Es quitarle la decisión al modelo:
darle la paleta, la tipografía, los keyframes y el código de los componentes
que quieres. Las cinco páginas de la lista funcionan porque cada una entrega
una decisión ya tomada.

Este proyecto es un ejemplo de eso: no salió genérico porque el doc 03 decidió
la paleta con contraste medido, la tipografía y una metáfora ("La Oficina")
**antes** de escribir el primer componente.

---

## 1. Aceternity UI y React Bits → pega el código

No digas *"usa el Bento Grid de Aceternity"*. El modelo no puede abrir la
página y lo que hará es inventarse algo parecido de memoria, que es justo el
resultado genérico que querías evitar.

Abre el componente, copia el código y pégalo:

> Quiero una sección de características. Este es el componente de Aceternity
> UI: `[pega el código]`. Intégralo en `components/X.tsx`, cámbiale el
> contenido por el nuestro y adáptalo a nuestros tokens de color.

Funciona porque el `cn` de `lib/utils.ts` ya está puesto: los componentes de
Aceternity, React Bits y shadcn lo dan por hecho y se pegan sin tocarlos.

## 2. UIverse → pega el CSS

Igual. Copia el bloque de HTML/CSS del botón, el loader o el toggle:

> Cambia el botón de enviar por este elemento de UIverse: `[pega]`. Ajústalo
> a `--color-azul-700` y mantén el aro de foco doble.

## 3. Animista → los keyframes ya están, o pega los tuyos

`app/globals.css` trae seis animaciones de estilo Animista listas:

| Utilidad | Qué hace |
|---|---|
| `animate-entrada` | Entra escalando desde 0.94 |
| `animate-subir` | Entra subiendo 14px |
| `animate-aparecer` | Fundido simple |
| `animate-expandir-letras` | El `tracking-in-expand` — solo titulares |
| `animate-latido` | Pulso lento, para llamar la atención sin gritar |
| `animate-brillo` | Barrido de brillo, para estados de carga |

Para añadir una nueva desde Animista, pega el `@keyframes` y di:

> Añade esta animación de Animista: `[pega]`. Ponla en el bloque `@theme` de
> `app/globals.css` como `--animate-<nombre>`.

> **Corrección importante:** en Tailwind 4 los keyframes **no** van en
> `tailwind.config.js` — ese archivo no existe y no debe crearse. Van dentro
> de `@theme`, en CSS. Cualquier guía que diga lo contrario es de Tailwind 3.

## 4. Dribbble → **pega la captura de pantalla**

> **Corrección importante:** sí puedo ver imágenes. Describir un diseño con
> palabras pierde el 90% de la información; una captura la conserva entera.

Arrastra el PNG al chat y di qué quieres de él:

> Copia la jerarquía visual y el espaciado de esta referencia, pero con
> nuestra paleta y nuestro contenido. Fíjate en el ritmo vertical y en cómo
> respira la tarjeta.

Ya funcionó en este proyecto: la paleta entera salió de tres capturas de
pantalla pegadas al principio de la conversación.

Y si solo quieres los colores de una imagen, dilo — se pueden sacar los hex
exactos y pasarlos por `npm run verificar:contraste` antes de adoptarlos.

---

## Dirección estética DE ESTE PROYECTO

⚠ **Aquí hay un choque que conviene tener claro.**

La receta que circula para "frontend con buena pinta" es casi siempre la
misma: modo oscuro, glassmorphism, `border-white/10`, resplandores
ambientales. Se ve espectacular en un portafolio.

**Para este sitio está mal, y el proyecto lo detecta solo.**

- `border-white/10` sobre casi cualquier fondo da un contraste de ~1.2:1. El
  criterio 1.4.11 de WCAG pide 3:1 para bordes de componentes. `npm run
  verificar:contraste` lo rechaza.
- El glassmorphism pone texto sobre un fondo variable y desenfocado: el
  contraste deja de ser medible, o sea que deja de poder garantizarse.
- Este sitio lo abre gente con baja visión, dislexia y ansiedad, muchas veces
  desde un teléfono barato en un pasillo con sol. El modo oscuro con
  resplandores es peor ahí, no mejor.

**Lo que sí aplica aquí:**

- Papel cálido (`--color-papel`), no blanco puro ni negro.
- Color en bloques francos: bandas de acento, pestañas de carpeta, campos de
  color enteros. Nada de degradados apagados.
- Profundidad por **capas y sombras**, no por transparencia.
- Movimiento discreto y con propósito: el brazo del avatar, el `+` que gira,
  la tarjeta que se levanta. Nunca decorativo por decorar.
- El carácter viene de la **metáfora** (tablilla, archivador, corcho, pizarra,
  pared del pasillo), no de los efectos. Es lo que hace que no se parezca a
  ninguna plantilla.

Si un componente de Aceternity o UIverse viene en oscuro, tradúcelo a la
paleta antes de pegarlo. Consérvale la estructura y la animación; cámbiale
los colores.

---

## Antes de dar por bueno cualquier rediseño

```bash
npm run verificar
```

Comprueba contraste, integridad de contenido, 29 pruebas, tipos, build y
axe-core sobre las 39 rutas. **Si un diseño no pasa esto, no es un diseño
bonito: es uno que deja gente fuera.**

---

## Plantilla para tus OTROS proyectos

Copia esto a `CLAUDE.md` en la raíz de un proyecto nuevo y ajusta la sección
de identidad. Lo que hace que funcione no es la lista de webs: es que las tres
primeras líneas obliguen a decidir.

```markdown
# Sistema de diseño

## Identidad (RELLENA ESTO — es lo único que evita el resultado genérico)
- Sensación en tres palabras: ______, ______, ______
- Referencia visual: [pega una captura de Dribbble en el chat]
- Paleta: ______ (mide el contraste antes de adoptarla)
- Tipografía: titulares ______ / cuerpo ______
- Metáfora o concepto: ______

## Fuentes de componentes
- Estructura y efectos: Aceternity UI, React Bits
- Elementos sueltos: UIverse
- Animaciones: Animista
- Composición y color: Dribbble (pegar la captura, no describirla)

## Reglas
- Nada de blanco/gris por defecto ni de layouts centrados sin jerarquía.
- Todo elemento interactivo lleva estados hover, active y focus visibles.
- El indicador de foco debe verse sobre fondo claro Y sobre fondo oscuro.
- Los keyframes van donde toque según la versión de Tailwind:
  v4 → `@theme` en CSS. v3 → `tailwind.config.js`.
- Toda animación se apaga con `prefers-reduced-motion`.
- Antes de dar algo por terminado, medir el contraste. Sin excepción.

## Dependencias que dan por hechas esas librerías
npm install clsx tailwind-merge lucide-react framer-motion canvas-confetti
Y el ayudante `cn` en lib/utils.ts (usa `tailwind-merge`, NO `tail-merge`).
```
