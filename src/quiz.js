import React, { useState, useEffect } from 'react';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); 
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [responses, setResponses] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false); // flag for the quiz end

  useEffect(() => {
    // Fetch and set questions from the JSON file
    fetch('/questions.json')
      .then((response) => response.json())
      .then((data) => setQuestions(data.questions))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (currentQuestionIndex < questions.length && timeLeft > 0 && !quizEnded) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000); // 1 second interval

      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, questions, timeLeft, quizEnded]);

  const handleAnswerClick = (selectedOption) => {
    if (!questionAnswered) {
      // Check if the selected option is correct
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = selectedOption === currentQuestion.correctOption;

      // Update the responses array
      setResponses([...responses, { question: currentQuestion, selectedOption, isCorrect }]);

      // Update the score
      if (isCorrect) {
        setScore(score + 1);
      }

      // Mark the question as answered
      setQuestionAnswered(true);

      // Check if it's the last question to end the quiz
      if (currentQuestionIndex === questions.length - 1) {
        setQuizEnded(true);
      } else {
        // Move to the next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(20); // Reset the timer for the next question
        setQuestionAnswered(false); // Reset questionAnswered for the next question
      }
    }
  };

  if (questions.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  if (quizEnded || timeLeft <= 0) {
    const percentage = (score / questions.length) * 100;
    let feedback = 'Quiz is finished';

    if (percentage >= 80) {
      feedback = 'Congratulations! You did great!';
    } else if (percentage >= 60) {
      feedback = 'Good job, but there\'s room for improvement.';
    } else {
      feedback = 'You might want to study more cause you suck.';
    }

    return (
      <div className="bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-4">Test Ended</h1>
        <p>Your Score: {score} / {questions.length}</p>
        <p>Percentage: {percentage.toFixed(2)}%</p>
        <p>{feedback}</p>
        {/* Display Responses */}
        <div className="mt-4">
          <h2 className="text-xl mb-2">Responses:</h2>
          <ul>
            {responses.map((response, index) => (
              <li key={index} className="mb-2">
                Question {index + 1}: {response.isCorrect ? 'Correct' : 'Incorrect'}
                <br />
                Your Answer: {response.selectedOption}
                <br />
                Correct Answer: {response.question.correctOption}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-red-950 text-black p-4 ">
      <h2 className="text-xl text-white mb-2">Question {currentQuestionIndex + 1}</h2>
      <p className="mb-4 text-white">{currentQuestion.questionText}</p>
      <ul>
        {currentQuestion.options.map((option, index) => (
          <li
            key={index}
            className={`cursor-pointer bg-white rounded p-2 mb-2 hover:bg-red-900 ${
              questionAnswered ? 'pointer-events-none' : ''
            }`}
            onClick={() => handleAnswerClick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
      <div className="mt-4 text-white ">
        <p>Time Left: {timeLeft} seconds</p>
      </div>
    </div>
  );
}

export default Quiz;
