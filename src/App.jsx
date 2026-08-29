import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   CRECELERA · Lead Magnet — v2
   Chequeo comercial · 5 preguntas · reveal sin score
   ───────────────────────────────────────────────────────────── */

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwhLAxc3CJa10zEojEcE6g2N48YzgTnqmA2YhMW8vU2ofD_94JupZe4FPP8dXG0HxY2/exec";
const CALENDAR_URL = "https://calendar.app.google/JqpHnEPrA3szRFhC8";

/* ⚠️ COMPLETAR: datos de contacto del footer del reveal */
const EMAIL = "agustin@crecelera.com";
const LINKEDIN = "https://www.linkedin.com/in/agustinissel/";

const AZUL = "#203AD3";
const AZUL_HOND = "#1B2FA6";
const LIMA = "#CDFD85";
const NEGRO = "#0F0F0F";
const BLANCO = "#FFFFFF";

const DISPLAY = "'Red Hat Display', system-ui, sans-serif";
const TEXTO = "'Red Hat Text', system-ui, sans-serif";

/* ── Instrumento ─────────────────────────────────────────────── */

const PREGUNTAS = [
  {
    id: "p1",
    dimension: "Estrategia y Mercado",
    pregunta: "¿A quién le vende tu equipo?",
    opciones: [
      "No tenemos un cliente definido, le vendemos a cualquiera",
      "Tenemos una idea de nuestro cliente objetivo, pero no está formalizada",
      "El cliente ideal está definido, pero en general no se respeta",
      "Tenemos un perfil claro y definido, y el equipo lo respeta",
      "Además, segmentamos por tiers y priorizamos según eso",
    ],
  },
  {
    id: "p2",
    dimension: "Generación de Pipeline",
    pregunta: "¿De dónde salen tus oportunidades?",
    opciones: [
      "Boca en boca y referidos, no controlamos el flujo",
      "Algo entra por redes o la web, pero sin estrategia ni constancia",
      "Hay prospección, pero depende de cada vendedor y no tiene un rol que la ejecute",
      "Tenemos una estrategia de canales definida (referidos, web, redes, prospección)",
      "Además, la prospección está centralizada en un rol o equipo, con seguimiento semanal del pipeline",
    ],
  },
  {
    id: "p3",
    dimension: "Proceso Comercial",
    pregunta: "Cuando mandás una propuesta, ¿qué pasa después?",
    opciones: [
      "La mando y espero que el cliente responda, no hay estrategia de seguimiento",
      "Hago el seguimiento cuando puedo y me acuerdo",
      "Hay un proceso formal, pero cada vendedor lo ejecuta a su manera y sin consistencia",
      "Tenemos un modelo de seguimiento claro que todo el equipo ejecuta con consistencia",
      "Además, con niveles de servicio según el tipo de cliente y post-mortem para revisar resultados",
    ],
  },
  {
    id: "p4",
    dimension: "Equipo Comercial",
    pregunta: "¿Cómo está estructurado tu equipo comercial?",
    opciones: [
      "Soy yo. El founder es la totalidad del equipo comercial",
      "Hay equipo, pero sin funciones claramente diferenciadas",
      "Tenemos un equipo comercial con un líder claro",
      "Además de líder, roles diferenciados con preventa y posventa",
      "Equipo maduro e independiente del founder, con metas, presupuesto y targets de cumplimiento",
    ],
  },
  {
    id: "p5",
    dimension: "Gobernanza y Sistemas",
    pregunta: "¿Cómo gestionás y medís tus ventas?",
    opciones: [
      "No tenemos medición formal",
      "Tenemos un Excel que vive desactualizado",
      "Tengo un sistema (Drive, plantillas online) bastante actualizado y que miro con recurrencia",
      "Tengo un CRM en uso con pipeline review semanal",
      "CRM, forecast que le acierto, decido con esos números",
    ],
  },
];

const HERIDAS = {
  p1: {
    quePasa: "Le vendés a quien aparece.",
    equipo: "Sin segmentación, todo se trata igual. El mismo esfuerzo, el mismo tiempo y el mismo discurso para clientes que no compran de la misma forma. Y lo que funciona en un segmento puede matarte un deal en otro. No tenés una arquitectura que te permita asignar esfuerzo y recursos de manera eficiente, y con equipo el problema se multiplica: la estrategia de segmentación termina siendo el criterio de cada vendedor en lugar de una decisión de negocio. Así no hay base para vender más con el esfuerzo y el ticket adecuados, y sin esa base, escalar es apretar el acelerador con el freno de mano puesto.",
    solo: "Sin segmentación, todo se trata igual. El mismo esfuerzo, el mismo tiempo y el mismo discurso para clientes que no compran de la misma forma. Y lo que funciona en un segmento puede matarte un deal en otro. No tenés una arquitectura que te permita asignar esfuerzo y recursos de manera eficiente, y el recurso que estás asignando mal es tu propio tiempo: cada reunión con alguien que nunca iba a comprar es una reunión que no tuviste con alguien que sí. El criterio existe, pero vive en tu cabeza y no está escrito en ningún lado. ¿Sobre qué base vas a sumar a la primera persona que venda sin vos?",
  },
  p2: {
    quePasa: "Tu crecimiento depende de referidos que no controlás.",
    equipo: "El pipeline se llena solo cuando alguien te recomienda, y eso no es un modelo: es suerte con buena reputación. Funciona bárbaro hasta el mes que no llega ninguno, y ahí no hay palanca que puedas mover — no podés abrir la canilla cuando la necesitás ni cerrarla cuando estás desbordado. Con equipo el problema es doble: no hay un rol que se levante a prospectar, así que cada vendedor sale a buscar cuando se le vacía la agenda, y cuando está ocupado no busca nadie. Por eso el pipeline te sube y baja sin que puedas explicar por qué. No tenés proyecciones, tenés deseos. Y que se cumplan no depende de vos.",
    solo: "El pipeline se llena solo cuando alguien te recomienda, y eso no es un modelo: es suerte con buena reputación. Y como prospectar compite con entregar, estás en un modelo stop & go: el mes que estás produciendo no buscás, y cuando terminás de producir el pipeline está vacío. Ahí salís a buscar con urgencia, que es la peor posición para negociar — el que necesita cerrar este mes acepta condiciones que no aceptaría el mes que viene. No tenés proyecciones, tenés deseos. Y que se cumplan no depende de vos.",
  },
  p3: {
    quePasa: "Las propuestas salen y el seguimiento queda en la memoria.",
    equipo: "Ya hiciste el esfuerzo, el heavy lifting — prospectaste, te reuniste, entendiste el problema, armaste la propuesta: horas y horas de trabajo. Y te quedás sin nafta en el último kilómetro. Cada vendedor hace seguimiento como puede, desestructurado. Las oportunidades que perdés, no sabés del todo por qué. Las que ganás, seguramente tampoco. Pero lo importante no es solamente entender para mejorar los procesos: lo importante es vender, generar ingresos. Y en ese sentido, ¿qué pasa si el sí que estás esperando está en ese seguimiento que nunca hiciste?",
    solo: "Ya hiciste el esfuerzo, el heavy lifting — prospectaste, te reuniste, entendiste el problema, armaste la propuesta: horas y horas de trabajo. Y te quedás sin nafta en el último kilómetro. El seguimiento compite con entregar, facturar y resolver lo urgente, y siempre pierde: es lo único que no tiene un cliente reclamándote del otro lado. Las oportunidades que perdés, no sabés del todo por qué. Las que ganás, seguramente tampoco. Pero lo importante no es solamente entender para mejorar los procesos: lo importante es vender, generar ingresos. Y en ese sentido, ¿qué pasa si el sí que estás esperando está en ese seguimiento que nunca hiciste?",
  },
  p4: {
    quePasa: "El sistema comercial depende de vos.",
    equipo: "Todos hacen todo: el mismo que prospecta arma la propuesta, hace el seguimiento y después atiende al cliente que ya cerró. Nadie es dueño de una etapa, así que cuando algo se cae no hay a quién preguntarle qué pasó. Sin roles definidos el rendimiento depende de la voluntad de cada uno, y las diferencias entre el que vende bien y el que no vende se explican con \"es que tiene más calle\" en lugar de con un método que se pueda copiar. Y en los deals grandes seguís entrando vos, porque en el fondo sabés que sin vos no se cierran. ¿Estás tranquilo si no te metés por tres semanas?",
    solo: "Y eso le pone un techo a cuánto podés crecer, a menos que te puedas clonar. Cada oportunidad grande espera a que vos tengas agenda, y las chicas se caen porque no llegás. Tu capacidad de venta es tu capacidad de atención, que compartís con el día a día del negocio, los clientes y los problemas inesperados que a todos nos surgen cuando más complicados estamos. Probablemente seas el mejor vendedor, pero sos también el techo del crecimiento. Y cuando decidís sumar a alguien, no tenés un proceso: tenés tu experiencia y tu know how, y eso es difícil de enseñar. Estirás la curva de aprendizaje — tenés suerte si el vendedor la sobrevive, o te conformás con que lo haga a su manera. Buena suerte tomándote vacaciones.",
  },
  p5: {
    quePasa: "No tenés un sistema donde vivan tus ventas.",
    equipo: "La información está repartida: un poco en la cabeza del vendedor, mucho en WhatsApp, y algo en un Excel que alguien actualizó hace tres semanas. No hay una vista donde puedas ver en qué está trabada cada oportunidad, así que te enterás de que un deal se cayó cuando ya se cayó. Y como no hay números, las discusiones internas se ganan por volumen de voz: el que argumenta mejor define la prioridad, no el que tiene razón. ¿Te imaginás arrancar un viaje largo sin Waze? Bueno, estás en esa: el auto avanza, pero no sabés si vas por el camino rápido, si hay un corte adelante, ni a qué hora llegás.",
    solo: "Está todo en tu cabeza, y eso se siente como control: sabés con quién hablaste, qué quedó pendiente, a quién tenés que llamar. Pero tu cabeza no te muestra el conjunto — te muestra lo que te acordás, que casi siempre es lo último que pasó y lo que más te preocupa. Las oportunidades que se enfrían no te avisan que se están enfriando, se van apagando en silencio mientras vos atendés lo que grita. Y sin números no podés comparar: no sabés si este mes es mejor o peor que el anterior, ni si lo que cambiaste sirvió de algo. ¿Te imaginás arrancar un viaje largo sin Waze? Bueno, estás en esa: el auto avanza, pero no sabés si vas por el camino rápido, si hay un corte adelante, ni a qué hora llegás. Y como sos vos solo, no hay un copiloto que te ayude.",
  },
};

