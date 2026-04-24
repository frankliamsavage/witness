'use client';

import { useState } from 'react';

interface JourneyToLightProps {
  onLightFound: (testimonial: string, scripture: string) => void;
  onClose: () => void;
}

export default function JourneyToLight({ onLightFound, onClose }: JourneyToLightProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    heartPosture: '',
    truthSeeking: '',
    scriptureVerse: '',
    personalTestimony: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const spiritualQuestions = [
    {
      step: 1,
      title: "🕊️ Heart Posture",
      question: "In the quiet of your heart, what draws you to seek deeper truth? Speak honestly of your spiritual hunger.",
      placeholder: "Share the longing in your heart for truth...",
      key: 'heartPosture'
    },
    {
      step: 2,
      title: "📖 Scripture Foundation", 
      question: "What verse or passage of Scripture has spoken most deeply to your soul? Share the words that have illuminated your path.",
      placeholder: "Enter the Scripture that has touched your heart...",
      key: 'scriptureVerse'
    },
    {
      step: 3,
      title: "💡 Seeking Truth",
      question: "How has the Lord been preparing your heart for deeper revelation? Describe your journey toward His light.",
      placeholder: "Describe your spiritual journey and growth...",
      key: 'truthSeeking'
    },
    {
      step: 4,
      title: "✨ Testimony of Faith",
      question: "In your own words, testify to how Christ has revealed Himself to you. Let your heart speak of His faithfulness.",
      placeholder: "Share your testimony of God's work in your life...",
      key: 'personalTestimony'
    }
  ];

  const currentQuestion = spiritualQuestions.find(q => q.step === currentStep);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Combine all responses into a testimony
    const fullTestimony = `
Heart Posture: ${answers.heartPosture}

Scripture Foundation: ${answers.scriptureVerse}

Truth Seeking: ${answers.truthSeeking}

Personal Testimony: ${answers.personalTestimony}
    `.trim();

    onLightFound(fullTestimony, answers.scriptureVerse);
  };

  const isCurrentStepComplete = () => {
    const currentKey = currentQuestion?.key;
    return currentKey ? answers[currentKey as keyof typeof answers].trim().length > 20 : false;
  };

  const allStepsComplete = () => {
    return Object.values(answers).every(answer => answer.trim().length > 20);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-purple-900 via-blue-900 to-purple-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-purple-600">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🕊️ Journey to the Light
              </h2>
              <p className="text-purple-200 mt-1">
                "Ask, and it will be given to you; seek, and you will find..." - Matthew 7:7
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-purple-300 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Progress */}
          <div className="mt-4 flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded ${
                  step <= currentStep ? 'bg-yellow-400' : 'bg-purple-700'
                } transition-colors`}
              />
            ))}
          </div>
          <p className="text-purple-200 text-sm mt-2">Step {currentStep} of 4</p>
        </div>

        {/* Question */}
        <div className="p-6">
          {currentQuestion && (
            <>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-yellow-300 mb-2">
                  {currentQuestion.title}
                </h3>
                <p className="text-purple-100 leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              <textarea
                value={answers[currentQuestion.key as keyof typeof answers]}
                onChange={(e) => setAnswers(prev => ({
                  ...prev,
                  [currentQuestion.key]: e.target.value
                }))}
                placeholder={currentQuestion.placeholder}
                className="w-full h-32 p-4 bg-purple-800 border border-purple-600 rounded-lg text-white placeholder-purple-300 resize-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                rows={6}
              />
              
              {answers[currentQuestion.key as keyof typeof answers].length > 0 && 
               answers[currentQuestion.key as keyof typeof answers].length < 20 && (
                <p className="text-yellow-300 text-sm mt-2">
                  Please share more from your heart (at least a few sentences)
                </p>
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-purple-600 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 bg-purple-700 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!isCurrentStepComplete()}
              className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allStepsComplete() || isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Seeking the Light...
                </>
              ) : (
                <>
                  ✨ Enter the Sanctuary
                </>
              )}
            </button>
          )}
        </div>

        {/* Scripture Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-purple-300 text-sm italic">
            "The light shines in the darkness, and the darkness has not overcome it." - John 1:5
          </p>
        </div>
      </div>
    </div>
  );
}