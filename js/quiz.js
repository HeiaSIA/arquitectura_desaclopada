const questions = [
  {
    prompt: "¿Qué permite principalmente desacoplar el frontend del backend?",
    answers: [
      "Que ambos compartan directamente las mismas tablas",
      "Que colaboren mediante un contrato como una API",
      "Que el frontend ejecute las reglas privadas del backend",
      "Que ambos deban desplegarse siempre juntos"
    ],
    correct: 1,
    explanation: "Una API define el contrato de comunicación. La interfaz y el backend pueden evolucionar por separado mientras respeten ese contrato."
  },
  {
    prompt: "¿Qué caracteriza a la comunicación basada en eventos?",
    answers: [
      "El emisor publica un hecho y otros componentes pueden reaccionar de forma asíncrona",
      "Todos los servicios consultan la misma base de datos",
      "Cada petición debe esperar una respuesta HTTP inmediata",
      "El consumidor modifica directamente la memoria del emisor"
    ],
    correct: 0,
    explanation: "Con eventos, el productor comunica que algo ocurrió sin tener que invocar directamente a cada consumidor. Esto reduce dependencias temporales, aunque la consistencia puede ser eventual."
  },
  {
    prompt: "Un servicio de pedidos recibe mucha más carga que los demás. ¿Qué ventaja de microservicios puede ayudar?",
    answers: [
      "Cambiar el esquema de todos los servicios",
      "Escalar únicamente las instancias del servicio de pedidos",
      "Desplegar todo el sistema en un único servidor",
      "Copiar los datos de los otros servicios en pedidos"
    ],
    correct: 1,
    explanation: "La escalabilidad independiente permite asignar más instancias o recursos al servicio con mayor demanda, sin escalar necesariamente los demás."
  },
  {
    prompt: "¿Qué describe mejor el patrón Database per Service?",
    answers: [
      "Una base compartida donde todos los servicios editan cualquier tabla",
      "Cada servicio es dueño de sus datos y los ofrece mediante su interfaz",
      "Cada servicio almacena una copia de todas las bases",
      "La base de datos sustituye la comunicación entre servicios"
    ],
    correct: 1,
    explanation: "Cada servicio controla su persistencia y protege sus detalles internos. Las consultas que cruzan límites se resuelven mediante APIs, eventos u otros patrones, no accediendo a tablas ajenas."
  },
  {
    prompt: "¿Cuál es un costo operativo habitual al pasar a microservicios?",
    answers: [
      "Desaparecen los fallos de red",
      "Todos los cambios deben publicarse juntos",
      "Hay que gestionar observabilidad y fallos parciales entre servicios",
      "La escalabilidad independiente deja de ser posible"
    ],
    correct: 2,
    explanation: "La red introduce latencia y fallos parciales. Métricas, registros, trazas, límites de tiempo y reintentos controlados ayudan a operar el sistema distribuido."
  }
];

const questionTitle = document.querySelector("#question-title");
const answerList = document.querySelector("#answer-list");
const feedback = document.querySelector("#quiz-feedback");
const nextButton = document.querySelector("#next-question");
const restartButton = document.querySelector("#restart-quiz");
const progressLabel = document.querySelector("#quiz-progress");
const progressBar = document.querySelector("#quiz-progress-bar");
const progressTrack = progressBar.closest(".progress");
const scoreLabel = document.querySelector("#quiz-score");
const quizContent = document.querySelector("#quiz-content");
const quizResult = document.querySelector("#quiz-result");
const resultTitle = document.querySelector("#result-title");
const resultCopy = document.querySelector("#result-copy");

let currentQuestion = 0;
let score = 0;
let answered = false;

function updateProgress() {
  progressLabel.textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
  progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(currentQuestion));
  scoreLabel.textContent = `Puntuación: ${score}`;
}

function renderQuestion() {
  const question = questions[currentQuestion];
  answered = false;
  feedback.hidden = true;
  feedback.textContent = "";
  feedback.className = "feedback mt-3";
  nextButton.hidden = true;
  questionTitle.textContent = question.prompt;
  answerList.replaceChildren();

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => selectAnswer(index));
    answerList.append(button);
  });

  updateProgress();
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const question = questions[currentQuestion];
  const isCorrect = selectedIndex === question.correct;
  if (isCorrect) score += 1;

  answerList.querySelectorAll(".answer-option").forEach((button, index) => {
    button.disabled = true;
    if (index === question.correct) button.classList.add("is-correct");
    if (index === selectedIndex && !isCorrect) button.classList.add("is-incorrect");
  });

  feedback.hidden = false;
  feedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");
  const feedbackTitle = document.createElement("strong");
  feedbackTitle.textContent = isCorrect ? "¡Correcto! " : "No exactamente. ";
  feedback.replaceChildren(feedbackTitle, document.createTextNode(question.explanation));
  nextButton.textContent = currentQuestion === questions.length - 1 ? "Ver resultado" : "Siguiente pregunta";
  nextButton.hidden = false;
  updateProgress();
}

function finishQuiz() {
  const percentage = Math.round((score / questions.length) * 100);
  const message = percentage === 100
    ? "Excelente dominio de los conceptos. ¡Todas tus respuestas son correctas!"
    : percentage >= 60
      ? "Buen trabajo. Repasa las explicaciones para afianzar los conceptos que faltaron."
      : "Vuelve a revisar los fundamentos y prueba otra vez: cada intento ayuda a aprender.";

  quizContent.hidden = true;
  quizResult.hidden = false;
  resultTitle.textContent = `Obtuviste ${score} de ${questions.length} (${percentage}%)`;
  resultCopy.textContent = message;
  progressLabel.textContent = "Cuestionario completado";
  progressBar.style.width = "100%";
  progressTrack.setAttribute("aria-valuenow", String(questions.length));
  scoreLabel.textContent = `Puntuación: ${score}`;
}

nextButton.addEventListener("click", () => {
  if (currentQuestion === questions.length - 1) {
    finishQuiz();
    return;
  }
  currentQuestion += 1;
  renderQuestion();
});

restartButton.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  quizResult.hidden = true;
  quizContent.hidden = false;
  renderQuestion();
});

renderQuestion();
