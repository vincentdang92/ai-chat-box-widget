'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

interface BookingToolProps {
    websiteKey: string;
    onComplete: (bookingData: {
        serviceName: string;
        date: string;
        time: string;
    }) => void;
}

const services = {
    nail_demo: [
        { name: 'Classic Manicure', price: '$25', emoji: '💅' },
        { name: 'Gel Nails', price: '$45', emoji: '✨' },
        { name: 'Nail Art', price: '$60', emoji: '🎨' },
        { name: 'Deluxe Spa Package', price: '$75', emoji: '💆' },
    ],
    tour_demo: [
        { name: 'Beach Paradise', price: '$1,299', emoji: '🏖️' },
        { name: 'Mountain Adventure', price: '$899', emoji: '⛰️' },
        { name: 'City Explorer', price: '$699', emoji: '🏙️' },
        { name: 'Safari Experience', price: '$1,499', emoji: '🦁' },
    ],
};

export default function BookingTool({ websiteKey, onComplete }: BookingToolProps) {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const serviceList = services[websiteKey as keyof typeof services] || services.nail_demo;

    const handleServiceSelect = (service: { name: string; price: string }) => {
        setSelectedService(service.name);
        setSelectedPrice(service.price);
        setStep(2);
    };

    const handleDateSubmit = () => {
        if (date) setStep(3);
    };

    const handleTimeSubmit = () => {
        if (time) {
            setStep(4);
            // Trigger the booking summary
            onComplete({
                serviceName: selectedService,
                date,
                time,
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-md"
        >
            {/* Step 1: Service Selection */}
            {step === 1 && (
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Select a Service</h4>
                    <div className="space-y-2">
                        {serviceList.map((service) => (
                            <button
                                key={service.name}
                                onClick={() => handleServiceSelect(service)}
                                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{service.emoji}</span>
                                    <div>
                                        <p className="font-semibold text-gray-900">{service.name}</p>
                                        <p className="text-sm text-gray-600">{service.price}</p>
                                    </div>
                                </div>
                                <span className="text-blue-500">→</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Date Selection */}
            {step === 2 && (
                <div>
                    <div className="mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>Service: {selectedService}</span>
                        </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar size={20} />
                        Select Date
                    </h4>
                    <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="e.g., Tomorrow, Feb 1, Monday"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                        autoFocus
                    />
                    <button
                        onClick={handleDateSubmit}
                        disabled={!date}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Continue
                    </button>
                </div>
            )}

            {/* Step 3: Time Selection */}
            {step === 3 && (
                <div>
                    <div className="mb-4 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>Service: {selectedService}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>Date: {date}</span>
                        </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Clock size={20} />
                        Select Time
                    </h4>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        {['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'].map((timeSlot) => (
                            <button
                                key={timeSlot}
                                onClick={() => setTime(timeSlot)}
                                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${time === timeSlot
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                                    }`}
                            >
                                {timeSlot}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="Or enter custom time"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    />
                    <button
                        onClick={handleTimeSubmit}
                        disabled={!time}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Review Booking
                    </button>
                </div>
            )}
        </motion.div>
    );
}
