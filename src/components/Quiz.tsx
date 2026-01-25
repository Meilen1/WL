import { useEffect, useState } from "react";
import type { Question } from "../types/Question";

const API_URL = "https://competitions-noon-disciplines-initiative.trycloudflare.com";

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  useEffect(() => {
    fetch(`${API_URL}/api/preguntas`)
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
  if (sent) return;

  try {
    await fetch(`${API_URL}/api/resultados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
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

            <input
              type="text"
              placeholder="Ingresá tu nombre"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <br /><br />

            <button disabled={!name} onClick={submitResults}>
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
