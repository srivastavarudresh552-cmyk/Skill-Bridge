import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div className="bg-warning-600 px-4 py-2 text-center text-sm font-medium text-white">
      You're offline. Some features won't work until your connection is restored.
    </div>
  );
}