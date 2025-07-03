import { ArrowRight, Sparkles, Zap, Heart } from "lucide-react";
import ChatbotWidget from "./components/ChatBotWidget";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:p-8">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">Demo App</span>
        </div>
        <div className="hidden md:flex space-x-8 text-gray-300">
          <a href="#" className="hover:text-white transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-white transition-colors">
            About
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-8 inline-flex items-center px-4 py-2 bg-purple-800/30 rounded-full border border-purple-700/50 backdrop-blur-sm">
          <span className="text-purple-200 text-sm">Application Demo</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Welcome
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl leading-relaxed">
          This is a simple demo application. The main functionality will be
          available through the chat interface.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="group flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 border border-purple-500/50 rounded-full text-purple-300 font-semibold hover:bg-purple-500/10 backdrop-blur-sm transition-all duration-300">
            View Demo
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Demo Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-800/20 to-pink-800/20 border border-purple-700/30 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 group">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Interactive</h3>
              <p className="text-gray-300">
                Engage with the application through our chat interface for a
                seamless experience.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-800/20 to-purple-800/20 border border-blue-700/30 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 group">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Modern Design
              </h3>
              <p className="text-gray-300">
                Clean and contemporary interface designed for ease of use and
                clarity.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-800/20 to-red-800/20 border border-pink-700/30 backdrop-blur-sm hover:border-pink-500/50 transition-all duration-300 group">
              <div className="h-12 w-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Simple</h3>
              <p className="text-gray-300">
                Straightforward functionality focused on demonstrating core
                features effectively.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Explore?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Use the chat interface to interact with the application.
          </p>
          <button className="group flex items-center mx-auto px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
            Start Demo
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-purple-800/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-xl font-bold text-white">Demo App</span>
          </div>
          <div className="text-gray-400 text-sm">© 2025 Demo Application</div>
        </div>
      </footer>

      {/* chatbot widget */}
      <ChatbotWidget />
    </div>
  );
};

export default App;
