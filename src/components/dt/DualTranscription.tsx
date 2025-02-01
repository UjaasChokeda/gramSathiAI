import { useEffect, useState, memo, useCallback } from "react";
import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { ToolCall } from "../../multimodal-live-types";

interface TranslationType {
  sourceLanguage: string;
  targetLanguage: string;
  translatedText: string;
}

const declaration: FunctionDeclaration = {
  name: "generate_translation_report",
  description: "Generates a translation report based on the conversation",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      sourceLanguage: {
        type: SchemaType.STRING,
        description: "The source language of the conversation",
      },
      targetLanguage: {
        type: SchemaType.STRING,
        description: "The target language for translation",
      },
      translatedText: {
        type: SchemaType.STRING,
        description: "The translated text",
      },
    },
    required: ["sourceLanguage", "targetLanguage", "translatedText"],
  },
};

function TranslatorComponent() {
  const [translation, setTranslation] = useState<TranslationType | null>(null);
  const [conversationSummary, setConversationSummary] = useState<string[]>([]);
  const [isTranslationActive, setIsTranslationActive] = useState(false);
  const { client, setConfig } = useLiveAPIContext();

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
      },
      systemInstruction: {
        parts: [
          {
            text: `You are a professional AI translator. Your task is to help users translate conversations between two languages. The user will specify the two languages. You will listen to the user's and the person he is talking to, and translate one language to the other language without repeating the input language. Continue this process until the conversation ends. At the end of the conversation, generate a summary of the conversation in bullet points without asking automatically stop speaking.`,
          },
        ],
      },
      tools: [{ functionDeclarations: [declaration] }],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      const fc = toolCall.functionCalls.find(
        (fc) => fc.name === declaration.name
      );
      if (fc) {
        const args = fc.args as TranslationType;
        setTranslation(args);
        setIsTranslationActive(false);
        setConversationSummary((prev) => [
          ...prev,
          `Translated from ${args.sourceLanguage} to ${args.targetLanguage}: ${args.translatedText}`,
        ]);
      }

      if (toolCall.functionCalls.length) {
        setTimeout(
          () =>
            client.sendToolResponse({
              functionResponses: toolCall.functionCalls.map((fc) => ({
                response: { output: { success: true } },
                id: fc.id,
              })),
            }),
          200
        );
      }
    };
    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  const handleStartTranslation = () => {
    setIsTranslationActive(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Baat-Bandhu</h2>
          <div className="flex items-center gap-4">
            {isTranslationActive && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Translation in Progress
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          Please specify the source and target languages, and start the
          translation process.
        </p>
        <button
          onClick={handleStartTranslation}
          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
        >
          Start Translation
        </button>
      </div>

      {translation && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Translation Report</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">
              Translated from {translation.sourceLanguage} to{" "}
              {translation.targetLanguage}: {translation.translatedText}
            </p>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-blue-700 mb-3">
                Conversation Summary
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {conversationSummary.map((summary, idx) => (
                  <li key={idx} className="text-gray-700">
                    {summary}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const DualTranscription = memo(TranslatorComponent);
