import ChatbotWidget from "../components/ChatbotWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Website Content</h1>
        <p className="text-gray-600 mb-8">This represents your main website content. The chatbot widget appears as a floating overlay.</p>
        
        {/* Dummy content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Welcome to Our Platform</h2>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Features</h2>
          <ul className="text-gray-600 leading-relaxed space-y-2">
            <li>• Modern chatbot interface with file upload capabilities</li>
            <li>• Support for TXT, CSV, PDF, and XLSX files</li>
            <li>• Drag and drop functionality</li>
            <li>• Responsive design for all devices</li>
            <li>• Real-time messaging interface</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Get Started</h2>
          <p className="text-gray-600 leading-relaxed">
            Click on the chatbot widget in the bottom right corner to start a conversation with our AI assistant. 
            You can ask questions or upload files for analysis.
          </p>
        </div>
      </div>

      <ChatbotWidget />
    </div>
  );
}
