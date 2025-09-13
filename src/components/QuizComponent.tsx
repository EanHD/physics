import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { Quiz } from '../lib/models/types'

interface QuizComponentProps {
  quiz: Quiz
  onComplete: (score: number, answers: Record<string, string>) => void
  onClose?: () => void
  className?: string
}

export default function QuizComponent({ quiz, onComplete, onClose, className = '' }: QuizComponentProps) {
  const { isDark } = useTheme()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1
  const hasAnswered = answers[currentQuestion.id] !== undefined

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate score and show results
      const correctAnswers = quiz.questions.filter(q => 
        answers[q.id] === q.correct_answer
      ).length
      const finalScore = correctAnswers / quiz.questions.length
      setScore(finalScore)
      setShowResults(true)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleFinish = () => {
    onComplete(score, answers)
  }

  const getAnswerStyle = (isSelected: boolean) => {
    const baseStyle = `w-full p-4 text-left rounded-lg border transition-all duration-200 ${
      isDark
        ? 'border-gray-600 hover:border-gray-500'
        : 'border-gray-300 hover:border-gray-400'
    }`

    if (isSelected) {
      return `${baseStyle} ${
        isDark
          ? 'bg-blue-900 border-blue-600 text-blue-100'
          : 'bg-blue-50 border-blue-500 text-blue-900'
      }`
    }

    return `${baseStyle} ${
      isDark
        ? 'bg-gray-800 hover:bg-gray-750'
        : 'bg-white hover:bg-gray-50'
    }`
  }

  if (showResults) {
    return (
      <div className={`${className}`}>
        <div className={`rounded-lg border p-6 ${
          isDark
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-300 bg-white'
        }`}>
          
          {/* Results Header */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">
              {score >= 0.8 ? '🎉' : score >= 0.6 ? '👏' : '📚'}
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <div className="text-3xl font-bold mb-2">
              {Math.round(score * 100)}%
            </div>
            <p className={`${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              You got {quiz.questions.filter(q => answers[q.id] === q.correct_answer).length} out of {quiz.questions.length} questions correct
            </p>
          </div>

          {/* Score interpretation */}
          <div className={`p-4 rounded-lg mb-6 ${
            score >= 0.8
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : score >= 0.6
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            <p className="font-medium">
              {score >= 0.8 ? 'Excellent work!' : score >= 0.6 ? 'Good job!' : 'Keep studying!'}
            </p>
            <p className="text-sm mt-1">
              {score >= 0.8 
                ? 'You have a strong understanding of this material.'
                : score >= 0.6
                  ? 'You understand most concepts but could review a few areas.'
                  : 'Consider reviewing the material before moving on.'
              }
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center space-x-3">
            <button
              onClick={handleFinish}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Continue
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className={`rounded-lg border p-6 ${
        isDark
          ? 'border-gray-700 bg-gray-800'
          : 'border-gray-300 bg-white'
      }`}>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}%</span>
          </div>
          <div className={`w-full bg-gray-200 rounded-full h-2 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentQuestion.question}
          </h2>

          {/* Answer options */}
          <div className="space-y-3">
            {currentQuestion.type === 'multiple_choice' && currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={getAnswerStyle(answers[currentQuestion.id] === option)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion.id] === option
                      ? 'border-blue-500 bg-blue-500'
                      : isDark ? 'border-gray-400' : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion.id] === option && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}

            {currentQuestion.type === 'true_false' && (
              <>
                <button
                  onClick={() => handleAnswer('true')}
                  className={getAnswerStyle(answers[currentQuestion.id] === 'true')}
                >
                  ✅ True
                </button>
                <button
                  onClick={() => handleAnswer('false')}
                  className={getAnswerStyle(answers[currentQuestion.id] === 'false')}
                >
                  ❌ False
                </button>
              </>
            )}

            {currentQuestion.type === 'short_answer' && (
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className={`w-full p-4 border rounded-lg resize-none ${
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                rows={4}
              />
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentQuestionIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : isDark
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
            }`}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnswered}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !hasAnswered
                ? 'opacity-50 cursor-not-allowed'
                : isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next'}
          </button>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className={`mt-4 w-full py-2 text-sm rounded-lg transition-colors ${
              isDark
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Exit Quiz
          </button>
        )}
      </div>
    </div>
  )
}