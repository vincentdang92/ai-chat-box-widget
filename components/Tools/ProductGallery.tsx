'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
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
    const { category, products } = data;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-purple-500" size={18} />
                <h3 className="font-semibold text-gray-800 text-sm">{category}</h3>
            </div>

            {/* Products Grid - Optimized for chat widget */}
            <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100 hover:border-purple-300 transition-all hover:shadow-md flex flex-col"
                    >
                        {/* Product Image/Icon */}
                        <div className="text-3xl mb-2 text-center">
                            {product.image}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-xs mb-1 line-clamp-1">
                                {product.name}
                            </h4>
                            <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                                {product.description}
                            </p>
                        </div>

                        {/* Price and Button */}
                        <div className="mt-auto">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-purple-600 font-bold text-sm">
                                    {product.price}
                                </span>
                            </div>
                            <button
                                onClick={() => onBook?.(product.name)}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-1.5 px-3 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 active:scale-95 shadow-sm"
                            >
                                📅 Book Now
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer hint */}
            <p className="text-xs text-gray-500 mt-3 text-center">
                Click "Book Now" to schedule your appointment
            </p>
        </motion.div>
    );
}
