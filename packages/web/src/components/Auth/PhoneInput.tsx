'use client';

import * as React from 'react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import './PhoneInput.css';

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onRawInputChange?: (value: string) => void; // Callback for raw input value
  disabled?: boolean;
  placeholder?: string;
}

type PhoneInputComponentProps = Omit<React.ComponentProps<'input'>, 'onChange' | 'value' | 'ref'> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void;
    onRawInputChange?: (value: string) => void;
  };

const PhoneInputInternal: React.ForwardRefExoticComponent<PhoneInputComponentProps> = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputComponentProps
>(({ className, onChange, value, disabled, onRawInputChange, ...props }, ref) => {
  // Use a ref to store the latest onRawInputChange callback
  // This allows us to create a stable input component wrapper that doesn't change on every render
  const onRawInputChangeRef = React.useRef(onRawInputChange);
  React.useEffect(() => {
    onRawInputChangeRef.current = onRawInputChange;
  }, [onRawInputChange]);

  // Create a stable input component function that never changes
  // This prevents the input from being recreated on every render, which causes focus loss
  const inputComponentWrapper = React.useCallback(
    (inputProps: React.ComponentProps<'input'> & { onRawInputChange?: (value: string) => void }) => (
      <InputComponent {...inputProps} onRawInputChange={onRawInputChangeRef.current} />
    ),
    [], // Empty deps - callback is stable, uses ref for latest value
  );

  return (
    <RPNInput.default
      ref={ref}
      className={cn('flex flex-row PhoneInput', className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={inputComponentWrapper}
      smartCaret={false}
      country="IR"
      defaultCountry="IR"
      value={value || undefined}
      disabled={disabled}
      /**
       * Handles the onChange event.
       *
       * react-phone-number-input returns E.164 format when valid, undefined otherwise.
       * We pass the value (or empty string) to parent, which will handle normalization.
       *
       * @param {E164Number | undefined} value - The entered value in E.164 format or undefined
       */
      onChange={(value) => {
        // Pass the value to parent (could be E.164 format or undefined)
        // Parent component will handle normalization from raw input if needed
        onChange?.(value || ('' as RPNInput.Value));
      }}
      {...props}
    />
  );
});
PhoneInputInternal.displayName = 'PhoneInputInternal';

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & { onRawInputChange?: (value: string) => void }
>(({ className, value, onChange, onBlur, onRawInputChange, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Notify parent of raw input value (for normalization when library returns undefined)
    onRawInputChange?.(inputValue);

    // Pass the change event to the library
    onChange?.(e);
  };

  return (
    <Input
      ref={ref}
      className={cn('rounded-s-none rounded-e-lg', className)}
      dir="ltr"
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      {...props}
    />
  );
});
InputComponent.displayName = 'InputComponent';

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: Array<{ label: string; value: RPNInput.Country | undefined }>;
  onChange: (country: RPNInput.Country) => void;
};

// Simplified CountrySelect that only shows the flag, no dropdown
const CountrySelect = ({ value: selectedCountry }: CountrySelectProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="flex gap-1 rounded-s-lg rounded-e-none border-r-0 px-3 focus:z-10 cursor-default"
      disabled={true}
      aria-label="Country: Iran"
      tabIndex={-1}
    >
      <FlagComponent country={selectedCountry} countryName="Iran" />
    </Button>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

// Export wrapper component that matches the expected interface
export function PhoneInput({ value, onChange, onRawInputChange, disabled, placeholder }: PhoneInputProps) {
  return (
    <PhoneInputInternal
      value={value}
      onChange={(val) => onChange(val || '')}
      onRawInputChange={onRawInputChange}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
}
