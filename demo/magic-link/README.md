# Demo: acceso por enlace mágico

```bash
node demo/magic-link/servidor.mjs
```

Abre <http://localhost:4321>. **Cero dependencias, cero `npm install`.**

## Pruébalo en este orden

1. Clic en **"Personal"** (o ve a `/edit`).
2. Escribe `maria.rivera@escuela.pr` → **Enviar enlace de acceso**.
3. **Mira la terminal.** El enlace aparece ahí. Cópialo al navegador.
4. Ya estás dentro. Nunca escribiste una contraseña.

Después prueba que las defensas funcionan:

| Prueba | Qué debe pasar |
|---|---|
| Abre el mismo enlace otra vez | Falla — es de un solo uso |
| Cambia una letra del token en la URL | Falla — la firma no cuadra |
| Escribe `cualquiera@gmail.com` | **Misma respuesta**, pero no se envía nada |
| Pide 6 enlaces al mismo correo | El sexto se bloquea 15 minutos |
| F12 → Application → Cookies | `sesion` marcada `HttpOnly` |
| Borra la cookie y ve a `/edit/panel` | Te saca |

## Verificado

Los 9 comportamientos de arriba están probados y pasan:

```
GET  /                          -> 200
GET  /edit                      -> 200
GET  /edit/panel   sin sesión   -> 302  (te saca)
GET  /edit/panel   con sesión   -> 200
GET  /edit/panel   cookie alterada -> 302  (firma inválida)
GET  /edit         con sesión   -> 302 -> /edit/panel
enlace usado 2 veces            -> 302 ?error=invalido
token con firma alterada        -> 302 ?error=invalido
6 intentos al mismo correo      -> el 6to bloqueado
```

## Por qué el enlace mágico y no una contraseña

- **Nada que recordar.** El fallo real de una contraseña compartida no es que
  la adivinen: es que se olvida, se apunta en un papel pegado al monitor, y se
  comparte por WhatsApp.
- **Sabes quién editó qué.** La sesión trae el nombre, así que el historial
  puede decir *"Editado por Sra. Rivera"*.
- **Revocar es trivial.** Quitas un correo de la lista y esa persona queda
  fuera al instante, sin que nadie más tenga que cambiar nada.
- **No hay contraseña que filtrar.** No existe, así que no se puede robar.

## Cómo se traduce a producción

Casi todo el archivo pasa tal cual. Solo cambian tres cosas:

| En la demo | En producción |
|---|---|
| `enviarCorreo()` imprime en consola | Una llamada a **Resend** (gratis, suficiente para 2 personas) |
| `SECRETO` se genera al arrancar | `process.env.SESSION_SECRET` en Vercel — si no, cada despliegue cierra todas las sesiones |
| `CORREOS_AUTORIZADOS` es un Map | `process.env.STAFF_EMAILS.split(',')` |
| `tokensUsados` es un Set en memoria | Upstash Redis con TTL de 10 min, **o** acepta la ventana de 10 min y no guardes nada |
| Cookie sin `Secure` | **Añade `Secure`.** Obligatorio en HTTPS. |

> **Ojo con el SMTP de Supabase:** el que trae por defecto permite **2 correos
> de autenticación por hora**. Es para probar, no para usar. Con SMTP propio
> (Resend) el límite sube a 30/hora. Esto sorprende a mucha gente en el peor
> momento.

## Dos detalles del código que vale la pena mirar

**`firmaValida()`** usa `timingSafeEqual`, no `===`. Un `===` se rinde en el
primer byte distinto, y esa diferencia de microsegundos es medible desde
afuera — deja adivinar la firma byte por byte. Comparar en tiempo constante
cierra esa puerta. Es una línea.

**La respuesta a un correo no autorizado es idéntica** a la de uno autorizado.
Si dijéramos *"ese correo no existe"*, cualquiera podría averiguar quién
trabaja en la escuela probando direcciones. Es el mismo motivo por el que un
login nunca debe decir "usuario correcto, contraseña incorrecta".

Y el límite de intentos tiene **dos números distintos**: 5 por correo, 20 por
IP. Una escuela entera suele salir a internet por una sola IP pública; con un
límite de 5 por IP, tres maestras pidiendo enlaces el mismo día se bloquearían
entre ellas. El límite estricto va donde un atacante tendría que adivinar.
