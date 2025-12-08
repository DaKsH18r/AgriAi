import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Paperclip,
  Sparkles,
  TrendingUp,
  Camera,
  CloudSun,
  Loader,
  User,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { agentAPI } from "../services/api";

// Types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    riskLevel?: string;
    actionItems?: string[];
  };
}

// Internal Components
function WelcomeScreen({
  onSuggestionClick,
}: {
  onSuggestionClick: (text: string) => void;
}) {
  const suggestions = [
    {
      icon: Sparkles,
      title: "Analyze Crop Health",
      description: "Get AI insights on your field conditions",
      query: "Analyze the current health status of my corn crop in Field A",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: TrendingUp,
      title: "Market Price Forecast",
      description: "Predict commodity prices for selling decisions",
      query: "Analyze tomato prices in Delhi and tell me if I should sell now",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Camera,
      title: "Identify Disease from Photo",
      description: "Upload a photo for instant diagnosis",
      query: "I want to upload a photo of my crop leaves for disease detection",
      color: "from-red-500 to-pink-600",
    },
    {
      icon: CloudSun,
      title: "Weather Outlook",
      description: "Get weather-based farming recommendations",
      query: "How will the weather affect my irrigation schedule this week?",
      color: "from-yellow-500 to-orange-600",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-agri-green to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Bot size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-agri-dark mb-3">
          AgriAI Assistant
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          Your intelligent farming companion powered by AI. Ask questions,
          upload photos, or get personalized recommendations.
        </p>
      </div>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => onSuggestionClick(suggestion.query)}
            className="group relative bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-agri-green hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
          >
            {/* Gradient Background on Hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${suggestion.color} opacity-0 group-hover:opacity-5 transition-opacity`}
            ></div>

            <div className="relative z-10">
              <suggestion.icon
                size={32}
                className="text-agri-green mb-3 group-hover:scale-110 transition-transform"
              />
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {suggestion.title}
              </h3>
              <p className="text-sm text-gray-600">{suggestion.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 mb-6 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-agri-green"
            : "bg-gradient-to-br from-agri-green to-emerald-600"
        }`}
      >
        {isUser ? (
          <User size={18} className="text-white" />
        ) : (
          <Bot size={18} className="text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[85%]`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-agri-green text-white rounded-tr-sm ml-auto"
              : "bg-white border border-slate-200 text-gray-800 rounded-tl-sm shadow-sm"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Metadata Widgets */}
          {!isUser && message.metadata && (
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
              {message.metadata.confidence !== undefined && (
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-xs font-semibold text-gray-700">
                    Confidence: {message.metadata.confidence}%
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{ width: `${message.metadata.confidence}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {message.metadata.riskLevel && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
                  <AlertTriangle size={14} className="text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-700">
                    Risk: {message.metadata.riskLevel}
                  </span>
                </div>
              )}

              {message.metadata.actionItems &&
                message.metadata.actionItems.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-semibold text-gray-600 uppercase">
                      Action Items:
                    </p>
                    {message.metadata.actionItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle
                          size={14}
                          className="text-agri-green mt-0.5 flex-shrink-0"
                        />
                        <span className="text-xs text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>

        <span
          className={`text-xs text-gray-500 mt-1 block ${
            isUser ? "text-right" : ""
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function InputArea({
  onSend,
  loading,
}: {
  onSend: (message: string, file?: File) => void;
  loading: boolean;
}) {
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSend(input);
      setInput("");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !loading) {
      onSend(`[Uploaded image: ${file.name}]`, file);
      e.target.value = "";
    }
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-gray-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload crop photo for disease detection"
        >
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AgriAI about your crops, weather, or upload a photo..."
          disabled={loading}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-10 h-10 flex items-center justify-center bg-agri-green hover:bg-agri-green/90 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
}

// Helper function to extract crop and city from user message
function extractCropAndCity(message: string): { crop: string; city: string } {
  const lowerMessage = message.toLowerCase();

  // Common crops
  const crops = [
    "tomato",
    "onion",
    "potato",
    "wheat",
    "rice",
    "corn",
    "cotton",
    "sugarcane",
  ];
  const detectedCrop = crops.find((c) => lowerMessage.includes(c)) || "tomato";

  // Common cities
  const cities = ["delhi", "mumbai", "bangalore", "pune", "hyderabad"];
  const detectedCity = cities.find((c) => lowerMessage.includes(c)) || "Delhi";

  return {
    crop: detectedCrop,
    city: detectedCity.charAt(0).toUpperCase() + detectedCity.slice(1),
  };
}

// Format API response as chat message
function formatAgentResponse(analysis: any): Message {
  const {
    decision,
    market_signals,
    llm_insights,
    current_price,
    predicted_price,
  } = analysis;

  let content = `**🤖 AI Crop Analysis**\n\n`;
  content += `**Decision: ${decision.action}**\n`;
  content += `Current Price: ₹${current_price}/kg\n`;
  if (predicted_price) content += `Predicted Price: ₹${predicted_price}/kg\n\n`;

  content += `**Reasoning:**\n${decision.reason}\n\n`;

  if (decision.best_action_date) {
    content += `**Best Action Date:** ${decision.best_action_date}\n`;
  }
  if (decision.expected_price) {
    content += `**Expected Price:** ₹${decision.expected_price}/kg\n\n`;
  }

  if (llm_insights) {
    content += `**💬 Expert Advice:**\n${llm_insights}\n\n`;
  }

  if (market_signals && market_signals.length > 0) {
    content += `**📊 Market Signals:**\n`;
    market_signals.slice(0, 3).forEach((signal: any) => {
      content += `• ${signal.signal_type}: ${signal.signal} (${Math.round(
        signal.strength * 100
      )}%)\n`;
    });
  }

  return {
    id: Date.now().toString(),
    role: "assistant",
    content,
    timestamp: new Date(),
    metadata: {
      confidence: Math.round(decision.confidence * 100),
      riskLevel: decision.risk_level,
      actionItems: decision.best_action_date
        ? [
            `Monitor prices until ${decision.best_action_date}`,
            "Check market conditions daily",
            "Prepare harvest/storage logistics",
          ]
        : undefined,
    },
  };
}

// Helper function for dummy responses (fallback)
function getDummyResponse(userMessage: string): Message {
  const lowerMessage = userMessage.toLowerCase();

  if (
    lowerMessage.includes("crop health") ||
    lowerMessage.includes("analyze")
  ) {
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: `Based on the latest sensor data from Field A, your corn crop is showing healthy growth patterns. Chlorophyll levels are optimal, and NDVI readings indicate strong vegetation vigor.\n\n**Key Findings:**\n• Leaf Area Index (LAI): 4.2 (Excellent)\n• Chlorophyll Content: 45 µg/cm² (Normal)\n• Growth Rate: 12% above average\n\nNo immediate intervention required. Continue current irrigation schedule.`,
      timestamp: new Date(),
      metadata: {
        confidence: 94,
        riskLevel: "Low",
        actionItems: [
          "Monitor nitrogen levels in next 7 days",
          "Continue current irrigation schedule",
          "Scout for early signs of pests",
        ],
      },
    };
  } else if (
    lowerMessage.includes("price") ||
    lowerMessage.includes("forecast") ||
    lowerMessage.includes("market")
  ) {
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: `**Tomato Price Forecast (Next 7 Days)**\n\nBased on historical trends, weather patterns, and market demand:\n\n📈 **Expected Price Range:** ₹18-22 per kg\n📊 **Current Price:** ₹20 per kg\n🎯 **Confidence Level:** 87%\n\n**Market Insights:**\n• Demand is expected to increase due to festival season\n• Weather conditions are favorable for transportation\n• Supply from neighboring regions is stable\n\n**Recommendation:** Consider selling 60% of harvest on Day 3-4 when prices peak at ₹21-22/kg.`,
      timestamp: new Date(),
      metadata: {
        confidence: 87,
        riskLevel: "Moderate",
        actionItems: [
          "Monitor daily price updates",
          "Prepare harvest logistics for Day 3",
          "Contact buyer network in advance",
        ],
      },
    };
  } else if (
    lowerMessage.includes("photo") ||
    lowerMessage.includes("upload") ||
    lowerMessage.includes("disease") ||
    lowerMessage.includes("image")
  ) {
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: `**Disease Detection Analysis**\n\n🔍 Analyzing uploaded image...\n\n**Diagnosis:** Early Blight (Alternaria solani)\n**Affected Crop:** Tomato\n**Severity:** Moderate (Stage 2/5)\n\n**Symptoms Detected:**\n• Concentric ring patterns on lower leaves\n• Dark brown lesions with yellow halo\n• Leaf curling and wilting\n\n**Immediate Treatment:**\n1. Remove and destroy affected leaves\n2. Apply fungicide (Mancozeb 75% WP @ 2.5g/L)\n3. Improve air circulation between plants\n4. Avoid overhead irrigation\n\n**Prevention:** Apply protective fungicide spray every 7-10 days during humid conditions.`,
      timestamp: new Date(),
      metadata: {
        confidence: 92,
        riskLevel: "Moderate",
        actionItems: [
          "Apply fungicide within 24 hours",
          "Remove affected leaves immediately",
          "Monitor spread to adjacent plants",
          "Schedule follow-up inspection in 5 days",
        ],
      },
    };
  } else if (
    lowerMessage.includes("weather") ||
    lowerMessage.includes("irrigation") ||
    lowerMessage.includes("rain")
  ) {
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: `**Weather-Based Irrigation Recommendation**\n\n☀️ **7-Day Weather Outlook:**\n• Days 1-3: Clear skies, 32-35°C, Low humidity (40-45%)\n• Days 4-5: Partly cloudy, 28-30°C, Moderate humidity (60%)\n• Days 6-7: 70% chance of rain (15-20mm expected)\n\n**Irrigation Schedule Adjustment:**\n\n✅ **Day 1-2:** Irrigate normally (Morning: 6-8 AM)\n⚠️ **Day 3:** Increase irrigation by 15% due to high heat\n⏸️ **Day 4-5:** Reduce to 70% of normal\n🚫 **Day 6-7:** Skip irrigation (rain expected)\n\n**Water Savings:** ~25% reduction in water usage this week while maintaining optimal soil moisture.`,
      timestamp: new Date(),
      metadata: {
        confidence: 89,
        riskLevel: "Low",
        actionItems: [
          "Set irrigation timer for Day 3 (15% increase)",
          "Monitor soil moisture on Day 5",
          "Check drainage systems before expected rain",
        ],
      },
    };
  } else {
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: `I'm AgriAI, your intelligent farming assistant. I can help you with:\n\n🌾 **Crop Health Analysis** - Real-time monitoring and diagnostics\n💰 **Market Predictions** - Price forecasts for selling decisions\n📸 **Disease Detection** - Upload photos for instant diagnosis\n🌤️ **Weather Insights** - Actionable recommendations based on forecasts\n🚜 **Farm Management** - Irrigation, fertilization, and harvest planning\n\nWhat would you like to know about your farm today?`,
      timestamp: new Date(),
    };
  }
}

// Main Component
export default function AgentDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      // Check if user is asking for crop analysis
      const lowerContent = content.toLowerCase();
      const needsAnalysis =
        lowerContent.includes("analyze") ||
        lowerContent.includes("price") ||
        lowerContent.includes("forecast") ||
        lowerContent.includes("sell") ||
        lowerContent.includes("market") ||
        lowerContent.includes("tomato") ||
        lowerContent.includes("onion") ||
        lowerContent.includes("wheat") ||
        lowerContent.includes("corn");

      if (
        needsAnalysis &&
        !lowerContent.includes("weather") &&
        !lowerContent.includes("disease") &&
        !lowerContent.includes("photo")
      ) {
        // Call real backend API
        const { crop, city } = extractCropAndCity(content);
        const analysis = await agentAPI.analyzeCrop(crop, city);
        const aiResponse = formatAgentResponse(analysis);
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        // Use dummy responses for other queries
        setTimeout(() => {
          const aiResponse = getDummyResponse(content);
          setMessages((prev) => [...prev, aiResponse]);
        }, 1500);
      }
    } catch (error) {
      console.error("Agent analysis error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error analyzing the crop. Please try again or check if the backend service is running.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-agri-light">
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
        ) : (
          <div className="max-w-4xl mx-auto px-6 py-8">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {loading && (
              <div className="flex gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-agri-green to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <Loader size={20} className="animate-spin text-agri-green" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Always visible at bottom */}
      <InputArea onSend={handleSendMessage} loading={loading} />
    </div>
  );
}
