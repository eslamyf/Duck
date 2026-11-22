export default function TripToast({ message }) {
  if (!message) return null;

  return (
    <div className="toast-notice" role="status" aria-live="polite">
      {message}
    </div>
  );
}
