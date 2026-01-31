import { NextRequest, NextResponse } from 'next/server';
import { WidgetConfig } from '@/lib/types';

// Mock configurations for demo purposes
const MOCK_CONFIGS: Record<string, WidgetConfig> = {
    nail_demo: {
        websiteKey: 'nail_demo',
        botName: 'Nail Studio Assistant',
        botAvatar: '💅',
        primaryColor: '#EC4899',
        secondaryColor: '#F9A8D4',
        knowledgeBaseId: 'nail-kb-001',
        features: {
            booking: true,
            ticketing: true,
            productGallery: true,
        },
        branding: {
            poweredByText: 'Powered by AI Chat SDK',
            poweredByUrl: 'https://example.com',
        },
    },
    tour_demo: {
        websiteKey: 'tour_demo',
        botName: 'Travel Guide',
        botAvatar: '✈️',
        primaryColor: '#3B82F6',
        secondaryColor: '#93C5FD',
        knowledgeBaseId: 'tour-kb-001',
        features: {
            booking: true,
            ticketing: true,
            productGallery: true,
        },
        branding: {
            poweredByText: 'Powered by AI Chat SDK',
            poweredByUrl: 'https://example.com',
        },
    },
};

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const websiteKey = searchParams.get('websiteKey');

        if (!websiteKey) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing websiteKey parameter',
                },
                { status: 400 }
            );
        }

        // In production, fetch from your Dashboard API
        // const response = await fetch(`${process.env.DASHBOARD_API_URL}/widget/config`, {
        //   headers: {
        //     'X-Website-Key': websiteKey,
        //     'Authorization': `Bearer ${process.env.DASHBOARD_API_SECRET}`,
        //   },
        // });

        // For demo, use mock data
        const config = MOCK_CONFIGS[websiteKey];

        if (!config) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid websiteKey',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: config,
        });
    } catch (error) {
        console.error('Error in config route:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
            },
            { status: 500 }
        );
    }
}