/* Indicadores impactados por dimensión. Se nombran, nunca se cuantifican. */
const INDICADORES = {
  p1: ["Esfuerzo comercial por oportunidad", "Generación de leads calificados", "Tasa de cierre"],
  p2: ["Volumen de pipeline (en dinero)", "Predictibilidad del forecast"],
  p3: ["Tasa de cierre", "Revenue", "Trazabilidad"],
  p4: ["Capacidad de crecimiento", "Curva de aprendizaje"],
  p5: ["Exactitud del forecast", "Visibilidad del pipeline", "Velocidad de decisión"],
};

const FORTALEZAS = {
  p1: "Sabés a quién le vendés. Eso ya te ahorra el esfuerzo que otros tiran en clientes que nunca iban a cerrar.",
  p2: "Tenés canales que traen oportunidades sin depender de la suerte del mes.",
  p3: "Tus propuestas tienen seguimiento real, no memoria.",
  p4: "El equipo funciona con estructura. No todo pasa por vos.",
  p5: "Tenés números para decidir. La mayoría decide con intuición y se entera tarde.",
};

/* Cruces: dos dimensiones flojas que en realidad son un solo problema. */
const CRUCES = [
  { par: ["p2", "p5"],
    equipo: "No controlás el flujo y tampoco lo medís. Por eso nunca vas a saber si el problema es que entran pocas oportunidades o que se caen las que entran.",
    solo:   "No controlás el flujo y tampoco lo medís. Por eso nunca vas a saber si el problema es que entran pocas oportunidades o que se caen las que entran." },
  { par: ["p1", "p2"],
    equipo: "Prospectás sin tener claro a quién. Todo lo que generes arriba del funnel va a llegar sucio abajo, y el equipo va a trabajar el doble para cerrar la mitad.",
    solo:   "Prospectás sin tener claro a quién. Todo lo que generes arriba del funnel va a llegar sucio abajo, y cada hora que ponés ahí es una hora que no recuperás." },
  { par: ["p3", "p5"],
    equipo: "Sin proceso de seguimiento y sin medición, cada propuesta perdida se pierde dos veces: perdés la venta y perdés el aprendizaje.",
    solo:   "Sin proceso de seguimiento y sin medición, cada propuesta perdida se pierde dos veces: perdés la venta y perdés el aprendizaje." },
  { par: ["p3", "p4"],
    equipo: "El proceso vive en tu cabeza y el equipo depende de vos. Cada persona que sumes va a copiar tu memoria, no tu método.",
    solo:   "El proceso vive en tu cabeza y sos el único que lo ejecuta. No hay nada que puedas delegar todavía, porque nunca existió fuera tuyo." },
  { par: ["p1", "p4"],
    equipo: "Vos sos el que sabe a quién hay que venderle, y eso no está escrito. El equipo no puede aplicar un criterio que nunca salió de tu cabeza.",
    solo:   "Vos sos el que sabe a quién hay que venderle. Mientras eso no esté escrito no es transferible: se va con vos a cada reunión." },
];

const CANCHAS = [
  "BPO & contact center", "Construcción & inmobiliario", "Distribución & mayoristas",
  "Educación & formación", "Industria & manufactura", "Logística & transporte",
  "Maquinaria & concesionarios", "Marketing & agencias", "Retail & ecommerce",
  "Salud", "Servicios profesionales", "Tecnología & software", "Otro",
];

const ROLES = ["Founder / CEO", "Dirección comercial", "Gerencia o jefatura", "Otro"];

const TICKETS = ["Menos de USD 1.000", "USD 1.000 – 5.000", "USD 5.000 – 20.000", "USD 20.000 – 100.000", "Más de USD 100.000"];
const VENTAS = ["Menos de 10", "10 – 50", "50 – 200", "200 – 1.000", "Más de 1.000"];
const PROPUESTAS = ["Cada una se arma casi de cero", "Tenemos plantilla, pero se personaliza mucho", "Modelo estándar con partes fijas y variables"];

/* ── Marca · trazados oficiales del manual ───────────────────── */

