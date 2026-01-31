'use client';

import { AgentProvider } from '@/lib';
import ChatWidget from '@/components/ChatWidget';
import { useState } from 'react';

export default function Home() {
    const [selectedDemo, setSelectedDemo] = useState<'nail_demo' | 'tour_demo'>('nail_demo');

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        AI Chat SDK Widget
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Multi-tenant AI Chat Widget for Next.js 16
                    </p>

                    {/* Demo Selector */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setSelectedDemo('nail_demo')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedDemo === 'nail_demo'
                                    ? 'bg-pink-500 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            💅 Nail Studio Demo
                        </button>
                        <button
                            onClick={() => setSelectedDemo('tour_demo')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedDemo === 'tour_demo'
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            ✈️ Travel Tour Demo
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl mb-4">🎨</div>
                        <h3 className="text-xl font-semibold mb-2">Dynamic Theming</h3>
                        <p className="text-gray-600">
                            Automatically adapts colors and branding based on website_key configuration
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl mb-4">⚡</div>
                        <h3 className="text-xl font-semibold mb-2">AI Streaming</h3>
                        <p className="text-gray-600">
                            Real-time streaming responses with Vercel AI SDK and tool calling
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl mb-4">🔧</div>
                        <h3 className="text-xl font-semibold mb-2">Generative UI</h3>
                        <p className="text-gray-600">
                            Interactive components for booking, ticketing, and product galleries
                        </p>
                    </div>
                </div>

                {/* Integration Example */}
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-4">Quick Integration</h2>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <code>{`import { AgentProvider } from '@/lib';
import ChatWidget from '@/components/ChatWidget';

export default function App() {
  return (
    <AgentProvider websiteKey="${selectedDemo}">
      <ChatWidget />
    </AgentProvider>
  );
}`}</code>
                    </pre>
                </div>
            </div>

            {/* Chat Widget */}
            <AgentProvider websiteKey={selectedDemo}>
                <ChatWidget />
            </AgentProvider>
        </main>
    );
}
