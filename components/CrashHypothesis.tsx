export default function CrashHypothesis({ hypothesis }: { hypothesis: string }) {
  return (
    <div className="overview-strip">
      <div className="kv">
        <span className="k">Hypothesis:</span>
        <span className="v">{hypothesis}</span>
      </div>
    </div>
  );
}

