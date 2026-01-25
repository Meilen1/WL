import { useEffect, useState } from "react";
import type { Question } from "../types/Question";

const API_URL = "https://sydney-houston-resident-choosing.trycloudflare.com";

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
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar preguntas");
        return res.json();
      })
      .then((rows) => {
        const map = new Map<number, Question>();

        rows.forEach((r: any) => {
          if (!map.has(r.question_id)) {
            map.set(r.question_id, {
              id: r.question_id,
              text: r.question_text,
              options: [],
            });
          }

          map.get(r.question_id)!.options.push({
            id: r.answer_id,
            text: r.answer_text,
          });
        });

        setQuestions(Array.from(map.values()));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("No se pudieron cargar las preguntas");
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
    await fetch(`${API_URL}/api/resultados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        answers,
      }),
    });

    setSent(true);
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
