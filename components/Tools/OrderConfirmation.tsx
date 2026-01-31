'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Calendar, Mail, User, FileText } from 'lucide-react';

interface OrderConfirmationProps {
    data: {
        success: boolean;
        orderId: string;
        productName: string;
        quantity: number;
        customerName?: string;
        customerEmail?: string;
        specialRequests?: string;
        status: string;
        estimatedDelivery: string;
        message: string;
    };
}

export default function OrderConfirmation({ data }: OrderConfirmationProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm"
        >
            {/* Success Header */}
            <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-green-600" size={24} />
                <h4 className="font-semibold text-green-900 text-lg">Order Confirmed!</h4>
            </div>

            {/* Message */}
            <p className="text-sm text-green-800 mb-4 leading-relaxed">
                {data.message}
            </p>

            {/* Order Details */}
            <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                    <Package className="text-gray-500 mt-0.5" size={16} />
                    <div className="flex-1">
                        <p className="text-gray-500 text-xs">Order ID</p>
                        <p className="font-mono font-semibold text-gray-900">{data.orderId}</p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <FileText className="text-gray-500 mt-0.5" size={16} />
                    <div className="flex-1">
                        <p className="text-gray-500 text-xs">Product</p>
                        <p className="font-semibold text-gray-900">
                            {data.productName} × {data.quantity}
                        </p>
                    </div>
                </div>

                {data.customerName && data.customerName !== 'Guest' && (
                    <div className="flex items-start gap-2">
                        <User className="text-gray-500 mt-0.5" size={16} />
                        <div className="flex-1">
                            <p className="text-gray-500 text-xs">Customer</p>
                            <p className="font-semibold text-gray-900">{data.customerName}</p>
                        </div>
                    </div>
                )}

                {data.customerEmail && data.customerEmail !== 'Not provided' && (
                    <div className="flex items-start gap-2">
                        <Mail className="text-gray-500 mt-0.5" size={16} />
                        <div className="flex-1">
                            <p className="text-gray-500 text-xs">Email</p>
                            <p className="font-semibold text-gray-900">{data.customerEmail}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-2">
                    <Calendar className="text-gray-500 mt-0.5" size={16} />
                    <div className="flex-1">
                        <p className="text-gray-500 text-xs">Estimated Delivery</p>
                        <p className="font-semibold text-gray-900">{data.estimatedDelivery}</p>
                    </div>
                </div>

                {data.specialRequests && data.specialRequests !== 'None' && (
                    <div className="pt-2 border-t border-gray-200">
                        <p className="text-gray-500 text-xs mb-1">Special Requests</p>
                        <p className="text-gray-700 italic">{data.specialRequests}</p>
                    </div>
                )}
            </div>

            {/* Status Badge */}
            <div className="mt-3 flex justify-end">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircle size={12} />
                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
            </div>
        </motion.div>
    );
}