function LogoCrecelera({ height = 30, color = BLANCO }) {
  return (
    <svg viewBox="0 0 348.25 75.65" height={height} fill="none" role="img" aria-label="Crecelera"
      style={{ display: "block", color, width: "auto" }}>
      <g> <path fill="currentColor" d="M37.82,8.98c.08,0,.15,0,.23,0,14.3.11,26.12,10.63,28.27,24.35h9.06C73.17,14.64,57.32.12,38.05,0c-.08,0-.15,0-.23,0-7.18,0-13.89,2-19.6,5.47l6.61,6.61c3.91-1.98,8.32-3.1,13-3.1Z"/> <path fill="currentColor" d="M38.05,66.67c-.08,0-.15,0-.23,0-4.58,0-8.91-1.07-12.76-2.98l-6.62,6.62c5.67,3.39,12.3,5.34,19.38,5.34.08,0,.15,0,.23,0,19.27-.11,35.12-14.63,37.33-33.33h-9.06c-2.15,13.72-13.97,24.24-28.27,24.35Z"/> <path fill="currentColor" d="M38.05,38h0s0,0,0,0h0s0,0,0,0L11.11,11.05h0c-2.13,2.13-4.02,4.52-5.6,7.1l15.18,15.18H.27c-.17,1.47-.27,2.97-.27,4.49s.09,3.02.27,4.49h20.78l-15.4,15.4c1.6,2.58,3.49,4.95,5.64,7.06h0s26.77-26.77,26.77-26.77Z"/> <polygon fill="currentColor" points="38.05 25.3 38.06 25.3 38.05 25.3 38.05 25.3"/> </g> <g> <path fill="currentColor" d="M110.37,46.74c-.63.79-1.4,1.4-2.31,1.81-.92.42-1.93.63-3.05.63-2.17,0-3.96-.82-5.38-2.46-1.42-1.65-2.13-3.93-2.13-6.88,0-1.99.32-3.67.95-5.04.63-1.36,1.53-2.4,2.7-3.12,1.18-.72,2.51-1.07,4.02-1.07,1.75,0,3.17.44,4.28,1.31,1.1.88,1.79,2.17,2.07,3.88h7.24c-.14-2.27-.81-4.23-2-5.87-1.19-1.64-2.78-2.93-4.77-3.85-1.99-.93-4.27-1.39-6.82-1.39-3.01,0-5.62.6-7.85,1.81-2.22,1.21-3.95,2.94-5.19,5.19-1.25,2.26-1.86,4.98-1.86,8.16s.58,5.81,1.76,8.08c1.17,2.28,2.87,4.03,5.09,5.25,2.22,1.23,4.86,1.83,7.9,1.83,2.48,0,4.73-.45,6.74-1.36,2.01-.91,3.65-2.18,4.91-3.8,1.25-1.63,2.01-3.56,2.26-5.8h-7.24c-.24,1.02-.68,1.92-1.31,2.7Z"/> <path fill="currentColor" d="M202.04,46.74c-.63.79-1.4,1.4-2.31,1.81-.91.42-1.93.63-3.05.63-2.17,0-3.96-.82-5.37-2.46-1.42-1.65-2.13-3.93-2.13-6.88,0-1.99.32-3.67.95-5.04.63-1.36,1.53-2.4,2.7-3.12,1.17-.72,2.51-1.07,4.01-1.07,1.75,0,3.17.44,4.28,1.31,1.1.88,1.79,2.17,2.07,3.88h7.24c-.14-2.27-.8-4.23-1.99-5.87-1.19-1.64-2.78-2.93-4.78-3.85-1.99-.93-4.26-1.39-6.82-1.39-3.01,0-5.62.6-7.85,1.81-2.22,1.21-3.95,2.94-5.19,5.19-1.24,2.26-1.86,4.98-1.86,8.16s.59,5.81,1.76,8.08c1.17,2.28,2.87,4.03,5.09,5.25,2.22,1.23,4.85,1.83,7.9,1.83,2.49,0,4.74-.45,6.74-1.36,2.01-.91,3.65-2.18,4.91-3.8,1.26-1.63,2.01-3.56,2.26-5.8h-7.24c-.24,1.02-.68,1.92-1.31,2.7Z"/> <polygon fill="currentColor" points="250.65 15.65 248.29 15.65 247.46 15.65 242.2 15.65 242.2 21.48 247.42 21.48 247.42 54.38 254.73 54.38 254.73 15.65 251.07 15.65 250.65 15.65"/> <path fill="currentColor" d="M176.75,28.85c-2.29-2.82-5.94-4.23-10.94-4.23-3.22,0-5.96.61-8.24,1.81-2.27,1.2-4.01,2.94-5.22,5.22-1.2,2.27-1.81,4.99-1.81,8.13s.6,5.86,1.81,8.13c1.21,2.28,2.92,4.03,5.14,5.25,2.22,1.23,4.89,1.83,8,1.83,4.03,0,7.29-.96,9.82-2.89,2.51-1.92,3.98-4.51,4.41-7.77h-7.24c-.28,1.4-1.05,2.56-2.34,3.47-1.28.91-2.82,1.36-4.64,1.36-1.68,0-3.09-.4-4.23-1.2-1.13-.81-2.01-1.88-2.62-3.23-.57-1.27-.88-2.71-.91-4.33h21.93c.34-4.9-.62-8.76-2.92-11.57ZM158.4,35.38c.32-.97.77-1.81,1.33-2.52,1.33-1.68,3.35-2.51,6.04-2.51,1.86,0,3.37.47,4.56,1.41,1.19.95,1.83,2.16,1.94,3.63h-13.87Z"/> <path fill="currentColor" d="M239.17,28.85c-2.29-2.82-5.94-4.23-10.94-4.23-3.22,0-5.96.61-8.24,1.81-2.27,1.2-4.01,2.94-5.22,5.22-1.2,2.27-1.81,4.99-1.81,8.13s.6,5.86,1.81,8.13c1.21,2.28,2.92,4.03,5.14,5.25,2.22,1.23,4.89,1.83,8,1.83,4.03,0,7.29-.96,9.82-2.89,2.51-1.92,3.98-4.51,4.41-7.77h-7.24c-.28,1.4-1.05,2.56-2.34,3.47-1.28.91-2.82,1.36-4.64,1.36-1.68,0-3.09-.4-4.22-1.2-1.14-.81-2.01-1.88-2.63-3.23-.57-1.27-.88-2.71-.91-4.33h21.93c.34-4.9-.62-8.76-2.92-11.57ZM220.82,35.38c.32-.97.77-1.81,1.33-2.52,1.33-1.68,3.35-2.51,6.04-2.51,1.86,0,3.37.47,4.56,1.41,1.19.95,1.83,2.16,1.94,3.63h-13.87Z"/> <path fill="currentColor" d="M285.3,28.85c-2.29-2.82-5.94-4.23-10.94-4.23-3.22,0-5.96.61-8.24,1.81-2.27,1.2-4.01,2.94-5.22,5.22-1.21,2.27-1.81,4.99-1.81,8.13s.6,5.86,1.81,8.13c1.2,2.28,2.92,4.03,5.14,5.25,2.22,1.23,4.89,1.83,8,1.83,4.03,0,7.29-.96,9.82-2.89,2.51-1.92,3.99-4.51,4.41-7.77h-7.24c-.28,1.4-1.05,2.56-2.34,3.47-1.28.91-2.82,1.36-4.64,1.36-1.68,0-3.09-.4-4.22-1.2-1.14-.81-2.01-1.88-2.63-3.23-.57-1.27-.88-2.71-.91-4.33h21.93c.35-4.9-.62-8.76-2.92-11.57ZM266.95,35.38c.33-.97.77-1.81,1.33-2.52,1.33-1.68,3.34-2.51,6.03-2.51,1.86,0,3.37.47,4.56,1.41,1.19.95,1.83,2.16,1.94,3.63h-13.87Z"/> <path fill="currentColor" d="M308.79,24.68c-1.65,0-3.14.29-4.48.87-1.35.57-2.57,1.43-3.68,2.56-.34.34-.66.72-.98,1.12l-.25-3.92h-6.88v29.07h7.24v-15.64c0-2.34.94-4.63,2.73-6.14,0,0,.02-.02.03-.02,1.48-1.24,3.12-1.86,4.91-1.86,1.5,0,2.64.43,3.41,1.28.61.68.96,1.54,1.09,2.55h7.27c-.15-3.08-1.11-5.47-2.91-7.14-1.96-1.82-4.46-2.73-7.5-2.73Z"/> <path fill="currentColor" d="M138.67,24.68c-1.65,0-3.14.29-4.49.87-1.35.57-2.57,1.43-3.68,2.56-.34.34-.66.72-.98,1.12l-.25-3.92h-6.88v29.07h7.24v-15.64c0-2.34.94-4.63,2.73-6.14,0,0,.02-.02.03-.02,1.48-1.24,3.12-1.86,4.91-1.86,1.5,0,2.64.43,3.41,1.28.61.68.96,1.54,1.09,2.55h7.27c-.15-3.08-1.11-5.47-2.91-7.14-1.96-1.82-4.46-2.73-7.5-2.73Z"/> <path fill="currentColor" d="M346.63,29.58c-1.08-1.59-2.62-2.8-4.59-3.65-1.98-.84-4.31-1.25-7.01-1.25s-5,.39-7.03,1.18c-2.03.79-3.65,1.92-4.86,3.39-1.2,1.47-1.89,3.24-2.07,5.3h6.98c.18-1.47.86-2.62,2.05-3.44,1.19-.82,2.74-1.23,4.67-1.23s3.5.45,4.61,1.36c1.12.91,1.68,2.17,1.68,3.78v1.88h-7.83c-4.13,0-7.35.83-9.66,2.49-2.31,1.66-3.46,3.98-3.46,6.96,0,1.71.4,3.22,1.2,4.51.8,1.3,1.93,2.31,3.39,3.04,1.45.74,3.14,1.1,5.06,1.1,2.59,0,4.79-.49,6.61-1.5,1.13-.62,3.18-2.23,4.69-4.69l.1,2.14.16,3.41h6.93v-18.94c0-2.31-.54-4.26-1.63-5.85ZM336.22,47.87c-1.39.96-2.99,1.42-4.77,1.42-1.33,0-2.38-.32-3.15-.97-.77-.64-1.15-1.44-1.15-2.39,0-1.3.52-2.27,1.58-2.94,1.05-.67,2.48-1,4.3-1h8.05s-2.29,4.1-4.85,5.88Z"/> </g>
    </svg>
  );
}

