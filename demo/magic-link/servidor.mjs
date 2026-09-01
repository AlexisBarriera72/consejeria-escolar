#!/usr/bin/env node
/**
 * Demo de acceso por enlace mágico — Consejería Escolar
 * =====================================================
 *
 * Corre con:   node demo/magic-link/servidor.mjs
 * Abre:        http://localhost:4321
 *
 * CERO dependencias. Solo módulos de Node. No hay npm install.
 *
 * Qué demuestra
 * -------------
 * El flujo completo de "magic link": la maestra escribe su correo, recibe un
 * enlace, hace clic, y queda dentro. Sin contraseña que recordar, olvidar,
 * apuntar en un papel o compartir.
 *
 * En esta demo el enlace se imprime en la TERMINAL en vez de enviarse por
 * correo. Eso no es un atajo del demo: es exactamente como se desarrolla esto
 * en local. En producción cambias una función (`enviarCorreo`) por una llamada
 * a Resend y no cambias nada más.
 *
 * Lo que es real aquí y hay que copiar tal cual a producción:
 *   - El token va FIRMADO con HMAC-SHA256. No se puede fabricar sin el secreto.
 *   - La firma se compara con timingSafeEqual (evita ataques de temporización).
 *   - El token expira a los 10 minutos.
 *   - El token es de un solo uso.
 *   - La cookie de sesión es HttpOnly + SameSite=Lax (y Secure en producción).
 *   - La sesión también va firmada: el navegador no puede editarla.
 *   - Hay límite de intentos por correo y por IP.
 *   - Solo los correos de la lista pueden entrar.
 *   - La respuesta es IDÉNTICA exista o no el correo (no filtra quién es staff).
 *   - Toda ruta protegida vuelve a verificar la sesión. No basta con esconder
 *     la página: hay que proteger cada ruta que escribe.
 *
 * Lo único falso es `enviarCorreo()` y que los datos viven en memoria.
 */

import { createServer } from 'node:http';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

// ───────────────────────────────────────────────────────────── configuración

const PUERTO = 4321;

/** En producción: process.env.SESSION_SECRET, 32+ bytes aleatorios, en Vercel.
 *  Nunca en el repositorio. */
const SECRETO = randomBytes(32).toString('hex');

/** En producción: process.env.STAFF_EMAILS.split(',')
 *  Para 1–3 personas, una variable de entorno es toda la "base de datos de
 *  usuarios" que necesitas. Añadir a alguien = editar una variable en Vercel. */
const CORREOS_AUTORIZADOS = new Map([
  ['maria.rivera@escuela.pr', 'Sra. Rivera'],
  ['ana.colon@escuela.pr', 'Sra. Colón'],
]);

const VIDA_DEL_ENLACE_MS = 10 * 60 * 1000;      // 10 minutos
const VIDA_DE_SESION_MS = 8 * 60 * 60 * 1000;   // 8 horas (turno escolar)
/** Dos límites distintos, a propósito.
 *
 *  Una escuela entera suele salir a internet por UNA sola IP pública. Si el
 *  límite por IP fuera 5, tres maestras pidiendo enlaces el mismo día se
 *  bloquearían entre ellas. Por eso el límite por IP es holgado (frena a un
 *  atacante automatizado, no a un pasillo lleno de gente) y el límite estricto
 *  va por correo, que es lo que un atacante realmente tendría que adivinar. */
const MAX_INTENTOS_CORREO = 5;
const MAX_INTENTOS_IP = 20;
const VENTANA_INTENTOS_MS = 15 * 60 * 1000;

// ───────────────────────────────────────────────── estado (solo para la demo)

/** Tokens ya usados, para que un enlace sirva UNA sola vez.
 *  En producción: Upstash Redis con TTL de 10 min, o acepta la ventana de
 *  10 minutos y guarda nada. Para 2 usuarias, cualquiera de las dos está bien. */
const tokensUsados = new Set();

/** Límite de intentos: clave -> { conteo, desde } */
const intentos = new Map();

// ─────────────────────────────────────────────────────────────── criptografía

