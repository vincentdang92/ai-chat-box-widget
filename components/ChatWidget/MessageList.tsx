'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Message, useChat } from 'ai/react';
import { Bot, User, Loader2 } from 'lucide-react';
import { useAgent } from '@/lib';
import OrderConfirmation from '@/components/Tools/OrderConfirmation';
import ProductGallery from '@/components/Tools/ProductGallery';
import BookingSummary from '@/components/Tools/BookingSummary';
import BookingTool from '@/components/Tools/BookingTool';

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    onConfirmBooking: (serviceName: string, date: string, time: string) => void;
}

export default function MessageList({ messages, isLoading, onConfirmBooking }: MessageListProps) {
    const { config } = useAgent();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showBookingTool, setShowBookingTool] = useState(false);
    const [selectedService, setSelectedService] = useState('');

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, showBookingTool]);

    if (!config) return null;

    return (
        <div className="h-full overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <div className="text-4xl mb-4">{config.botAvatar}</div>
                    <h3 className="font-semibold text-lg text-gray-700 mb-2">
                        Welcome to {config.botName}
                    </h3>
                    <p className="text-sm">How can I assist you today?</p>
                </div>
            )}

            {messages.map((message, index) => (
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                >
                    {/* Avatar */}
                    <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${message.role === 'user' ? 'bg-gray-600' : ''
                            }`}
                        style={
                            message.role === 'assistant'
                                ? { backgroundColor: config.primaryColor }
                                : undefined
                        }
                    >
                        {message.role === 'user' ? (
                            <User size={16} />
                        ) : (
                            <span className="text-base">{config.botAvatar}</span>
                        )}
                    </div>

                    {/* Message Content */}
                    <div
                        className={`flex-1 max-w-[75%] ${message.role === 'user' ? 'text-right' : 'text-left'
                            }`}
                    >
                        <div
                            className={`inline-block px-4 py-2 rounded-2xl ${message.role === 'user'
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-white'
                                }`}
                            style={
                                message.role === 'assistant'
                                    ? { backgroundColor: config.primaryColor }
                                    : undefined
                            }
                        >
                            <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                            </p>
                        </div>

                        {/* Tool Calls / UI Components */}
                        {message.toolInvocations && message.toolInvocations.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {message.toolInvocations.map((tool: any) => {
                                    // Render BookingTool for product_gallery
                                    if (tool.toolName === 'product_gallery' && tool.result) {
                                        return (
                                            <div key={tool.toolCallId}>
                                                <ProductGallery
                                                    data={tool.result}
                                                    onBook={(productName) => {
                                                        setSelectedService(productName);
                                                        setShowBookingTool(true);
                                                    }}
                                                />
                                                {showBookingTool && (
                                                    <div className="mt-3">
                                                        <BookingTool
                                                            websiteKey={config.websiteKey || 'nail_demo'}
                                                            selectedService={selectedService}
                                                            onComplete={(bookingData) => {
                                                                setShowBookingTool(false);
                                                                onConfirmBooking(
                                                                    bookingData.serviceName,
                                                                    bookingData.date,
                                                                    bookingData.time
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    // Render BookingSummary for booking_tool
                                    if (tool.toolName === 'booking_tool' && tool.result?.requiresConfirmation) {
                                        return (
                                            <div key={tool.toolCallId} className="mt-2">
                                                <BookingSummary
                                                    bookingData={{
                                                        serviceName: tool.result.serviceName,
                                                        date: tool.result.date,
                                                        time: tool.result.time,
                                                        customerName: tool.result.customerName,
                                                        customerEmail: tool.result.customerEmail,
                                                        customerMobile: tool.result.customerMobile,
                                                        price: tool.result.price,
                                                    }}
                                                    onConfirm={() => {
                                                        onConfirmBooking(
                                                            tool.result.serviceName,
                                                            tool.result.date,
                                                            tool.result.time
                                                        );
                                                    }}
                                                />
                                            </div>
                                        );
                                    }
                                    if (tool.toolName === 'create_order' && tool.result) {
                                        return (
                                            <OrderConfirmation
                                                key={tool.toolCallId}
                                                data={tool.result}
                                            />
                                        );
                                    }

                                    // Default rendering for other tools
                                    return (
                                        <div
                                            key={tool.toolCallId}
                                            className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
                                        >
                                            <div className="font-semibold text-gray-700 mb-1">
                                                {tool.toolName === 'booking_tool' && '📅 Booking Request'}
                                                {tool.toolName === 'ticket_tool' && '🎫 Support Ticket'}
                                                {tool.toolName === 'confirm_booking' && '✅ Booking Confirmed'}
                                                {!['booking_tool', 'ticket_tool', 'product_gallery', 'create_order', 'confirm_booking'].includes(tool.toolName) && `🔧 ${tool.toolName}`}
                                            </div>
                                            {tool.result && (
                                                <div className="text-gray-600">
                                                    {typeof tool.result === 'string'
                                                        ? tool.result
                                                        : tool.result.message || JSON.stringify(tool.result, null, 2)}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                >
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: config.primaryColor }}
                    >
                        <span className="text-base">{config.botAvatar}</span>
                    </div>
                    <div
                        className="px-4 py-2 rounded-2xl text-white flex items-center gap-2"
                        style={{ backgroundColor: config.primaryColor }}
                    >
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm">Typing...</span>
                    </div>
                </motion.div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}
