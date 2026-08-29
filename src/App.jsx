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
  p1: "Le vendés a quien aparece. El equipo pone la misma energía en un cliente que deja diez veces menos, y eso recién se ve cuando cerrás el año.",
  p2: "Tu crecimiento depende de referidos. Funciona bárbaro hasta el mes que no llega ninguno, y ahí no hay palanca que puedas mover.",
  p3: "Las propuestas salen y el seguimiento queda en tu memoria. Las que se caen, se caen en silencio: nunca sabés si fue el precio, el timing o que simplemente se olvidaron.",
  p4: "El sistema comercial sos vos, y eso le pone un techo a cuánto podés crecer. A menos que te puedas clonar.",
  p5: "Estás manejando mirando por el espejo retrovisor. Te enterás de cómo viene el mes cuando ya no podés hacer nada para cambiarlo.",
};

/* Lo que ya está sólido (score 4-5). Reconocer antes de golpear. */
const FORTALEZAS = {
  p1: "Sabés a quién le vendés. Eso ya te ahorra el esfuerzo que otros tiran en clientes que nunca iban a cerrar.",
  p2: "Tenés canales que traen oportunidades sin depender de la suerte del mes.",
  p3: "Tus propuestas tienen seguimiento real, no memoria.",
  p4: "El equipo funciona con estructura. No todo pasa por vos.",
  p5: "Tenés números para decidir. La mayoría decide con intuición y se entera tarde.",
};

/* Cruces: cuando dos dimensiones fallan juntas, el problema es uno solo. */
const CRUCES = [
  { par: ["p2", "p5"], texto: "No controlás el flujo y tampoco lo medís. Por eso nunca vas a saber si el problema es que entran pocas oportunidades o que se caen las que entran." },
  { par: ["p1", "p2"], texto: "Prospectás sin tener claro a quién. Todo lo que generes arriba del funnel va a llegar sucio abajo." },
  { par: ["p3", "p5"], texto: "Sin proceso de seguimiento y sin medición, cada propuesta perdida se pierde dos veces: perdés la venta y perdés el aprendizaje." },
  { par: ["p3", "p4"], texto: "El proceso vive en tu cabeza y el equipo depende de vos. Cada persona que sumes va a copiar tu memoria, no tu método." },
  { par: ["p1", "p4"], texto: "Vos sos el que sabe a quién hay que venderle. Mientras eso no esté escrito, no es transferible: se va con vos a cada reunión." },
];

const TICKET_ALTO = ["USD 20.000 – 100.000", "Más de USD 100.000"];
const VOLUMEN_BAJO = ["Menos de 10", "10 – 50"];

const CANCHAS = [
  "Servicios profesionales", "BPO y contact center", "Tecnología y software",
  "Marketing y agencias", "Industria y manufactura", "Construcción e inmobiliario",
  "Concesionarios y maquinaria", "Distribución y mayoristas", "Retail y ecommerce",
  "Logística y transporte", "Salud", "Educación y formación", "Otro",
];
const TICKETS = ["Menos de USD 1.000", "USD 1.000 – 5.000", "USD 5.000 – 20.000", "USD 20.000 – 100.000", "Más de USD 100.000"];
const VENTAS = ["Menos de 10", "10 – 50", "50 – 200", "200 – 1.000", "Más de 1.000"];
const PROPUESTAS = ["Cada una se arma casi de cero", "Tenemos plantilla, pero se personaliza mucho", "Modelo estándar con partes fijas y variables"];

/* ── Marca ───────────────────────────────────────────────────── */

function Isotipo({ size = 32, color = BLANCO }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <path d="M30 20 A36 36 0 1 1 30 80" stroke={color} strokeWidth="11" fill="none" strokeLinecap="butt" />
      <path d="M4 50 H52" stroke={color} strokeWidth="11" fill="none" strokeLinecap="butt" />
      <path d="M36 32 L56 50 L36 68" stroke={color} strokeWidth="11" fill="none" strokeLinecap="butt" strokeLinejoin="miter" />
    </svg>
  );
}

function Logo({ color = BLANCO, size = 28 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.34 }}>
      <Isotipo size={size} color={color} />
      <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: size * 0.86, color, letterSpacing: "-0.025em", lineHeight: 1 }}>
        crecelera
      </span>
    </div>
  );
}

function ObjetoGrafico({ opacity = 1 }) {
  return (
    <svg viewBox="0 0 400 420" fill="none" aria-hidden="true" style={{ width: "100%", height: "auto", opacity, display: "block" }}>
      <rect x="118" y="20" width="46" height="190" rx="23" fill={AZUL_HOND} />
      <rect x="188" y="0" width="46" height="210" rx="23" fill={AZUL_HOND} />
      <rect x="258" y="30" width="46" height="180" rx="23" fill={AZUL_HOND} />
      <path
        d="M20 220 C20 190 60 168 92 186 C112 150 158 150 178 184 C200 148 248 152 264 188 C296 168 340 190 340 224 L340 420 L20 420 Z"
        fill={LIMA}
      />
    </svg>
  );
}

