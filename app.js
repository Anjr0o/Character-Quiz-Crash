const STORE = {
  questions: [
    {
      question: "Shoots lightning and stays with his trainer?",
      answers: ["Chocobo", "Minotaur", "Pikachu", "Ravio"],
      correctAnswer: "Pikachu",
    },
    {
      question: "Who is always trying to strike it big?",
      answers: ["Gene Starwind", "Wario", "Spike Spiegel", "All of the above"],
      correctAnswer: "All of the above",
    },
    {
      question: "Who needs to find the treasure at the Grand Line?",
      answers: [
        "The Straw Hat Crew",
        "The Akatsuki",
        "The Soul Society",
        "Organization XIII",
      ],
      correctAnswer: "The Straw Hat Crew",
    },
    {
      question: "Who is the legendary hero clad in green?",
      answers: ["Luigi", "Link", "Lance", "Lorelei"],
      correctAnswer: "Link",
    },
    {
      question: "Who bends all the elements to their will?",
      answers: [
        "The Sannin",
        "The Z Fighters",
        "The Voltron Paladins",
        "The Avatars",
      ],
      correctAnswer: "The Aavtars",
    },
  ],
  quizStarted: false,
  questionNumber: 0,
  submittingAnswer: false,
  score: 0,
  currentQuestionState: {
    answerArray: [],
  },
};

function generateWelcomeScreen() {
  return `
  <div class="welcome">
    <form>
      <p>
        How do you do? Are you ready to take on this Character Quiz?
      </p>

      <button type="submit" id="beginQuiz" autofocus>Begin Quiz</button>
    </form>
  </div>
    `;
}

function generateQuizInterface(questionObject) {
  // 3. Added in button with class="submit-answer"
  return `
  <div class="quiz-interface">
    <p>Question ${questionObject.index} / ${STORE.questions.length}
    </p>
    <p>
      ${questionObject.question.question}
    </p>
    <form>
      <ul>
        ${generateAnswerArray(questionObject.question.answers)}
      </ul>
      <button type="submit" class="submit-answer" autofocus>Submit Answer</button>
    </form>
  </div>`;
}
// 1. Added in answers as parameter
function generateAnswerArray(answers) {
  let answerArray = [];
  let indexArray = [];
  answers.forEach((answer) => {
    answerArray.push(answer);
    indexArray.push(answers.indexOf(answer));
  });
  return answerArray.map((answer) => stringifyQuizAnswers(answer)).join("");
}
// 2. Added answer as parameter
function stringifyQuizAnswers(answer) {
  let questionNumber = STORE.questionNumber;
  let name = STORE.questions[questionNumber].answers.indexOf(answer);
  return `
  <li>
    <div class="answer-container">
    <input type="radio" name="answer" id="answer-${name}" data-answer="${answer}">
    <label for="answer-${name}"> ${answer}</label>
    </div>
  </li>
  `;
}

function generateAnswerResults() {
  let answerArray = STORE.currentQuestionState.answerArray;
  const buttons = {
    next:
      ' <button type="submit" class="next-question" autofocus>Next Question</button>',
    results:
      '<button type="submit" class="see-results" autofocus>See Results</button>',
  };

  let correctResponse = `Good job! "${answerArray[1]}" is right.`;
  let incorrectResponse = `Yikes, ${answerArray[2]} is wrong. ${answerArray[1]} is the correct answer.`;
  // 8. Changed store.questions.length to STORE.questions.length
  let isFinalQuestion = STORE.questionNumber + 1 === STORE.questions.length;

  // 9. Changed store.score to STORE.score
  // 10. Changed isLastQuestion to isFinalQuestion
  return `
    <div class="answer-response">
    <form>
    <p>${answerArray[0] === true ? correctResponse : incorrectResponse}</p>
    <p> Score: ${STORE.score}</p>
    ${isFinalQuestion ? buttons.results : buttons.next}
    </form>
    </div>
    `;
}

