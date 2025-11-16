interface ProgressBarProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ percentage, label, showPercentage = true }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">{label}</span>
          {showPercentage && <span className="font-semibold text-ace-blue">{percentage}%</span>}
        </div>
      )}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
