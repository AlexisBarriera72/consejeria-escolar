/**
 * Service worker — Consejería Escolar (doc 06 §6)
 *
 * Para qué está aquí: cuando pasa un huracán y se va la luz o la red, un
 * sitio escolar es justo cuando MÁS falta hace y justo cuando está caído.
 * Con esto, las guías que alguien ya abrió siguen abriéndose sin conexión.
 *
 * Estrategia, a propósito distinta según qué se pide:
 *
 *  · Páginas → red primero, caché si la red falla. Una guía vieja es mucho
 *    mejor que nada, pero si hay red queremos la versión de hoy: un anuncio
 *    de "mañana no hay clases" no puede servirse desde una caché de la
 *    semana pasada.
 *  · Recursos estáticos (fuentes, imágenes, JS) → caché primero. Llevan un
 *    hash en el nombre, así que si cambian cambia la URL.
 *  · El panel (/edit) → NUNCA se cachea. Es contenido privado y siempre
 *    debe pasar por el servidor, que es quien comprueba la sesión.
 */

const VERSION = 'v1';
const PAGINAS = `paginas-${VERSION}`;
const RECURSOS = `recursos-${VERSION}`;
const SIN_CONEXION = '/sin-conexion.html';

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(PAGINAS).then((c) => c.addAll([SIN_CONEXION, '/'])),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) =>
        Promise.all(
          claves
            .filter((k) => !k.endsWith(VERSION))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET') return;

  const url = new URL(peticion.url);
  if (url.origin !== self.location.origin) return;

  // El panel y las rutas de API quedan fuera de la caché, siempre.
  if (url.pathname.startsWith('/edit') || url.pathname.startsWith('/api')) {
    return;
  }

  if (peticion.mode === 'navigate') {
    evento.respondWith(
      fetch(peticion)
        .then((res) => {
          const copia = res.clone();
          caches.open(PAGINAS).then((c) => c.put(peticion, copia));
          return res;
        })
        .catch(async () => {
          const guardada = await caches.match(peticion);
          return guardada ?? caches.match(SIN_CONEXION);
        }),
    );
    return;
  }

  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/subidas/')) {
    evento.respondWith(
      caches.match(peticion).then(
        (guardada) =>
          guardada ??
          fetch(peticion).then((res) => {
            const copia = res.clone();
            caches.open(RECURSOS).then((c) => c.put(peticion, copia));
            return res;
          }),
      ),
    );
  }
});
