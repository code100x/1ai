import { useEffect, RefObject } from 'react';

interface UseGlobalKeyPressOptions {
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  onKeyPress: (key: string) => void;
  disabled?: boolean;
  loading?: boolean;
  preventFocus?: boolean;
}

export const useGlobalKeyPress = ({
  inputRef,
  onKeyPress,
  disabled = false,
  loading = false,
  preventFocus = false,
}: UseGlobalKeyPressOptions) => {
  useEffect(() => {
    const handleGlobalKeyPress = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused = 
        activeElement?.tagName.toLowerCase() === 'input' ||
        activeElement?.tagName.toLowerCase() === 'textarea' ||
        activeElement?.hasAttribute('contenteditable') ||
        activeElement?.closest('[contenteditable]') ||
        activeElement?.hasAttribute('role') && activeElement.getAttribute('role') === 'textbox';
      // Only focus input if:
      // 1. No input is currently focused
      // 2. The key is a printable character (not special keys)
      // 3. No modifier keys are pressed (except shift for uppercase)
      // 4. Input is not disabled
      // 5. Not currently loading
      // 6. No additional prevent condition is set
      if (
        !isInputFocused &&
        !disabled &&
        !loading &&
        !preventFocus &&
        inputRef.current &&
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        inputRef.current.focus();
        
        onKeyPress(event.key);
        
        event.preventDefault();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyPress);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress);
    };
  }, [inputRef, onKeyPress, disabled, loading, preventFocus]);
};
