'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, DollarSign, CheckCircle2 } from 'lucide-react';

interface BookingSummaryProps {
    bookingData: {
        serviceName: string;
        date: string;
        time: string;
        customerName?: string;
        customerEmail?: string;
        customerMobile?: string;
        price?: string;
    };
    onConfirm: () => void;
}

export default function BookingSummary({ bookingData, onConfirm }: BookingSummaryProps) {
    const { serviceName, date, time, customerName, customerEmail, customerMobile, price } = bookingData;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 shadow-lg"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-purple-500 p-2 rounded-full">
                    <CheckCircle2 className="text-white" size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-sm">Booking Summary</h3>
                    <p className="text-xs text-gray-600">Please review your booking details</p>
                </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-lg p-3 mb-4 space-y-3">
                {/* Service */}
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <div className="bg-purple-100 p-2 rounded-lg">
                        <span className="text-xl">💅</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Service</p>
                        <p className="font-semibold text-gray-900 text-sm">{serviceName}</p>
                    </div>
                    {price && (
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="font-bold text-purple-600 text-sm">{price}</p>
                        </div>
                    )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-start gap-2">
                        <Calendar className="text-purple-500 mt-0.5" size={16} />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Date</p>
                            <p className="font-semibold text-gray-900 text-xs">{date}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Clock className="text-purple-500 mt-0.5" size={16} />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Time</p>
                            <p className="font-semibold text-gray-900 text-xs">{time}</p>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                {(customerName || customerEmail || customerMobile) && (
                    <div className="space-y-2">
                        <p className="text-xs text-gray-500 font-semibold mb-2">Customer Information</p>
                        {customerName && (
                            <div className="flex items-center gap-2">
                                <User className="text-gray-400" size={14} />
                                <p className="text-xs text-gray-700">{customerName}</p>
                            </div>
                        )}
                        {customerMobile && (
                            <div className="flex items-center gap-2">
                                <Phone className="text-gray-400" size={14} />
                                <p className="text-xs text-gray-700">{customerMobile}</p>
                            </div>
                        )}
                        {customerEmail && (
                            <div className="flex items-center gap-2">
                                <Mail className="text-gray-400" size={14} />
                                <p className="text-xs text-gray-700 break-all">{customerEmail}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Total Amount */}
            {price && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <DollarSign size={18} />
                            <span className="font-semibold text-sm">Total Amount</span>
                        </div>
                        <span className="font-bold text-xl">{price}</span>
                    </div>
                </div>
            )}

            {/* Confirm Button */}
            <button
                onClick={onConfirm}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 active:scale-95 shadow-md text-sm flex items-center justify-center gap-2"
            >
                <CheckCircle2 size={18} />
                Confirm Booking
            </button>

            {/* Footer Note */}
            <p className="text-xs text-gray-500 text-center mt-3">
                You'll receive a confirmation email shortly
            </p>
        </motion.div>
    );
}
