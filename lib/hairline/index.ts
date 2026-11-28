// Two figures from Hairline (MIT, (c) 2026 Lucas Marques, see ./LICENSE),
// copied from https://github.com/lucasmarkes/hairline v0.5.1 because this
// project only needs these two and they have no dependencies.
import { create, type Figure, type HairlineOptions } from "./mount";
import { mount as dishEngine } from "./figures/dish";
import { mount as terrainEngine } from "./figures/terrain";

export type { Figure, HairlineOptions } from "./mount";

/** A parabolic dish on a two-axis gimbal. The pointer aims it. */
export function dish(el: HTMLElement, options?: HairlineOptions): Figure {
  return create(
    {
      id: "dish",
      label: "A satellite dish that turns to follow the pointer.",
      rest: "rest",
      engine: dishEngine,
    },
    el,
    options,
  );
}

/** Eighty-one pillars on a plinth that rise around the pointer. */
export function terrain(el: HTMLElement, options?: HairlineOptions): Figure {
  return create(
    {
      id: "terrain",
      label: "A field of pillars that rise around the pointer.",
      rest: "rest",
      engine: terrainEngine,
    },
    el,
    options,
  );
}
