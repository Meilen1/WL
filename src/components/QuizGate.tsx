import { useState, useEffect } from "react";
import Quiz from "./Quiz";

export default function QuizGate() {
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const btn = document.getElementById("startTyping");
    if (!btn) return;

    const handler = () => setShowQuiz(true);
    btn.addEventListener("click", handler);

    return () => btn.removeEventListener("click", handler);
  }, []);

  if (!showQuiz) return null;

  return <Quiz />;
}