function LogoCoBranding({ height = 30, color = BLANCO }) {
  return (
    <svg viewBox="0 0 496.47 87.17" height={height} fill="none" role="img" aria-label="Agustín Issel · Crecelera"
      style={{ display: "block", color, width: "auto" }}>
      <g> <path fill="currentColor" d="M90.39,33.83c0-5.38-4.36-9.74-9.74-9.74h-19.43v6.87h19.43c1.59,0,2.88,1.29,2.88,2.88s-1.29,2.88-2.88,2.88h-18.95c-6.28,0-11.37-5.09-11.37-11.37s5.09-11.37,11.37-11.37h14.96c3.79,0,6.87,3.07,6.87,6.87h6.87c0-7.58-6.15-13.73-13.73-13.73h-14.96c-10.07,0-18.24,8.17-18.24,18.24h0c0,10.07,8.17,18.24,18.24,18.24h18.95c5.38,0,9.74-4.36,9.74-9.74Z"/> <path fill="currentColor" d="M161.68,50.43h-18.95c-10.07,0-18.24,8.17-18.24,18.24h0c0,10.07,8.17,18.24,18.24,18.24h14.96c7.58,0,13.73-6.15,13.73-13.73h-6.87c0,3.79-3.07,6.87-6.87,6.87h-14.96c-5.86,0-10.69-4.44-11.31-10.13h30.26c5.38,0,9.74-4.36,9.74-9.74h0c0-5.38-4.36-9.74-9.74-9.74ZM161.68,63.05h-28.84c1.96-3.43,5.65-5.75,9.89-5.75h18.95c1.59,0,2.88,1.29,2.88,2.88s-1.29,2.88-2.88,2.88Z"/> <path fill="currentColor" d="M23.99,7.09h-8.69C6.85,7.09,0,13.94,0,22.39v21.18h6.87v-12.62h25.56v12.62h6.87v-21.18c0-8.45-6.85-15.3-15.3-15.3ZM32.43,24.09H6.87v-2.23c0-4.36,3.54-7.9,7.9-7.9h9.76c4.36,0,7.9,3.54,7.9,7.9v2.23Z"/> <path fill="currentColor" d="M109.78,43.79h8.69c8.45,0,15.3-6.85,15.3-15.3V7.31h-6.87v21.71c0,4.36-3.54,7.9-7.9,7.9h-9.76c-4.36,0-7.9-3.54-7.9-7.9V7.31h-6.87v21.18c0,8.45,6.85,15.3,15.3,15.3Z"/> <path fill="currentColor" d="M163.38,21.9h-14.59c-2.2,0-3.98-1.78-3.98-3.98s1.78-3.98,3.98-3.98h24.57v-6.85h-24.59c-5.98,0-10.83,4.85-10.83,10.83s4.85,10.83,10.83,10.83h14.59c2.2,0,3.98,1.78,3.98,3.98s-1.78,3.98-3.98,3.98h-24.57v6.85h24.59c5.98,0,10.83-4.85,10.83-10.83s-4.85-10.83-10.83-10.83Z"/> <path fill="currentColor" d="M68.9,65.26h-14.59c-2.2,0-3.98-1.78-3.98-3.98h0c0-2.2,1.78-3.98,3.98-3.98h24.57v-6.85h-24.59c-5.98,0-10.83,4.85-10.83,10.83h0c0,5.98,4.85,10.83,10.83,10.83h14.59c2.2,0,3.98,1.78,3.98,3.98h0c0,2.2-1.78,3.98-3.98,3.98h-24.57v6.85h24.59c5.98,0,10.83-4.85,10.83-10.83h0c0-5.98-4.85-10.83-10.83-10.83Z"/> <path fill="currentColor" d="M109.33,65.26h-14.59c-2.2,0-3.98-1.78-3.98-3.98h0c0-2.2,1.78-3.98,3.98-3.98h24.57v-6.85h-24.59c-5.98,0-10.83,4.85-10.83,10.83h0c0,5.98,4.85,10.83,10.83,10.83h14.59c2.2,0,3.98,1.78,3.98,3.98h0c0,2.2-1.78,3.98-3.98,3.98h-24.57v6.85h24.59c5.98,0,10.83-4.85,10.83-10.83h0c0-5.98-4.85-10.83-10.83-10.83Z"/> <path fill="currentColor" d="M181.03,31.08c0,6.91,5.58,12.52,12.49,12.55l9.02.04v-6.97h-8.21c-3.39,0-6.14-2.75-6.14-6.14V13.94h14.26v-6.85h-14.26V.24h-7.16v6.85h-3.58v6.85h3.58v17.14Z"/> <rect fill="currentColor" x="208.19" y="13.94" width="6.87" height="29.63"/> <path fill="currentColor" d="M220.69.24h-3.46c-5,0-9.05,4.05-9.05,9.05v1.23h6.87v-1.33c0-1.15.93-2.08,2.08-2.08h3.56V.24Z"/> <path fill="currentColor" d="M253.12,7.09v28.98l-20.66-26.45c-1.25-1.6-3.16-2.53-5.19-2.53h0c-3.64,0-6.58,2.95-6.58,6.58v29.9h6.87V14.49l20.75,26.56c1.24,1.58,3.14,2.51,5.15,2.51,3.61,0,6.53-2.92,6.53-6.53V7.09h-6.87Z"/> <polygon fill="currentColor" points="0 57.3 16 57.3 16 80.06 0 80.06 0 86.91 39.29 86.91 39.29 80.06 22.86 80.06 22.86 57.3 39.29 57.3 39.29 50.45 0 50.45 0 57.3"/> <path fill="currentColor" d="M184.32,73.92v-23.47h-6.87v23.93c0,6.93,5.62,12.55,12.55,12.55h12.54v-6.87h-12.09c-3.39,0-6.14-2.75-6.14-6.14Z"/> </g> <g> <g> <path fill="currentColor" d="M405.89,6.56c.05,0,.11,0,.16,0,10.06.08,18.37,7.47,19.88,17.12h6.37c-1.56-13.15-12.7-23.36-26.25-23.44-.05,0-.11,0-.16,0-5.05,0-9.76,1.41-13.78,3.85l4.64,4.64c2.75-1.39,5.85-2.18,9.14-2.18Z"/> <path fill="currentColor" d="M406.06,47.12c-.05,0-.11,0-.16,0-3.22,0-6.27-.76-8.97-2.09l-4.65,4.65c3.99,2.38,8.65,3.75,13.63,3.75.05,0,.11,0,.16,0,13.55-.08,24.7-10.29,26.25-23.44h-6.37c-1.51,9.65-9.82,17.04-19.88,17.12Z"/> <path fill="currentColor" d="M406.06,26.97h0s0,0,0,0h0s0,0,0,0l-18.95-18.95h0c-1.5,1.5-2.82,3.17-3.93,5l10.67,10.67h-14.36c-.12,1.04-.19,2.09-.19,3.16s.06,2.12.19,3.16h14.61l-10.83,10.83c1.12,1.81,2.45,3.48,3.96,4.97h0s18.82-18.82,18.82-18.82Z"/> <polygon fill="currentColor" points="406.06 18.04 406.06 18.04 406.06 18.04 406.06 18.04"/> </g> <g> <path fill="currentColor" d="M329.15,81.11c-.44.55-.99.98-1.62,1.27-.65.3-1.36.44-2.14.44-1.53,0-2.79-.58-3.78-1.73-1-1.16-1.5-2.77-1.5-4.84,0-1.4.22-2.58.67-3.54.44-.96,1.08-1.69,1.9-2.2.83-.5,1.77-.76,2.83-.76,1.23,0,2.23.31,3.01.92.77.62,1.26,1.53,1.46,2.73h5.09c-.1-1.6-.57-2.97-1.41-4.13-.84-1.15-1.96-2.06-3.36-2.71-1.4-.66-3-.98-4.8-.98-2.12,0-3.96.42-5.52,1.27-1.56.85-2.78,2.07-3.65,3.65-.88,1.59-1.31,3.5-1.31,5.74s.41,4.09,1.23,5.68c.82,1.6,2.02,2.83,3.58,3.69,1.56.86,3.42,1.29,5.56,1.29,1.74,0,3.33-.32,4.74-.96,1.42-.64,2.57-1.53,3.45-2.68.88-1.14,1.41-2.5,1.59-4.08h-5.09c-.17.72-.48,1.35-.92,1.9Z"/> <path fill="currentColor" d="M393.63,81.11c-.44.55-.98.98-1.62,1.27-.64.3-1.36.44-2.14.44-1.53,0-2.79-.58-3.78-1.73-1-1.16-1.5-2.77-1.5-4.84,0-1.4.22-2.58.67-3.54.44-.96,1.07-1.69,1.9-2.2.82-.5,1.76-.76,2.82-.76,1.23,0,2.23.31,3.01.92.78.62,1.26,1.53,1.46,2.73h5.09c-.1-1.6-.56-2.97-1.4-4.13-.84-1.15-1.96-2.06-3.36-2.71-1.4-.66-3-.98-4.8-.98-2.12,0-3.96.42-5.52,1.27-1.56.85-2.78,2.07-3.65,3.65-.87,1.59-1.31,3.5-1.31,5.74s.41,4.09,1.24,5.68c.82,1.6,2.02,2.83,3.58,3.69,1.56.86,3.41,1.29,5.55,1.29,1.75,0,3.33-.32,4.74-.96,1.42-.64,2.57-1.53,3.45-2.68.89-1.14,1.42-2.5,1.59-4.08h-5.09c-.17.72-.48,1.35-.92,1.9Z"/> <polygon fill="currentColor" points="427.82 59.24 426.16 59.24 425.57 59.24 421.88 59.24 421.88 63.34 425.55 63.34 425.55 86.48 430.69 86.48 430.69 59.24 428.12 59.24 427.82 59.24"/> <path fill="currentColor" d="M375.84,68.52c-1.61-1.98-4.18-2.97-7.7-2.97-2.26,0-4.19.43-5.8,1.27-1.6.85-2.82,2.07-3.67,3.67-.85,1.6-1.27,3.51-1.27,5.72s.42,4.12,1.27,5.72c.85,1.6,2.06,2.83,3.62,3.69,1.56.86,3.44,1.29,5.63,1.29,2.83,0,5.13-.68,6.9-2.03,1.77-1.35,2.8-3.17,3.1-5.46h-5.09c-.2.99-.74,1.8-1.64,2.44-.9.64-1.99.96-3.27.96-1.18,0-2.17-.28-2.97-.85-.8-.57-1.41-1.33-1.84-2.27-.4-.89-.62-1.9-.64-3.04h15.43c.24-3.45-.44-6.16-2.05-8.14ZM362.93,73.12c.23-.68.54-1.27.93-1.77.94-1.18,2.35-1.77,4.25-1.77,1.31,0,2.37.33,3.21.99.84.67,1.29,1.52,1.37,2.55h-9.76Z"/> <path fill="currentColor" d="M419.75,68.52c-1.61-1.98-4.18-2.97-7.7-2.97-2.26,0-4.19.43-5.8,1.27-1.6.85-2.82,2.07-3.67,3.67-.85,1.6-1.27,3.51-1.27,5.72s.42,4.12,1.27,5.72c.85,1.6,2.06,2.83,3.62,3.69,1.56.86,3.44,1.29,5.63,1.29,2.83,0,5.13-.68,6.9-2.03,1.77-1.35,2.8-3.17,3.1-5.46h-5.09c-.2.99-.74,1.8-1.64,2.44-.9.64-1.99.96-3.27.96-1.18,0-2.17-.28-2.97-.85-.8-.57-1.42-1.33-1.85-2.27-.4-.89-.62-1.9-.64-3.04h15.43c.24-3.45-.44-6.16-2.05-8.14ZM406.84,73.12c.23-.68.54-1.27.93-1.77.94-1.18,2.35-1.77,4.25-1.77,1.31,0,2.37.33,3.21.99.84.67,1.29,1.52,1.37,2.55h-9.76Z"/> <path fill="currentColor" d="M452.19,68.52c-1.61-1.98-4.18-2.97-7.7-2.97-2.26,0-4.19.43-5.8,1.27-1.6.85-2.82,2.07-3.67,3.67-.85,1.6-1.27,3.51-1.27,5.72s.42,4.12,1.27,5.72c.85,1.6,2.05,2.83,3.61,3.69,1.56.86,3.44,1.29,5.63,1.29,2.83,0,5.13-.68,6.9-2.03,1.77-1.35,2.81-3.17,3.1-5.46h-5.09c-.2.99-.74,1.8-1.64,2.44-.9.64-1.99.96-3.27.96-1.18,0-2.17-.28-2.97-.85-.8-.57-1.42-1.33-1.85-2.27-.4-.89-.62-1.9-.64-3.04h15.43c.25-3.45-.44-6.16-2.05-8.14ZM439.28,73.12c.23-.68.54-1.27.94-1.77.93-1.18,2.35-1.77,4.24-1.77,1.31,0,2.37.33,3.21.99.84.67,1.29,1.52,1.37,2.55h-9.76Z"/> <path fill="currentColor" d="M468.72,65.59c-1.16,0-2.21.2-3.15.61-.95.4-1.81,1.01-2.59,1.8-.24.24-.46.5-.69.79l-.18-2.76h-4.84v20.44h5.09v-11c0-1.65.66-3.26,1.92-4.32,0,0,.01-.01.02-.02,1.04-.87,2.19-1.31,3.45-1.31,1.05,0,1.85.3,2.4.9.43.48.68,1.08.77,1.79h5.11c-.1-2.17-.78-3.85-2.04-5.02-1.38-1.28-3.13-1.92-5.28-1.92Z"/> <path fill="currentColor" d="M349.06,65.59c-1.16,0-2.21.2-3.15.61-.95.4-1.81,1.01-2.59,1.8-.24.24-.46.5-.69.79l-.18-2.76h-4.84v20.44h5.09v-11c0-1.65.66-3.26,1.92-4.32,0,0,.01-.01.02-.02,1.04-.87,2.19-1.31,3.45-1.31,1.05,0,1.85.3,2.4.9.43.48.68,1.08.77,1.79h5.11c-.1-2.17-.78-3.85-2.04-5.02-1.38-1.28-3.13-1.92-5.28-1.92Z"/> <path fill="currentColor" d="M495.33,69.04c-.76-1.12-1.84-1.97-3.23-2.57-1.39-.59-3.03-.88-4.93-.88s-3.52.28-4.94.83c-1.43.55-2.57,1.35-3.42,2.38-.85,1.03-1.33,2.28-1.46,3.73h4.91c.13-1.03.6-1.84,1.44-2.42.84-.58,1.93-.87,3.29-.87s2.46.32,3.25.96c.79.64,1.18,1.53,1.18,2.66v1.33h-5.51c-2.91,0-5.17.58-6.79,1.75-1.62,1.17-2.43,2.8-2.43,4.89,0,1.2.28,2.26.85,3.17.56.91,1.36,1.63,2.38,2.14,1.02.52,2.21.78,3.56.78,1.82,0,3.37-.35,4.65-1.05.8-.44,2.24-1.57,3.3-3.3l.07,1.51.11,2.4h4.87v-13.32c0-1.62-.38-2.99-1.14-4.12ZM488.01,81.9c-.98.68-2.1,1-3.36,1-.94,0-1.67-.23-2.22-.69-.54-.45-.81-1.01-.81-1.68,0-.91.37-1.6,1.11-2.07.74-.47,1.74-.7,3.02-.7h5.66s-1.61,2.89-3.41,4.13Z"/> </g> </g> <rect fill="currentColor" x="287.06" width=".89" height="87.17"/>
    </svg>
  );
}

