# AI Chat SDK Widget

A multi-tenant, embeddable AI Chat SDK widget for Next.js 16 that dynamically fetches configurations via Dashboard API and streams responses through a centralized gateway.

## ✨ Features

- 🎨 **Dynamic Theming** - Automatically adapts colors and branding based on `website_key`
- ⚡ **AI Streaming** - Real-time streaming responses with Vercel AI SDK
- 🔧 **Generative UI** - Interactive components for booking, ticketing, and product galleries
- 💾 **Thread Persistence** - Maintains conversation history across page reloads
- 🎭 **Multi-tenant** - Support multiple websites with different configurations
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_DASHBOARD_API_URL=https://your-dashboard.com/api/v1
DASHBOARD_API_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-your-openai-key-here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## 📖 Usage

### Basic Integration

```tsx
import { AgentProvider } from '@/lib';
import ChatWidget from '@/components/ChatWidget';

export default function App() {
  return (
    <AgentProvider websiteKey="your_website_key">
      <ChatWidget />
    </AgentProvider>
  );
}
```

### Available Demos

The project includes two demo configurations:

- **`nail_demo`** - Nail Studio Assistant (Pink theme)
- **`tour_demo`** - Travel Guide (Blue theme)

## 🏗️ Architecture

### Core Components

- **`AgentProvider`** - Context provider that fetches configuration and manages theming
- **`ChatWidget`** - Main widget with FAB and chat window
- **`ChatWindow`** - Chat interface with messages and input
- **`MessageList`** - Renders messages with streaming support

### API Routes

- **`/api/widget/config`** - Returns widget configuration based on `website_key`
- **`/api/chat`** - Streaming chat endpoint with tool calling support

### Generative UI Tools

- **`BookingTool`** - Interactive booking form
- **`TicketTool`** - Support ticket creation
- **`ProductGallery`** - Product/service carousel

## 🎨 Theming

The widget uses CSS variables for dynamic theming:

```css
--primary-color: #3B82F6;
--primary-dark: #2563EB;
--primary-light: #60A5FA;
--background: #FFFFFF;
--foreground: #000000;
```

Colors are automatically calculated and applied based on the `primaryColor` from the configuration.

## 🔧 Configuration

Widget configuration structure:

```typescript
interface WidgetConfig {
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
```

## 📦 Tech Stack

- **Next.js 16** - App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Vercel AI SDK** - Streaming and tool calling
- **Lucide React** - Icons

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
