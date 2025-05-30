import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number; // Diameter of the circle
  strokeWidth?: number; // Thickness of the progress line
  circleColor?: string; // Color of the background circle
  progressColor?: string; // Color of the progress arc
  textColor?: string; // Color of the percentage text
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 100, // Default size
  strokeWidth = 10, // Default stroke width
  circleColor = 'text-gray-200', // Tailwind class for gray background
  progressColor = 'text-green-500', // Tailwind class for green progress
  textColor = 'text-gray-800', // Tailwind class for text color
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Ensure percentage is within 0-100 for proper display
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          strokeWidth={strokeWidth}
          stroke={circleColor}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className={circleColor.startsWith('text-') ? circleColor : ''} // Apply Tailwind class if it's a class
        />
        {/* Progress circle */}
        <circle
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={progressColor.startsWith('text-') ? `var(--${progressColor.replace('text-', '')})` : progressColor}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className={`${progressColor.startsWith('text-') ? progressColor : ''} transition-all duration-500 ease-in-out`}
        />
      </svg>
      {/* Percentage Text */}
      <div className={`absolute text-xl font-bold ${textColor}`}>
        {clampedPercentage.toFixed(0)}%
      </div>
    </div>
  );
};

export default CircularProgress;