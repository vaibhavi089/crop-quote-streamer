
import React from "react";
import Dashboard from "@/components/Dashboard";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-green-800 mb-2">
            AgriPrice Monitor
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time agricultural commodity price tracking for farmers, traders, and consumers.
            Stay updated with the latest market trends and price fluctuations.
          </p>
        </header>
        
        <main>
          <Dashboard />
        </main>
        
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Data sourced from the Indian Agricultural Market API</p>
          <p className="mt-1">© {new Date().getFullYear()} AgriPrice Monitor</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