function Asterisco({ color = AZUL_HOND, style = {} }) {
  return (
    <svg viewBox="0 0 158.38 196.08" fill="none" aria-hidden="true" style={{ color, ...style }}>
      <path fill="currentColor" d="M86.51,184.02c-1.07,7.45-9.41,11.48-16.09,12.01-3.19.25-6.73-.43-7.45-3.75l-2.25-10.36-1.71-12.95-.9-10.54-.46-7.7-.46-7.55.52-13.87-.22-4.95-17.43,12.36-8.4,5.88c-5.58,3.91-10.53,7.97-16.91,10.82-2.26,1.01-4.5,3.01-7.08,3.44-3.18.53-7.87-3.96-7.65-7.31,1.84-8.21,7.95-13.9,14.53-18.35l5.94-5.6,5.21-3.93,9.09-7.07,5.82-4.53,4.05-3,11.9-8.56-10.88-10.39-10.08-9.81-5.13-5.28c-5.25-5.4-9.83-11.19-14.74-16.86-2.97-3.44-4.61-6.68-6.14-10.94l-1.82-5.07c-.53-1.48-.78-3.44-.15-4.63.83-1.56,2.61-2.58,4.37-3.1,4.92-1.45,9.31.78,13.56,2.76,6.28,2.91,10.59,7.16,15.55,11.64l14.33,12.93,5.71,4.82,1.64-14.13.67-3.27,6.01-31.57,4.7-9.46c1.59-3.2,4.39-5.99,7.62-6.14,3.41-.16,7.99.82,9.46,4.55,1.62,4.12,3.92,9.23,4.02,13.74l.31,14.77-.42,14.19c-.06,2.14.04,4.14.48,6.19-.44,2.33-.67,4.83-.63,7.25l.09,7.28.02,1.56c0,.48,1.83.64,2.25.34l11.06-8.03,15.31-9.71,5.91-4.15c2.69-1.89,5.75-5,8.86-5.34,6.66-.73,12.11,2.48,15.78,7.38,2.47,3.29,5.07,7.24,3.71,11.45-1.4,4.33-5.89,4.93-9.35,6.97l-40.43,23.98-7.81,5.06c1.82,2.19,3.02,3.19,4.95,4.66l6.94,5.27,7.05,5.23,11.46,9.19,10.88,8.58c5.32,4.19,10.49,8.3,14.85,13.49,2.01,2.39,1.17,6.21-.85,8.33-3.83,4.03-9.16,6.63-14.93,6.06l-4.56-1.07c-6.06-2.24-11.13-5.82-16.38-9.42l-8.05-5.54-6.87-5.49-12.44-9.05-1.06,12.09-1.28,12.91-.6,10.33-3.01,20.96Z"/>
    </svg>
  );
}

