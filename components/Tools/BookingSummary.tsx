'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, DollarSign, User, Mail, MessageSquare } from 'lucide-react';

interface BookingSummaryProps {
    data: {
        serviceType: string;
        serviceName: string;
        date: string;
        time: string;
        price?: string;
        customerName?: string;
        customerEmail?: string;
        specialRequests?: string;
    };
    onConfirm: () => void;
}

export default function BookingSummary({ data, onConfirm }: BookingSummaryProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <div className="text-2xl">📋</div>
                <h4 className="font-semibold text-blue-900 text-lg">Booking Summary</h4>
            </div>

            <p className="text-sm text-blue-800 mb-4">
                Please review your booking details below and click confirm to complete your reservation.
            </p>

            {/* Booking Details */}
            <div className="bg-white rounded-lg p-4 space-y-3 mb-4">
                {/* Service */}
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                    <div className="text-3xl">{data.serviceType === 'tour' ? '✈️' : '💅'}</div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Service</p>
                        <p className="font-bold text-gray-900 text-lg">{data.serviceName}</p>
                        <p className="text-xs text-gray-600 capitalize">{data.serviceType}</p>
                    </div>
                    {data.price && (
                        <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">{data.price}</p>
                        </div>
                    )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                        <Calendar className="text-blue-500 mt-0.5" size={18} />
                        <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-semibold text-gray-900">{data.date}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Clock className="text-blue-500 mt-0.5" size={18} />
                        <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="font-semibold text-gray-900">{data.time}</p>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                {(data.customerName || data.customerEmail) && (
                    <div className="pt-3 border-t border-gray-200 space-y-2">
                        {data.customerName && (
                            <div className="flex items-center gap-2">
                                <User className="text-gray-400" size={16} />
                                <p className="text-sm text-gray-700">{data.customerName}</p>
                            </div>
                        )}
                        {data.customerEmail && (
                            <div className="flex items-center gap-2">
                                <Mail className="text-gray-400" size={16} />
                                <p className="text-sm text-gray-700">{data.customerEmail}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Special Requests */}
                {data.specialRequests && (
                    <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-start gap-2">
                            <MessageSquare className="text-gray-400 mt-0.5" size={16} />
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Special Requests</p>
                                <p className="text-sm text-gray-700 italic">{data.specialRequests}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={onConfirm}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                    <span>✓</span>
                    <span>Confirm Booking</span>
                </button>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-gray-500 text-center mt-3">
                By confirming, you agree to our terms and conditions
            </p>
        </motion.div>
    );
}
