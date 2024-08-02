import { Ban } from 'lucide-react';

interface ErrorProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorProps) {
  return (
    <div className="w-full flex rounded-lg bg-red-500 py-1 px-4 items-center gap-3">
      <Ban className="size-5 text-zinc-200" />
      <p className="text-base text-zinc-200">{message}</p>
    </div>
  );
}
