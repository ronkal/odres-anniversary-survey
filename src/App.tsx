import { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);

  const questions: { question: string; options: string[]; correct: string }[] =
    [
      {
        question: "¿Dónde comenzó Odres Nuevos?",
        options: [
          "Plaza Castilla, López de Vega con Lincoln",
          "Hogar de tía Dorcas",
          "Hogar de los Pastores Oller",
        ],
        correct: "Hogar de tía Dorcas",
      },
      {
        question: "¿Cuántas personas se bautizaron en el primer bautismo?",
        options: ["5", "9", "1"],
        correct: "9",
      },
      {
        question: "¿Cuál fue la primera familia en aceptar a Jesús?",
        options: [
          "Familia de Luis y Lucía",
          "Familia de tía Dorcas",
          "Familia de Jennifer y Julián",
        ],
        correct: "Familia de Luis y Lucía",
      },
      {
        question: "¿Cuántos años tiene el Pastor?",
        options: ["48", "50", "51"],
        correct: "50",
      },
      {
        question: "¿Cuál es el/la miembro más joven de Odres Nuevos RD?",
        options: ["Galia", "Jimena", "Harmonie"],
        correct: "Harmonie",
      },
      {
        question: "¿El año 2024 fue el año de ...?",
        options: [
          "Doble porción",
          "La Gracia",
          "La Gran Cosecha",
          "La Expansión",
        ],
        correct: "La Expansión",
      },
    ];

  useEffect(() => {
    if (submitted) {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
      if (storedUsers[name]) {
        setSubmitted(true);
      }
    }
  }, [submitted]);

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].question]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      checkAnswers();
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const checkAnswers = () => {
    let totalScore = 0;
    questions.forEach(({ question, correct }) => {
      if (answers[question] === correct) {
        totalScore++;
      }
    });
    setScore(totalScore);

    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
    storedUsers[name] = { answers, score: totalScore };
    localStorage.setItem("users", JSON.stringify(storedUsers));
  };

  return (
    <div className="min-w-full p-6">
      <h1 className="text-center text-2xl font-bold">
        <span className="text-amber-400">Odres Nuevos</span> Trivia
      </h1>
      {!submitted ? (
        <form onSubmit={handleNameSubmit} className="mt-4 text-center">
          <label>
            Nombre:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="ml-2 rounded border p-2"
              required
            />
          </label>
          <button
            type="submit"
            className="ml-2 rounded bg-blue-500 p-2 text-white"
          >
            Iniciar
          </button>
        </form>
      ) : showResults ? (
        <div className="mt-4 text-center">
          <h2 className="text-lg font-bold">Resultados</h2>
          {questions.map(({ question, correct }) => (
            <p key={question} className="mt-2">
              <strong>{question}</strong> <br />
              <span
                className={
                  answers[question] === correct
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                Tu respuesta: {answers[question]}
              </span>{" "}
              <br />
              <span className="text-blue-500">
                Respuesta correcta: {correct}
              </span>
            </p>
          ))}
          <p className="mt-4 text-lg font-bold">
            Puntuación: {score} / {questions.length}
          </p>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <h2 className="text-lg font-bold">
            {questions[currentQuestion].question}
          </h2>
          <ul className="mt-4">
            {questions[currentQuestion].options.map((option) => (
              <li key={option}>
                <label>
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    onChange={() => handleAnswer(option)}
                    checked={
                      answers[questions[currentQuestion].question] === option
                    }
                  />{" "}
                  {option}
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            {currentQuestion > 0 && (
              <button
                onClick={prevQuestion}
                className="mr-2 rounded bg-gray-500 p-2 text-white"
              >
                Anterior
              </button>
            )}
            <button
              onClick={nextQuestion}
              className="rounded bg-blue-500 p-2 text-white"
            >
              {currentQuestion < questions.length - 1
                ? "Siguiente"
                : "Verificar Respuestas"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
