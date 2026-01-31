import { NextRequest } from 'next/server';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Mock Language Model for demo purposes
class MockLanguageModel {
    specificationVersion = 'v1';
    provider = 'mock';
    modelId = 'mock-model';
    defaultObjectGenerationMode = 'json';

    async doGenerate(): Promise<any> {
        throw new Error('Not implemented');
    }

    async doStream(options: any): Promise<any> {
        // Get the last user message to provide contextual response
        const messages = options.prompt || [];
        const lastMessage = messages[messages.length - 1];
        const userMessage = lastMessage?.content?.[0]?.text?.toLowerCase() || '';

        // Determine websiteKey from system context or default
        let websiteKey = 'nail_demo';
        for (const msg of messages) {
            if (msg.content?.[0]?.websiteKey) {
                websiteKey = msg.content[0].websiteKey;
                break;
            }
        }

        // Contextual response logic
        let mockResponse = '';
        let shouldCallProductGallery = false;

        // Greeting detection
        if (userMessage.match(/^(hi|hello|hey|xin chào|chào)/i)) {
            mockResponse = websiteKey === 'nail_demo'
                ? "Hello! I'm your Nail Studio Assistant. 💅 How can I help you today? Would you like to see our services or book an appointment?"
                : "Welcome! I'm your Travel Guide. ✈️ Are you looking to explore our tour packages or need help planning your trip?";
        }
        // Service/product inquiry - trigger product gallery
        else if (userMessage.match(/(service|product|offer|what do you|show me|see|gallery|menu|package)/i)) {
            mockResponse = websiteKey === 'nail_demo'
                ? "I'd love to show you our services! Here's our gallery. Click 'Book Now' on any service you like. 💅✨"
                : "Here are our amazing tour packages! Click 'Book Now' on any tour to get started. ✈️🌍";
            shouldCallProductGallery = true;
        }
        // Booking/order intent
        else if (userMessage.match(/(book|appointment|schedule|reserve|want to|i'd like)/i)) {
            mockResponse = websiteKey === 'nail_demo'
                ? "Perfect! Let me help you book an appointment. I'll start the booking process for you. 💅"
                : "Wonderful! Let's get your dream vacation booked. Starting the booking process now. ✈️";
        }
        // Date/time responses
        else if (userMessage.match(/(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next week|\d{1,2}\/\d{1,2})/i)) {
            mockResponse = "Perfect! What time would work best for you? We have morning (9am-12pm), afternoon (1pm-5pm), and evening (6pm-8pm) slots available.";
        }
        else if (userMessage.match(/(\d{1,2}:\d{2}|\d{1,2}\s?(am|pm)|morning|afternoon|evening)/i)) {
            mockResponse = "Excellent! Let me prepare your booking summary with all the details. Please review and confirm when ready.";
        }
        // Price inquiry
        else if (userMessage.match(/(price|cost|how much|expensive|cheap)/i)) {
            mockResponse = websiteKey === 'nail_demo'
                ? "Our services range from $25 for a classic manicure to $75 for our deluxe spa package. Would you like to see the full price list?"
                : "Our tours range from $699 for a 4-day city explorer to $1,499 for a 6-day safari experience. Would you like details on a specific package?";
        }
        // Help/general
        else {
            const responses = mockResponses[websiteKey] || mockResponses.nail_demo;
            mockResponse = responses[Math.floor(Math.random() * responses.length)];
        }

        // Simulate streaming by yielding words with delay
        const stream = new ReadableStream({
            async start(controller) {
                // Stream text response
                const words = mockResponse.split(' ');
                for (let i = 0; i < words.length; i++) {
                    const word = words[i] + (i < words.length - 1 ? ' ' : '');
                    controller.enqueue({
                        type: 'text-delta',
                        textDelta: word,
                    });
                    await new Promise(resolve => setTimeout(resolve, 50));
                }

                // If we should call product gallery, add tool call
                if (shouldCallProductGallery) {
                    const toolCallId = `call_${Date.now()}`;

                    // Send tool call
                    controller.enqueue({
                        type: 'tool-call',
                        toolCallId,
                        toolName: 'product_gallery',
                        args: { category: websiteKey === 'nail_demo' ? 'Nail Services' : 'Tour Packages' },
                    });
                }

                controller.enqueue({
                    type: 'finish',
                    finishReason: 'stop',
                    usage: { promptTokens: 10, completionTokens: mockResponse.split(' ').length },
                });
                controller.close();
            },
        });

        return {
            stream,
            rawCall: { rawPrompt: null, rawSettings: {} },
        };
    }
}

// Enhanced mock AI responses with more variety
const mockResponses: Record<string, string[]> = {
    nail_demo: [
        "I'm here to help with all your nail care needs! What would you like to know?",
        "Our nail studio offers premium services. How can I assist you today?",
        "Looking to pamper yourself? I can help you find the perfect service!",
    ],
    tour_demo: [
        "Ready for an adventure? I can help you plan the perfect trip!",
        "Let me help you discover amazing destinations. What interests you?",
        "Travel awaits! How can I help you plan your next journey?",
    ],
};

export async function POST(req: NextRequest) {
    try {
        const { messages, threadId, websiteKey } = await req.json();

        if (!websiteKey) {
            return new Response('Missing websiteKey', { status: 400 });
        }

        // Use mock language model for demo
        const mockModel = new MockLanguageModel();

        // Simulate streaming with mock data
        const result = streamText({
            model: mockModel as any,
            messages,
            tools: {
                booking_tool: tool({
                    description: 'Book an appointment or service',
                    parameters: z.object({
                        serviceType: z.string().describe('Type of service (e.g., manicure, tour)'),
                        serviceName: z.string().describe('Specific service name'),
                        date: z.string().describe('Preferred date'),
                        time: z.string().describe('Preferred time'),
                        customerName: z.string().optional().describe('Customer name'),
                        customerEmail: z.string().optional().describe('Customer email'),
                        specialRequests: z.string().optional().describe('Any special requests'),
                    }),
                    execute: async ({ serviceType, serviceName, date, time, customerName, customerEmail, specialRequests }) => {
                        const priceMap: Record<string, string> = {
                            'Classic Manicure': '$25',
                            'Gel Nails': '$45',
                            'Nail Art': '$60',
                            'Deluxe Spa Package': '$75',
                            'Beach Paradise': '$1,299',
                            'Mountain Adventure': '$899',
                            'City Explorer': '$699',
                            'Safari Experience': '$1,499',
                        };

                        const price = priceMap[serviceName] || 'Contact for pricing';

                        return {
                            success: true,
                            requiresConfirmation: true,
                            serviceType,
                            serviceName,
                            date,
                            time,
                            price,
                            customerName: customerName || '',
                            customerEmail: customerEmail || '',
                            specialRequests: specialRequests || '',
                        };
                    },
                }),
                product_gallery: tool({
                    description: 'Show product or service gallery',
                    parameters: z.object({
                        category: z.string().describe('Product category'),
                    }),
                    execute: async ({ category }) => {
                        const products = websiteKey === 'nail_demo'
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
                            ];

                        return {
                            category,
                            products,
                        };
                    },
                }),
                confirm_booking: tool({
                    description: 'Confirm and finalize a booking',
                    parameters: z.object({
                        serviceName: z.string().describe('Service being booked'),
                        date: z.string().describe('Booking date'),
                        time: z.string().describe('Booking time'),
                    }),
                    execute: async ({ serviceName, date, time }) => {
                        await new Promise(resolve => setTimeout(resolve, 500));

                        const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

                        return {
                            success: true,
                            bookingId,
                            serviceName,
                            date,
                            time,
                            status: 'confirmed',
                            message: `🎉 Booking confirmed! Your booking #${bookingId} has been successfully confirmed. We'll see you on ${date} at ${time}!`,
                        };
                    },
                }),
            },
            maxSteps: 5,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('Error in chat route:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
