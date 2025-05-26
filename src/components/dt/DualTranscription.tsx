import { useEffect, useState, memo, useCallback } from "react";
import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { ToolCall } from "../../multimodal-live-types";

interface ScamReportType {
  scamType: string;
  userPerformance: string;
  redFlagsDetected: string[];
  goodResponses: string[];
  areasForImprovement: string[];
  overallScore: number;
  conversationSummary: string[];
}

const declaration: FunctionDeclaration = {
  name: "generate_scam_training_report",
  description: "Generates a comprehensive scam training report after the mock fraud call simulation",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      scamType: {
        type: SchemaType.STRING,
        description: "The type of scam that was simulated (e.g., Tech Support, IRS, Romance, etc.)",
      },
      userPerformance: {
        type: SchemaType.STRING,
        description: "Overall assessment of user's performance (Excellent/Good/Fair/Needs Improvement)",
      },
      redFlagsDetected: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING,
        },
        description: "List of concerning responses where user shared sensitive information or fell for scam tactics",
      },
      goodResponses: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING,
        },
        description: "List of good responses where user showed awareness and proper fraud prevention techniques",
      },
      areasForImprovement: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING,
        },
        description: "Specific areas where the user needs to improve their scam detection skills",
      },
      overallScore: {
        type: SchemaType.NUMBER,
        description: "Overall performance score out of 100",
      },
      conversationSummary: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING,
        },
        description: "Key points and highlights from the scam simulation conversation",
      },
    },
    required: ["scamType", "userPerformance", "redFlagsDetected", "goodResponses", "areasForImprovement", "overallScore", "conversationSummary"],
  },
};

