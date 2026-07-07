interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#EEF0FF] dark:bg-[#6F7CFF]/20 flex items-center justify-center text-[#6F7CFF] mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-calm-text dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-sm text-calm-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}
