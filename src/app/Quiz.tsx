import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import QuestionCard from "./QuestionCard";
import { fetchTotalCount, generateQuestions, Question } from "../api/quizApi";
import { ModeToggle } from "../shared/components/theme/mode-toggle";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "../shared/components";
import { RotateCw } from "lucide-react";

/**
 * Quiz component for the Rick and Morty Quiz application.
 * Manages quiz state, fetches questions, tracks score, and handles user interactions.
 */
const Quiz: React.FC = () => {
  // State to track the index of the current question.
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // State to track the user's score.
  const [score, setScore] = useState<number>(0);
  // State used as a key to re-fetch new questions when the quiz is restarted.
  const [quizKey, setQuizKey] = useState<number>(0);

  // Query to fetch the total number of characters from the Rick and Morty API.
  const {
    data: totalCount,
    isLoading: isLoadingTotal,
    error: totalError,
  } = useQuery<number, Error>({
    queryKey: ["totalCount"],
    queryFn: fetchTotalCount,
  });

  // Query to generate quiz questions once the total character count is available.
  const {
    data: questions,
    isLoading: isLoadingQuestions,
    error: questionsError,
    refetch,
  } = useQuery<Question[], Error>({
    queryKey: ["quiz", quizKey],
    queryFn: () => generateQuestions(totalCount!),
    enabled: !!totalCount,
  });

  /**
   * Handles the user's answer selection.
   * Increments the score if the answer is correct, then advances to the next question.
   * @param selectedOption - The option selected by the user.
   */
  const handleAnswer = (selectedOption: string) => {
    if (!questions) return;
    // Check if the selected option matches the correct answer.
    if (selectedOption === questions[currentQuestionIndex].correctName) {
      setScore((prev) => prev + 1);
    }
    // Move on to the next question.
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  /**
   * Resets the quiz state and triggers a re-fetch of new questions.
   */
  const handlePlayAgain = () => {
    setQuizKey((prev) => prev + 1); // Change key to trigger new questions.
    setCurrentQuestionIndex(0); // Reset question index.
    setScore(0); // Reset score.
    refetch(); // Re-fetch questions.
  };

  // Render a loading message if either query is still in progress.
  if (isLoadingTotal || isLoadingQuestions) {
    return (
      <div>
        <h2>Loading quiz...</h2>
      </div>
    );
  }

  // Display an error message if fetching the total count fails.
  if (totalError) {
    return (
      <div>
        <h2>Error: {totalError.message}</h2>
      </div>
    );
  }

  // Display an error message if fetching the questions fails.
  if (questionsError) {
    return (
      <div>
        <h2>Error: {questionsError.message}</h2>
      </div>
    );
  }

  // If all questions have been answered, display the quiz completion screen.
  if (questions && currentQuestionIndex >= questions.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2>Quiz Completed!</h2>
          <p>
            Your score: {score} / {questions.length}
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={handlePlayAgain} style={{ cursor: "pointer" }}>
              <RotateCw />
              Play Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render the active quiz question along with score and progress information.
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="flex justify-center">
            <h2>Rick and Morty Quiz</h2>
          </CardTitle>
          <CardDescription className="flex justify-between m-[10px]">
            <p>Score: {score}</p>
            <ModeToggle />
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="flex justify-center p-4">
          {questions && (
            <QuestionCard
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
            />
          )}
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-center">
          <p>
            Question {currentQuestionIndex + 1} of {questions?.length}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Quiz;