function FlechaCurva({ color = AZUL_HOND, style = {} }) {
  return (
    <svg viewBox="0 0 386.09 214.17" fill="none" aria-hidden="true" style={{ color, ...style }}>
      <path fill="currentColor" d="M2.17,192.58l7.74-1.74,5.01-.46,8.02-.5,8.46-.54,23.9-3.04,18.63-3.09,8.73-1.37,3.91-.97,12.17-2.59,14.24-3.39,4.48-.92,13.67-3.83,5.69-1.69,6.06-1.92,17.06-5.35,9.39-3.47,11.13-4.27,10.49-4.5,5.46-2.37,6.42-2.77,9.16-4.53,6.22-2.88,8.74-4.45,30.47-18.82,5.6-3.49,4.74-3.47,13.79-10.72,4.47-3.86,5.35-4.52,10.8-9.7,14.8-14.34,12.45-12.53,8.97-9.91,7.4-8.52c1.57-1.8,2.92-3.32,3.97-5.7l-16.06,7.59c-4.02,1.9-11.7-5.88-10.09-13.15l20.18-10.29,14.65-6.83,7.71-2.74c3.76-1.34,7.37-1.23,11.08.26,2.99,1.2,5.55,4.22,5.21,7.59-.83,8.06-.05,15.69.95,23.65l2.59,20.69c.25,2.04.28,4.8-1.33,6.24-3.17,2.84-8.48,4-12.53,2.22-2.72-2.75-3.04-7.55-3.64-11.21l-1.88-11.32c-.06-.34-.14-1.75-.41-1.54l-1.46,1.09-14.2,19.67-14.69,17.82-18.39,19.33-4.09,3.69-5.76,5.5-4.88,5.34-5.52,4.7-7.04,5.71-8.83,7.01-13.21,9.57-16.49,10.63-10.38,6.08-9.92,5.3-5.01,2.49-10.71,5.19-10.65,4.38-21.46,9.49-11.19,3.9-5.23,1.58-7.1,1.89-23.57,7.08-9.5,1.96-4.91.84c-9.14,2.9-17.66,5.46-27.05,7.04l-27.67,4.66-6.02.67-12.66,2.14-21.34,1.48c-9.43.65-16.86,1.63-22.11-6.05l-2.12-3.1-1.72-1.27c-.48-.35-.39-1.49-.28-2.28-1.3-2.61-1.76-6.26,1.16-8.46Z"/>
    </svg>
  );
}


/* Arma el resumen textual de lo que vio el prospecto, para guardarlo en el Sheet */
function armarResumen(respuestas, contexto) {
  const vals = PREGUNTAS.map((p) => ({ ...p, score: respuestas[p.id] || 0 }));
  const prom = vals.reduce((a, b) => a + b.score, 0) / vals.length;
  const maduro = prom >= 4 && vals.every((v) => v.score >= 3);
  const ctx = respuestas.p4 === 1 ? "solo" : "equipo";
  if (maduro) return "MADURO · Se le mostró: sistema construido, sin CTA de venta.";

  let br = vals.filter((v) => v.score <= 2).sort((a, b) => a.score - b.score);
  if (!br.length) br = vals.filter((v) => v.score <= 3).sort((a, b) => a.score - b.score);
  const visibles = br.map((b) => b.id);
  const fuertes = vals.filter((v) => v.score >= 4).sort((a, b) => b.score - a.score).slice(0, 2);
  const cruce = CRUCES.find((c) => c.par.every((id) => visibles.includes(id)));

  const L = [];
  L.push(`Contexto: ${ctx === "solo" ? "founder solo" : "con equipo"} · ${br.length} de 5 dimensiones con fuga.`);
  if (fuertes.length) L.push(`A favor: ${fuertes.map((f) => f.dimension).join(" · ")}.`);
  L.push("");
  br.forEach((b) => {
    L.push(`— ${b.dimension.toUpperCase()} (nivel ${b.score}/5)`);
    L.push(`  ${HERIDAS[b.id].quePasa} ${HERIDAS[b.id][ctx]}`);
    L.push(`  Indicadores: ${INDICADORES[b.id].join(", ")}`);
    L.push("");
  });
  if (cruce) L.push(`CRUCE: ${cruce[ctx]}`);
  return L.join("\n");
}

/* ── App ─────────────────────────────────────────────────────── */

