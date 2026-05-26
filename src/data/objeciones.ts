import type { Objecion } from '../types';

export const OBJECIONES: Objecion[] = [
  {
    id: 1,
    titulo: "La comisión es muy alta",
    pitchPropuesto: "Entiendo que el porcentaje es un punto clave en su rentabilidad. Rappi no es un costo fijo como el alquiler; es una inversión sobre ventas reales. Básicamente, es un equipo de marketing trabajando para usted que solo cobra cuando el dinero ya ingresó a su negocio.",
    simplificado: "La comisión no es un costo fijo: solo paga cuando vende. Es marketing que cobra por resultado, no por estar.",
    flujo: "Objeción: comisión alta → No es costo fijo, es inversión → Solo cobra cuando vende → Cierre: ¿proyectamos cuánto podría vender sin arriesgar capital?"
  },
  {
    id: 2,
    titulo: "Calidad del producto",
    pitchPropuesto: "Su marca es lo más importante y que el pedido llegue perfecto es nuestra prioridad. Lo asesoramos con el empaque ideal según su tipo de comida. Además, el seguimiento en tiempo real garantiza que el cliente sepa exactamente dónde está su orden, cuidando la experiencia final.",
    simplificado: "Asesoría de packaging según su producto y seguimiento en tiempo real para cuidar la experiencia del cliente.",
    flujo: "Objeción: calidad → Asesoría de empaque → Seguimiento en tiempo real → Cierre: ¿qué producto le preocupa más?"
  },
  {
    id: 3,
    titulo: "Ya trabaja con otra aplicación",
    pitchPropuesto: "Es excelente que ya domine el canal digital; eso facilita mucho el inicio. Sin embargo, los usuarios de Rappi son una base distinta y muy fiel. Estar aquí es captar ventas de clientes que hoy no están comprando en su restaurante. Sumarnos no le quita tiempo y son ingresos extra.",
    simplificado: "Los usuarios de Rappi son una base distinta. Estar en Rappi son ingresos adicionales de clientes que hoy no lo conocen.",
    flujo: "Objeción: otra app → Bases de clientes distintas → Ingresos extra sin quitarle tiempo → Cierre: ¿revisamos qué categoría tiene más potencial?"
  },
  {
    id: 4,
    titulo: "Manejo de menú",
    pitchPropuesto: "No es necesario que suba toda su carta para comenzar. Podemos iniciar solo con sus 5 platos estrella. Nuestro equipo se encarga del montaje para que usted pueda estar recibiendo pedidos en cuestión de días.",
    simplificado: "Solo 5 platos estrella para empezar. El equipo carga el menú; usted solo elige los productos.",
    flujo: "Objeción: menú amplio → Solo 5 platos estrella → Equipo hace el montaje → Cierre: ¿cuáles son sus 5 platos más pedidos?"
  },
  {
    id: 5,
    titulo: "Los repartidores llegan tarde",
    pitchPropuesto: "El tiempo de entrega es crítico para la satisfacción de su cliente. Hemos optimizado la flota en su zona y contamos con un sistema de protección: si ocurre un problema ajeno a su cocina, Rappi asume el costo. Usted no pierde por errores externos.",
    simplificado: "Flota optimizada en su zona y sistema de protección: si el error no es de su cocina, Rappi asume el costo.",
    flujo: "Objeción: repartidores tarde → Flota optimizada → Rappi asume errores externos → Cierre: ¿fue experiencia propia o lo escuchó de otros?"
  },
  {
    id: 6,
    titulo: "Ya tiene su delivery propio",
    pitchPropuesto: "Es muy valioso que ya cuente con su propia logística de entregas. Rappi es un canal de venta adicional para llegar a clientes que aún no lo conocen. Usted decide si usa sus repartidores o los nuestros; el objetivo es que su negocio crezca.",
    simplificado: "Rappi llega a clientes que aún no lo conocen. Usted elige si usa sus repartidores o los de Rappi.",
    flujo: "Objeción: delivery propio → Canal adicional de ventas → Usted elige la logística → Cierre: ¿qué parte de su operación actual le funciona mejor?"
  },
  {
    id: 7,
    titulo: "No tenemos presupuesto",
    pitchPropuesto: "Precisamente por eso lo busco, para generar ingresos adicionales sin inversión. Iniciar en Rappi no tiene costo de inscripción ni mensualidades. Solo cobramos una comisión por cada venta concretada. Si no vende, no paga absolutamente nada.",
    simplificado: "Sin costo de inscripción ni mensualidades. Solo paga comisión por cada venta. Si no vende, no paga.",
    flujo: "Objeción: sin presupuesto → Sin costo inicial ni mensualidad → Solo paga por venta real → Cierre: ¿si pudiera empezar esta semana sin inversión, le interesaría?"
  },
  {
    id: 8,
    titulo: "La zona de cobertura es limitada",
    pitchPropuesto: "El alcance es fundamental para asegurar un buen volumen de órdenes. Iniciamos con un radio estratégico de alta demanda. A medida que su restaurante crece y recibe buenas reseñas, la aplicación amplía su cobertura de forma automática.",
    simplificado: "Radio inicial de alta demanda que se amplía automáticamente con las ventas y reseñas del restaurante.",
    flujo: "Objeción: cobertura → Radio estratégico inicial → Crece con ventas y reseñas → Cierre: ¿cuántos usuarios activos hay cerca de su local?"
  },
  {
    id: 9,
    titulo: "No tengo tiempo ahora",
    pitchPropuesto: "Entiendo perfectamente; la operación del día a día es muy exigente. Solo necesito dos minutos para coordinar una llamada breve cuando esté más tranquilo. Tenemos una oportunidad puntual para su zona que no quisiera que pierda.",
    simplificado: "Solo 2 minutos para agendar una llamada breve. Hay una oportunidad puntual para su zona con fecha límite.",
    flujo: "Objeción: sin tiempo → Solo 2 minutos para agendar → Oportunidad con fecha límite → Cierre: ¿mañana temprano o el jueves?"
  },
  {
    id: 10,
    titulo: "La tienda recién está comenzando",
    pitchPropuesto: "Es el momento ideal para ganar visibilidad y posicionarse rápidamente. Rappi impulsa a los locales nuevos en los resultados de búsqueda. Además, usted tiene el control total: si el local se llena, puede pausar la aplicación con un solo clic.",
    simplificado: "Los locales nuevos reciben impulso en búsquedas. Y si se llena, pausa la app con un clic.",
    flujo: "Objeción: tienda nueva → Boost en búsquedas → Control total para pausar → Cierre: ¿aprovechamos el impulso de su apertura?"
  },
  {
    id: 11,
    titulo: "No damos abasto con los pedidos",
    pitchPropuesto: "Es excelente tener esa demanda; significa que su producto es de alta calidad. Rappi es su aliado para optimizar los horarios de menor flujo. Usted decide cuándo recibir pedidos; la aplicación se adapta a su ritmo de cocina, no al revés.",
    simplificado: "Usted decide cuándo recibir pedidos. La app se adapta a su ritmo de cocina, no al revés.",
    flujo: "Objeción: exceso de pedidos → App se adapta a su ritmo → Activar solo en baches → Cierre: ¿le serviría activarla en los momentos de menor flujo?"
  },
  {
    id: 12,
    titulo: "Escuché quejas de otros dueños",
    pitchPropuesto: "Agradezco su honestidad; es la base para construir una alianza seria. Hemos realizado cambios profundos, como el nuevo sistema de disputas que protege al restaurante de cobros injustos. No le pido que me crea; pruébenos un mes y vea los resultados.",
    simplificado: "Nuevo sistema de disputas que protege al restaurante de cobros injustos. Un mes de prueba para que evalúe la diferencia.",
    flujo: "Objeción: quejas externas → Cambios concretos realizados → Sistema de disputas → Cierre: ¿qué tendría que cambiar para darle una oportunidad?"
  },
  {
    id: 13,
    titulo: "Tengo una deuda de Ads y no vuelvo",
    isRP: true,
    pitchPropuesto: "Lamento la experiencia previa; queremos que este regreso sea rentable y exitoso. Si decide retomar, su deuda anterior de publicidad queda saldada. Empezamos de cero para enfocarnos únicamente en generar nuevas ventas para usted.",
    simplificado: "Si decide retomar, la deuda de Ads queda saldada. Empezamos de cero enfocados en generar ventas.",
    flujo: "Objeción: deuda de Ads → Deuda saldada al retomar → Empezamos de cero → Cierre: ¿qué le gustaría que fuera diferente esta vez?"
  },
  {
    id: 14,
    titulo: "Me fui por el cobro de cancelaciones",
    isRP: true,
    pitchPropuesto: "Entiendo la frustración de asumir costos por situaciones fuera de su control. Ahora, desde el Portal de Socios, usted puede gestionar múltiples requerimientos de forma sencilla desde su celular. Si el error no es de su cocina, Rappi protege su pago.",
    simplificado: "Nuevo portal para gestionar disputas desde el celular. Si el error no es de su cocina, Rappi protege su pago.",
    flujo: "Objeción: cobro de cancelaciones → Portal de disputas desde celular → Rappi protege pagos → Cierre: ¿le muestro cómo funciona el nuevo sistema?"
  },
  {
    id: 15,
    titulo: "Me fui por el cobro de compensaciones",
    isRP: true,
    pitchPropuesto: "Ese ha sido uno de los puntos donde Rappi más ha trabajado. Lanzamos un sistema de código QR para validar entregas completas, lo que permite establecer con precisión dónde estuvo el error. También activamos reglas antifraude para usuarios reincidentes.",
    simplificado: "Código QR para verificar entregas completas y reglas antifraude para usuarios reincidentes. El sistema protege al restaurante.",
    flujo: "Objeción: cobro de compensaciones → QR para validar entregas → Reglas antifraude → Cierre: ¿te comparto el detalle del nuevo sistema?"
  }
];