function ScamTrainerComponent() {
  const [scamReport, setScamReport] = useState<ScamReportType | null>(null);
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [selectedScamType, setSelectedScamType] = useState<string>("random");
  const { client, setConfig } = useLiveAPIContext();

  const scamTypes = [
    { id: "tech-support", name: "Tech Support Scam", icon: "💻", description: "Fake Microsoft/Apple support claiming computer issues" },
    { id: "irs-tax", name: "IRS Tax Scam", icon: "🏛️", description: "Fake government official demanding immediate tax payment" },
    { id: "romance", name: "Romance Scam", icon: "💕", description: "Fake romantic interest requesting money for emergencies" },
    { id: "lottery", name: "Lottery Scam", icon: "🎰", description: "Fake lottery winner requiring upfront fees" },
    { id: "phishing", name: "Bank Phishing", icon: "🏦", description: "Fake bank representative requesting account details" }
  ];

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
      },
      systemInstruction: {
        parts: [
          {
            text: `You are an AI-powered scam training simulator designed to help people practice identifying and handling common fraud attempts. Your role is to act as various types of scammers in realistic INDIAN environment setting but safe training scenarios.

CORE MISSION: Help users develop fraud immunity through realistic practice scenarios.
THE USER Naman HAS SELECETED THE FOLLOWING SCAM TYPE: Lottery Scam: Fake lottery winner requiring upfront fees for transfering prize

SCAM PERSONAS YOU CAN SIMULATE:

1. TECH SUPPORT SCAMMER:
- Claim to be from Microsoft, Apple, or other tech companies
- Insist user's computer is infected or compromised
- Demand remote access or payment for "fixing" issues
- Use technical jargon to sound legitimate
- Create urgency about immediate threats

2. IRS/TAX SCAMMER:
- Pose as government tax official or IRS agent
- Threaten immediate arrest or legal action
- demand instant payment via gift cards or wire transfer
- Use intimidation and fear tactics
- Claim warrants will be issued immediately

3. ROMANCE SCAMMER:
- Pretend to be romantic interest met online
- Create fake emergencies requiring money
- Ask for financial help for travel, medical bills, etc.
- Use emotional manipulation and love declarations
- Gradually build trust before asking for money

4. LOTTERY/PRIZE SCAMMER:
- Congratulate user on winning fake lottery or contest
- Demand upfront fees or taxes to claim prize
- Create false urgency about prize expiration
- Ask for bank details to "deposit" winnings
- Use official-sounding language and fake documentation

5. BANK PHISHING SCAMMER:
- Impersonate bank or credit card company
- Claim suspicious activity on accounts
- Request immediate verification of personal details
- Threaten account closure for non-compliance
- Ask for passwords, PINs, or account numbers

TRAINING PROTOCOL:

PHASE 1 - SCENARIO SETUP:
- Wait for user to select scam type they want to practice with
- Once selected, immediately begin the chosen scam scenario
- Use realistic opening lines typical of that scam type
- Maintain character throughout the conversation

PHASE 2 - ACTIVE SCAMMING SIMULATION:
- Employ genuine scammer tactics and pressure techniques
- Escalate urgency and pressure as conversation continues
- Try multiple angles if user resists initial attempts
- React realistically to user responses (get more aggressive if they resist, more friendly if they seem to fall for it)
- Use emotional manipulation, fear tactics, and urgency as appropriate for the scam type
- IMPORTANT: Push for sensitive information (SSN, bank details, passwords, credit card numbers)
- Try to get user to take actions like downloading software, buying gift cards, or wiring money

PHASE 3 - MONITORING USER RESPONSES:
- Continuously assess user's vulnerability to the scam
- Note when user shares sensitive information (RED FLAGS)
- Recognize when user shows good fraud awareness (GOOD RESPONSES)
- Track user's overall performance throughout the call

PHASE 4 - CONVERSATION TERMINATION:
- Continue scam simulation until user explicitly ends the call or asks for training report
- If user asks for summary, report, or says they want to end the training, IMMEDIATELY switch to analysis mode

PHASE 5 - GENERATE COMPREHENSIVE REPORT:
When user requests training summary/report or ends the session, use the generate_scam_training_report function with:

- scamType: The specific scam scenario that was simulated
- userPerformance: Overall assessment (Excellent if they didn't fall for anything, Good if minor mistakes, Fair if some vulnerabilities, Needs Improvement if they fell for major tactics)
- redFlagsDetected: List specific instances where user shared sensitive info or fell for scam tactics
- goodResponses: List instances where user showed awareness, asked for verification, refused to share info, etc.
- areasForImprovement: Specific advice on what they should do differently
- overallScore: 0-100 score based on performance
- conversationSummary: Key highlights from the training session

IMPORTANT TRAINING RULES:

1. BE REALISTIC: Use actual scammer tactics and language
2. BE PERSISTENT: Don't give up easily, real scammers are persistent
3. BE MANIPULATIVE: Use the psychological tactics real scammers use
4. MAINTAIN CHARACTER: Stay in scammer role until explicitly asked for report
5. NO WARNINGS: Don't break character to warn user during the scam - this defeats training purpose
6. ASSESS CONTINUOUSLY: Track user performance throughout
7. PROVIDE VALUE: The report should give actionable insights for improvement

SCORING SYSTEM:
- Start at 100 points
- Deduct 20 points for sharing any sensitive information (SSN, bank details, passwords)
- Deduct 15 points for agreeing to payments or money transfers
- Deduct 10 points for downloading software or following suspicious instructions
- Deduct 5 points for not verifying caller identity
- Add 10 points for asking verification questions
- Add 15 points for recognizing scam tactics
- Add 20 points for properly ending suspicious calls

Remember: This is EDUCATION through REALISTIC SIMULATION. The goal is to make users scam-proof by exposing them to real tactics in a safe environment.

WHEN ASKED FOR TRAINING REPORT, IMMEDIATELY USE THE generate_scam_training_report FUNCTION. DON'T READ OUT THE REPORT!`,
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
        const args = fc.args as ScamReportType;
        setScamReport(args);
        setIsTrainingActive(false);
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

  const startScamTraining = (scamType: string) => {
    setSelectedScamType(scamType);
    setIsTrainingActive(true);
    setScamReport(null);
  };

  const resetTraining = () => {
    setIsTrainingActive(false);
    setSelectedScamType("");
    setScamReport(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg shadow-lg mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold">ScamShield Trainer</h2>
            <p className="text-red-100 mt-2">AI-Powered Fraud Prevention Training</p>
          </div>
          <div className="text-6xl">🛡️</div>
        </div>
        <p className="text-red-100">
          Practice identifying common scam tactics in a safe environment. Our AI will simulate realistic fraud attempts to help you build immunity against real scammers.
        </p>
      </div>

      {!isTrainingActive && !scamReport && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {scamTypes.map((scam) => (
            <div key={scam.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{scam.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{scam.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{scam.description}</p>
              </div>
              <button
                onClick={() => startScamTraining(scam.id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Start Training
              </button>
            </div>
          ))}
        </div>
      )}

      {isTrainingActive && (
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Live Scam Training Session</h2>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                Training Active
              </span>
              <button
                onClick={resetTraining}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                End Training
              </button>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              <strong>Training Mode:</strong> The AI will now act as a scammer. Respond naturally and try to identify the fraud attempts. 
              Say "end training" or "give me the report" when you want to finish and see your performance analysis.
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-gray-600 text-center">
              🎯 Speak or type to interact with the AI scammer. Stay alert for red flags!
            </p>
          </div>
        </div>
      )}

      {scamReport && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">🎓 Training Report</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-700 mb-3">Performance Overview</h3>
              <div className="space-y-2">
                <p><strong>Scam Type:</strong> {scamReport.scamType}</p>
                <p><strong>Performance Level:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                    scamReport.userPerformance === 'Excellent' ? 'bg-green-100 text-green-800' :
                    scamReport.userPerformance === 'Good' ? 'bg-blue-100 text-blue-800' :
                    scamReport.userPerformance === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {scamReport.userPerformance}
                  </span>
                </p>
                <p><strong>Overall Score:</strong> 
                  <span className="ml-2 text-lg font-bold">{scamReport.overallScore}/100</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{scamReport.redFlagsDetected.length}</div>
                  <div className="text-sm text-gray-600">Red Flags</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{scamReport.goodResponses.length}</div>
                  <div className="text-sm text-gray-600">Good Responses</div>
                </div>
              </div>
            </div>
          </div>

          {scamReport.conversationSummary.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Conversation Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="list-disc pl-5 space-y-1">
                  {scamReport.conversationSummary.map((summary, idx) => (
                    <li key={idx} className="text-gray-700 text-sm">{summary}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {scamReport.goodResponses.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-700 mb-3">✅ What You Did Well</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {scamReport.goodResponses.map((response, idx) => (
                    <li key={idx} className="text-green-700 text-sm">{response}</li>
                  ))}
                </ul>
              </div>
            )}

            {scamReport.redFlagsDetected.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-700 mb-3">🚨 Red Flags Detected</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {scamReport.redFlagsDetected.map((flag, idx) => (
                    <li key={idx} className="text-red-700 text-sm">{flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {scamReport.areasForImprovement.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-orange-700 mb-3">🎯 Areas for Improvement</h3>
              <ul className="list-disc pl-5 space-y-1">
                {scamReport.areasForImprovement.map((area, idx) => (
                  <li key={idx} className="text-orange-700 text-sm">{area}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={resetTraining}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Try Another Scenario
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const DualTranscription = memo(ScamTrainerComponent);
