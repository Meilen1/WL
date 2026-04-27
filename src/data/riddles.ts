export interface Riddle {
  buttonLabel: string;
  text: string;
  password: string;
  placeholder?: string;
  background?: string;
}

export const RIDDLES: Riddle[] = [
  {
    buttonLabel: "dueña de mis pensamientos..",
    text: `22:40hs
    Entra a su turno como todas las noches. 
    La veo pasar para la armería, ya con su uniforme; agarra sus cosas.. 
    Se me pone la mente en blanco cuando la veo, me paraliza. Ojala pudiese verme como soy.
    Me preocupa esto que estoy sintiendo, pero me siento tan bien cuando me da un poco de su tiempo.
    Estuvimos hablando antes de que entre a su turno; cancela sus salidas para estar conmigo
    Sabe que exploto de emocion cuando dice mi nombre asi?`,
    password: "6856daebb0115b3b8c7403d42488f61b2a0c4e270b6821f0a3ee255a8dec48d6",
    placeholder:"Heroe tragico _ _ _ _",
  },
  {
    buttonLabel: "No me sueltes",
    text: `Tengo mucho miedo. ¿Sentís el viento tan fuerte como yo? No puedo verte bien porque la noche está muy oscura. ¿Vos podés verme? ¿Te alcanza la luz de la luna?

Sé que me voy a caer en cualquier momento. Está muy alto. Y aunque me digas que todo va a estar bien, no se siente así desde donde estoy. Quisiera solo creerte, como todas las demás veces en las que simplemente confié en vos.

Se me acaba el tiempo. Tus dedos están cediendo cada vez más. Esas manos que me protegían tanto, esa voz que calmaba mi ansiedad, se despiden de mí diciendo mi nombre tan suavemente. No quiero dejar de escucharla.

Por más que piense, no sé cuál es la respuesta. Se siente como si tuviese que decir una palabra clave, pero no la encuentro. Antes tus ojos me decían las respuestas… ¿por qué ya no puedo verlas?

Solté todo lo que traía conmigo para no pesarte tanto. Arranqué mi propio corazón y lo lancé al vacío para que ya no se sintieran los latidos tan fuertes cuando estaba cerca tuyo.

Ya no hay tiempo.

Como último acto de amor, voy a creerte de nuevo, aunque todo esté tan oscuro allá abajo y mis pies sientan el frío profundo de esa oscuridad. Cuando llegue al fondo, voy a recordar el frío de tus manos y cómo tu voz jamás dejó de sonar cálida al decir mi nombre.

Ahora mis ojos están negros; se tiñeron hasta lo más blanco. Mi memoria desaparece tan fácilmente con todo lo demás, pero permanecen cada mañana en la que desperté y recordé tu nombre antes que el mío. Ojalá te hayan llegado, como a mí, todos los “buenos días”; no había día en que no me llegaran.

Quise amarte con intensidad. ¿Lo logré? Ojalá hayas podido sentir aunque sea una parte de todo lo lindo que me hiciste sentir.`,
    password: "a3597b17551a0ad22f82a8096b407cec9b8886fe2f5eb2bcbff96b6774ed8f56",
    placeholder:"_ _ _ _ _ _",
    background: "/images/no-me-sueltes.png",
  },
  // {
  //   buttonLabel: "...",
  //   text: `...`,
  //   password: "...",
  // },

];