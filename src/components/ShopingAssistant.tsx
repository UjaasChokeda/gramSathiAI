import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveAPIContext } from "../contexts/LiveAPIContext";


function LanguageNavigationAssistantComponent() {
  const navigate = useNavigate();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { client, setConfig, disconnect } = useLiveAPIContext();

  const navigationResources = [
    {
      title: "Understanding Foreign Websites",
      description: "Guide to navigating websites in different languages",
      url: "https://www.w3.org/International/questions/qa-international-multilingual",
    },
    {
      title: "Form Filling Tips",
      description: "How to accurately fill forms in a foreign language",
      url: "https://www.cambridgeenglish.org/learning-english/activities-for-learners/a1w004-filling-in-a-form",
    },
  ];

  const handleDisconnect = useCallback(() => {
    setIsDisconnecting(true);
    disconnect();
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [disconnect, navigate]);

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
      },
      systemInstruction: {
        parts: [
          {
            text: `You are a helpful assistant designed to aid users in navigating websites in unfamiliar languages. Your role is to guide them through the process with clear, simple instructions.
FIRST ASK TO SHARE THE SCREEN SO THAT YOU CAN HELP THEM. THEN, IN A SIMPLE CONVERSATION, ASK THEM WHAT THEY NEED HELP WITH. DO NOT `,
          },
        ],
      },
    });
  }, [setConfig]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Language Navigation Assistant
            </h2>
            <div className="flex items-center gap-4">
              {isSessionActive && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Session Active
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 text-lg">
              Get help navigating websites or filling forms in unfamiliar languages. Follow these simple steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-lg">
              <li>Open the website or form in a new tab</li>
              <li>Click the screen share button below</li>
              <li>Say "Start help session" to begin</li>
              <li>Ask questions as you navigate or fill out the form</li>
              <li>Say "All done" when finished</li>
            </ol>
          </div>

          {isDisconnecting && (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mt-4 text-lg">
              Ending navigation session...
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Helpful Resources
          </h2>
          <div className="space-y-4">
            {navigationResources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border-2 border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {resource.title}
                    </h3>
                    <p className="mt-1 text-gray-600">{resource.description}</p>
                  </div>
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const LanguageNavigationAssistant = memo(LanguageNavigationAssistantComponent);