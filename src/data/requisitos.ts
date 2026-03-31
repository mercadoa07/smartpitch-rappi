export interface Requisito {
  id: string;
  categoria: string;
  texto: string;
  detalle: string;
}

export const REQUISITOS: Requisito[] = [
  // Documentos
  {
    id: 'doc_1',
    categoria: 'Documentos',
    texto: 'Certificado Bancario',
    detalle: 'Documento que acredita la cuenta bancaria del negocio donde se realizarán los pagos semanales de Rappi.'
  },
  {
    id: 'doc_2',
    categoria: 'Documentos',
    texto: 'RUT / RFC / NIT / RUC (según país)',
    detalle: 'Número de identificación tributaria del negocio. Varía según el país: RUT (AR/CL), RFC (MX), NIT (CO), RUC (EC/PE).'
  },
  {
    id: 'doc_3',
    categoria: 'Documentos',
    texto: 'Documento de Identidad del Representante Legal',
    detalle: 'Cédula, DNI o pasaporte vigente de la persona que firma el contrato con Rappi en nombre del restaurante.'
  },
  {
    id: 'doc_4',
    categoria: 'Documentos',
    texto: 'Cámara de Comercio / Registro Mercantil',
    detalle: 'Documento de constitución o registro del negocio. En algunos países puede reemplazarse con declaración jurada para negocios informales.'
  },
  // Menú
  {
    id: 'menu_1',
    categoria: 'Menú',
    texto: 'Mínimo 15 productos disponibles permanentemente',
    detalle: 'Los productos deben estar disponibles de forma constante, no temporales. Se recomienda empezar con los más vendidos y mejor calificados.'
  },
  {
    id: 'menu_2',
    categoria: 'Menú',
    texto: 'Imagen por producto (mínimo 360×360px)',
    detalle: 'Foto real del producto, sin marca de agua, bien iluminada y sobre fondo neutro. Rappi ofrece sesión fotográfica gratuita para aliados nuevos.'
  },
  {
    id: 'menu_3',
    categoria: 'Menú',
    texto: 'Precio, nombre y descripción por producto',
    detalle: 'Cada ítem debe tener nombre claro, precio actualizado y descripción breve de ingredientes o contenido (máx. 120 caracteres).'
  },
  // Imágenes de marca
  {
    id: 'marca_1',
    categoria: 'Imágenes de marca',
    texto: 'Logo (mínimo 700×520px)',
    detalle: 'Logo del restaurante en fondo blanco o transparente. Formato JPG, PNG o SVG. Este logo aparece en el resultado de búsqueda dentro de Rappi.'
  },
  {
    id: 'marca_2',
    categoria: 'Imágenes de marca',
    texto: 'Imagen de portada (mínimo 1032×530px)',
    detalle: 'Foto de portada del restaurante o de los platos más representativos. Se muestra en la parte superior del perfil del restaurante en Rappi.'
  },
  // Operación
  {
    id: 'op_1',
    categoria: 'Operación',
    texto: 'Horario de operación mínimo 35 horas semanales',
    detalle: 'El restaurante debe comprometerse a estar disponible en Rappi al menos 35 horas por semana. Puede ajustar su horario en tiempo real desde el Portal de Socios.'
  },
];