function generateQuizResults() {
  return `
    <div class='quiz-results'>
      <p>
       You're finished!
         </p>
          <p>You scored ${STORE.score} out of ${STORE.questions.length * 10}</p>
        <button class="restart-quiz">Restart Quiz</button>
    </div>`;
}

function renderQuiz() {
  if (STORE.quizStarted === false) {
    if (STORE.questionNumber === STORE.questions.length) {
      $("main").html(generateQuizResults());
    } else {
      $("main").html(generateWelcomeScreen());
    }
  } else if (STORE.quizStarted === true) {
    if (STORE.submittingAnswer === false) {
      $("main").html(generateQuizInterface(currentQuestion()));
      // 7. Changed subnittingANswer to submittingAnswer
    } else if (STORE.submittingAnswer === true) {
      $("main").html(generateAnswerResults());
    }
  }
}

function startQuiz() {
  STORE.quizStarted = true;
}

function restartQuiz() {
  STORE.quizStarted = false;
  STORE.questionNumber = 0;
  STORE.submittingAnswer = false;
  STORE.currentQuestionState.answerArray = [];
}

function seeResults() {
  STORE.quizStarted = false;
  STORE.questionNumber++;
}

function currentQuestion() {
  let index = STORE.questionNumber;
  let questionObject = STORE.questions[index];
  return {
    index: index + 1,
    question: questionObject,
  };
}

function nextQuestion() {
  // 11. Changed questionNUmber to questionNumber
  if (STORE.questionNumber < STORE.questions.length) {
    STORE.questionNumber++;
    STORE.submittingAnswer = false;
  } else if (STORE.questionNumber === STORE.questions.length) {
    STORE.quizStarted = false;
  }
}

function validateAnswers() {
  let radios = $('input:radio[name="answer"]');
  // 4. Removed ":" in input:[name="answer"]
  let selectedAnswer = $('input[name="answer"]:checked').data("answer");
  let questionNumber = STORE.questionNumber;
  // 5. Replaced store.questions with STORE.questions
  let correctAnswer = STORE.questions[questionNumber].correctAnswer;

  if (radios.filter(":checked").length === 0) {
    alert("Aht aht, pick an answer please.");
    return;
  } else {
    STORE.submittingAnswer = true;
    // 6. Changed "correctANswer = slectedAnswer" to "correctAnswer === selectedAnswer"
    if (selectedAnswer === correctAnswer) {
      STORE.score += 10;
      STORE.currentQuestionState.answerArray = [
        true,
        correctAnswer,
        selectedAnswer,
      ];
    } else {
      STORE.currentQuestionState.answerArray = [
        false,
        correctAnswer,
        selectedAnswer,
      ];
    }
  }
}

function handleBeginQuizSubmit() {
  $("main").on("click", "#beginQuiz", (event) => {
    event.preventDefault();
    startQuiz();
    renderQuiz();
  });
}

function handleSubmitAnswer() {
  $("main").on("click", ".submit-answer", (event) => {
    event.preventDefault();
    console.log("submitting answer");
    validateAnswers();
    renderQuiz();
  });
}

function handleNextQuestionSubmit() {
  $("main").on("click", ".next-question", (event) => {
    event.preventDefault();
    nextQuestion();
    renderQuiz();
  });
}

function handleSeeResultsSubmit() {
  $("main").on("click", ".see-results", (event) => {
    event.preventDefault();
    seeResults();
    renderQuiz();
  });
}

function handleRestartQuizSubmit() {
  $("main").on("click", ".restart-quiz", (event) => {
    event.preventDefault();
    restartQuiz();
    renderQuiz();
  });
}

function handleQuiz() {
  renderQuiz();
  handleBeginQuizSubmit();
  handleSubmitAnswer();
  handleNextQuestionSubmit();
  handleSeeResultsSubmit();
  handleRestartQuizSubmit();
}

$(handleQuiz);
