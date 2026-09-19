export function Loading({ message = 'Please wait...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <div className="text-[11px] text-black font-normal">{message}</div>
      {/* Classic Windows 95/98 Segmented Blue Progress Bar */}
      <div className="win98-sunken w-48 h-5 p-0.5 flex gap-0.5 bg-white overflow-hidden">
        <div className="h-full w-3 bg-[#000080]" />
        <div className="h-full w-3 bg-[#000080]" />
        <div className="h-full w-3 bg-[#000080]" />
        <div className="h-full w-3 bg-[#000080]" />
        <div className="h-full w-3 bg-[#000080]" />
        <div className="h-full w-3 bg-[#000080] animate-pulse" />
        <div className="h-full w-3 bg-[#000080] animate-pulse" />
      </div>
    </div>
  );
}
