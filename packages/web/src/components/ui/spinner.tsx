import { cn } from '@/lib/utils';
import './spinner.css';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  return (
    <div
      data-slot="spinner"
      className={cn('spinner', `spinner-${size}`, className)}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <div className="spinner-circle" />
    </div>
  );
}

export { Spinner };

