import { useMemo } from 'react';
import type { FirebaseError } from 'firebase/app';
import { extractErrorMessage, isFirebaseError } from '../lib/types/errors';

interface UseErrorHandlerOptions {
  defaultMessage: string;
  firebaseErrorMap?: Record<string, string>;
  onFirebasePopupClosed?: () => void;
}

/**
 * Custom hook for handling errors consistently
 */
export function useErrorHandler(options: UseErrorHandlerOptions) {
  const { defaultMessage, firebaseErrorMap = {}, onFirebasePopupClosed } = options;

  const getFirebaseErrorMessage = useMemo(
    () => (error: FirebaseError): string => {
      const mappedMessage = firebaseErrorMap[error.code];
      if (mappedMessage !== undefined) {
        return mappedMessage;
      }

      // Special handling for popup closed by user
      if (error.code === 'auth/popup-closed-by-user') {
        onFirebasePopupClosed?.();
        return '';
      }

      return `${defaultMessage} (${error.code})`;
    },
    [defaultMessage, firebaseErrorMap, onFirebasePopupClosed],
  );

  const handleError = (error: unknown): string => {
    if (isFirebaseError(error)) {
      return getFirebaseErrorMessage(error);
    }

    return extractErrorMessage(error, defaultMessage);
  };

  return {
    handleError,
    getFirebaseErrorMessage,
  };
}

