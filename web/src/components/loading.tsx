export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <span className="animate-bounce text-blue-600 text-[60px]">.</span>
      <span className="animate-bounce text-blue-600 text-[80px]">.</span>
      <span className="animate-bounce text-blue-600 text-[100px]">.</span>
      <span className="animate-bounce text-blue-600 text-[120px]">.</span>
    </div>
  );
}
