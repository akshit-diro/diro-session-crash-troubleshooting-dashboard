export default function Alerts({ summary }: { summary: string }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg">
      <div className="inline-flex gap-1.5">
        <span className="text-slate-500">Summary:</span>
        <span className="font-semibold">{summary}</span>
      </div>
    </div>
  );
}
