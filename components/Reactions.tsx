"use client";

import { useOptimistic, useTransition } from "react";
import { setReaction } from "@/app/actions";
import type { ReactionKind } from "@/lib/types";
import { Lightbulb, PartyPopper, ThumbsUp } from "./icons";

const KINDS: { kind: ReactionKind; label: string; Icon: () => React.ReactElement }[] = [
  { kind: "like", label: "Like", Icon: () => <ThumbsUp /> },
  { kind: "celebrate", label: "Celebrate", Icon: () => <PartyPopper /> },
  { kind: "insightful", label: "Insightful", Icon: () => <Lightbulb /> },
];

type State = { mine: ReactionKind | null; counts: Record<ReactionKind, number> };

export function Reactions({
  postId,
  mine,
  counts,
}: {
  postId: string;
  mine: ReactionKind | null;
  counts: Record<ReactionKind, number>;
}) {
  const [pending, startTransition] = useTransition();
  const [state, apply] = useOptimistic<State, ReactionKind | null>(
    { mine, counts },
    (prev, next) => {
      const c = { ...prev.counts };
      if (prev.mine) c[prev.mine] -= 1;
      if (next) c[next] += 1;
      return { mine: next, counts: c };
    },
  );

  function toggle(kind: ReactionKind) {
    const next = state.mine === kind ? null : kind;
    startTransition(async () => {
      apply(next);
      await setReaction(postId, next);
    });
  }

  return (
    <div className="reactions" role="group" aria-label="React to this post">
      {KINDS.map(({ kind, label, Icon }) => (
        <button
          key={kind}
          type="button"
          className="react-btn"
          aria-pressed={state.mine === kind}
          aria-label={`${label}, ${state.counts[kind]}`}
          onClick={() => toggle(kind)}
          disabled={pending}
        >
          <Icon />
          <span className="label">{label}</span>
          {state.counts[kind] > 0 && <span className="count">{state.counts[kind]}</span>}
        </button>
      ))}
    </div>
  );
}
