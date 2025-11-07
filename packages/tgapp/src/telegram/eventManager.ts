/**
 * Telegram WebApp Event Manager
 * Provides a centralized, type-safe way to handle Telegram events
 */

import type { TelegramEventHandler, TelegramEventPayload, TelegramEventType } from './types';

type EventListenerMap = Partial<{
  [K in TelegramEventType]: Set<TelegramEventHandler<K>>;
}>;

/**
 * Event Manager for Telegram WebApp events
 * Handles registration, unregistration, and dispatching of events
 */
export class TelegramEventManager {
  private listeners: EventListenerMap = {};
  private webApp: NonNullable<typeof window.Telegram>['WebApp'] | null = null;
  private isInitialized = false;
  private eventHandlers: Map<string, () => void> = new Map();

  /**
   * Initialize the event manager with Telegram WebApp instance
   */
  initialize(webApp: NonNullable<typeof window.Telegram>['WebApp']): void {
    // Always update webApp reference in case it changes
    this.webApp = webApp;

    // Only setup event listeners once
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.setupEventListeners();
    }
  }

  /**
   * Register an event handler for a specific event type
   */
  on<T extends TelegramEventType>(eventType: T, handler: TelegramEventHandler<T>): () => void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = new Set() as EventListenerMap[T];
    }

    const handlerSet = this.listeners[eventType] as Set<TelegramEventHandler<T>>;
    if (handlerSet) {
      handlerSet.add(handler);
    }

    // Return unsubscribe function
    return () => {
      this.off(eventType, handler);
    };
  }

  /**
   * Unregister an event handler
   */
  off<T extends TelegramEventType>(eventType: T, handler: TelegramEventHandler<T>): void {
    const handlerSet = this.listeners[eventType] as Set<TelegramEventHandler<T>>;
    if (handlerSet) {
      handlerSet.delete(handler);
    }
  }

  /**
   * Dispatch an event to all registered handlers
   */
  private dispatch<T extends TelegramEventType>(eventType: T, payload: TelegramEventPayload[T]): void {
    const handlerSet = this.listeners[eventType] as Set<TelegramEventHandler<T>>;
    if (handlerSet) {
      handlerSet.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Setup event listeners using Telegram WebApp API
   */
  private setupEventListeners(): void {
    if (!this.webApp) {
      return;
    }

    // Handle theme_changed event
    const themeChangedHandler = () => {
      if (!this.webApp) return;
      const themeParams = this.webApp.themeParams || {};
      console.log('[TelegramEventManager] Theme changed event received', {
        colorScheme: this.webApp.colorScheme,
        themeParams,
      });
      this.dispatch('theme_changed', {
        theme_params: themeParams as Record<string, string>,
      });
    };
    this.webApp.onEvent('themeChanged', themeChangedHandler);
    this.eventHandlers.set('themeChanged', themeChangedHandler);
    console.log('[TelegramEventManager] Theme change listener registered');

    // Handle viewport_changed event
    const viewportChangedHandler = () => {
      if (!this.webApp) return;

      this.dispatch('viewport_changed', {
        height: this.webApp.viewportHeight,
        is_expanded: this.webApp.isExpanded,
        is_state_stable: true, // Telegram doesn't provide this directly
      });
    };
    this.webApp.onEvent('viewportChanged', viewportChangedHandler);
    this.eventHandlers.set('viewportChanged', viewportChangedHandler);

    // Handle main_button_pressed event
    const mainButtonHandler = () => {
      this.dispatch('main_button_pressed', {});
    };
    this.webApp.MainButton.onClick(mainButtonHandler);
    this.eventHandlers.set('mainButton', mainButtonHandler);

    // Handle back_button_pressed event
    if ('BackButton' in this.webApp && this.webApp.BackButton) {
      const backButtonHandler = () => {
        this.dispatch('back_button_pressed', {});
      };
      this.webApp.BackButton.onClick(backButtonHandler);
      this.eventHandlers.set('backButton', backButtonHandler);
    }

    // Add more event listeners as needed
    // The Telegram WebApp API uses onEvent for some events
    // and specific methods (like MainButton.onClick) for others
  }

  /**
   * Cleanup all event listeners
   */
  cleanup(): void {
    if (!this.webApp) {
      return;
    }

    // Remove all event listeners using stored handlers
    const themeHandler = this.eventHandlers.get('themeChanged');
    if (themeHandler) {
      this.webApp.offEvent('themeChanged', themeHandler);
    }

    const viewportHandler = this.eventHandlers.get('viewportChanged');
    if (viewportHandler) {
      this.webApp.offEvent('viewportChanged', viewportHandler);
    }

    // MainButton doesn't have offClick, so we can't remove it
    // This is fine as the button handlers are typically persistent

    const backButtonHandler = this.eventHandlers.get('backButton');
    if (backButtonHandler && 'BackButton' in this.webApp && this.webApp.BackButton) {
      this.webApp.BackButton.offClick(backButtonHandler);
    }

    // Clear all registered handlers
    this.listeners = {};
    this.eventHandlers.clear();
    this.isInitialized = false;
    this.webApp = null;
  }
}

// Singleton instance
export const telegramEventManager = new TelegramEventManager();
