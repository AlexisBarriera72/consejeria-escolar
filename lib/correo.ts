import 'server-only';

/**
 * Envío del enlace de acceso.
 *
 * Con RESEND_API_KEY puesto, se envía de verdad. Sin él, se imprime en la
 * consola del servidor — que es exactamente como se desarrolla esto en local
 * y lo que hace el prototipo de demo/magic-link/.
 *
 * Nota sobre Supabase, por si alguien lo reconsidera: su SMTP por defecto
 * permite DOS correos de autenticación por hora. Es para probar, no para
 * usar. Con Resend son 3.000 al mes en el plan gratis, de sobra para dos
 * personas que entran un par de veces por semana.
 */

export async function enviarEnlace(
  correo: string,
  enlace: string,
): Promise<void> {
  const clave = process.env.RESEND_API_KEY;
  const remitente =
    process.env.CORREO_REMITENTE ??
    'Consejería Escolar <onboarding@resend.dev>';

  if (!clave) {
    console.log(
      [
        '',
        '─'.repeat(72),
        `  📧  CORREO SIMULADO  →  ${correo}`,
        '      (sin RESEND_API_KEY; en producción esto llega a su bandeja)',
        '',
        `      ${enlace}`,
        '',
        '      Vence en 10 minutos. Sirve una sola vez.',
        '─'.repeat(72),
        '',
      ].join('\n'),
    );
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clave}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: remitente,
      to: correo,
      subject: 'Tu enlace para entrar al panel',
      html: `
        <div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.6;color:#16202e">
          <p>Hola,</p>
          <p>Pulsa aquí para entrar al panel de la Consejería Escolar:</p>
          <p style="margin:28px 0">
            <a href="${enlace}"
               style="background:#2f5ea8;color:#fff;padding:14px 26px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block">
              Entrar al panel
            </a>
          </p>
          <p style="color:#5b6676;font-size:14px">
            Este enlace vence en 10 minutos y solo se puede usar una vez.<br>
            Si no lo pediste tú, puedes ignorar este correo.
          </p>
        </div>`,
    }),
  });

  if (!res.ok) {
    // No se filtra el motivo al navegador: se registra aquí y a la persona
    // se le dice lo mismo que siempre, para no revelar quién es del personal.
    console.error('Resend falló:', res.status, await res.text());
    throw new Error('ENVIO_FALLIDO');
  }
}
