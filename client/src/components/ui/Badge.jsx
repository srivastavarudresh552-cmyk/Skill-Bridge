const styles = {
  high: 'bg-danger-50 text-danger-700 ring-1 ring-inset ring-danger-100',
  medium: 'bg-warning-50 text-warning-600 ring-1 ring-inset ring-warning-100',
  low: 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200',
  success: 'bg-success-50 text-success-700 ring-1 ring-inset ring-success-100',
};

export default function Badge({ tone = 'low', children }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles[tone] || styles.low}`}>
      {children}
    </span>
  );
}