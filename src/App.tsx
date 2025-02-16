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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(0);

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
    setCurrentUserIndex(0); // Reset carousel index when toggling
  };

  const filteredUsers = Object.entries(savedUsers).filter(([_, data]) =>
    data.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleNextUser = () => {
    if (currentUserIndex < filteredUsers.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    }
  };

  const handlePrevUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
    }
  };

  return (
    <div className="mx-auto mb-10 flex h-screen min-h-screen max-w-7xl flex-col p-6">
      <h1 className="text-center text-3xl font-bold text-purple-800">
        <span className="text-amber-400">Grupo de Estudio</span> Trivia
      </h1>

      {!submitted ? (
        <form onSubmit={handleNameSubmit} className="mt-8 space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-lg font-medium text-gray-700">Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-gray-300 p-3 text-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="rounded-lg bg-purple-600 py-3 text-lg font-semibold text-white transition-all hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              Iniciar
            </button>
            <button
              type="button"
              onClick={toggleSavedAnswers}
              className="rounded-lg bg-green-600 py-3 text-lg font-semibold text-white transition-all hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              {showSavedAnswers
                ? "Ocultar Respuestas Guardadas"
                : "Ver Respuestas Guardadas"}
            </button>
          </div>
        </form>
      ) : showResults ? (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-purple-800">Resultados</h2>
          <div className="space-y-4">
            {questions.map(({ question, correct }) => (
              <div key={question} className="rounded-lg bg-white p-4 shadow-md">
                <p className="text-lg font-semibold text-gray-800">
                  {question}
                </p>
                <p
                  className={`mt-2 text-lg ${
                    answers[question] === correct
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Tu respuesta: {answers[question]}
                </p>
                <p className="mt-2 text-lg text-blue-600">
                  Respuesta correcta: {correct}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xl font-bold text-purple-800">
            Puntuación: {score} / {questions.length}
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-2xl font-bold text-purple-800">
              {questions[currentQuestion].question}
            </h2>
            <div className="mt-4 space-y-4">
              {questions[currentQuestion].options.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 rounded-lg border border-gray-300 p-4 transition-all hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    onChange={() => handleAnswer(option)}
                    checked={
                      answers[questions[currentQuestion].question] === option
                    }
                    className="h-5 w-5 accent-purple-600"
                  />
                  <span className="text-lg text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            {currentQuestion > 0 && (
              <button
                onClick={prevQuestion}
                className="rounded-lg bg-gray-600 px-6 py-3 text-lg font-semibold text-white transition-all hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              >
                Anterior
              </button>
            )}
            <button
              onClick={nextQuestion}
              className="rounded-lg bg-purple-600 px-6 py-3 text-lg font-semibold text-white transition-all hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              {currentQuestion < questions.length - 1
                ? "Siguiente"
                : "Verificar Respuestas"}
            </button>
          </div>
        </div>
      )}

      {showSavedAnswers && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-purple-800">
            Respuestas Guardadas
          </h2>
          <div className="flex flex-col items-center space-y-4">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            {filteredUsers.length > 0 ? (
              <div className="w-full rounded-lg bg-white p-6 shadow-md">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-purple-800">
                    {filteredUsers[currentUserIndex][1].name}
                  </h3>
                  {questions.map(({ question, correct }) => (
                    <div key={question}>
                      <p className="text-lg font-semibold text-gray-800">
                        {question}
                      </p>
                      <p
                        className={`text-lg ${
                          filteredUsers[currentUserIndex][1].answers[
                            question
                          ] === correct
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Respuesta:{" "}
                        {filteredUsers[currentUserIndex][1].answers[question] ||
                          "-"}
                      </p>
                    </div>
                  ))}
                  <p className="text-lg font-bold text-purple-800">
                    Puntuación: {filteredUsers[currentUserIndex][1].score} /{" "}
                    {questions.length}
                  </p>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={handlePrevUser}
                    disabled={currentUserIndex === 0}
                    className={`rounded-lg px-6 py-3 text-lg font-semibold text-white transition-all focus:ring-2 focus:outline-none ${
                      currentUserIndex === 0
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
                    }`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleNextUser}
                    disabled={currentUserIndex === filteredUsers.length - 1}
                    className={`rounded-lg px-6 py-3 text-lg font-semibold text-white transition-all focus:ring-2 focus:outline-none ${
                      currentUserIndex === filteredUsers.length - 1
                        ? "cursor-not-allowed bg-purple-400"
                        : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-lg text-gray-800">
                No se encontraron resultados.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
