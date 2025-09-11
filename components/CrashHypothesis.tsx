import type { HypothesisItem } from '../lib/types';

export default function CrashHypothesis({ items }: { items: HypothesisItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-500">
        No obvious crash root-cause; review warnings around disconnect timeframe.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((h, idx) => (
        <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-slate-900">
              {h.title}: {h.hypothesis}
            </div>
            <div className="text-sm text-slate-600">Confidence: {h.confidence}%</div>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-800 text-sm">
            {h.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
          {h.evidence && h.evidence.length > 0 && (
            <div className="mt-2">
              <div className="text-slate-600 text-sm font-medium">Evidence:</div>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm">
                {h.evidence.map((e, j) => (
                  <li key={j}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
