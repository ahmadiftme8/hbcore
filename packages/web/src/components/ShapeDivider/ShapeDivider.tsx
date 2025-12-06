import './ShapeDivider.css';

interface ShapeDividerProps {
  color?: string;
}

export function ShapeDivider({ color }: ShapeDividerProps) {
  const style = color ? ({ '--divider-color': color } as React.CSSProperties) : undefined;

  return (
    <div className="shape-divider">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="shape-divider-svg"
        style={style}
        aria-hidden="true"
      >
        <g className="shape-divider-group">
          <path d="M0 0v100c250 0 375-24 500-48 125 24 250 48 500 48V0H0Z" opacity=".5" />
          <path d="M0 0v4c250 0 375 24 500 48C625 28 750 4 1000 4V0H0Z" />
        </g>
      </svg>
    </div>
  );
}
