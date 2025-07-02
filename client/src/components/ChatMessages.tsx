import { Sparkles, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 chat-scrollbar">
      {messages.map((message) => (
        <div key={message.id} className={`flex items-start space-x-3 animate-fade-in ${message.sender === 'user' ? 'justify-end' : ''}`}>
          {message.sender === 'bot' && (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div className={`rounded-2xl p-3 shadow-sm max-w-[75%] ${
            message.sender === 'bot' 
              ? 'bg-white rounded-tl-sm' 
              : 'bg-blue-600 text-white rounded-tr-sm'
          }`}>
            <p className={`text-sm leading-relaxed ${
              message.sender === 'bot' ? 'text-gray-800' : 'text-white'
            }`}>
              {message.text}
            </p>
            <span className={`text-xs mt-1 block ${
              message.sender === 'bot' ? 'text-gray-500' : 'text-blue-100'
            }`}>
              {message.timestamp}
            </span>
          </div>

          {message.sender === 'user' && (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
