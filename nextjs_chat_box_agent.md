# prompt: Create a Multi-tenant AI Chat SDK for Next.js 16 (Dashboard-Integrated)

## Context
Build a high-end, embeddable AI Chat SDK widget. Instead of hardcoding AI providers, this SDK fetches configurations and streams responses via a centralized Dashboard API using a unique `website_key`.

## Core Logic (Architecture)
1. **On Mount:** SDK sends `website_key` to your Dashboard API (`/api/v1/widget/config`) to get:
    - Bot name, avatar, primary colors.
    - Knowledge base context ID.
    - Enabled features (Booking, Ticketing).
2. **Chat Flux:** All messages are sent to your Dashboard Gateway (`/api/v1/chat/stream`) which acts as a proxy between the user and the LLM (Ollama/Qwen/GPT).

## Tech Stack
- **Next.js 16** (App Router) + **Tailwind CSS**.
- **Vercel AI SDK** (Streaming & Tool Calling).
- **Framer Motion** (Interaction animations).
- **State Management:** React Context to handle `website_key` and configurations.

## SDK Component Structure

### 1. Provider Wrapper: `<AgentProvider websiteKey="YOUR_KEY" />`
- Fetches branding and settings from `https://your-dashboard.com/api/v1/widget/config`.
- Supplies theme colors dynamically to Tailwind/CSS variables.

### 2. Main Entry: `<ChatWidget />`
- Floating Action Button (FAB) with dynamic branding.
- Chat window with "Power by YourBrand" footer.

### 3. API Integration: `app/api/chat/route.ts` (Proxy Mode)
- Headers must include `X-Website-Key`.
- Forward the payload to your Dashboard endpoint.
- Support **Generative UI** for:
    - **`booking_tool`**: Displays a scheduling card (Nails/Tours).
    - **`ticket_tool`**: Displays a form for support requests.
    - **`product_gallery`**: Displays a slider of services.

## Detailed UI/UX Requirements
- **Dynamic Theming:** CSS Variables (`--primary-color`) should update based on the Dashboard config.
- **Message Types:** - `text`: Standard streaming text.
    - `ui-component`: Interactive cards (Forms, Selection chips).
- **Persistence:** Save `thread_id` in `localStorage` to keep the conversation across page reloads.

## Mock Data Implementation (For local testing)
- If `website_key === 'nail_demo'`: Show Pink theme, Nails services.
- If `website_key === 'tour_demo'`: Show Blue theme, Tour packages.

## Instructions for Cursor/Copilot
- Implement `ChatWidget` as a **Client Component**.
- Use `framer-motion` for "Slide-in" and "Bounce" effects.
- Ensure the chat input supports auto-resize and "Enter to send".
- **Security:** Ensure the `website_key` is passed in the header of every stream request.