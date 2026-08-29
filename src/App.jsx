import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   CRECELERA · Lead Magnet
   Chequeo comercial · 5 preguntas · reveal sin score
   ───────────────────────────────────────────────────────────── */

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwhLAxc3CJa10zEojEcE6g2N48YzgTnqmA2YhMW8vU2ofD_94JupZe4FPP8dXG0HxY2/exec";
const CALENDAR_URL = "https://calendar.app.google/JqpHnEPrA3szRFhC8";

const AZUL = "#203AD3";
const AZUL_OSCURO = "#1A2FA8";
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

/* Heridas: texto fijo por dimensión. Nunca menciona score ni solución. */
const HERIDAS = {
  p1: "Le vendés a quien aparece. Sin un perfil que filtre, el equipo gasta el mismo esfuerzo en oportunidades que valen muy distinto.",
  p2: "Tu crecimiento depende de referidos que no controlás. No hay un flujo que puedas abrir o cerrar cuando lo necesitás.",
  p3: "Las propuestas salen y después el seguimiento queda librado a la memoria. No sabés por qué se caen las que se caen.",
  p4: "El sistema comercial sos vos. Si no estás, no hay ventas.",
  p5: "Estás decidiendo sin números. Te enterás de cómo viene el mes cuando el mes ya terminó.",
};

const CANCHAS = [
  "Servicios profesionales", "BPO y contact center", "Tecnología y software",
  "Marketing y agencias", "Industria y manufactura", "Construcción e inmobiliario",
  "Concesionarios y maquinaria", "Distribución y mayoristas", "Retail y ecommerce",
  "Logística y transporte", "Salud", "Educación y formación", "Otro",
];

const TICKETS = ["Menos de USD 1.000", "USD 1.000 – 5.000", "USD 5.000 – 20.000", "USD 20.000 – 100.000", "Más de USD 100.000"];
const VENTAS = ["Menos de 10", "10 – 50", "50 – 200", "200 – 1.000", "Más de 1.000"];
const PROPUESTAS = ["Cada una se arma casi de cero", "Tenemos plantilla, pero se personaliza mucho", "Modelo estándar con partes fijas y variables"];

/* ── Isotipo (flecha entrando al círculo) ────────────────────── */

function Isotipo({ size = 32, color = BLANCO }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M50 12 a38 38 0 0 1 0 76 a38 38 0 0 1 -26 -10" stroke={color} strokeWidth="11" fill="none" strokeLinecap="butt" />
      <path d="M24 22 a38 38 0 0 0 -0.5 0.4" stroke={color} strokeWidth="11" fill="none" />
      <path d="M8 50 h46 M38 32 L58 50 L38 68" stroke={color} strokeWidth="11" fill="none" strokeLinejoin="miter" strokeLinecap="butt" />
    </svg>
  );
}

