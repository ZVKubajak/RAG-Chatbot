import { useState, useRef } from 'react';
import { MessageCircle, Send, Paperclip, X, Upload } from 'lucide-react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm here to help you. How can I assist you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showFileModal, setShowFileModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        isBot: false
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "Thanks for your message! I'm processing your request...",
          isBot: true
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: any) => {
    const file = files[0];
    if (file) {
      const fileMessage = {
        id: messages.length + 1,
        text: `📎 Uploaded file: ${file.name}`,
        isBot: false
      };
      setMessages(prev => [...prev, fileMessage]);
      setShowFileModal(false);
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "I've received your file! I'll analyze it and get back to you.",
          isBot: true
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const FileModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        <button
          onClick={() => setShowFileModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Upload File</h3>
        
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300 hover:border-purple-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Drag and drop your file here, or
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Browse Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
        
        <p className="text-sm text-gray-500 mt-4 text-center">
          Supported formats: PDF, TXT, CSV, XLS, etc.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Chat Window */}
      <div className={`fixed bottom-20 right-4 z-40 transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'opacity-100 transform translate-y-0 scale-100' 
          : 'opacity-0 transform translate-y-4 scale-95 pointer-events-none'
      }`}>
        <div className="bg-white rounded-2xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                  <img src="https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg" className="w-full h-full object-cover rounded-full" alt="stock image of man" />
                </div>                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs opacity-90">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFileModal(true)}
                className="text-gray-500 cursor-pointer hover:text-purple-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  inputValue.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                <Send className="h-[14px] w-[14px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button - Fixed in bottom right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 cursor-pointer right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* File Upload Modal */}
      {showFileModal && <FileModal />}
    </>
  );
};

export default ChatbotWidget;