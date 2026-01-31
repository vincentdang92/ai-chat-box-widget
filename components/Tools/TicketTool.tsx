'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface TicketToolProps {
    data?: {
        subject?: string;
        description?: string;
    };
}

export default function TicketTool({ data }: TicketToolProps) {
    const [formData, setFormData] = useState({
        subject: data?.subject || '',
        description: data?.description || '',
        priority: 'medium' as 'low' | 'medium' | 'high',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
                <div className="text-green-600 font-semibold mb-2">✅ Ticket Created!</div>
                <p className="text-sm text-gray-600">
                    Your support ticket has been created. Ticket ID: <strong>TK-{Date.now()}</strong>
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
            <h4 className="font-semibold text-gray-900 mb-3">🎫 Create Support Ticket</h4>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Subject</label>
                    <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="Brief description of the issue"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-600 mb-1">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                        rows={4}
                        placeholder="Provide more details about your issue..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-600 mb-1">
                        <AlertCircle size={12} className="inline mr-1" />
                        Priority
                    </label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 transition-colors"
                >
                    Submit Ticket
                </button>
            </form>
        </motion.div>
    );
}
