import { useEffect, useState } from "react";
import type { Question } from "../types/Question";

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/questions", {
      method: "POST",
    })
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions);
        setLoading(false);
      });
  }, []);

  const selectAnswer = (questionId: number, optionId: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const submit = () => {
    console.log("Respuestas:", answers);

    fetch("http://localhost:5000/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });
  };

  if (loading) return <p>Cargando preguntas...</p>;

  return (
    <div>
      {questions.map(q => (
        <div key={q.id} style={{ marginBottom: "1.5rem" }}>
          <h3>{q.text}</h3>

          {q.options.map(opt => (
            <label key={opt.id} style={{ display: "block" }}>
              <input
                type="radio"
                name={`question-${q.id}`}
                checked={answers[q.id] === opt.id}
                onChange={() => selectAnswer(q.id, opt.id)}
              />
              {opt.text}
            </label>
          ))}
        </div>
      ))}

      <button
        disabled={Object.keys(answers).length !== questions.length}
        onClick={submit}
      >
        Enviar respuestas
      </button>
    </div>
  );
}