/* ── App ─────────────────────────────────────────────────────── */

export default function App() {
  const [paso, setPaso] = useState("landing");
  const [idx, setIdx] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [contexto, setContexto] = useState({ cancha: "", ticket: "", ventas: "", propuestas: "" });
  const [contacto, setContacto] = useState({ nombre: "", email: "", empresa: "" });
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
    const { nombre, email, empresa } = contacto;
    if (!nombre.trim() || !email.trim() || !empresa.trim()) {
      setErrorGate("Completá los tres campos para ver tu lectura.");
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
        body: JSON.stringify({ ...contacto, ...contexto, respuestas, origen: "lead-magnet" }),
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
      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        button:focus-visible, input:focus-visible, select:focus-visible, a:focus-visible { outline: 3px solid ${LIMA}; outline-offset: 3px; }
        input::placeholder { color: rgba(255,255,255,0.38); }
        select option { background: ${AZUL_HOND}; color: ${BLANCO}; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }

        .wrap { max-width: 1180px; margin: 0 auto; padding: 0 28px; }
        .col { max-width: 760px; }
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
        <Logo color={BLANCO} size={30} />
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
          <div className="col">
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

        <p style={{ fontFamily: TEXTO, fontSize: "clamp(17px, 1.5vw, 21px)", lineHeight: 1.55, color: "rgba(255,255,255,0.9)", marginTop: 40, maxWidth: 520 }}>
          Cinco preguntas sobre cómo vende tu empresa. Al final vas a ver dónde
          tu sistema comercial está perdiendo oportunidades.
        </p>

        <p style={{ fontFamily: TEXTO, fontSize: 15, color: "rgba(255,255,255,0.6)", marginTop: 14 }}>
          Toma dos minutos. Sin registro previo.
        </p>

        <button className="cta" onClick={onStart} style={{
          marginTop: 36, background: LIMA, color: NEGRO, border: "none", borderRadius: 7,
          padding: "19px 44px", fontFamily: DISPLAY, fontWeight: 800, fontSize: 18,
          letterSpacing: "-0.01em", transition: "transform 160ms ease",
        }}>
          Empezar el chequeo
        </button>

        <div style={{ marginTop: 54, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.18)", fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: "3.4px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
          Arquitectura comercial
        </div>
      </div>

      <div className="hero-art">
        <ObjetoGrafico />
      </div>
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <div style={{ fontFamily: DISPLAY, fontSize: 11.5, fontWeight: 800, letterSpacing: "2.6px", color: LIMA, textTransform: "uppercase", marginBottom: 18 }}>
      {children}
    </div>
  );
}

function Pregunta({ data, numero, total, seleccionada, onResponder, onVolver }) {
  return (
    <div style={{ paddingTop: 54 }}>
      <Eyebrow>{String(numero).padStart(2, "0")} · {data.dimension}</Eyebrow>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(27px, 3.6vw, 42px)", lineHeight: 1.12, color: BLANCO, letterSpacing: "-0.028em", margin: "0 0 32px" }}>
        {data.pregunta}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.opciones.map((op, i) => {
          const activa = seleccionada === i + 1;
          return (
            <button key={i} className="opt" onClick={() => onResponder(i + 1)} style={{
              textAlign: "left", background: activa ? LIMA : "rgba(255,255,255,0.09)",
              color: activa ? NEGRO : BLANCO, border: activa ? "1px solid " + LIMA : "1px solid rgba(255,255,255,0.18)",
              borderRadius: 8, padding: "18px 22px", fontFamily: TEXTO, fontSize: 16.5,
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
      <label style={{ display: "block", fontFamily: DISPLAY, fontSize: 11, fontWeight: 800, letterSpacing: "2px", color: LIMA, textTransform: "uppercase", marginBottom: 10 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: 8, padding: "15px 17px", fontFamily: TEXTO, fontSize: 16, color: BLANCO,
};

function Contexto({ valores, setValores, onSeguir, onVolver }) {
  const set = (k, v) => setValores((p) => ({ ...p, [k]: v }));
  const listo = valores.cancha && valores.ticket && valores.ventas && valores.propuestas;

  return (
    <div style={{ paddingTop: 54 }}>
      <Eyebrow>Contexto</Eyebrow>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(27px, 3.6vw, 42px)", lineHeight: 1.12, color: BLANCO, letterSpacing: "-0.028em", margin: "0 0 14px" }}>
        Cuatro datos para calibrar la lectura
      </h2>
      <p style={{ fontFamily: TEXTO, fontSize: 16, color: "rgba(255,255,255,0.7)", margin: "0 0 34px" }}>
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
        padding: "18px 30px", fontFamily: DISPLAY, fontWeight: 800, fontSize: 17.5,
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
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(27px, 3.6vw, 42px)", lineHeight: 1.12, color: BLANCO, letterSpacing: "-0.028em", margin: "0 0 14px" }}>
        Ya tenemos tu lectura
      </h2>
      <p style={{ fontFamily: TEXTO, fontSize: 16, color: "rgba(255,255,255,0.7)", margin: "0 0 34px" }}>
        Decinos quién sos y te la mostramos.
      </p>

      <Campo label="Nombre">
        <input value={valores.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Tu nombre" style={inputStyle} />
      </Campo>
      <Campo label="Email">
        <input type="email" value={valores.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@empresa.com" style={inputStyle} />
      </Campo>
      <Campo label="Empresa">
        <input value={valores.empresa} onChange={(e) => set("empresa", e.target.value)} placeholder="Nombre de tu empresa" style={inputStyle} />
      </Campo>

      {error && <p style={{ fontFamily: TEXTO, fontSize: 14.5, color: LIMA, margin: "0 0 18px", fontWeight: 600 }}>{error}</p>}

      <button className="cta" onClick={onEnviar} disabled={enviando} style={{
        width: "100%", maxWidth: 340, background: LIMA, color: NEGRO, border: "none", borderRadius: 7,
        padding: "18px 30px", fontFamily: DISPLAY, fontWeight: 800, fontSize: 17.5,
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
  // Maduro sólo si además NINGUNA dimensión está floja: un 2 aislado sigue siendo una fuga real
  const maduro = promedio >= 4 && vals.every((v) => v.score >= 3);
  const inicial = promedio <= 1.6;

  let brechas = vals.filter((v) => v.score <= 2).sort((a, b) => a.score - b.score).slice(0, 3);
  if (!brechas.length && !maduro) {
    brechas = vals.filter((v) => v.score <= 3).sort((a, b) => a.score - b.score).slice(0, 2);
  }

  // Lo que ya está sólido: hasta 2, para reconocer sin diluir
  const fuertes = vals.filter((v) => v.score >= 4).sort((a, b) => b.score - a.score).slice(0, 2);

  // Cruce: primera combinación cuyas dos dimensiones estén flojas
  const flojas = vals.filter((v) => v.score <= 2).map((v) => v.id);
  const cruce = CRUCES.find((c) => c.par.every((id) => flojas.includes(id)));

  // Línea de contexto: ticket alto + volumen bajo = cada oportunidad pesa
  const pesaCadaDeal =
    TICKET_ALTO.includes(contexto.ticket) && VOLUMEN_BAJO.includes(contexto.ventas);

  const parrafo = { fontFamily: TEXTO, fontSize: "clamp(16.5px, 1.35vw, 18.5px)", lineHeight: 1.6, color: "rgba(255,255,255,0.9)" };

  return (
    <div style={{ paddingTop: 54 }}>
      {maduro ? (
        <>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(30px, 4.2vw, 50px)", lineHeight: 1.06, color: BLANCO, letterSpacing: "-0.03em", margin: "0 0 28px" }}>
            Tu sistema comercial está construido.
          </h2>
          <p style={parrafo}>
            Las cinco dimensiones que medimos están sólidas. No necesitás lo que hacemos —
            y eso también es un resultado.
          </p>
          <p style={{ ...parrafo, marginTop: 20 }}>
            Si en algún momento el sistema deja de acompañar el crecimiento, sabés dónde encontrarnos.
          </p>
        </>
      ) : (
        <>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(29px, 4vw, 48px)", lineHeight: 1.08, color: BLANCO, letterSpacing: "-0.03em", margin: "0 0 40px" }}>
            {nombre ? nombre.trim().split(" ")[0] + ", tu" : "Tu"} sistema comercial tiene fugas en{" "}
            <span style={{ color: LIMA }}>{brechas.length} de las 5</span> dimensiones que medimos.
          </h2>

          {fuertes.length > 0 && (
            <div style={{ marginBottom: 44 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 11.5, fontWeight: 800, letterSpacing: "2.6px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 16 }}>
                Lo que ya tenés a favor
              </div>
              {fuertes.map((f) => (
                <div key={f.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ color: LIMA, fontFamily: DISPLAY, fontWeight: 900, fontSize: 17, lineHeight: 1.5, flexShrink: 0 }}>✓</span>
                  <p style={{ ...parrafo, fontSize: "clamp(15.5px, 1.25vw, 17px)", color: "rgba(255,255,255,0.78)", margin: 0 }}>
                    {FORTALEZAS[f.id]}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div style={{ fontFamily: DISPLAY, fontSize: 11.5, fontWeight: 800, letterSpacing: "2.6px", color: LIMA, textTransform: "uppercase", marginBottom: 20 }}>
            Dónde se te escapa
          </div>

          {brechas.map((b) => (
            <div key={b.id} style={{ borderLeft: `3px solid ${LIMA}`, padding: "2px 0 4px 22px", marginBottom: 26 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 12, fontWeight: 800, letterSpacing: "2.2px", color: LIMA, textTransform: "uppercase", marginBottom: 10 }}>
                {b.dimension}
              </div>
              <p style={{ ...parrafo, margin: 0 }}>{HERIDAS[b.id]}</p>
            </div>
          ))}

          {cruce && (
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 12, padding: "26px 28px", marginTop: 32 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 11.5, fontWeight: 800, letterSpacing: "2.4px", color: LIMA, textTransform: "uppercase", marginBottom: 12 }}>
                Y no son problemas separados
              </div>
              <p style={{ ...parrafo, margin: 0 }}>{cruce.texto}</p>
            </div>
          )}

          {pesaCadaDeal && (
            <p style={{ ...parrafo, marginTop: 30, color: "rgba(255,255,255,0.82)" }}>
              Con tu ticket y tu volumen, cada oportunidad que se cae no es un número en un reporte:
              es una porción real del año.
            </p>
          )}

          <div style={{ height: 1, background: "rgba(255,255,255,0.18)", margin: "34px 0 32px" }} />

          <p style={{ ...parrafo, margin: "0 0 20px" }}>
            <strong style={{ color: BLANCO }}>Lo que esta lectura te dice:</strong> hay {brechas.length === 1 ? "un punto" : `${brechas.length} puntos`} donde tu sistema comercial pierde. Ninguno es un problema de esfuerzo.
          </p>
          <p style={{ ...parrafo, margin: "0 0 30px" }}>
            <strong style={{ color: BLANCO }}>Lo que no te dice:</strong> cuánto te está costando. Cuántas oportunidades se caen por mes, cuánto revenue queda sobre la mesa, y cuál de estas fugas te drena más.
          </p>

          <div style={{ background: AZUL, borderRadius: 12, padding: "30px", margin: "0 0 32px" }}>
            <p style={{ ...parrafo, color: BLANCO, margin: 0 }}>
              {inicial ? (
                <>Y esto es lo importante: <strong>estás vendiendo sin un sistema atrás.</strong> Lo que hoy sostenés a pulso, un sistema lo sostiene solo.</>
              ) : (
                <>Y esto es lo importante: <strong>llegaste hasta acá sin un sistema comercial atrás.</strong> Todo lo que construiste lo hiciste con tu expertise, tu red y tu esfuerzo. Imaginate con una arquitectura comercial que te deje capitalizar todo eso en lugar de depender de que vos estés en cada venta.</>
              )}
            </p>
          </div>

          <p style={{ ...parrafo, margin: "0 0 32px" }}>
            Cuánto vale esa diferencia, en tu negocio y con tus números, es lo que mide un{" "}
            <strong style={{ color: LIMA }}>Revenue Reality Check</strong>.
          </p>

          <a className="cta" href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" style={{
            display: "block", textAlign: "center", background: LIMA, color: NEGRO,
            textDecoration: "none", borderRadius: 7, padding: "20px 30px", maxWidth: 380,
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 18, transition: "transform 160ms ease",
          }}>
            Agendá 30 minutos
          </a>

          <p style={{ fontFamily: TEXTO, fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 16, maxWidth: 380, textAlign: "center", fontStyle: "italic" }}>
            Sin propuesta, sin presentación. Media hora para entender tu caso.
          </p>
        </>
      )}

      <div style={{ marginTop: 70, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 22, alignItems: "center", marginBottom: 24 }}>
          <a className="lnk" href={`mailto:${EMAIL}`} style={{ fontFamily: TEXTO, fontSize: 15, color: "rgba(255,255,255,0.8)", textDecoration: "none", transition: "color 150ms" }}>
            {EMAIL}
          </a>
          <a className="lnk" href={LINKEDIN} target="_blank" rel="noopener noreferrer" style={{ fontFamily: TEXTO, fontSize: 15, color: "rgba(255,255,255,0.8)", textDecoration: "none", transition: "color 150ms" }}>
            LinkedIn
          </a>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <Logo color="rgba(255,255,255,0.72)" size={22} />
          <span style={{ fontFamily: DISPLAY, fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
            © 2026 Crecelera · Arquitectura comercial
          </span>
        </div>
      </div>
    </div>
  );
}