const b64 = (s) => Buffer.from(s).toString('base64url');
const deB64 = (s) => Buffer.from(s, 'base64url').toString('utf8');

function firmar(texto) {
  return createHmac('sha256', SECRETO).update(texto).digest('base64url');
}

/** Compara firmas en tiempo constante.
 *  Un `===` normal se rinde en el primer byte distinto, y esa diferencia de
 *  microsegundos es medible: deja adivinar la firma byte por byte. */
function firmaValida(texto, firmaRecibida) {
  const esperada = Buffer.from(firmar(texto));
  const recibida = Buffer.from(String(firmaRecibida));
  if (esperada.length !== recibida.length) return false;
  return timingSafeEqual(esperada, recibida);
}

/** Crea `payload.firma`. El navegador puede LEER el payload — no guardes nada
 *  secreto ahí — pero no puede MODIFICARLO sin invalidar la firma. */
function crearToken(datos) {
  const payload = b64(JSON.stringify(datos));
  return `${payload}.${firmar(payload)}`;
}

function leerToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, firma] = token.split('.');
  if (!firmaValida(payload, firma)) return null;         // firma falsa
  try {
    const datos = JSON.parse(deB64(payload));
    if (Date.now() > datos.exp) return null;             // vencido
    return datos;
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────── límite de intentos

function excedeLimite(clave, maximo) {
  const ahora = Date.now();
  const registro = intentos.get(clave);
  if (!registro || ahora - registro.desde > VENTANA_INTENTOS_MS) {
    intentos.set(clave, { conteo: 1, desde: ahora });
    return false;
  }
  registro.conteo += 1;
  return registro.conteo > maximo;
}

// ────────────────────────────────────────────────────────────────── "correo"

function enviarCorreo(correo, enlace) {
  // En producción esto es una llamada a Resend:
  //
  //   await resend.emails.send({
  //     from: 'Consejería Escolar <acceso@tudominio.com>',
  //     to: correo,
  //     subject: 'Tu enlace para entrar',
  //     html: `<a href="${enlace}">Entrar al panel</a> — vence en 10 minutos.`,
  //   });
  //
  // Ojo: el SMTP que trae Supabase por defecto permite 2 correos por HORA.
  // Es para probar, no para usar. Con SMTP propio (Resend) suben a 30/hora.
  console.log('\n' + '─'.repeat(70));
  console.log('  📧  CORREO SIMULADO  →  ' + correo);
  console.log('      (en producción esto llega a su bandeja de entrada)');
  console.log('');
  console.log('      ' + enlace);
  console.log('');
  console.log('      Vence en 10 minutos. Sirve una sola vez.');
  console.log('─'.repeat(70) + '\n');
}

// ─────────────────────────────────────────────────────────────────── sesión

function crearSesion(correo) {
  return crearToken({
    correo,
    nombre: CORREOS_AUTORIZADOS.get(correo),
    exp: Date.now() + VIDA_DE_SESION_MS,
    tipo: 'sesion',
  });
}

/** La única función que decide si alguien está adentro.
 *  Se llama en CADA ruta protegida — incluidas las que escriben datos. */
function sesionActiva(req) {
  const cookies = Object.fromEntries(
    (req.headers.cookie ?? '')
      .split(';')
      .map((c) => c.trim().split('='))
      .filter((p) => p.length === 2)
  );
  const datos = leerToken(cookies.sesion);
  if (!datos || datos.tipo !== 'sesion') return null;
  // Revocar a alguien = quitarlo de la lista. Su cookie deja de servir aquí.
  if (!CORREOS_AUTORIZADOS.has(datos.correo)) return null;
  return datos;
}

// ────────────────────────────────────────────────────────────────── plantilla

const ESTILO = `
  :root {
    --azul-500:#4378c6; --azul-700:#2f5ea8; --azul-900:#1e3f73;
    --azul-100:#dbe4f6; --tinta:#16202e; --papel:#fbfaf7;
    --gris:#5b6676; --ambar:#ffc226; --menta:#75d2c1; --rosa-700:#c4166b;
  }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--papel); color:var(--tinta);
    font:17px/1.6 'Segoe UI',system-ui,sans-serif; }
  .barra { background:var(--azul-500); color:#fff; padding:14px 24px;
    display:flex; justify-content:space-between; align-items:center; }
  .aviso { background:var(--azul-100); color:var(--tinta); padding:12px 24px;
    font-size:15px; border-bottom:1px solid #c6d4ec; }
  main { max-width:620px; margin:0 auto; padding:48px 24px; }
  h1 { font-size:32px; margin:0 0 8px; color:var(--azul-900); letter-spacing:-.02em; }
  p.sub { color:var(--gris); margin:0 0 32px; }
  label { display:block; font-weight:600; margin-bottom:8px; }
  input[type=email] { width:100%; padding:14px 16px; font-size:17px;
    border:2px solid #d4dbe6; border-radius:10px; background:#fff; }
  input[type=email]:focus { outline:3px solid var(--ambar); outline-offset:2px;
    border-color:var(--azul-700); }
  button { font:inherit; font-weight:600; padding:15px 26px; border-radius:10px;
    border:2px solid var(--azul-700); cursor:pointer; }
  .primario { background:var(--azul-700); color:#fff; }
  .secundario { background:#fff; color:var(--azul-700); }
  button:focus-visible { outline:3px solid var(--ambar); outline-offset:2px; }
  .tarjeta { background:#fff; border:1px solid #e4e8ef; border-radius:16px;
    padding:28px; margin:24px 0; }
  .error { background:#fdeaf1; border-left:4px solid var(--rosa-700);
    padding:14px 18px; border-radius:8px; margin-bottom:24px; }
  .ok { background:#e8f7f3; border-left:4px solid #0a7d85;
    padding:14px 18px; border-radius:8px; }
  code { background:#eef1f6; padding:2px 7px; border-radius:5px; font-size:15px; }
  .pie { color:var(--gris); font-size:14px; margin-top:40px;
    border-top:1px solid #e4e8ef; padding-top:20px; }
  a { color:var(--azul-700); }
`;

function pagina({ titulo, cuerpo, sesion = null }) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${titulo} · Consejería Escolar</title><style>${ESTILO}</style></head><body>
<div class="barra">
  <strong>Consejería Escolar</strong>
  ${sesion
    ? `<span style="display:flex;gap:16px;align-items:center">Hola, ${sesion.nombre}
       <form method="POST" action="/edit/salir" style="margin:0">
         <button class="secundario" style="padding:8px 16px">Cerrar sesión</button>
       </form></span>`
    : ''}
</div>
${sesion ? `<div class="aviso">Estás en el panel de edición — los estudiantes no ven esta pantalla.</div>` : ''}
<main>${cuerpo}</main></body></html>`;
}

// ──────────────────────────────────────────────────────────────────── rutas

function responder(res, codigo, html, cabeceras = {}) {
  res.writeHead(codigo, {
    'Content-Type': 'text/html; charset=utf-8',
    'X-Robots-Tag': 'noindex',
    ...cabeceras,
  });
  res.end(html);
}

function leerCuerpo(req) {
  return new Promise((resolve) => {
    let datos = '';
    req.on('data', (c) => {
      datos += c;
      if (datos.length > 10_000) req.destroy();   // no aceptes cuerpos enormes
    });
    req.on('end', () => resolve(Object.fromEntries(new URLSearchParams(datos))));
  });
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PUERTO}`);
  const ruta = url.pathname;
  const sesion = sesionActiva(req);

  // ── Página pública ──────────────────────────────────────────────────────
  if (ruta === '/') {
    return responder(res, 200, pagina({
      titulo: 'Inicio',
      cuerpo: `
        <h1>Página pública</h1>
        <p class="sub">Esto representa el sitio que ven estudiantes y encargados.</p>
        <div class="tarjeta">
          <p>El panel de edición vive en <code>/edit</code>. Puedes llegar
          escribiendo la dirección, o por el enlace discreto de abajo.</p>
          <p><a href="/edit">Personal</a></p>
        </div>
        <div class="pie">
          Correos autorizados para la demo:<br>
          <code>maria.rivera@escuela.pr</code> · <code>ana.colon@escuela.pr</code><br><br>
          Prueba también un correo NO autorizado: verás que la respuesta es
          idéntica. El sitio nunca revela quién es personal.
        </div>`,
    }));
  }

  // ── Pantalla de acceso ──────────────────────────────────────────────────
  if (ruta === '/edit' && req.method === 'GET') {
    if (sesion) {
      return responder(res, 302, '', { Location: '/edit/panel' });
    }
    const error = url.searchParams.get('error');
    return responder(res, 200, pagina({
      titulo: 'Acceso',
      cuerpo: `
        <h1>Entrar al panel</h1>
        <p class="sub">Te enviamos un enlace por correo. No hay contraseña.</p>
        ${error === 'limite'
          ? `<div class="error"><strong>Demasiados intentos.</strong>
             Espera 15 minutos y vuelve a intentar.</div>` : ''}
        ${error === 'invalido'
          ? `<div class="error"><strong>Ese enlace ya no sirve.</strong>
             Los enlaces vencen a los 10 minutos y solo se pueden usar una vez.
             Pide uno nuevo.</div>` : ''}
        <form method="POST" action="/edit/acceso" class="tarjeta">
          <label for="correo">Tu correo electrónico</label>
          <input id="correo" name="correo" type="email" required
                 autocomplete="email" placeholder="nombre@escuela.pr">
          <p style="margin:20px 0 0">
            <button class="primario" type="submit">Enviar enlace de acceso</button>
          </p>
        </form>`,
    }));
  }

  // ── Generar y "enviar" el enlace ────────────────────────────────────────
  if (ruta === '/edit/acceso' && req.method === 'POST') {
    const { correo = '' } = await leerCuerpo(req);
    const limpio = correo.trim().toLowerCase();
    const ip = req.socket.remoteAddress ?? 'desconocida';

    // Se evalúan LAS DOS antes del `if`. Con `||` la segunda no correría
    // cuando la primera ya dio true, y ese contador quedaría desfasado.
    const ipPasada = excedeLimite(`ip:${ip}`, MAX_INTENTOS_IP);
    const correoPasado = excedeLimite(`correo:${limpio}`, MAX_INTENTOS_CORREO);
    if (ipPasada || correoPasado) {
      return responder(res, 302, '', { Location: '/edit?error=limite' });
    }

    if (CORREOS_AUTORIZADOS.has(limpio)) {
      const token = crearToken({
        correo: limpio,
        exp: Date.now() + VIDA_DEL_ENLACE_MS,
        jti: randomBytes(9).toString('base64url'),   // id único -> un solo uso
        tipo: 'enlace',
      });
      enviarCorreo(limpio, `http://localhost:${PUERTO}/edit/verificar?token=${token}`);
    } else {
      // Correo no autorizado: no enviamos nada, pero la respuesta al navegador
      // es EXACTAMENTE la misma. Si dijéramos "ese correo no existe",
      // cualquiera podría averiguar quién trabaja aquí probando direcciones.
      console.log(`\n  ⚠  Intento con correo no autorizado: ${limpio} (no se envió nada)\n`);
    }

    return responder(res, 200, pagina({
      titulo: 'Revisa tu correo',
      cuerpo: `
        <h1>Revisa tu correo</h1>
        <div class="ok">
          Si <strong>${limpio.replace(/[<>&]/g, '')}</strong> pertenece al personal,
          le acabamos de enviar un enlace para entrar.
        </div>
        <div class="tarjeta">
          <p><strong>El enlace vence en 10 minutos</strong> y solo se puede usar
          una vez. Si no llega, revisa la carpeta de correo no deseado.</p>
          <p style="margin-bottom:0"><a href="/edit">Pedir otro enlace</a></p>
        </div>
        <div class="pie">
          <strong>En esta demo el enlace se imprimió en la terminal</strong>
          donde corriste <code>node servidor.mjs</code>. Cópialo y pégalo en el
          navegador. En producción llega por correo real vía Resend.
        </div>`,
    }));
  }

  // ── Verificar el enlace y abrir sesión ──────────────────────────────────
  if (ruta === '/edit/verificar') {
    const token = url.searchParams.get('token') ?? '';
    const datos = leerToken(token);

    // Falla si: la firma es falsa, el token venció, o ya se usó.
    if (!datos || datos.tipo !== 'enlace' || tokensUsados.has(datos.jti)) {
      return responder(res, 302, '', { Location: '/edit?error=invalido' });
    }
    if (!CORREOS_AUTORIZADOS.has(datos.correo)) {
      return responder(res, 302, '', { Location: '/edit?error=invalido' });
    }

    tokensUsados.add(datos.jti);   // quemado: este enlace no sirve otra vez

    const cookie = [
      `sesion=${crearSesion(datos.correo)}`,
      'HttpOnly',                              // JavaScript no la puede leer
      'SameSite=Lax',                          // no viaja desde otros sitios
      'Path=/',
      `Max-Age=${VIDA_DE_SESION_MS / 1000}`,
      // 'Secure',                             // ← obligatorio en producción
    ].join('; ');

    return responder(res, 302, '', { Location: '/edit/panel', 'Set-Cookie': cookie });
  }

  // ── Panel protegido ─────────────────────────────────────────────────────
  if (ruta === '/edit/panel') {
    if (!sesion) return responder(res, 302, '', { Location: '/edit' });

    const vence = new Date(sesion.exp).toLocaleTimeString('es-PR', {
      hour: 'numeric', minute: '2-digit',
    });

    return responder(res, 200, pagina({
      titulo: 'Panel',
      sesion,
      cuerpo: `
        <h1>Panel de edición</h1>
        <p class="sub">Entraste sin escribir ninguna contraseña.</p>
        <div class="tarjeta">
          <p style="margin-top:0"><strong>Aquí irían las tres tarjetas:</strong></p>
          <p>Preguntas y Guías · Noticias · Profesionales</p>
        </div>
        <div class="tarjeta">
          <p style="margin-top:0"><strong>Sesión activa</strong></p>
          <p>Persona: ${sesion.nombre} (<code>${sesion.correo}</code>)<br>
          Vence a las ${vence}.</p>
          <p style="margin-bottom:0">Ese nombre es lo que aparecería en
          <em>"Editado por ${sesion.nombre}"</em> en el historial de cambios.</p>
        </div>
        <div class="pie">
          <strong>Pruébalo:</strong> abre las herramientas de desarrollador
          (F12) → Application → Cookies. Verás la cookie <code>sesion</code>
          marcada <code>HttpOnly</code>. No hay forma de leerla ni de
          fabricarla desde JavaScript.<br><br>
          <strong>Y esto:</strong> vuelve a abrir el enlace del correo. Ya no
          funciona — era de un solo uso.
        </div>`,
    }));
  }

  // ── Cerrar sesión ───────────────────────────────────────────────────────
  if (ruta === '/edit/salir' && req.method === 'POST') {
    return responder(res, 302, '', {
      Location: '/',
      'Set-Cookie': 'sesion=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0',
    });
  }

  responder(res, 404, pagina({
    titulo: 'No encontrado',
    cuerpo: '<h1>Esa página no existe</h1><p><a href="/">Volver al inicio</a></p>',
  }));
});

servidor.listen(PUERTO, () => {
  console.log(`
  ╭──────────────────────────────────────────────────────────────╮
  │  Demo de enlace mágico — Consejería Escolar                  │
  ╰──────────────────────────────────────────────────────────────╯

  Abre:  http://localhost:${PUERTO}

  1. Haz clic en "Personal" (o ve directo a /edit)
  2. Escribe:  maria.rivera@escuela.pr
  3. El enlace aparecerá AQUÍ ABAJO, en esta terminal.
     Cópialo al navegador.

  Prueba también:
  · un correo cualquiera        -> misma respuesta, ningún enlace
  · el mismo enlace dos veces   -> el segundo intento falla
  · 6 intentos seguidos         -> bloqueo por 15 minutos
  · F12 -> Application -> Cookies -> la sesión es HttpOnly

  Ctrl+C para salir.
`);
});
