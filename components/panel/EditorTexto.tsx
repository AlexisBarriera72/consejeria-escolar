'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useCallback } from 'react';

/**
 * El editor de texto — SEIS botones y ni uno más (doc 04 §4).
 *
 * Negrita · Cursiva · Viñetas · Numerada · Enlace · Deshacer.
 *
 * No hay selector de fuente, ni de tamaño, ni de color, ni alineación, ni
 * tablas. Y es a propósito, no por vagancia: dale un selector de color y de
 * tamaño a diez personas distintas y en un mes tienes Comic Sans morado de
 * 14 puntos en una página pública, y cada anuncio con una pinta distinta.
 *
 * Quitar la elección es lo que garantiza que el sitio siga viéndose bien
 * cuando quien lo hizo ya no esté. A la clienta se le dice así: "así siempre
 * se ve bien, sin que tengan que preocuparse por el diseño".
 */

const BOTON =
  'min-w-10 min-h-10 px-3 rounded-lg border border-borde bg-white ' +
  'text-tinta font-semibold hover:bg-azul-100 disabled:opacity-40';
const ACTIVO = 'bg-azul-700 text-white border-azul-700 hover:bg-azul-900';

export function EditorTexto({
  valor,
  alCambiar,
  etiqueta,
}: {
  valor: string;
  alCambiar: (html: string) => void;
  etiqueta: string;
}) {
  const editor = useEditor({
    // Sin esto, Tiptap renderiza en el servidor y el HTML no coincide al
    // hidratar. La advertencia lo dice, pero es fácil pasarla por alto.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false, // los titulares son campos aparte, no texto libre
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Link.configure({ openOnClick: false, autolink: false }),
    ],
    content: valor,
    onUpdate: ({ editor }) => alCambiar(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'min-h-48 px-4 py-3 focus:outline-none [&_ul]:list-disc ' +
          '[&_ol]:list-decimal [&_li]:ml-5 [&_p]:mb-3 [&_a]:text-azul-700 ' +
          '[&_a]:underline',
        'aria-label': etiqueta,
      },
      /**
       * Pegar SIEMPRE como texto plano.
       *
       * Las maestras pegan desde Word, y Word arrastra una montaña de HTML
       * en línea — fuentes, tamaños, colores, márgenes — que destroza la
       * maqueta y se salta las seis restricciones de arriba por la puerta
       * de atrás. Esta línea es la que hace que el límite sea real.
       */
      handlePaste(view, evento) {
        const texto = evento.clipboardData?.getData('text/plain');
        if (!texto) return false;
        evento.preventDefault();
        view.dispatch(view.state.tr.insertText(texto));
        return true;
      },
    },
  });

  const ponerEnlace = useCallback(() => {
    if (!editor) return;
    const previo = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt(
      '¿A qué dirección lleva el enlace?',
      previo ?? 'https://',
    );
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="border-borde h-64 animate-pulse rounded-xl border-2 bg-white" />
    );
  }

  return (
    <div className="border-borde focus-within:border-azul-700 overflow-hidden rounded-xl border-2 bg-white">
      <div
        role="toolbar"
        aria-label="Formato del texto"
        className="border-borde flex flex-wrap gap-1.5 border-b p-2"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-pressed={editor.isActive('bold')}
          className={`${BOTON} ${editor.isActive('bold') ? ACTIVO : ''}`}
        >
          <strong>N</strong>
          <span className="sr-only">Negrita</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-pressed={editor.isActive('italic')}
          className={`${BOTON} ${editor.isActive('italic') ? ACTIVO : ''}`}
        >
          <em>C</em>
          <span className="sr-only">Cursiva</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-pressed={editor.isActive('bulletList')}
          className={`${BOTON} ${editor.isActive('bulletList') ? ACTIVO : ''}`}
        >
          <span aria-hidden>• —</span>
          <span className="sr-only">Lista con viñetas</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-pressed={editor.isActive('orderedList')}
          className={`${BOTON} ${editor.isActive('orderedList') ? ACTIVO : ''}`}
        >
          <span aria-hidden>1.</span>
          <span className="sr-only">Lista numerada</span>
        </button>
        <button
          type="button"
          onClick={ponerEnlace}
          aria-pressed={editor.isActive('link')}
          className={`${BOTON} ${editor.isActive('link') ? ACTIVO : ''}`}
        >
          <span aria-hidden>🔗</span>
          <span className="sr-only">Poner un enlace</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={BOTON}
        >
          <span aria-hidden>↶</span>
          <span className="sr-only">Deshacer</span>
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
