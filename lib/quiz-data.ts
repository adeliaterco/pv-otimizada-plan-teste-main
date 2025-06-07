export const quizSteps = [
  {
    id: 1,
    question: "¡NO DEJES QUE LA PERSONA QUE AMAS SALGA DE TU VIDA PARA SIEMPRE!",
    description:
      "Haz la prueba rápida de 2 minutos y descubre cómo aplicar el PLAN A - RECONQUISTA RÁPIDA en tu caso específico.",
    subtext: "Selecciona tu género:",
    options: ["MASCULINO", "FEMENINO"],
    warning:
      "⚠️ ATENCIÓN: ¡Este método comprobado solo debe usarse si estás 100% comprometido en reconquistar tu amor perdido!",
    elements: {
      heartbeat: true,
      timer: "Prueba de 2 minutos",
    },
  },
  {
    id: 2,
    question: "¿CUÁL ES TU EDAD?",
    description: "(Esta información es crucial para personalizar tu plan de reconquista)",
    options: [
      "18-29 - Fase de descubrimientos emocionales",
      "29-39 - Período de consolidación de valores",
      "39-49 - Momento de reevaluación de prioridades",
      "50+ - Fase de madurez emocional",
    ],
    elements: {
      ageIcons: true,
      counter: "personas que ya hicieron la prueba hoy",
    },
  },
  {
    id: 3,
    question: "¿CUÁNTO TIEMPO LLEVAN SEPARADOS?",
    description: "(El tiempo es un factor crítico para tu estrategia de reconquista)",
    options: {
      masculino: [
        "Menos de una semana - ¡Ventana de oportunidad máxima!",
        "Hace 1 mes - Período ideal para aplicar el Protocolo de 72 horas",
        "2 a 6 meses - Fase que requiere los 21 Gatillos Emocionales",
        "Más de 6 meses - Requiere enfoque de reconexión profunda",
      ],
      feminino: [
        "Menos de una semana - ¡Ventana de oportunidad máxima!",
        "Hace 1 mes - Período ideal para aplicar el Protocolo de 72 horas",
        "2 a 6 meses - Fase que requiere los 21 Gatillos Emocionales",
        "Más de 6 meses - Requiere enfoque de reconexión profunda",
      ],
    },
    bonusUnlock: {
      id: 1,
      title: "21 GATILLOS EMOCIONALES QUE FUNCIONAN",
      value: 47,
      description: "Las 21 frases exactas que hacen que piense en ti obsesivamente.",
    },
  },
  {
    id: 4,
    question: {
      masculino: "¿CÓMO FUE SU SEPARACIÓN?",
      feminino: "¿CÓMO FUE SU SEPARACIÓN?",
    },
    description: "(Esta información es vital para determinar tu estrategia específica)",
    options: {
      masculino: [
        "Ella terminó conmigo - Requiere técnicas específicas de reposicionamiento",
        "Yo terminé con ella - Necesita enfoque de reconexión emocional",
        "Decidimos terminar juntos - Ideal para aplicar el método de transformación mutua",
      ],
      feminino: [
        "Él terminó conmigo - Requiere técnicas específicas de reposicionamiento",
        "Yo terminé con él - Necesita enfoque de reconexión emocional",
        "Decidimos terminar juntos - Ideal para aplicar el método de transformación mutua",
      ],
    },
    elements: {
      analysisText: "Calculando tasa de éxito para tu caso...",
      successRate: "¡Tu caso tiene características prometedoras!",
    },
  },
  {
    id: 5,
    question: "¿CUÁNTO TIEMPO ESTUVIERON JUNTOS?",
    description: "(La duración de la relación influye directamente en tu estrategia)",
    options: [
      "Más de 3 años - Conexión profunda que puede reavivarse rápidamente",
      "De 1 a 3 años - Período ideal para aplicar los 7 Pilares de la Presencia Irresistible",
      "De 6 meses a 1 año - Fase crítica que responde bien a los 21 Gatillos Emocionales",
      "Menos de 6 meses - Requiere técnicas específicas de reconexión rápida",
    ],
  },
  {
    id: 6,
    question: "¿CUÁL FUE LA PARTE MÁS DOLOROSA DE LA RUPTURA?",
    description: "(Identificar tu dolor principal es esencial para tu recuperación emocional y reconquista)",
    options: {
      masculino: [
        "😔 Lidiar con la soledad y el vacío - El Plan A resuelve esto en los primeros 7 días",
        "😢 La montaña rusa emocional: ira, tristeza, arrepentimiento - Nuestro método estabiliza tus emociones",
        "😐 Lidiar con recuerdos y memorias - Transformamos recuerdos dolorosos en combustible para la reconquista",
        "💔 Imaginarla con otro hombre - Técnicas específicas para revertir este escenario",
        "🤔 Darse cuenta de que los planes que hicimos nunca se concretarán - Aprende a reconstruir sueños juntos",
        "⚡ Otro - Tenemos soluciones para cualquier escenario de ruptura",
      ],
      feminino: [
        "😔 Lidiar con la soledad y el vacío - El Plan A resuelve esto en los primeros 7 días",
        "😢 La montaña rusa emocional: ira, tristeza, arrepentimiento - Nuestro método estabiliza tus emociones",
        "😐 Lidiar con recuerdos y memorias - Transformamos recuerdos dolorosos en combustible para la reconquista",
        "💔 Imaginarlo con otra mujer - Técnicas específicas para revertir este escenario",
        "🤔 Darse cuenta de que los planes que hicimos nunca se concretarán - Aprende a reconstruir sueños juntos",
        "⚡ Otro - Tenemos soluciones para cualquier escenario de ruptura",
      ],
    },
    elements: {
      profileAnalysis: "Personalizando tu estrategia emocional...",
      profileComplete: "46%",
    },
  },
  {
    id: 7,
    question: {
      masculino: "¿CUÁL ES TU SITUACIÓN ACTUAL CON TU EX?",
      feminino: "¿CUÁL ES TU SITUACIÓN ACTUAL CON TU EX?",
    },
    description: "(Esta información determinará tu punto de partida en el PLAN A)",
    options: {
      masculino: [
        "🧐 Estoy haciendo contacto cero - Estrategia perfecta para aplicar el protocolo de 72 horas",
        "😢 Ella solo me ignora - Técnicas específicas para romper la barrera de la indiferencia",
        "❌ Ella me bloqueó en todas las redes sociales - Método de reconexión indirecta que funciona en el 89% de los casos",
        "🤝 Discutimos solo cosas esenciales - Posición ideal para implementar los 21 Gatillos Emocionales",
        "🤔 Conversamos a veces - Escenario perfecto para aplicar los 7 Pilares de la Atracción",
        "😌 Todavía somos amigos - Cómo salir de la friendzone en 14 días o menos",
        "🔥 Tuvimos relaciones algunas veces después de la ruptura - Cómo transformar la atracción física en reconexión emocional",
      ],
      feminino: [
        "🧐 Estoy haciendo contacto cero - Estrategia perfecta para aplicar el protocolo de 72 horas",
        "😢 Él solo me ignora - Técnicas específicas para romper la barrera de la indiferencia",
        "❌ Él me bloqueó en todas las redes sociales - Método de reconexión indirecta que funciona en el 89% de los casos",
        "🤝 Discutimos solo cosas esenciales - Posición ideal para implementar los 21 Gatillos Emocionales",
        "🤔 Conversamos a veces - Escenario perfecto para aplicar los 7 Pilares de la Atracción",
        "😌 Todavía somos amigos - Cómo salir de la friendzone en 14 días o menos",
        "🔥 Tuvimos relaciones algunas veces después de la ruptura - Cómo transformar la atracción física en reconexión emocional",
      ],
    },
    elements: {
      profileComplete: "62%",
      testimonialImage: "",
    },
  },
  {
    id: 8,
    question: {
      masculino: "¿ELLA YA ESTÁ SALIENDO CON OTRA PERSONA?",
      feminino: "¿ÉL YA ESTÁ SALIENDO CON OTRA PERSONA?",
    },
    description: "(Esta información es crucial para definir tu enfoque estratégico)",
    options: {
      masculino: [
        "🚫 No, ella está soltera - Escenario ideal para aplicar el método completo",
        "🤔 No estoy seguro - Técnicas de investigación discreta incluidas en el método",
        "😔 Sí, ella está saliendo con alguien - Estrategias específicas para superar la competencia",
        "💔 Sí, ella está en una relación seria - Método avanzado de reconquista en relaciones establecidas",
        "🔄 Ella está conociendo a varias personas - Cómo destacarte en medio de la competencia",
      ],
      feminino: [
        "🚫 No, él está soltero - Escenario ideal para aplicar el método completo",
        "🤔 No estoy segura - Técnicas de investigación discreta incluidas en el método",
        "😔 Sí, él está saliendo con alguien - Estrategias específicas para superar la competencia",
        "💔 Sí, él está en una relación seria - Método avanzado de reconquista en relaciones establecidas",
        "🔄 Él está conociendo a varias personas - Cómo destacarte en medio de la competencia",
      ],
    },
    bonusUnlock: {
      id: 2,
      title: "PROTOCOLO DE EMERGENCIA 72H",
      value: 37,
      description: "Qué hacer cuando todo parece perdido y tienes 72 horas para actuar.",
    },
    elements: {
      profileComplete: "77%",
    },
  },
  {
    id: 9,
    question: {
      masculino: "¿CUÁNTO QUIERES RECUPERARLA?",
      feminino: "¿CUÁNTO QUIERES RECUPERARLO?",
    },
    description: "(Tu nivel de compromiso determinará tu éxito)",
    subtext: "El 91% de las personas que seleccionaron nivel 4 reconquistaron a su ex en menos de 21 días usando el PLAN A.",
    options: ["1 - No estoy seguro", "2 - Lo estoy considerando", "3 - Lo quiero bastante", "4 - Lo quiero mucho"],
    note: "Solo trabajo con personas determinadas a transformar su situación amorosa. El PLAN A - RECONQUISTA RÁPIDA fue desarrollado para quien está listo para actuar.",
    elements: {
      thermometer: true,
      profileComplete: "85%",
    },
  },
  {
    id: 10,
    question: "EXPERTO ANALIZANDO TU CASO...",
    description: "Espera mientras analizo tus respuestas para crear tu estrategia personalizada.",
    options: [],
    autoAdvance: true,
    elements: {
      expertPhoto: true,
      expertImage: "https://optimalhealthscout.shop/wp-content/uploads/2025/06/imagem_gerada-2025-06-01T212625.544.png",
      autoMessage: "Con base en 7 años de experiencia ayudando a personas como tú...",
      profileComplete: "90%",
    },
  },
  {
    id: 11,
    question: "¡FELICIDADES! Analicé tus respuestas y tengo buenas noticias para ti.",
    description:
      "Con base en tu perfil y situación específica, el PLAN A - RECONQUISTA RÁPIDA tiene un 91% de probabilidad de funcionar en tu caso.",
    options: ["¿VAMOS AL SIGUIENTE PASO?"],
    note: "Estoy aquí para guiarte personalmente en este viaje de reconquista. En los últimos 7 años, he ayudado a más de 3.847 personas a recuperar sus relaciones usando este método exclusivo.",
    elements: {
      expertPhoto: true,
      expertImage: "https://optimalhealthscout.shop/wp-content/uploads/2025/06/imagem_gerada-2025-06-01T212625.544.png",
      profileComplete: "95%",
      helpedCounter: "Personas ayudadas hoy: 17",
      compatibilityCalc: "91%",
    },
  },
  {
    id: 12,
    question: "RESULTADOS COMPROBADOS",
    subtext:
      "EL 91% DE MIS ALUMNOS VIERON RESULTADOS EXPRESIVOS EN LOS PRIMEROS 7 DÍAS APLICANDO EL PLAN A - RECONQUISTA RÁPIDA",
    description: "",
    options: ["¡YO TAMBIÉN QUIERO ESOS RESULTADOS!"],
    elements: {
      bigNumber: "91%",
      profileComplete: "98%",
      testimonialImage: "https://optimalhealthscout.shop/wp-content/uploads/2025/06/prova-face-espanhol.png",
    },
  },
  {
    id: 13,
    question: "TU PLAN A - RECONQUISTA RÁPIDA DE 21 DÍAS",
    description: "Desarrollado específicamente para tu caso, basado en tus respuestas.",
    subtext:
      "Este sistema paso a paso ya ha ayudado a 3.847 personas a reconquistar a su ex y construir relaciones aún más fuertes que antes.",
    options: {
      masculino: ["¡SÍ, QUIERO RECONQUISTARLA AHORA!"],
      feminino: ["¡SÍ, QUIERO RECONQUISTARLO AHORA!"],
    },
    note: "¡Incluye los 2 bonos exclusivos (valor total: $84) que aceleran tu reconquista!",
    elements: {
      plan21Days: true,
      profileComplete: "100%",
      allBonuses: true,
    },
  },
  {
    id: 14,
    question: {
      masculino: "DE RECHAZADO A DESEADO EN 21 DÍAS O MENOS",
      feminino: "DE RECHAZADA A DESEADA EN 21 DÍAS O MENOS",
    },
    description:
      "El único sistema paso a paso científicamente desarrollado para personas determinadas a recuperar el amor de quien dejó un vacío en sus vidas.",
    options: {
      masculino: ["¡SÍ, QUIERO RECONQUISTARLA AHORA!"],
      feminino: ["¡SÍ, QUIERO RECONQUISTARLO AHORA!"],
    },
    finalPage: true,
    elements: {
      beforeAfter: true,
      fullSalesPage: true,
    },
  },
]

