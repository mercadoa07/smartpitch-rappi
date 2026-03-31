import type { Objecion } from '../types';

export const OBJECIONES: Objecion[] = [
  {
    id: 1,
    titulo: "La comisión es muy alta",
    pitchPropuesto: "Entiendo perfectamente, y valoro que lo menciones porque es una pregunta clave. La comisión de Rappi no es un costo fijo mensual como el alquiler. Acá solo pagás cuando efectivamente vendés. El ticket promedio de pedidos en tu zona es de {MZ_TICKET_AVG}, lo que significa que cada pedido pone a trabajar miles de usuarios que hoy no te conocen. ¿Te parece si revisamos juntos cuánto tendrías que vender para que la comisión tenga sentido?",
    simplificado: "La comisión no es un costo fijo; solo pagás cuando vendés. Con el ticket promedio de tu zona, cada pedido pone a trabajar miles de usuarios nuevos para tu negocio.",
    flujo: "Objeción: comisión alta → Aclarar: pagas solo si vendés → Anclar con ticket promedio → Calcular punto de equilibrio → Cierre: ¿hacemos los números?"
  },
  {
    id: 2,
    titulo: "El manejo del producto puede afectar la calidad",
    pitchPropuesto: "Es una preocupación muy válida y demuestra que te importa la experiencia de tu cliente. Desde el día uno te acompañamos con recomendaciones de packaging según tu tipo de producto. Rappi tiene herramientas de seguimiento del pedido en tiempo real. ¿Qué productos son los que más te preocupan? Así te doy una solución concreta hoy mismo.",
    simplificado: "Rappi acompaña con recomendaciones de packaging y seguimiento en tiempo real. Los clientes de Rappi son una base distinta, estás dejando ventas encima de la mesa.",
    flujo: "Objeción: calidad → Solución de packaging → Seguimiento en tiempo real → Nueva base de clientes → Cierre: ¿qué producto revisamos?"
  },
  {
    id: 3,
    titulo: "Ya trabaja con otra aplicación",
    pitchPropuesto: "Qué bien que ya estás en el mundo del delivery, eso me dice que sabés el potencial que tiene. Rappi y las otras apps no comparten la misma base de clientes. Los usuarios que piden por Rappi en tu zona son personas que NO están en la otra plataforma. Estás dejando dinero en la mesa. Y si ya tenés el packaging y la operación lista, el trabajo extra es mínimo. ¿Te parece revisar qué producto tuyo podría romperla en Rappi desde el primer mes?",
    simplificado: "Rappi y la otra app no comparten clientes. Para arrancar solo necesitas 5 productos estrella bien fotografiados; el equipo te ayuda a subirlos.",
    flujo: "Objeción: otra app → Bases de clientes distintas → Trabajo extra mínimo → Solo 5 productos → Cierre: ¿cuáles son tus 5 estrella?"
  },
  {
    id: 4,
    titulo: "Manejo de menú (muy amplio o complicado)",
    pitchPropuesto: "Solo necesitamos mínimo 5 productos que se mantengan en el tiempo, ni siquiera tenés que poner todo tu menú al inicio. Los restaurantes con mejores resultados en Rappi arrancan con una selección reducida y bien fotografiada. Nuestro equipo te ayuda a subirlo. ¿Cuáles serían tus 5 productos estrella?",
    simplificado: "Solo necesitas 5 productos para empezar; los mejores restaurantes arrancan con selección reducida y bien fotografiada. El equipo te ayuda a cargarlos.",
    flujo: "Objeción: menú amplio → Mínimo 5 productos → Equipo ayuda a subir → Cierre: ¿cuáles son tus 5 estrella?"
  },
  {
    id: 5,
    titulo: "Los Rappitenderos llegan tarde",
    pitchPropuesto: "Lo entiendo completamente. Rappi ha invertido fuertemente en aumentar la flota de repartidores en tu zona. Además actualizamos la política de cancelaciones: hoy contamos con un sistema de disputas donde si el problema no fue tuyo, no te cobramos nada, absolutamente cero. ¿Eso era un problema que habías tenido antes, o es una preocupación de lo que escuchaste de otros?",
    simplificado: "Rappi amplió la flota de repartidores y tiene un sistema de disputas: si el error no es tuyo, no te cobran nada.",
    flujo: "Objeción: repartidores tarde → Inversión en flota → Sistema de disputas (0% cargo) → Cierre: ¿fue experiencia propia?"
  },
  {
    id: 6,
    titulo: "Ya tiene su delivery propio",
    pitchPropuesto: "Eso es genial, significa que ya tenés la operación pensada para delivery. Tu delivery propio llega a quienes ya te conocen, pero Rappi te conecta con miles de clientes que HOY no saben que existís. Son canales complementarios. Incluso podés elegir si usás tus propios repartidores dentro de la app o los nuestros. ¿Qué parte de tu operación actual de delivery es la que más te funciona?",
    simplificado: "Tu delivery llega a clientes que ya te conocen, Rappi te conecta con miles que HOY no saben que existís: canales complementarios, no competencia.",
    flujo: null
  },
  {
    id: 7,
    titulo: "Realmente no tenemos dinero",
    pitchPropuesto: "Precisamente para eso estoy llamando. Rappi no te cobra ninguna mensualidad ni membresía para empezar, solo cobramos una comisión por cada pedido que se concrete. Si no vendés, no pagás. Y para arrancar con impulso, podemos lanzar una oferta en 3 de tus productos más vendidos. ¿Si te dijera que podés estar vendiendo esta semana sin ningún costo inicial, eso cambia algo en tu decisión?",
    simplificado: "Sin costo inicial ni mensualidad: solo pagás comisión por cada venta real. Oferta de lanzamiento en 3 productos esta semana.",
    flujo: "Objeción: sin dinero → Sin costo inicial → Oferta en 3 productos → Cierre: ¿cambia algo sin costo inicial?"
  },
  {
    id: 8,
    titulo: "La zona de cobertura es limitada",
    pitchPropuesto: "La cobertura inicial cubre un radio importante con una cantidad significativa de clientes potenciales. Y esto no es estático: a medida que tu restaurante crece en ventas y calificaciones, el radio puede ampliarse. Los mejores restaurantes llegaron a eso paso a paso. ¿Querés que te cuente cuántos usuarios activos de Rappi hay en ese radio hoy?",
    simplificado: "La cobertura inicial ya tiene gran alcance y puede crecer con tus ventas y calificaciones. Te muestro cuántos usuarios activos hay en tu radio.",
    flujo: "Objeción: cobertura → Radio inicial amplio → Crece con ventas → Cierre: ¿vemos usuarios activos?"
  },
  {
    id: 9,
    titulo: "Ahora no tengo tiempo",
    pitchPropuesto: "Totalmente válido. Solo dame 2 minutos ahora y acordamos una llamada corta para cuando vos lo decidas. Lo que sí te adelanto es que tenemos una oferta puntual para tu zona que tiene fecha límite. ¿Cuándo tenés 10 minutos esta semana?",
    simplificado: "Solo necesito 2 minutos ahora para agendar. Hay una oferta puntual para tu zona con fecha límite.",
    flujo: null
  },
  {
    id: 10,
    titulo: "Recién está comenzando la tienda",
    pitchPropuesto: "Qué mejor momento para arrancar. Cuando un restaurante entra nuevo a Rappi, la plataforma lo impulsa en los resultados de búsqueda para ganar visibilidad rápido. Tenés acceso a un portal con tráfico en tiempo real. Y podés desconectarte de la app en momentos de alto flujo. ¿Arrancamos esta semana para aprovechar el impulso inicial?",
    simplificado: "Restaurantes nuevos reciben impulso en búsquedas y datos de tráfico en tiempo real. Podés pausar en alto flujo.",
    flujo: "Objeción: recién abrió → Boost para nuevos → Portal en tiempo real → Podés pausar → Cierre: ¿arrancamos?"
  },
  {
    id: 11,
    titulo: "No da abasto con muchos pedidos",
    pitchPropuesto: "Qué bueno que tenés ese nivel de demanda. Justamente Rappi tiene una solución: desde el portal de socios podés pausar la recepción de pedidos en tiempo real con un simple clic. No sos esclavo de la app, vos la controlás. ¿Si tenés esa flexibilidad, creés que podrías manejar pedidos de Rappi en los momentos de menor flujo?",
    simplificado: "Desde el portal podés pausar pedidos con un clic. ¿En momentos de menor flujo podrías manejar pedidos de Rappi?",
    flujo: null
  },
  {
    id: 12,
    titulo: "Oí quejas sobre la aplicación de otros dueños",
    pitchPropuesto: "Agradezco que seas directo. Esas quejas probablemente son reales y Rappi las tomó en serio. Por eso hicimos cambios concretos: nuevo sistema de disputas donde si el error no es del restaurante, no se cobra nada. Estamos invirtiendo activamente en la zona. ¿Qué tal si hablamos con algún restaurante de tu zona que ya esté en Rappi?",
    simplificado: "Rappi tomó en serio las quejas: sistema de disputas que protege al restaurante y más inversión en la zona.",
    flujo: null
  },
  {
    id: 13,
    titulo: "Tengo una deuda de Ads y no voy a volver",
    isRP: true,
    pitchPropuesto: "Entiendo perfectamente y lamento esa experiencia. Lo que sí te puedo contar es que si decidís volver, esa deuda de Ads queda en cero. Es una decisión que tomamos para que el tema económico no sea un obstáculo. Además, hay mejoras importantes en cancelaciones y cobertura. ¿Qué tendría que ver diferente en Rappi hoy?",
    simplificado: "Si decidís volver, la deuda de Ads queda en cero. Hay mejoras importantes desde que te fuiste.",
    flujo: null
  },
  {
    id: 14,
    titulo: "Me fui por el cobro de compensaciones",
    isRP: true,
    pitchPropuesto: "Ese ha sido uno de los puntos donde Rappi más ha trabajado. Lanzamos un sistema de código QR para validar entregas completas, lo que permite establecer con precisión dónde estuvo el error. También activamos reglas antifraude para usuarios reincidentes. ¿Te parece si te comparto el detalle del nuevo sistema?",
    simplificado: "Código QR para verificar entregas completas y reglas antifraude contra usuarios reincidentes. El sistema protege al restaurante.",
    flujo: null
  },
  {
    id: 15,
    titulo: "Me fui por el cobro de cancelaciones",
    isRP: true,
    pitchPropuesto: "Esa es una de las razones principales por las que Rappi invirtió en cambiarlo. Hoy tenés en el Portal de Socios un nuevo flujo de disputas donde podés cuestionar varias cancelaciones a la vez con seguimiento fácil. ¿Qué pasaría si lo probás un mes con las nuevas reglas, y si no ves la diferencia, simplemente lo pausás?",
    simplificado: "Nuevo flujo de disputas en el Portal para cuestionar cancelaciones. ¿Probás un mes y si no ves diferencia, lo pausás?",
    flujo: null
  }
];
