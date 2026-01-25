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

  // 🔹 Traer preguntas
  useEffect(() => {
    fetch(`${API_URL}/api/preguntas`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando preguntas...</p>;
  if (!questions.length) return <p>No hay preguntas.</p>;

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        answers,
      }),
    });

    setSent(true);
  };

  // 🔚 Pantalla final
  if (finished) {
    if (sent) {
      return <h2>Gracias por participar 🎉</h2>;
    }

    return (
      <div>
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
      </div>
    );
  }

  // 🧠 Pregunta actual
  return (
    <div>
      <h3>
        Pregunta {currentIndex + 1} / {questions.length}
      </h3>

      <p>{current.text}</p>

      {current.options.map(opt => (
        <label key={opt.id} style={{ display: "block" }}>
          <input
            type="radio"
            name={`question-${current.id}`}
            checked={answers[current.id] === opt.id}
            onChange={() => selectAnswer(opt.id)}
          />
          {opt.text}
        </label>
      ))}

      <br />

      <button
        disabled={answers[current.id] == null}
        onClick={next}
      >
        {currentIndex + 1 === questions.length
          ? "Finalizar"
          : "Siguiente"}
      </button>
    </div>
  );
}
