import { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showSavedAnswers, setShowSavedAnswers] = useState<boolean>(false);
  const [savedUsers, setSavedUsers] = useState<
    Record<
      string,
      { name: string; answers: Record<string, string>; score: number }
    >
  >({});

  const questions: { question: string; options: string[]; correct: string }[] =
    [
      {
        question: "¿Dónde comenzó el grupo?",
        options: [
          "Plaza Castilla, López de Vega con Lincoln",
          "Hogar de la tía Juanita",
          "Hogar de los Pastores Pérez",
        ],
        correct: "Hogar de la tía Juanita",
      },
      {
        question: "¿Cuántas personas se bautizaron en el primer bautismo?",
        options: ["5", "9", "1"],
        correct: "9",
      },
      {
        question: "¿Cuál fue la primera familia en aceptar el mensaje?",
        options: [
          "Familia de Juan y María",
          "Familia de la tía Juanita",
          "Familia de Roberto y Laura",
        ],
        correct: "Familia de Juan y María",
      },
      {
        question: "¿Cuántos años tiene el líder?",
        options: ["48", "50", "51"],
        correct: "50",
      },
      {
        question: "¿Cuál es el/la miembro más joven del grupo?",
        options: ["Ana", "Carla", "Sofía"],
        correct: "Sofía",
      },
      {
        question: "¿El año 2024 fue el año de ...?",
        options: [
          "Doble bendición",
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
      const user = Object.values(storedUsers).find((u: any) => u.name === name);
      if (user) {
        setSubmitted(true);
      }
    }
  }, [submitted]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
    setSavedUsers(storedUsers);
  }, []);

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSavedAnswers(false);
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
    const userIdCounter = parseInt(
      localStorage.getItem("userIdCounter") || "0",
    );
    const newUserId = userIdCounter + 1;

    storedUsers[newUserId] = { name, answers, score: totalScore };
    localStorage.setItem("users", JSON.stringify(storedUsers));
    localStorage.setItem("userIdCounter", newUserId.toString());
    setSavedUsers(storedUsers);
  };

  const toggleSavedAnswers = () => {
    setShowSavedAnswers(!showSavedAnswers);
  };

  return (
    <div className="min-w-full p-6">
      <h1 className="text-center text-2xl font-bold">
        <span className="text-amber-400">Grupo de Estudio</span> Trivia
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
          <button
            type="button"
            onClick={toggleSavedAnswers}
            className="ml-2 rounded bg-green-500 p-2 text-white"
          >
            {showSavedAnswers
              ? "Ocultar Respuestas Guardadas"
              : "Ver Respuestas Guardadas"}
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

      {showSavedAnswers && (
        <div className="mt-4 text-center">
          <h2 className="text-lg font-bold">Respuestas Guardadas</h2>
          <table className="mt-4 w-full border-collapse border border-gray-500">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-500 p-2">Nombre</th>
                {questions.map(({ question }) => (
                  <th key={question} className="border border-gray-500 p-2">
                    {question}
                  </th>
                ))}
                <th className="border border-gray-500 p-2">Puntuación</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(savedUsers).map(([userId, data]) => (
                <tr key={userId} className="bg-white">
                  <td className="border border-gray-500 p-2">{data.name}</td>
                  {questions.map(({ question, correct }) => (
                    <td key={question} className="border border-gray-500 p-2">
                      <span
                        className={
                          data.answers[question] === correct
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {data.answers[question] || "-"}
                      </span>
                    </td>
                  ))}
                  <td className="border border-gray-500 p-2">
                    {data.score} / {questions.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
