export default function Alerts({ summary }: { summary: string }) {
  return (
    <div className="overview-strip">
      <div className="kv">
        <span className="k">Summary:</span>
        <span className="v">{summary}</span>
      </div>
    </div>
  );
}

