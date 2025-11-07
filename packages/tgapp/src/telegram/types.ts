/**
 * Telegram WebApp event types and payloads
 * Based on: https://docs.telegram-mini-apps.com/platform/events
 */

export type TelegramEventType =
  | 'theme_changed'
  | 'viewport_changed'
  | 'main_button_pressed'
  | 'back_button_pressed'
  | 'settings_button_pressed'
  | 'popup_closed'
  | 'qr_text_received'
  | 'clipboard_text_received'
  | 'write_access_requested'
  | 'phone_requested'
  | 'invoice_closed'
  | 'location_requested'
  | 'biometry_info_received'
  | 'biometry_auth_requested'
  | 'biometry_token_updated'
  | 'visibility_changed'
  | 'safe_area_changed'
  | 'content_safe_area_changed'
  | 'device_orientation_changed'
  | 'device_orientation_started'
  | 'device_orientation_failed'
  | 'accelerometer_changed'
  | 'accelerometer_started'
  | 'accelerometer_stopped'
  | 'accelerometer_failed'
  | 'scan_qr_popup_closed'
  | 'secondary_button_pressed'
  | 'reload_iframe'
  | 'set_custom_style'
  | 'prepared_message_sent'
  | 'prepared_message_failed'
  | 'secure_storage_key_saved'
  | 'secure_storage_key_received'
  | 'secure_storage_key_restored'
  | 'secure_storage_cleared'
  | 'secure_storage_failed'
  | 'location_checked'
  | 'custom_method_invoked';

export interface ThemeChangedPayload {
  theme_params: Record<string, string>;
}

export interface ViewportChangedPayload {
  height: number;
  width?: number;
  is_expanded: boolean;
  is_state_stable: boolean;
}

export interface PopupClosedPayload {
  button_id?: string;
}

export interface QrTextReceivedPayload {
  data?: string;
}

export interface ClipboardTextReceivedPayload {
  req_id: string;
  data?: string | null;
}

export interface WriteAccessRequestedPayload {
  status: 'allowed' | 'cancelled';
}

export interface PhoneRequestedPayload {
  status: 'sent' | 'cancelled';
}

export interface InvoiceClosedPayload {
  slug: string;
  status: 'paid' | 'failed' | 'pending' | 'cancelled';
}

export interface LocationRequestedPayload {
  available: boolean;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  course?: number;
  speed?: number;
  horizontal_accuracy?: number;
  vertical_accuracy?: number;
  course_accuracy?: number;
  speed_accuracy?: number;
}

export interface BiometryInfoReceivedPayload {
  available: boolean;
  access_requested: boolean;
  access_granted: boolean;
  device_id: string;
  token_saved: boolean;
  type: 'face' | 'finger';
}

export interface BiometryAuthRequestedPayload {
  status: 'failed' | 'authorized';
  token?: string;
}

export interface BiometryTokenUpdatedPayload {
  status: 'updated' | 'removed';
}

export interface VisibilityChangedPayload {
  is_visible: boolean;
}

export interface SafeAreaChangedPayload {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ContentSafeAreaChangedPayload {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface DeviceOrientationChangedPayload {
  absolute?: boolean;
  alpha: number;
  beta: number;
  gamma: number;
}

export interface DeviceOrientationFailedPayload {
  error: string;
}

export interface AccelerometerChangedPayload {
  x: number;
  y: number;
  z: number;
}

export interface AccelerometerFailedPayload {
  error: string;
}

export type SecondaryButtonPressedPayload = Record<string, never>;

export type ReloadIframePayload = Record<string, never>;

export type SetCustomStylePayload = Record<string, never>;

export type PreparedMessageSentPayload = Record<string, never>;

export interface PreparedMessageFailedPayload {
  error: string;
}

export interface SecureStorageKeySavedPayload {
  req_id: string;
}

export interface SecureStorageKeyReceivedPayload {
  req_id: string;
  value: string | null;
  can_restore?: boolean;
}

export interface SecureStorageKeyRestoredPayload {
  req_id: string;
  value: string | null;
}

export interface SecureStorageClearedPayload {
  req_id: string;
}

export interface SecureStorageFailedPayload {
  req_id: string;
  error?: string;
}

export interface LocationCheckedPayload {
  available: boolean;
  access_requested: boolean;
  access_granted: boolean;
}

export interface CustomMethodInvokedPayload {
  req_id: string;
  result?: unknown;
  error?: string;
}

export type TelegramEventPayload = {
  theme_changed: ThemeChangedPayload;
  viewport_changed: ViewportChangedPayload;
  main_button_pressed: Record<string, never>;
  back_button_pressed: Record<string, never>;
  settings_button_pressed: Record<string, never>;
  popup_closed: PopupClosedPayload;
  qr_text_received: QrTextReceivedPayload;
  clipboard_text_received: ClipboardTextReceivedPayload;
  write_access_requested: WriteAccessRequestedPayload;
  phone_requested: PhoneRequestedPayload;
  invoice_closed: InvoiceClosedPayload;
  location_requested: LocationRequestedPayload;
  biometry_info_received: BiometryInfoReceivedPayload;
  biometry_auth_requested: BiometryAuthRequestedPayload;
  biometry_token_updated: BiometryTokenUpdatedPayload;
  visibility_changed: VisibilityChangedPayload;
  safe_area_changed: SafeAreaChangedPayload;
  content_safe_area_changed: ContentSafeAreaChangedPayload;
  device_orientation_changed: DeviceOrientationChangedPayload;
  device_orientation_started: Record<string, never>;
  device_orientation_failed: DeviceOrientationFailedPayload;
  accelerometer_changed: AccelerometerChangedPayload;
  accelerometer_started: Record<string, never>;
  accelerometer_stopped: Record<string, never>;
  accelerometer_failed: AccelerometerFailedPayload;
  scan_qr_popup_closed: Record<string, never>;
  secondary_button_pressed: SecondaryButtonPressedPayload;
  reload_iframe: ReloadIframePayload;
  set_custom_style: SetCustomStylePayload;
  prepared_message_sent: PreparedMessageSentPayload;
  prepared_message_failed: PreparedMessageFailedPayload;
  secure_storage_key_saved: SecureStorageKeySavedPayload;
  secure_storage_key_received: SecureStorageKeyReceivedPayload;
  secure_storage_key_restored: SecureStorageKeyRestoredPayload;
  secure_storage_cleared: SecureStorageClearedPayload;
  secure_storage_failed: SecureStorageFailedPayload;
  location_checked: LocationCheckedPayload;
  custom_method_invoked: CustomMethodInvokedPayload;
};

export type TelegramEventHandler<T extends TelegramEventType> = (payload: TelegramEventPayload[T]) => void;