export const bonuses = [
  {
    id: 1,
    title: "21 GATILLOS EMOCIONALES QUE FUNCIONAN",
    value: 47,
    description: "Las 21 frases exactas que hacen que piense en ti obsesivamente.",
    details: [
      "✓ 7 Gatillos de Nostalgia",
      "✓ 7 Gatillos de Curiosidad",
      "✓ 7 Gatillos de Deseo"
    ]
  },
  {
    id: 2,
    title: "PROTOCOLO DE EMERGENCIA 72H",
    value: 37,
    description: "Qué hacer cuando todo parece perdido y tienes 72 horas para actuar.",
    details: [
      "✓ Plan de Acción Inmediata",
      "✓ Independencia Emocional",
      "✓ Comunicación Magnética"
    ]
  }
]

export const testimonials = [
  {
    name: "Carlos M., 34 años",
    text: "¡Ella volvió a responderme al 3er día y me invitó a salir al 6º día!",
    rating: 5,
  },
  {
    name: "Rafael, 32 años",
    text: "Estaba perdido después de la ruptura. El Plan A me dio dirección y confianza. ¡Hoy estamos más unidos que nunca!",
    rating: 5,
  },
  {
    name: "André, 28 años",
    text: "En solo 2 semanas siguiendo el Plan A, logré reconquistar a mi ex. ¡Los scripts funcionaron perfectamente!",
    rating: 5,
  },
  {
    name: "Marcelo, 41 años",
    text: "Después de 6 meses separados, pensé que ya no tenía oportunidad. En el día 12 del Plan A ella me llamó llorando queriendo volver.",
    rating: 5,
  },
]

export const socialProofMessages = [
  "¡Estás entre el 17% más determinado a reconquistar!",
  "¡Tu perfil muestra 91% de compatibilidad con el método!",
  "¡Has desbloqueado los 2 bonos - valor total de $84!",
  "El 87% de las personas en tu situación lograron resultados en menos de 14 días",
  "Estás más comprometido que el 73% de las personas que hicieron esta prueba",
]

// Función utilitaria para personalizar textos basados en el género
export function getPersonalizedContent(content: any, gender: string) {
  if (typeof content === "string") {
    return content
  }

  if (typeof content === "object" && content !== null) {
    if (content.masculino && content.feminino) {
      return gender === "MASCULINO" ? content.masculino : content.feminino
    }
    return content
  }

  return content
}
