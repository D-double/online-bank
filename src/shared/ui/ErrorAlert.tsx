export const ErrorAlert = ({ message }: { message: string }) => (
  <p role="alert" className="rounded-xl bg-negative/10 p-3 text-sm text-negative">
    {message}
  </p>
);
