import { useEffect, useState } from "react";
import type { Question } from "../types/Question";

const API_URL = "https://org-maternity-villas-faster.trycloudflare.com"; //esto cambia cuando cierro el tunnel. volver a usar cloudflared tunnel --url hhtp://localhost:8080 en la raspberry

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [discordId, setDiscordId] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);


useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("auth_token", token);
    window.history.replaceState({}, "", "/"); // limpia ?token
  }
}, []);

 
  useEffect(() => {
    fetch(`${API_URL}/api/Preguntas/preguntas`)
      .then(res => res.json())
      .then((data) => {
        setQuestions(
          data.map((q: any) => ({
            id: q.id,
            text: q.question,
            options: q.answers.map((a: any) => ({
              id: a.id,
              text: a.text,
            })),
          }))
        );
        setLoading(false);
      });
  }, []);

useEffect(() => {
  let cancelled = false;

  const token = localStorage.getItem("auth_token");

  if (!token) {
    setAuthChecked(true);
    return;
  }

  fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("No autenticado");
      return res.json();
    })
    .then(user => {
      if (cancelled) return;
      setDiscordId(user.discordId);
      setAuthChecked(true);
    })
    .catch(() => {
      if (cancelled) return;
      localStorage.removeItem("auth_token");
      setAuthChecked(true);
    });

  return () => {
    cancelled = true;
  };
}, []);



 
  if (loading) {
    return (
      <div style={wrapperStyle}>
        <p>Cargando preguntas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={wrapperStyle}>
        <p>{error}</p>
      </div>
    );
  }

    if (!authChecked) {
  return (
    <div style={wrapperStyle}>
      <p>Verificando usuario...</p>
    </div>
  );
}

if (!discordId) {
  setTimeout(() => {
    window.location.href = `${API_URL}/auth/discord/login`;
  }, 800);

  return (
    <div style={wrapperStyle}>
      <p>Conectando con Discord…</p>
    </div>
  );
}

  if (!questions.length) {
    return (
      <div style={wrapperStyle}>
        <p>No hay preguntas disponibles.</p>
      </div>
    );
  }

  const current = questions[currentIndex];

  const selectAnswer = (optionId: number) => {
    setAnswers(prev => ({
      ...prev,
      [current.id]: optionId,
    }));
  };

  const next = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
    } else {
      setFinished(true);
    }
  };

const submitResults = async () => {
  if (sent || !discordId) return;

  try {
const token = localStorage.getItem("auth_token");

await fetch(`${API_URL}/api/Preguntas/resultados`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    answers,
  }),
});


    setSent(true);
  } catch {
    setError("No se pudo enviar el resultado");
  }
};

  
  if (finished) {
    return (
      <div style={wrapperStyle}>
        {sent ? (
          <h2>Gracias.</h2>
        ) : (
          <>
            <h2>Completaste el cuestionario</h2>



            <br /><br />

            <button disabled={!discordId} onClick={submitResults}>
              Enviar resultado
            </button>
          </>
        )}
      </div>
    );
  }



  
  return (
    <div className="quiz-layer">
      <h3>
        Pregunta {currentIndex + 1} / {questions.length}
      </h3>

      <p className="quiz-text">{current.text}</p>

      {current.options.map(opt => (
        <label key={opt.id} className="quiz-option">
          <input
            type="radio"
            name={`question-${current.id}`}
            checked={answers[current.id] === opt.id}
            onChange={() => selectAnswer(opt.id)}
          />
          <span>{opt.text}</span>
        </label>
      ))}

      <br />

      <button
        disabled={answers[current.id] == null}
        onClick={next}
      >
        {currentIndex + 1 === questions.length ? "Finalizar" : "Siguiente"}
      </button>
    </div>
  );


}


const wrapperStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 10,
  color: "white",
  maxWidth: 600,
  margin: "0 auto",
  background: "rgba(0,0,0,0.4)",
  padding: 20,
  borderRadius: 12,
};
