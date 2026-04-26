import { useState, useEffect, useRef } from "react";
import type { Riddle } from "../data/riddles";

// ── Typewriter hook ──────────────────────────
function useTypewriter(text: string, active: boolean, speed = 28) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active) { setDisplayed(""); return; }
    setDisplayed("");
    indexRef.current = 0;
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, active]);

  return displayed;
}


function RiddleButton({
  riddle,
  index,
  openIndex,
  setOpenIndex,
}: {
  riddle: Riddle;
  index: number;
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
}) {
  const isOpen = openIndex === index;
  const text = useTypewriter(riddle.text, isOpen);

  return (
    <div className="riddle-item">
      <button
        className="riddle-btn"
        onClick={() => setOpenIndex(isOpen ? null : index)}
      >
        {riddle.buttonLabel}
      </button>
      {isOpen && <p className="riddle-text">{text}</p>}
    </div>
  );
}


interface Props {
  riddles: Riddle[];
}

export default function RiddleSection({ riddles }: Props) {
  const [unlockedCount, setUnlockedCount] = useState(1);
  const [openIndex, setOpenIndex]         = useState<number | null>(null);
  const [input, setInput]                 = useState("");
  const [error, setError]                 = useState(false);

  const allDone       = unlockedCount > riddles.length;
  const currentRiddle = riddles[unlockedCount - 1];

const handleSubmit = async () => {
  if (!currentRiddle) return;
  const h = new TextEncoder().encode(input.trim().toLowerCase());
  const buf = await crypto.subtle.digest("SHA-256", h);
  const hash = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (hash === currentRiddle.password) {
    setUnlockedCount((n) => n + 1);
    setInput("");
    setError(false);
  } else {
    setError(true);
    setTimeout(() => setError(false), 1500);
  }
};

  return (
    <div className="riddle-section">
      <div className="riddle-list">
        {riddles.slice(0, unlockedCount).map((riddle, i) => (
          <RiddleButton
            key={i}
            riddle={riddle}
            index={i}
            openIndex={openIndex}
            setOpenIndex={setOpenIndex}
          />
        ))}
      </div>

      {!allDone && (
        <div className="password-area">
          <div className={`password-box${error ? " shake" : ""}`}>
            <input
              type="text"
              className="password-input"
              placeholder="02/05/26 22:00hs"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoComplete="off"
              spellCheck={false}
              disabled
            />
            <button className="password-submit" onClick={handleSubmit}>→</button>
          </div>
          {error && <p className="password-error">esperame..</p>}
        </div>
      )}

      {allDone && <p className="password-done">Has encontrado todo 🌌</p>}
    </div>
  );
}