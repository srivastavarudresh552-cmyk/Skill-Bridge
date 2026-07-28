export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="card animate-fade-in-up flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}