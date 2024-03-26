document.addEventListener('DOMContentLoaded', () => {
    fetch('sportquiz.json')
        .then(response => response.json())
        .then(data => {
            console.log('Questions loaded:', data.quizData);
            startQuiz(data.quizData);
        })
        .catch(error => console.error("Error loading quiz:", error));
});

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let userAnswers = [];

function startQuiz(questions) {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    const timerElement = document.getElementById('timer');

    function updateScoreAndProgress() {
        document.getElementById('score').textContent = `Score : ${score} sur ${questions.length}`;
        document.getElementById('progress').textContent = `Question ${currentQuestionIndex + 1} sur ${questions.length}`;
    }

    function showQuestion(question) {
        clearInterval(timerInterval);
        startTimer();

        questionElement.textContent = question.question;
        optionsElement.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.onclick = () => selectOption(index, questions);
            optionsElement.appendChild(button);
        });

        updateScoreAndProgress();
    }

    function startTimer() {
        let time = 30; // Timer duration for each question in seconds
        timerElement.textContent = `Temps : ${time}`;
        timerInterval = setInterval(() => {
            time--;
            timerElement.textContent = `Temps : ${time}`;
            if (time <= 0) {
                clearInterval(timerInterval);
                moveToNextQuestion();
            }
        }, 1000);
    }

    function selectOption(selectedIndex, questions) {
        clearInterval(timerInterval); // Stop the timer when an answer is selected.
        
        const selectedAnswer = questions[currentQuestionIndex].answers[selectedIndex];
        const correctAnswer = questions[currentQuestionIndex].correctAnswer;
        const isCorrect = selectedAnswer === correctAnswer;
    
        // Store whether the answer was correct or not
        userAnswers[currentQuestionIndex] = isCorrect;
    
        // Display immediate feedback
        const feedbackElement = document.getElementById('feedback');
        if (isCorrect) {
            feedbackElement.textContent = "Correct!";
            feedbackElement.style.color = "green";
        } else {
            feedbackElement.textContent = "Incorrect!";
            feedbackElement.style.color = "red";
        }
    
        // Update the score based on the answers
        updateScore(questions);
    
        // Wait a bit before moving to the next question to allow the user to see the feedback
        setTimeout(moveToNextQuestion, 1000); // Adjust the delay as needed
    }
    
    
    
    

    function updateScore(questions) {
        score = userAnswers.filter(Boolean).length; // Assuming userAnswers is an array of boolean values
        // Update the DOM with the new score
        document.getElementById('score').textContent = `Score: ${score} out of ${questions.length}`;
    }
    
    function updateScoreAndProgress() {
        document.getElementById('score').textContent = `Score: ${score} sur ${questions.length}`;
        // Update any other elements like progress here
    }
    

    function moveToNextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(questions[currentQuestionIndex]);
        } else {
            // Handle the end of the quiz here (e.g., hide quiz, show results)
            displayCompletionMessage();
        }
        // Optionally, clear the feedback message
        const feedbackElement = document.getElementById('feedback');
        feedbackElement.textContent = '';
    }
    

    function moveToPrevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(questions[currentQuestionIndex]);
        }
    }
    function displayCompletionMessage() {
        // Logic to display completion message and final score
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = `<div>Your final score is ${score} out of ${questions.length}.</div>`;
        // Add any additional completion message or actions here
    }

    nextButton.addEventListener('click', moveToNextQuestion);
    prevButton.addEventListener('click', moveToPrevQuestion);

    showQuestion(questions[currentQuestionIndex]);
}