export default function App() {
  const [paso, setPaso] = useState("landing");
  const [idx, setIdx] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [contexto, setContexto] = useState({ cancha: "", ticket: "", ventas: "", propuestas: "" });
  const [contacto, setContacto] = useState({ nombre: "", email: "", empresa: "", rol: "" });
  const [enviando, setEnviando] = useState(false);
  const [errorGate, setErrorGate] = useState("");
  const topRef = useRef(null);

  useEffect(() => {
    if (document.getElementById("crecelera-fonts")) return;
    const l = document.createElement("link");
    l.id = "crecelera-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,400;0,500;0,700;0,800;0,900;1,800;1,900&family=Red+Hat+Text:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
  }, []);

  useEffect(() => {
    const bg = paso === "reveal" ? NEGRO : AZUL;
    document.body.style.background = bg;
    document.documentElement.style.background = bg;
  }, [paso]);

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ block: "start" });
  }, [idx, paso]);

  function responder(valor) {
    const p = PREGUNTAS[idx];
    setRespuestas((r) => ({ ...r, [p.id]: valor }));
    setTimeout(() => {
      if (idx < PREGUNTAS.length - 1) setIdx(idx + 1);
      else setPaso("contexto");
    }, 170);
  }

  async function enviar() {
    const { nombre, email, empresa, rol } = contacto;
    if (!nombre.trim() || !email.trim() || !empresa.trim() || !rol) {
      setErrorGate("Completá todos los campos para ver tu lectura.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorGate("Revisá el email, parece incompleto.");
      return;
    }
    setErrorGate("");
    setEnviando(true);
    try {
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ ...contacto, ...contexto, respuestas, resumen: armarResumen(respuestas, contexto), origen: "lead-magnet" }),
      });
    } catch (e) {
      console.error("Envío falló:", e);
    }
    setEnviando(false);
    setPaso("reveal");
  }

  const totalPasos = PREGUNTAS.length + 2;
  const progreso =
    paso === "landing" ? 0
    : paso === "preguntas" ? (idx / totalPasos) * 100
    : paso === "contexto" ? (PREGUNTAS.length / totalPasos) * 100
    : paso === "gate" ? ((PREGUNTAS.length + 1) / totalPasos) * 100
    : 100;

  return (
    <div style={{ minHeight: "100vh", background: paso === "reveal" ? NEGRO : AZUL, fontFamily: TEXTO, transition: "background 400ms ease" }}>
      <div ref={topRef} />
      {paso !== "reveal" && (
        <FlechaCurva color={AZUL_HOND} style={{
          position: "fixed", right: "-8%", bottom: "-6%", width: "62vw",
          maxWidth: 900, height: "auto", opacity: 0.55, pointerEvents: "none", zIndex: 0,
        }} />
      )}
      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        button:focus-visible, input:focus-visible, select:focus-visible, a:focus-visible { outline: 3px solid ${LIMA}; outline-offset: 3px; }
        input::placeholder { color: rgba(255,255,255,0.38); }
        select option { background: ${AZUL_HOND}; color: ${BLANCO}; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }

        .wrap { max-width: 1180px; margin: 0 auto; padding: 0 28px; position: relative; z-index: 1; }
        .col { max-width: 880px; margin: 0 auto; }
        .col-ancho { max-width: 1080px; margin: 0 auto; }
        .cajas { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 860px) { .cajas { grid-template-columns: 1fr 1fr; } }
        .opt:hover { background: rgba(255,255,255,0.16) !important; transform: translateX(4px); }
        .cta:hover { transform: translateY(-2px); }
        .lnk:hover { color: ${LIMA} !important; }

        .hero { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
        .hero-art { display: none; }
        @media (min-width: 900px) {
          .hero { grid-template-columns: 1.15fr 0.85fr; gap: 70px; min-height: 72vh; }
          .hero-art { display: block; }
        }
        @media (max-width: 640px) { .wrap { padding: 0 20px; } }
      `}</style>

      <div className="wrap" style={{ paddingTop: 26 }}>
        <LogoCrecelera height={32} color={BLANCO} />
      </div>

      {paso !== "landing" && paso !== "reveal" && (
        <div className="wrap" style={{ marginTop: 22 }}>
          <div style={{ height: 3, background: "rgba(255,255,255,0.18)", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${progreso}%`, background: LIMA, borderRadius: 2, transition: "width 320ms ease" }} />
          </div>
        </div>
      )}

      <div className="wrap" style={{ paddingBottom: 70 }}>
        {paso === "landing" && <Landing onStart={() => setPaso("preguntas")} />}

        {paso === "preguntas" && (
          <div className="col">
            <Pregunta
              data={PREGUNTAS[idx]}
              numero={idx + 1}
              total={PREGUNTAS.length}
              seleccionada={respuestas[PREGUNTAS[idx].id]}
              onResponder={responder}
              onVolver={idx > 0 ? () => setIdx(idx - 1) : null}
            />
          </div>
        )}

        {paso === "contexto" && (
          <div className="col">
            <Contexto
              valores={contexto} setValores={setContexto}
              onSeguir={() => setPaso("gate")}
              onVolver={() => { setPaso("preguntas"); setIdx(PREGUNTAS.length - 1); }}
            />
          </div>
        )}

        {paso === "gate" && (
          <div className="col">
            <Gate
              valores={contacto} setValores={setContacto}
              error={errorGate} enviando={enviando}
              onEnviar={enviar} onVolver={() => setPaso("contexto")}
            />
          </div>
        )}

        {paso === "reveal" && (
          <div className="col-ancho">
            <Reveal respuestas={respuestas} nombre={contacto.nombre} contexto={contexto} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Pantallas ───────────────────────────────────────────────── */

function Landing({ onStart }) {
  return (
    <div className="hero" style={{ paddingTop: 40 }}>
      <div>
        <h1 style={{
          fontFamily: DISPLAY, fontWeight: 900, fontStyle: "italic",
          fontSize: "clamp(44px, 7.4vw, 92px)", lineHeight: 0.95,
          color: BLANCO, letterSpacing: "-0.035em", margin: 0,
        }}>
          Growth is<br />not random.<br />
          <span style={{ position: "relative", display: "inline-block" }}>
            It's built.
            <svg viewBox="0 0 200 12" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: "0.02em", width: "100%", height: "0.14em" }}>
              <path d="M2 8 Q100 1 198 6" stroke={LIMA} strokeWidth="8" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p style={{ fontFamily: TEXTO, fontSize: "clamp(18px, 1.65vw, 23px)", lineHeight: 1.55, color: "rgba(255,255,255,0.9)", marginTop: 40, maxWidth: 520 }}>
          Cinco preguntas sobre cómo vende tu empresa. Al final vas a ver dónde
          tu sistema comercial está perdiendo oportunidades.
        </p>

        <p style={{ fontFamily: TEXTO, fontSize: 15, color: "rgba(255,255,255,0.6)", marginTop: 14 }}>
          Toma dos minutos. Sin registro previo.
        </p>

        <button className="cta" onClick={onStart} style={{
          marginTop: 36, background: LIMA, color: NEGRO, border: "none", borderRadius: 7,
          padding: "21px 48px", fontFamily: DISPLAY, fontWeight: 800, fontSize: 19.5,
          letterSpacing: "-0.01em", transition: "transform 160ms ease",
        }}>
          Empezar el chequeo
        </button>

        <div style={{ marginTop: 54, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.18)", fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: "3.4px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
          Arquitectura comercial
        </div>
      </div>

      <div className="hero-art">
        <Asterisco style={{ width: "100%", height: "auto" }} />
      </div>
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <div style={{ fontFamily: DISPLAY, fontSize: 12.5, fontWeight: 800, letterSpacing: "2.6px", color: LIMA, textTransform: "uppercase", marginBottom: 18 }}>
      {children}
    </div>
  );
}

function Pregunta({ data, numero, total, seleccionada, onResponder, onVolver }) {
  return (
    <div style={{ paddingTop: 54 }}>
      <Eyebrow>{String(numero).padStart(2, "0")} · {data.dimension}</Eyebrow>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4.1vw, 48px)", lineHeight: 1.12, color: BLANCO, letterSpacing: "-0.028em", margin: "0 0 32px" }}>
        {data.pregunta}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.opciones.map((op, i) => {
          const activa = seleccionada === i + 1;
          return (
            <button key={i} className="opt" onClick={() => onResponder(i + 1)} style={{
              textAlign: "left", background: activa ? LIMA : "rgba(255,255,255,0.09)",
              color: activa ? NEGRO : BLANCO, border: activa ? "1px solid " + LIMA : "1px solid rgba(255,255,255,0.18)",
              borderRadius: 8, padding: "20px 24px", fontFamily: TEXTO, fontSize: 18,
              lineHeight: 1.42, fontWeight: activa ? 600 : 400, transition: "all 150ms ease",
            }}>
              {op}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {onVolver ? (
          <button className="lnk" onClick={onVolver} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.62)", fontFamily: TEXTO, fontSize: 14.5, padding: 0, transition: "color 150ms" }}>
            ← Volver
          </button>
        ) : <span />}
        <span style={{ fontFamily: DISPLAY, fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>
          {numero} / {total}
        </span>
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: "block", fontFamily: DISPLAY, fontSize: 12, fontWeight: 800, letterSpacing: "2px", color: LIMA, textTransform: "uppercase", marginBottom: 10 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: 8, padding: "17px 19px", fontFamily: TEXTO, fontSize: 17, color: BLANCO,
};

function Contexto({ valores, setValores, onSeguir, onVolver }) {
  const set = (k, v) => setValores((p) => ({ ...p, [k]: v }));
  const listo = valores.cancha && valores.ticket && valores.ventas && valores.propuestas;

  return (
    <div style={{ paddingTop: 54 }}>
      <Eyebrow>Contexto</Eyebrow>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4.1vw, 48px)", lineHeight: 1.12, color: BLANCO, letterSpacing: "-0.028em", margin: "0 0 14px" }}>
        Cuatro datos para calibrar la lectura
      </h2>
      <p style={{ fontFamily: TEXTO, fontSize: 17, color: "rgba(255,255,255,0.7)", margin: "0 0 36px" }}>
        Ninguno es exacto. Elegí el rango que más se acerque.
      </p>

      <Campo label="¿En qué cancha jugás?">
        <select value={valores.cancha} onChange={(e) => set("cancha", e.target.value)} style={inputStyle}>
          <option value="">Elegí una opción</option>
          {CANCHAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Campo>
      <Campo label="Ticket promedio de venta">
        <select value={valores.ticket} onChange={(e) => set("ticket", e.target.value)} style={inputStyle}>
          <option value="">Elegí un rango</option>
          {TICKETS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Campo>
      <Campo label="Ventas cerradas por año">
        <select value={valores.ventas} onChange={(e) => set("ventas", e.target.value)} style={inputStyle}>
          <option value="">Elegí un rango</option>
          {VENTAS.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </Campo>
      <Campo label="¿Cuánto te cuesta armar una propuesta?">
        <select value={valores.propuestas} onChange={(e) => set("propuestas", e.target.value)} style={inputStyle}>
          <option value="">Elegí una opción</option>
          {PROPUESTAS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </Campo>

      <button className="cta" onClick={onSeguir} disabled={!listo} style={{
        marginTop: 14, width: "100%", maxWidth: 340, background: listo ? LIMA : "rgba(255,255,255,0.15)",
        color: listo ? NEGRO : "rgba(255,255,255,0.4)", border: "none", borderRadius: 7,
        padding: "20px 34px", fontFamily: DISPLAY, fontWeight: 800, fontSize: 19,
        cursor: listo ? "pointer" : "not-allowed", transition: "transform 160ms ease",
      }}>
        Continuar
      </button>

      <div>
        <button className="lnk" onClick={onVolver} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.62)", fontFamily: TEXTO, fontSize: 14.5, marginTop: 24, padding: 0, transition: "color 150ms" }}>
          ← Volver
        </button>
      </div>
    </div>
  );
}

function Gate({ valores, setValores, error, enviando, onEnviar, onVolver }) {
  const set = (k, v) => setValores((p) => ({ ...p, [k]: v }));
  return (
    <div style={{ paddingTop: 54 }}>
      <Eyebrow>Último paso</Eyebrow>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4.1vw, 48px)", lineHeight: 1.12, color: BLANCO, letterSpacing: "-0.028em", margin: "0 0 14px" }}>
        Ya tenemos tu lectura
      </h2>
      <p style={{ fontFamily: TEXTO, fontSize: 17, color: "rgba(255,255,255,0.7)", margin: "0 0 36px" }}>
        Decinos quién sos y te la mostramos.
      </p>

      <Campo label="Nombre">
        <input value={valores.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Nombre y apellido" style={inputStyle} />
      </Campo>
      <Campo label="Email">
        <input type="email" value={valores.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@empresa.com" style={inputStyle} />
      </Campo>
      <Campo label="Empresa">
        <input value={valores.empresa} onChange={(e) => set("empresa", e.target.value)} placeholder="Nombre de tu empresa" style={inputStyle} />
      </Campo>
      <Campo label="Tu rol">
        <select value={valores.rol} onChange={(e) => set("rol", e.target.value)} style={inputStyle}>
          <option value="">Elegí una opción</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </Campo>

      {error && <p style={{ fontFamily: TEXTO, fontSize: 14.5, color: LIMA, margin: "0 0 18px", fontWeight: 600 }}>{error}</p>}

      <button className="cta" onClick={onEnviar} disabled={enviando} style={{
        width: "100%", maxWidth: 340, background: LIMA, color: NEGRO, border: "none", borderRadius: 7,
        padding: "20px 34px", fontFamily: DISPLAY, fontWeight: 800, fontSize: 19,
        opacity: enviando ? 0.6 : 1, transition: "transform 160ms ease",
      }}>
        {enviando ? "Un segundo…" : "Ver mi lectura"}
      </button>

      <div>
        <button className="lnk" onClick={onVolver} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.62)", fontFamily: TEXTO, fontSize: 14.5, marginTop: 24, padding: 0, transition: "color 150ms" }}>
          ← Volver
        </button>
      </div>
    </div>
  );
}

function Reveal({ respuestas, nombre, contexto = {} }) {
  const vals = PREGUNTAS.map((p) => ({ ...p, score: respuestas[p.id] || 0 }));
  const promedio = vals.reduce((a, b) => a + b.score, 0) / vals.length;
  const maduro = promedio >= 4 && vals.every((v) => v.score >= 3);
  const inicial = promedio <= 1.6;

  // Contexto: founder solo (p4 === 1) vs con equipo
  const ctx = respuestas.p4 === 1 ? "solo" : "equipo";

  // TODAS las fugas, sin tope. Ordenadas de peor a mejor.
  let brechas = vals.filter((v) => v.score <= 2).sort((a, b) => a.score - b.score);
  if (!brechas.length && !maduro) {
    brechas = vals.filter((v) => v.score <= 3).sort((a, b) => a.score - b.score);
  }
  const visibles = brechas.map((b) => b.id);

  const fuertes = vals.filter((v) => v.score >= 4).sort((a, b) => b.score - a.score).slice(0, 2);

  // El cruce sólo aparece si AMBAS dimensiones están a la vista
  const cruce = CRUCES.find((c) => c.par.every((id) => visibles.includes(id)));

  const pesaCadaDeal =
    TICKET_ALTO.includes(contexto.ticket) && VOLUMEN_BAJO.includes(contexto.ventas);

  const parrafo = { fontFamily: TEXTO, fontSize: "clamp(16px, 1.25vw, 17.5px)", lineHeight: 1.6, color: "rgba(255,255,255,0.88)" };

  return (
    <div style={{ paddingTop: 54 }}>
      {maduro ? (
        <>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(33px, 4.7vw, 56px)", lineHeight: 1.06, color: BLANCO, letterSpacing: "-0.03em", margin: "0 0 28px" }}>
            Tu sistema comercial está construido.
          </h2>
          <p style={{ ...parrafo, fontSize: "clamp(17.5px, 1.5vw, 20.5px)" }}>
            Las cinco dimensiones que medimos están sólidas. No necesitás lo que hacemos —
            y eso también es un resultado.
          </p>
          <p style={{ ...parrafo, fontSize: "clamp(17.5px, 1.5vw, 20.5px)", marginTop: 20 }}>
            Si en algún momento el sistema deja de acompañar el crecimiento, sabés dónde encontrarnos.
          </p>
        </>
      ) : (
        <>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(32px, 4.5vw, 54px)", lineHeight: 1.08, color: BLANCO, letterSpacing: "-0.03em", margin: "0 0 40px" }}>
            {nombre ? nombre.trim().split(" ")[0] + ", tu" : "Tu"} sistema comercial pierde en{" "}
            <span style={{ color: LIMA }}>{brechas.length} de las 5</span> dimensiones que medimos.
          </h2>

          {fuertes.length > 0 && (
            <div style={{ marginBottom: 46 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 12.5, fontWeight: 800, letterSpacing: "2.6px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 16 }}>
                Lo que ya tenés a favor
              </div>
              {fuertes.map((f) => (
                <div key={f.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ color: LIMA, fontFamily: DISPLAY, fontWeight: 900, fontSize: 17, lineHeight: 1.5, flexShrink: 0 }}>✓</span>
                  <p style={{ ...parrafo, color: "rgba(255,255,255,0.76)", margin: 0 }}>{FORTALEZAS[f.id]}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ fontFamily: DISPLAY, fontSize: 12.5, fontWeight: 800, letterSpacing: "2.6px", color: LIMA, textTransform: "uppercase", marginBottom: 20 }}>
            Dónde se te escapa
          </div>

          <div className="cajas">
            {brechas.map((b) => (
              <div key={b.id} style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 12, padding: "26px 26px 22px", display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 800, letterSpacing: "2.2px", color: LIMA, textTransform: "uppercase", marginBottom: 14 }}>
                  {b.dimension}
                </div>
                <p style={{ fontFamily: DISPLAY, fontSize: "clamp(18px, 1.5vw, 21px)", fontWeight: 700, lineHeight: 1.28, color: BLANCO, margin: "0 0 16px", letterSpacing: "-0.015em" }}>
                  {HERIDAS[b.id].quePasa}
                </p>
                <p style={{ ...parrafo, margin: "0 0 20px", flexGrow: 1 }}>
                  {HERIDAS[b.id][ctx]}
                </p>
                <div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 10.5, fontWeight: 800, letterSpacing: "2px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 10 }}>
                    Indicadores que impacta
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {INDICADORES[b.id].map((ind) => (
                      <span key={ind} style={{
                        fontFamily: TEXTO, fontSize: 13, fontWeight: 600, color: LIMA,
                        border: `1px solid ${LIMA}44`, background: `${LIMA}12`,
                        borderRadius: 20, padding: "5px 13px",
                      }}>{ind}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cruce && (
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 12, padding: "28px 30px", marginTop: 26 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 12, fontWeight: 800, letterSpacing: "2.4px", color: LIMA, textTransform: "uppercase", marginBottom: 12 }}>
                Y no son problemas separados
              </div>
              <p style={{ ...parrafo, fontSize: "clamp(17px, 1.4vw, 19px)", margin: 0 }}>{cruce[ctx]}</p>
            </div>
          )}

          {pesaCadaDeal && (
            <p style={{ ...parrafo, fontSize: "clamp(17px, 1.4vw, 19px)", marginTop: 30 }}>
              Con tu ticket y tu volumen, cada oportunidad que se cae no es un número en un reporte:
              es una porción real del año.
            </p>
          )}

          <div style={{ height: 1, background: "rgba(255,255,255,0.18)", margin: "40px 0 34px" }} />

          <p style={{ ...parrafo, fontSize: "clamp(17.5px, 1.5vw, 20.5px)", margin: "0 0 20px" }}>
            <strong style={{ color: BLANCO }}>Lo que esta lectura te dice:</strong> dónde tu sistema comercial pierde, y qué indicadores te está tocando. Ninguno de estos puntos es un problema de esfuerzo.
          </p>
          <p style={{ ...parrafo, fontSize: "clamp(17.5px, 1.5vw, 20.5px)", margin: "0 0 30px" }}>
            <strong style={{ color: BLANCO }}>Lo que no te dice:</strong> cuánto te está costando. Cuántas oportunidades se caen por mes, cuánto revenue queda sobre la mesa, y cuál de estas fugas te drena más.
          </p>

          <div style={{ background: AZUL, borderRadius: 12, padding: "30px", margin: "0 0 32px" }}>
            <p style={{ ...parrafo, fontSize: "clamp(17.5px, 1.5vw, 20.5px)", color: BLANCO, margin: 0 }}>
              {inicial ? (
                <>Y esto es lo importante: <strong>estás vendiendo sin un sistema atrás.</strong> Lo que hoy sostenés a pulso, un sistema lo sostiene solo.</>
              ) : (
                <>Y esto es lo importante: <strong>llegaste hasta acá sin un sistema comercial atrás.</strong> Todo lo que construiste lo hiciste con tu expertise, tu red y tu esfuerzo. Imaginate con una arquitectura comercial que te deje capitalizar todo eso en lugar de depender de que vos estés en cada venta.</>
              )}
            </p>
          </div>

          <p style={{ ...parrafo, fontSize: "clamp(17.5px, 1.5vw, 20.5px)", margin: "0 0 32px" }}>
            Cuánto vale esa diferencia, en tu negocio y con tus números, es lo que mide un{" "}
            <strong style={{ color: LIMA }}>Revenue Reality Check</strong>.
          </p>

          <a className="cta" href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" style={{
            display: "block", textAlign: "center", background: LIMA, color: NEGRO,
            textDecoration: "none", borderRadius: 7, padding: "22px 34px", maxWidth: 420,
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 19.5, transition: "transform 160ms ease",
          }}>
            Agendá 30 minutos
          </a>

          <p style={{ fontFamily: TEXTO, fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 16, maxWidth: 420, textAlign: "center", fontStyle: "italic" }}>
            Sin propuesta, sin presentación. Media hora para entender tu caso.
          </p>
        </>
      )}

      <div style={{ marginTop: 70, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 30px", alignItems: "center", marginBottom: 26 }}>
          <a className="lnk" href={`mailto:${EMAIL}`} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: TEXTO, fontSize: 16, color: "rgba(255,255,255,0.85)", textDecoration: "none", transition: "color 150ms" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true" style={{ flexShrink: 0 }}>
              <rect x="2" y="4" width="20" height="16" rx="2.5" />
              <path d="M2.5 6.5 L12 13 L21.5 6.5" />
            </svg>
            {EMAIL}
          </a>
          <a className="lnk" href={LINKEDIN} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: TEXTO, fontSize: 16, color: "rgba(255,255,255,0.85)", textDecoration: "none", transition: "color 150ms", wordBreak: "break-all" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
            </svg>
            {LINKEDIN.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <LogoCoBranding height={30} color="rgba(255,255,255,0.78)" />
          <span style={{ fontFamily: DISPLAY, fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
            © 2026 Crecelera · Arquitectura comercial
          </span>
        </div>
      </div>
    </div>
  );
}
