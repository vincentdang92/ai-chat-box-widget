'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useChat } from 'ai/react';
import { useAgent, useThreadPersistence } from '@/lib';
import MessageList from './MessageList';
import ProductGallery from '../Tools/ProductGallery';

interface ChatWindowProps {
    onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
    const { config } = useAgent();
    const { threadId } = useThreadPersistence(config?.websiteKey || '');
    const [inputValue, setInputValue] = useState('');
    const [manualToolInvocations, setManualToolInvocations] = useState<any[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
        api: '/api/chat',
        body: {
            threadId,
            websiteKey: config?.websiteKey,
        },
        initialMessages: [],
    });

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [input]);

    // Auto-focus input after bot response
    useEffect(() => {
        if (!isLoading && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isLoading, messages]);

    // Detect service requests and manually trigger product_gallery
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'user') {
                const userMessage = lastMessage.content.toLowerCase();
                // Check if user is asking about services/products
                if (userMessage.match(/(service|product|offer|what do you|show me|see|gallery|menu|package)/i)) {
                    // Create a manual tool invocation for product_gallery
                    const toolInvocation = {
                        toolCallId: `manual_${Date.now()}`,
                        toolName: 'product_gallery',
                        state: 'result',
                        result: {
                            category: config?.websiteKey === 'nail_demo' ? 'Nail Services' : 'Tour Packages',
                            products: config?.websiteKey === 'nail_demo'
                                ? [
                                    { id: '1', name: 'Classic Manicure', description: 'Traditional nail care', price: '$25', image: '💅' },
                                    { id: '2', name: 'Gel Nails', description: 'Long-lasting gel polish', price: '$45', image: '✨' },
                                    { id: '3', name: 'Nail Art', description: 'Custom designs', price: '$60', image: '🎨' },
                                    { id: '4', name: 'Deluxe Spa Package', description: 'Full pampering experience', price: '$75', image: '💆' },
                                ]
                                : [
                                    { id: '1', name: 'Beach Paradise', description: '7 days in tropical resort', price: '$1,299', image: '🏖️' },
                                    { id: '2', name: 'Mountain Adventure', description: '5-day hiking expedition', price: '$899', image: '⛰️' },
                                    { id: '3', name: 'City Explorer', description: '4-day urban discovery', price: '$699', image: '🏙️' },
                                    { id: '4', name: 'Safari Experience', description: '6-day wildlife adventure', price: '$1,499', image: '🦁' },
                                ],
                        },
                    };

                    // Add to manual invocations if not already added
                    setManualToolInvocations(prev => {
                        const exists = prev.some(inv => inv.toolCallId === toolInvocation.toolCallId);
                        if (!exists) {
                            return [...prev, toolInvocation];
                        }
                        return prev;
                    });
                }
            }
        }
    }, [messages, config?.websiteKey]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            handleSubmit(e);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e as any);
        }
    };

    const handleConfirmBooking = (serviceName: string, date: string, time: string) => {
        // Send a message to trigger the confirm_booking tool
        append({
            role: 'user',
            content: `Confirm my booking for ${serviceName} on ${date} at ${time}`,
        });
    };

    if (!config) return null;

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 text-white"
                style={{ backgroundColor: config.primaryColor }}
            >
                <div className="flex items-center gap-3">
                    <div className="text-2xl">{config.botAvatar}</div>
                    <div>
                        <h3 className="font-semibold text-lg">{config.botName}</h3>
                        <p className="text-xs opacity-90">Online</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
                <MessageList
                    messages={messages}
                    isLoading={isLoading}
                    onConfirmBooking={handleConfirmBooking}
                />

                {/* Manual tool invocations rendered here */}
                {manualToolInvocations.length > 0 && (
                    <div className="px-4 pb-4">
                        {manualToolInvocations.map((tool) => {
                            if (tool.toolName === 'product_gallery' && tool.result) {
                                return (
                                    <div key={tool.toolCallId}>
                                        <ProductGallery
                                            data={tool.result}
                                            onBook={(productName: string) => {
                                                // Trigger booking by sending a message
                                                append({
                                                    role: 'user',
                                                    content: `I want to book ${productName}`,
                                                });
                                            }}
                                        />
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
                <form onSubmit={onSubmit} className="flex gap-2">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 max-h-[120px]"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-4 py-2 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                        style={{ backgroundColor: config.primaryColor }}
                    >
                        <Send size={20} />
                    </button>
                </form>

                {/* Powered By */}
                {config.branding?.poweredByText && (
                    <div className="mt-2 text-center">
                        <a
                            href={config.branding.poweredByUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            {config.branding.poweredByText}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
