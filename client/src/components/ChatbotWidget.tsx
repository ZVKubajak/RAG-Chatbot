import { useState, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import FileUploadModal from "./FileUploadModal";
import MessageInput from "./MessageInput";
import ChatToggleButton from "./ChatToggleButton";

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. How can I help you today? You can ask me questions or upload documents for analysis.",
      sender: 'bot',
      timestamp: '2:34 PM'
    },
    {
      id: '2',
      text: "Hi! I'd like to upload a document for analysis.",
      sender: 'user',
      timestamp: '2:35 PM'
    },
    {
      id: '3',
      text: "Perfect! I can help analyze your documents. I support TXT, CSV, PDF, and XLSX files. Click the attachment button to upload files.",
      sender: 'bot',
      timestamp: '2:35 PM'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! I'm here to help you with any questions or document analysis you need.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 2000);
  };

  const handleFileAttach = () => {
    setIsFileModalOpen(true);
  };

  const handleMinimize = () => {
    setIsOpen(false);
  };

  const handleOpenChat = () => {
    setIsOpen(true);
  };

  if (!isOpen) {
    return <ChatToggleButton onClick={handleOpenChat} hasNotification={true} />;
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-3rem)] flex flex-col animate-slide-up">
          <ChatHeader onMinimize={handleMinimize} />
          <ChatMessages messages={messages} />
          <MessageInput 
            onSendMessage={handleSendMessage} 
            onFileAttach={handleFileAttach}
            isTyping={isTyping}
          />
        </div>
      </div>
      
      <FileUploadModal 
        isOpen={isFileModalOpen} 
        onClose={() => setIsFileModalOpen(false)} 
      />
    </>
  );
}
