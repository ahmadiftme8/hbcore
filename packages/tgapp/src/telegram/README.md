# Telegram Event System

A clean, extensible event handling system for Telegram Mini Apps events.

## Architecture

```
src/telegram/
├── types.ts              # Event type definitions and payloads
├── eventManager.ts        # Central event manager (singleton)
├── events/               # Individual event handlers
│   ├── themeChanged.ts   # Theme change handler
│   └── index.ts         # Central export
└── hooks/
    └── useTelegramEvents.ts  # React hook for event initialization
```

## Usage

### 1. Initialize Events in Your App

```tsx
import { useTelegramEvents } from "@/telegram/hooks/useTelegramEvents";

function App() {
  useTelegramEvents(); // Initialize event system
  
  return <YourApp />;
}
```

### 2. Register Event Handlers

```tsx
import { telegramEventManager } from "@/telegram/eventManager";

// In your component
useEffect(() => {
  const unsubscribe = telegramEventManager.on("theme_changed", (payload) => {
    console.log("Theme changed:", payload.theme_params);
    // Handle theme change
  });
  
  return unsubscribe; // Cleanup on unmount
}, []);
```

### 3. Add New Event Handlers

1. Create a handler file in `src/telegram/events/`:

```typescript
// src/telegram/events/viewportChanged.ts
import type { ViewportChangedPayload } from "../types";

export function handleViewportChanged(payload: ViewportChangedPayload) {
  console.log("Viewport changed:", payload);
  // Handle viewport change
}
```

2. Register it in `useTelegramEvents.ts`:

```typescript
telegramEventManager.on("viewport_changed", handleViewportChanged);
```

3. Export from `events/index.ts`:

```typescript
export { handleViewportChanged } from "./viewportChanged";
```

## Available Events

All Telegram events are typed and available. See `types.ts` for the complete list, including:

- `theme_changed` - Theme changes (including dark mode)
- `viewport_changed` - Viewport size changes
- `main_button_pressed` - Main button clicks
- `back_button_pressed` - Back button clicks
- And many more...

## Design Patterns

### Singleton Event Manager
- Centralized event handling
- Type-safe event registration
- Automatic cleanup

### Separation of Concerns
- Event handlers are isolated in `events/` folder
- Each handler is a pure function
- Easy to test and maintain

### Type Safety
- Full TypeScript support
- Event payloads are strongly typed
- Compile-time error checking

## Adding New Events

1. Add event type to `TelegramEventType` in `types.ts`
2. Define payload interface in `types.ts`
3. Add to `TelegramEventPayload` mapping
4. Create handler in `events/` folder
5. Register in `eventManager.setupEventListeners()`
6. Export from `events/index.ts`

## References

- [Telegram Mini Apps Events Documentation](https://docs.telegram-mini-apps.com/platform/events)
- [Theme Changed Event](https://docs.telegram-mini-apps.com/platform/events#theme-changed)

