'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price?: string;
    image: string;
}

interface ProductGalleryProps {
    data: {
        category: string;
        products: Product[];
    };
    onBook?: (productName: string) => void;
}

export default function ProductGallery({ data, onBook }: ProductGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextProduct = () => {
        setCurrentIndex((prev) => (prev + 1) % data.products.length);
    };

    const prevProduct = () => {
        setCurrentIndex((prev) => (prev - 1 + data.products.length) % data.products.length);
    };

    const currentProduct = data.products[currentIndex];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
            <h4 className="font-semibold text-gray-900 mb-3">🛍️ {data.category}</h4>

            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center"
                    >
                        <div className="text-5xl mb-3">{currentProduct.image}</div>
                        <h5 className="font-semibold text-lg text-gray-900 mb-1">
                            {currentProduct.name}
                        </h5>
                        <p className="text-sm text-gray-600 mb-2">{currentProduct.description}</p>
                        {currentProduct.price && (
                            <p className="text-xl font-bold text-blue-600">{currentProduct.price}</p>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                {data.products.length > 1 && (
                    <div className="flex justify-between items-center mt-3">
                        <button
                            onClick={prevProduct}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex gap-1">
                            {data.products.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextProduct}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={() => onBook?.(currentProduct.name)}
                className="w-full mt-3 bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 transition-colors text-sm"
            >
                📅 Book Now
            </button>
        </motion.div>
    );
}
