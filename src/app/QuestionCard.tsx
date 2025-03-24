import React, { useState } from "react";
import { Question } from "../api/quizApi";
import { Button } from "../shared/components/ui/button";

/**
 * Props for the QuestionCard component.
 */
interface QuestionCardProps {
  /**
   * The quiz question data, including the image, correct answer, and options.
   */
  question: Question;
  /**
   * Callback function to handle the user's answer selection.
   * @param option - The answer option selected by the user.
   */
  onAnswer: (option: string) => void;
}

/**
 * QuestionCard component displays a single quiz question.
 * It renders the character image and only renders the answer options after the image is fully loaded.
 *
 * @param question - The quiz question data.
 * @param onAnswer - Function to call when an answer is selected.
 * @returns A React element displaying the quiz question.
 */
const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  // State to track whether the character image has loaded.
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="question-card">
      {/* Render the character image. When loaded, update the state. */}
      <img
        src={question.image}
        alt="Rick and Morty character"
        className="character-image"
        onLoad={() => setImageLoaded(true)}
      />
      {/* Optionally display a loading message until the image loads */}
      {!imageLoaded && <p>Loading image...</p>}

      {/* Only render the options after the image has fully loaded */}
      {imageLoaded && (
        <div className="options">
          {question.options.map((option, idx) => (
            <Button key={idx} onClick={() => onAnswer(option)}>
              {option}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