function Logo({ color = BLANCO, size = 28 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Isotipo size={size} color={color} />
      <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: size * 0.82, color, letterSpacing: "-0.02em" }}>
        crecelera
      </span>
    </div>
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
    l.href = "https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700;800;900&family=Red+Hat+Text:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
  }, []);

  useEffect(() => {
    document.body.style.background = paso === "reveal" ? NEGRO : AZUL;
    document.body.style.margin = "0";
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
    }, 180);
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
      // El reveal se muestra igual: nunca bloqueamos por un error de backend.
      console.error("Envío falló:", e);
    }
    setEnviando(false);
    setPaso("reveal");
  }

  const progreso = paso === "landing" ? 0 : paso === "preguntas" ? ((idx) / (PREGUNTAS.length + 2)) * 100
    : paso === "contexto" ? (PREGUNTAS.length / (PREGUNTAS.length + 2)) * 100
    : paso === "gate" ? ((PREGUNTAS.length + 1) / (PREGUNTAS.length + 2)) * 100 : 100;

  return (
    <div style={{ minHeight: "100vh", background: paso === "reveal" ? NEGRO : AZUL, fontFamily: TEXTO, transition: "background 400ms ease" }}>
      <div ref={topRef} />
      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        button:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid ${LIMA}; outline-offset: 2px; }
        input::placeholder { color: rgba(255,255,255,0.4); }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
        .opt:hover { background: rgba(255,255,255,0.14) !important; transform: translateX(3px); }
        .cta:hover { transform: translateY(-2px); }
        select option { background: ${AZUL_OSCURO}; color: ${BLANCO}; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "22px 20px 0", maxWidth: 680, margin: "0 auto" }}>
        <Logo color={paso === "reveal" ? BLANCO : BLANCO} size={26} />
      </div>

      {/* Progreso */}
      {paso !== "landing" && paso !== "reveal" && (
        <div style={{ maxWidth: 680, margin: "20px auto 0", padding: "0 20px" }}>
          <div style={{ height: 3, background: "rgba(255,255,255,0.18)", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${progreso}%`, background: LIMA, borderRadius: 2, transition: "width 320ms ease" }} />
          </div>
        </div>
      )}

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px 60px" }}>
        {paso === "landing" && <Landing onStart={() => setPaso("preguntas")} />}

        {paso === "preguntas" && (
          <Pregunta
            data={PREGUNTAS[idx]}
            numero={idx + 1}
            total={PREGUNTAS.length}
            seleccionada={respuestas[PREGUNTAS[idx].id]}
            onResponder={responder}
            onVolver={idx > 0 ? () => setIdx(idx - 1) : null}
          />
        )}

        {paso === "contexto" && (
          <Contexto
            valores={contexto}
            setValores={setContexto}
            onSeguir={() => setPaso("gate")}
            onVolver={() => { setPaso("preguntas"); setIdx(PREGUNTAS.length - 1); }}
          />
        )}

        {paso === "gate" && (
          <Gate
            valores={contacto}
            setValores={setContacto}
            error={errorGate}
            enviando={enviando}
            onEnviar={enviar}
            onVolver={() => setPaso("contexto")}
          />
        )}

        {paso === "reveal" && <Reveal respuestas={respuestas} nombre={contacto.nombre} />}
      </div>
    </div>
  );
}

/* ── Pantallas ───────────────────────────────────────────────── */

function Landing({ onStart }) {
  return (
    <div style={{ paddingTop: 72 }}>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(38px, 9vw, 62px)", lineHeight: 0.98, color: BLANCO, letterSpacing: "-0.03em", margin: 0, fontStyle: "italic" }}>
        Growth is<br />not random.<br />
        <span style={{ position: "relative", display: "inline-block" }}>
          It's built.
          <svg viewBox="0 0 200 12" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: "-2px", width: "100%", height: 10 }}>
            <path d="M2 8 Q100 1 198 6" stroke={LIMA} strokeWidth="7" fill="none" strokeLinecap="round" />
          </svg>
        </span>
      </h1>

      <p style={{ fontFamily: TEXTO, fontSize: 17, lineHeight: 1.55, color: "rgba(255,255,255,0.88)", marginTop: 38, maxWidth: 460 }}>
        Cinco preguntas sobre cómo vende tu empresa. Al final vas a ver dónde
        tu sistema comercial está perdiendo oportunidades.
      </p>

      <p style={{ fontFamily: TEXTO, fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 14 }}>
        Toma dos minutos.
      </p>

      <button className="cta" onClick={onStart} style={{
        marginTop: 34, background: LIMA, color: NEGRO, border: "none", borderRadius: 6,
        padding: "17px 34px", fontFamily: DISPLAY, fontWeight: 800, fontSize: 17,
        letterSpacing: "-0.01em", transition: "transform 160ms ease", width: "100%", maxWidth: 320,
      }}>
        Empezar el chequeo
      </button>

      <div style={{ marginTop: 64, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.16)", fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: "3px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>
        Arquitectura comercial
      </div>
    </div>
  );
}

function Pregunta({ data, numero, total, seleccionada, onResponder, onVolver }) {
  return (
    <div style={{ paddingTop: 44 }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 800, letterSpacing: "2.5px", color: LIMA, textTransform: "uppercase", marginBottom: 16 }}>
        {String(numero).padStart(2, "0")} · {data.dimension}
      </div>

      <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(25px, 5.5vw, 34px)", lineHeight: 1.15, color: BLANCO, letterSpacing: "-0.02em", margin: "0 0 30px" }}>
        {data.pregunta}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {data.opciones.map((op, i) => {
          const activa = seleccionada === i + 1;
          return (
            <button key={i} className="opt" onClick={() => onResponder(i + 1)} style={{
              textAlign: "left", background: activa ? LIMA : "rgba(255,255,255,0.08)",
              color: activa ? NEGRO : BLANCO, border: activa ? "none" : "1px solid rgba(255,255,255,0.16)",
              borderRadius: 7, padding: "16px 18px", fontFamily: TEXTO, fontSize: 15.5,
              lineHeight: 1.4, fontWeight: activa ? 600 : 400, transition: "all 150ms ease",
            }}>
              {op}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {onVolver ? (
          <button onClick={onVolver} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.62)", fontFamily: TEXTO, fontSize: 14, padding: 0 }}>
            ← Volver
          </button>
        ) : <span />}
        <span style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>
          {numero} / {total}
        </span>
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontFamily: DISPLAY, fontSize: 11, fontWeight: 800, letterSpacing: "2px", color: LIMA, textTransform: "uppercase", marginBottom: 9 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 7, padding: "14px 16px", fontFamily: TEXTO, fontSize: 15.5, color: BLANCO,
};

function Contexto({ valores, setValores, onSeguir, onVolver }) {
  const set = (k, v) => setValores((p) => ({ ...p, [k]: v }));
  const listo = valores.cancha && valores.ticket && valores.ventas && valores.propuestas;

  return (
    <div style={{ paddingTop: 44 }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 800, letterSpacing: "2.5px", color: LIMA, textTransform: "uppercase", marginBottom: 16 }}>
        Contexto
      </div>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(25px, 5.5vw, 34px)", lineHeight: 1.15, color: BLANCO, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
        Cuatro datos para calibrar la lectura
      </h2>
      <p style={{ fontFamily: TEXTO, fontSize: 15, color: "rgba(255,255,255,0.7)", margin: "0 0 30px" }}>
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
        marginTop: 12, width: "100%", background: listo ? LIMA : "rgba(255,255,255,0.15)",
        color: listo ? NEGRO : "rgba(255,255,255,0.4)", border: "none", borderRadius: 6,
        padding: "17px 30px", fontFamily: DISPLAY, fontWeight: 800, fontSize: 17,
        cursor: listo ? "pointer" : "not-allowed", transition: "transform 160ms ease",
      }}>
        Continuar
      </button>

      <button onClick={onVolver} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.62)", fontFamily: TEXTO, fontSize: 14, marginTop: 20, padding: 0 }}>
        ← Volver
      </button>
    </div>
  );
}

function Gate({ valores, setValores, error, enviando, onEnviar, onVolver }) {
  const set = (k, v) => setValores((p) => ({ ...p, [k]: v }));
  return (
    <div style={{ paddingTop: 44 }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 800, letterSpacing: "2.5px", color: LIMA, textTransform: "uppercase", marginBottom: 16 }}>
        Último paso
      </div>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(25px, 5.5vw, 34px)", lineHeight: 1.15, color: BLANCO, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
        Ya tenemos tu lectura
      </h2>
      <p style={{ fontFamily: TEXTO, fontSize: 15, color: "rgba(255,255,255,0.7)", margin: "0 0 30px" }}>
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

      {error && (
        <p style={{ fontFamily: TEXTO, fontSize: 14, color: LIMA, margin: "0 0 16px", fontWeight: 600 }}>{error}</p>
      )}

      <button className="cta" onClick={onEnviar} disabled={enviando} style={{
        width: "100%", background: LIMA, color: NEGRO, border: "none", borderRadius: 6,
        padding: "17px 30px", fontFamily: DISPLAY, fontWeight: 800, fontSize: 17,
        opacity: enviando ? 0.6 : 1, transition: "transform 160ms ease",
      }}>
        {enviando ? "Un segundo…" : "Ver mi lectura"}
      </button>

      <button onClick={onVolver} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.62)", fontFamily: TEXTO, fontSize: 14, marginTop: 20, padding: 0 }}>
        ← Volver
      </button>
    </div>
  );
}

function Reveal({ respuestas, nombre }) {
  const vals = PREGUNTAS.map((p) => ({ ...p, score: respuestas[p.id] || 0 }));
  const promedio = vals.reduce((a, b) => a + b.score, 0) / vals.length;
  const maduro = promedio >= 4;
  const inicial = promedio <= 1.6;

  let brechas = vals.filter((v) => v.score <= 2).sort((a, b) => a.score - b.score).slice(0, 3);
  if (!brechas.length && !maduro) {
    brechas = vals.filter((v) => v.score <= 3).sort((a, b) => a.score - b.score).slice(0, 2);
  }

  return (
    <div style={{ paddingTop: 44 }}>
      {maduro ? (
        <>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(28px, 6.5vw, 42px)", lineHeight: 1.08, color: BLANCO, letterSpacing: "-0.025em", margin: "0 0 24px" }}>
            Tu sistema comercial está construido.
          </h2>
          <p style={{ fontFamily: TEXTO, fontSize: 17, lineHeight: 1.6, color: "rgba(255,255,255,0.82)" }}>
            Las cinco dimensiones que medimos están sólidas. No necesitás lo que hacemos —
            y eso también es un resultado.
          </p>
          <p style={{ fontFamily: TEXTO, fontSize: 17, lineHeight: 1.6, color: "rgba(255,255,255,0.82)", marginTop: 18 }}>
            Si en algún momento el sistema deja de acompañar el crecimiento, sabés dónde encontrarnos.
          </p>
        </>
      ) : (
        <>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(27px, 6vw, 40px)", lineHeight: 1.1, color: BLANCO, letterSpacing: "-0.025em", margin: "0 0 34px" }}>
            {nombre ? nombre.split(" ")[0] + ", tu" : "Tu"} sistema comercial tiene fugas en{" "}
            <span style={{ color: LIMA }}>{brechas.length} de las 5</span> dimensiones que medimos.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {brechas.map((b) => (
              <div key={b.id} style={{ borderLeft: `3px solid ${LIMA}`, padding: "4px 0 22px 20px", marginBottom: 14 }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 12, fontWeight: 800, letterSpacing: "2px", color: LIMA, textTransform: "uppercase", marginBottom: 9 }}>
                  {b.dimension}
                </div>
                <p style={{ fontFamily: TEXTO, fontSize: 16.5, lineHeight: 1.5, color: "rgba(255,255,255,0.9)", margin: 0 }}>
                  {HERIDAS[b.id]}
                </p>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.18)", margin: "26px 0 30px" }} />

          <p style={{ fontFamily: TEXTO, fontSize: 16.5, lineHeight: 1.6, color: "rgba(255,255,255,0.9)", margin: "0 0 18px" }}>
            <strong style={{ color: BLANCO }}>Lo que esta lectura te dice:</strong> hay {brechas.length === 1 ? "un punto" : `${brechas.length} puntos`} donde tu sistema comercial pierde. Ninguno es un problema de esfuerzo.
          </p>

          <p style={{ fontFamily: TEXTO, fontSize: 16.5, lineHeight: 1.6, color: "rgba(255,255,255,0.9)", margin: "0 0 26px" }}>
            <strong style={{ color: BLANCO }}>Lo que no te dice:</strong> cuánto te está costando. Cuántas oportunidades se caen por mes, cuánto revenue queda sobre la mesa, y cuál de estas fugas te drena más.
          </p>

          <div style={{ background: AZUL, borderRadius: 10, padding: "26px 24px", margin: "0 0 30px" }}>
            <p style={{ fontFamily: TEXTO, fontSize: 16.5, lineHeight: 1.6, color: BLANCO, margin: 0 }}>
              {inicial ? (
                <>Y esto es lo importante: <strong>estás vendiendo sin un sistema atrás.</strong> Lo que hoy sostenés a pulso, un sistema lo sostiene solo.</>
              ) : (
                <>Y esto es lo importante: <strong>llegaste hasta acá sin un sistema comercial atrás.</strong> Todo lo que construiste lo hiciste con tu expertise, tu red y tu esfuerzo. Imaginate con una arquitectura comercial que te deje capitalizar todo eso en lugar de depender de que vos estés en cada venta.</>
              )}
            </p>
          </div>

          <p style={{ fontFamily: TEXTO, fontSize: 16.5, lineHeight: 1.6, color: "rgba(255,255,255,0.9)", margin: "0 0 30px" }}>
            Cuánto vale esa diferencia, en tu negocio y con tus números, es lo que mide un{" "}
            <strong style={{ color: LIMA }}>Revenue Reality Check</strong>.
          </p>

          <a className="cta" href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" style={{
            display: "block", textAlign: "center", background: LIMA, color: NEGRO,
            textDecoration: "none", borderRadius: 6, padding: "18px 30px",
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, transition: "transform 160ms ease",
          }}>
            Agendá 30 minutos
          </a>

          <p style={{ fontFamily: TEXTO, fontSize: 13.5, color: "rgba(255,255,255,0.55)", textAlign: "center", marginTop: 14, fontStyle: "italic" }}>
            Sin propuesta, sin presentación. Media hora para entender tu caso.
          </p>
        </>
      )}

      <div style={{ marginTop: 56, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.14)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo color="rgba(255,255,255,0.7)" size={20} />
        <span style={{ fontFamily: DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
          Arquitectura comercial
        </span>
      </div>
    </div>
  );
}
