'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, CheckCircle } from 'lucide-react';

interface BookingToolProps {
    websiteKey: string;
    selectedService?: string;
    onComplete: (bookingData: {
        serviceName: string;
        date: string;
        time: string;
        customerName: string;
        customerEmail: string;
        customerMobile: string;
        price: string;
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

const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
];

export default function BookingTool({ websiteKey, selectedService, onComplete }: BookingToolProps) {
    const [step, setStep] = useState(selectedService ? 2 : 1);
    const [service, setService] = useState(selectedService || '');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerMobile, setCustomerMobile] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const serviceList = services[websiteKey as keyof typeof services] || services.nail_demo;

    // Find price for selected service
    React.useEffect(() => {
        if (service) {
            const found = serviceList.find(s => s.name === service);
            if (found) setPrice(found.price);
        }
    }, [service, serviceList]);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone: string) => {
        return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };

    const handleServiceSelect = (serviceName: string, servicePrice: string) => {
        setService(serviceName);
        setPrice(servicePrice);
        setStep(2);
    };

    const handleDateSubmit = () => {
        if (!date) {
            setErrors({ date: 'Please select a date' });
            return;
        }
        setErrors({});
        setStep(3);
    };

    const handleTimeSubmit = () => {
        if (!time) {
            setErrors({ time: 'Please select a time' });
            return;
        }
        setErrors({});
        setStep(4);
    };

    const handleUserInfoSubmit = () => {
        const newErrors: Record<string, string> = {};

        if (!customerName.trim()) newErrors.name = 'Name is required';
        if (!customerEmail.trim()) newErrors.email = 'Email is required';
        else if (!validateEmail(customerEmail)) newErrors.email = 'Invalid email format';
        if (!customerMobile.trim()) newErrors.mobile = 'Mobile number is required';
        else if (!validatePhone(customerMobile)) newErrors.mobile = 'Invalid phone number';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onComplete({
            serviceName: service,
            date,
            time,
            customerName,
            customerEmail,
            customerMobile,
            price,
        });
    };

    // Generate next 14 days for date picker
    const getNextDays = () => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push({
                label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                value: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            });
        }
        return days;
    };

    const availableDays = getNextDays();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${step >= s ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                            {step > s ? '✓' : s}
                        </div>
                        {s < 4 && <div className={`flex-1 h-1 mx-1 ${step > s ? 'bg-purple-500' : 'bg-gray-200'}`} />}
                    </div>
                ))}
            </div>

            {/* Step 1: Service Selection */}
            {step === 1 && (
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Select a Service</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {serviceList.map((s) => (
                            <button
                                key={s.name}
                                onClick={() => handleServiceSelect(s.name, s.price)}
                                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{s.emoji}</span>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                                        <p className="text-xs text-purple-600 font-semibold">{s.price}</p>
                                    </div>
                                </div>
                                <span className="text-purple-500">→</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Date Selection */}
            {step === 2 && (
                <div>
                    <div className="mb-3 p-2 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                            <CheckCircle size={14} className="text-green-500" />
                            <span className="font-semibold">{service}</span>
                            <span className="ml-auto text-purple-600 font-bold">{price}</span>
                        </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                        <Calendar size={16} />
                        Select Date
                    </h4>
                    <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto mb-3">
                        {availableDays.map((day) => (
                            <button
                                key={day.value}
                                onClick={() => setDate(day.value)}
                                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${date === day.value
                                        ? 'bg-purple-600 text-white border-purple-600'
                                        : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                                    }`}
                            >
                                {day.label}
                            </button>
                        ))}
                    </div>
                    {errors.date && <p className="text-red-500 text-xs mb-2">{errors.date}</p>}
                    <button
                        onClick={handleDateSubmit}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
                    >
                        Continue
                    </button>
                </div>
            )}

            {/* Step 3: Time Selection */}
            {step === 3 && (
                <div>
                    <div className="mb-3 p-2 bg-purple-50 rounded-lg space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                            <CheckCircle size={14} className="text-green-500" />
                            <span>{service} - {price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                            <CheckCircle size={14} className="text-green-500" />
                            <span>{date}</span>
                        </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                        <Clock size={16} />
                        Select Time
                    </h4>
                    <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto mb-3">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setTime(slot)}
                                className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors ${time === slot
                                        ? 'bg-purple-600 text-white border-purple-600'
                                        : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                                    }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                    {errors.time && <p className="text-red-500 text-xs mb-2">{errors.time}</p>}
                    <button
                        onClick={handleTimeSubmit}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
                    >
                        Continue
                    </button>
                </div>
            )}

            {/* Step 4: User Information */}
            {step === 4 && (
                <div>
                    <div className="mb-3 p-2 bg-purple-50 rounded-lg space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                            <CheckCircle size={14} className="text-green-500" />
                            <span>{service} - {price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                            <CheckCircle size={14} className="text-green-500" />
                            <span>{date} at {time}</span>
                        </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Your Information</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                                <User size={14} />
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="John Doe"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                autoFocus
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                                <Phone size={14} />
                                Mobile Number *
                            </label>
                            <input
                                type="tel"
                                value={customerMobile}
                                onChange={(e) => setCustomerMobile(e.target.value)}
                                placeholder="+1 (555) 123-4567"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${errors.mobile ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                                <Mail size={14} />
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                placeholder="john@example.com"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>
                    <button
                        onClick={handleUserInfoSubmit}
                        className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
                    >
                        Review Booking
                    </button>
                </div>
            )}
        </motion.div>
    );
}
