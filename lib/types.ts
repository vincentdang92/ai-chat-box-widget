// Widget Configuration Types
export interface WidgetConfig {
    websiteKey: string;
    botName: string;
    botAvatar: string;
    primaryColor: string;
    secondaryColor?: string;
    knowledgeBaseId: string;
    features: {
        booking: boolean;
        ticketing: boolean;
        productGallery: boolean;
    };
    branding: {
        poweredByText?: string;
        poweredByUrl?: string;
    };
}

// Chat Message Types
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    toolCalls?: ToolCall[];
    ui?: React.ReactNode;
}

// Tool Call Types
export interface ToolCall {
    id: string;
    name: 'booking_tool' | 'ticket_tool' | 'product_gallery';
    arguments: Record<string, any>;
    result?: any;
}

// Booking Tool Types
export interface BookingData {
    serviceType: string;
    serviceName: string;
    date: string;
    time: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
}

// Ticket Tool Types
export interface TicketData {
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    attachments?: File[];
}

// Product Gallery Types
export interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    price?: string;
    category?: string;
}

// Theme Configuration
export interface ThemeConfig {
    primaryColor: string;
    primaryDark: string;
    primaryLight: string;
    background: string;
    foreground: string;
}

// API Response Types
export interface ConfigResponse {
    success: boolean;
    data: WidgetConfig;
    error?: string;
}

export interface ChatStreamRequest {
    messages: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
    }>;
    threadId: string;
    websiteKey: string;
}

// Agent Context Types
export interface AgentContextValue {
    config: WidgetConfig | null;
    loading: boolean;
    error: string | null;
    theme: ThemeConfig | null;
    refreshConfig: () => Promise<void>;
}
