"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Plus, Menu, X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function UlizaPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Uliza, your mortgage application assistant. I'm here to help you with any questions about your mortgage application, required documents, deadlines, or the application process. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {    
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    // Auto-focus textarea on mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const generateBotResponse = async (userInput: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const lowerInput = userInput.toLowerCase();

    // Enhanced response logic - replace with actual API call
    if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      return "Hello! I'm here to help you with your mortgage application. What would you like to know? You can ask me about required documents, deadlines, application steps, or any other questions you have.";
    }
    if (lowerInput.includes("document") || lowerInput.includes("documents") || lowerInput.includes("what do i need")) {
      return "For your mortgage application, you'll typically need:\n\n• **Identity Verification**: Government-issued ID (driver's license or passport)\n• **Income Documents**: Pay stubs, W-2 forms, tax returns (last 2 years)\n• **Bank Statements**: Last 2-3 months of statements for all accounts\n• **Employment Verification**: Employment letter or contact information\n• **Property Documents**: Purchase agreement, property appraisal (if available)\n• **Additional**: Gift letters (if applicable), explanation letters for any credit issues\n\nWhich specific documents do you need help with?";
    }
    if (lowerInput.includes("deadline") || lowerInput.includes("time") || lowerInput.includes("how long") || lowerInput.includes("when")) {
      return "Here's a typical mortgage application timeline:\n\n• **Loan Estimate**: Must be provided within 3 business days of application\n• **Application Review**: 1-2 weeks for initial review\n• **Underwriting**: 2-4 weeks for full underwriting process\n• **Total Timeline**: Typically 30-45 days from application to closing\n\n**Important**: The 3-day deadline for Loan Estimate delivery is a regulatory requirement under TRID rules. After you submit your application, you'll receive your Loan Estimate within 3 business days.\n\nIs there a specific deadline you're concerned about?";
    }
    if (lowerInput.includes("help") || lowerInput.includes("assist") || lowerInput.includes("what can you")) {
      return "I can help you with:\n\n• **Document Requirements**: Understanding what documents you need and why\n• **Application Steps**: Guiding you through each section of the application\n• **Deadlines & Timelines**: Explaining regulatory deadlines and typical processing times\n• **Compliance Questions**: TRID, ECOA, and California-specific requirements\n• **General Guidance**: Answering questions about the mortgage process\n\nWhat would you like to know more about?";
    }
    if (lowerInput.includes("status") || lowerInput.includes("progress") || lowerInput.includes("where am i")) {
      return "To check your application status:\n\n1. Go to your **Dashboard** to see all your applications\n2. View the **Progress Bar** on the application page to see which sections you've completed\n3. Each completed section will be marked with a checkmark\n\nYour application progress is tracked in real-time. Would you like me to guide you to a specific section that needs completion?";
    }
    if (lowerInput.includes("trid") || lowerInput.includes("compliance") || lowerInput.includes("regulation")) {
      return "TRID (TILA-RESPA Integrated Disclosure) is a federal regulation that requires:\n\n• **Loan Estimate**: Must be provided within 3 business days of application\n• **Closing Disclosure**: Must be provided at least 3 business days before closing\n• **Home Loan Toolkit**: Required for purchase transactions\n• **HUD Housing Counselors**: List must be provided\n\nOur platform is fully compliant with TRID, ECOA (Equal Credit Opportunity Act), and California-specific requirements. All disclosures are automatically generated and tracked.\n\nDo you have specific questions about any of these requirements?";
    }
    if (lowerInput.includes("thank") || lowerInput.includes("thanks")) {
      return "You're welcome! I'm here whenever you need help with your mortgage application. Feel free to ask if you have any other questions.";
    }
    if (lowerInput.includes("income") || lowerInput.includes("employment") || lowerInput.includes("salary")) {
      return "For income and employment verification, you'll need:\n\n• **Pay Stubs**: Last 30 days (typically 2-3 recent pay stubs)\n• **W-2 Forms**: Last 2 years\n• **Tax Returns**: Last 2 years (1040 forms)\n• **Employment Letter**: Current employment verification letter\n• **Bank Statements**: To verify direct deposits\n\nIf you're self-employed, you'll also need:\n• Profit and Loss statements\n• Business tax returns\n• 1099 forms (if applicable)\n\nDo you have questions about documenting your specific employment situation?";
    }
    if (lowerInput.includes("credit") || lowerInput.includes("score") || lowerInput.includes("debt")) {
      return "Credit and debt information is important for your mortgage application:\n\n• **Credit Score**: Lenders will pull your credit report (you don't need to provide this)\n• **Debt Information**: You'll need to list all current debts (credit cards, car loans, student loans, etc.)\n• **Monthly Payments**: Current minimum payments for all debts\n• **Credit Issues**: If you have any credit issues, you may need explanation letters\n\nYour debt-to-income ratio (DTI) is a key factor in loan approval. Generally, lenders prefer a DTI below 43%.\n\nDo you have specific questions about how your debts affect your application?";
    }

    // Default response for unrecognized queries
    return `I understand you're asking about: "${userInput}". 

Let me help you with that. I can assist with:
• Document requirements and preparation
• Understanding application steps and sections
• Regulatory deadlines and compliance
• General mortgage application questions

Could you provide a bit more detail about what you'd like to know? Or would you like me to guide you through a specific part of the application process?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    try {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: await generateBotResponse(currentInput),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I encountered an error. Please try again or rephrase your question.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
      // Refocus textarea after message is sent
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm Uliza, your mortgage application assistant. I'm here to help you with any questions about your mortgage application, required documents, deadlines, or the application process. What would you like to know?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 w-64 bg-gray-50 border-r border-gray-200 transition-transform duration-300 z-30 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <Button
            onClick={handleNewChat}
            className="w-full justify-start gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">
            Recent Chats
          </div>
          <div className="space-y-1">
            <div className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium cursor-pointer hover:bg-blue-100">
              Current Conversation
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Bot className="h-4 w-4" />
            <span className="font-medium">Uliza</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <h1 className="text-lg font-semibold text-gray-900">Uliza</h1>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            className="text-gray-600 hover:text-gray-900"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {messages.length === 1 && (
              <div className="text-center mb-12 mt-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Bot className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  How can I help you today?
                </h2>
                <p className="text-gray-600">
                  Ask me anything about your mortgage application
                </p>
              </div>
            )}

            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3"
                        : "bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
                        {message.text}
                      </p>
                    </div>
                  </div>
                  {message.sender === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">U</span>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div
          ref={inputContainerRef}
          className="border-t border-gray-200 bg-white px-4 py-4"
        >
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition-shadow focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Message Uliza..."
                disabled={isLoading}
                className="min-h-[52px] max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3 text-[15px] placeholder:text-gray-400"
                rows={1}
              />
              <div className="flex items-end pb-2 pr-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="h-9 w-9 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Uliza can make mistakes. Check important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

