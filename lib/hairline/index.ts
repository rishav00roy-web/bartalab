// Three figures from Hairline (MIT, (c) 2026 Lucas Marques, see ./LICENSE),
// copied from https://github.com/lucasmarkes/hairline v0.5.1 because this
// project only needs these few and they have no dependencies.
import { create, type Figure, type HairlineOptions } from "./mount";
import { mount as dishEngine } from "./figures/dish";
import { mount as loupeEngine } from "./figures/loupe";
import { mount as relayEngine } from "./figures/relay";

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

/** A hub with four branches of tiles: the path to the tile under the pointer lights hop by hop. */
export function relay(el: HTMLElement, options?: HairlineOptions): Figure {
  return create(
    { id: "relay", label: "A hub connected to branches of tiles; the route to the one you point at lights up.", rest: "rest", engine: relayEngine },
    el,
    options,
  );
}

/** A stand loupe over a ruled sheet: the pointer drags it across. */
export function loupe(el: HTMLElement, options?: HairlineOptions): Figure {
  return create(
    { id: "loupe", label: "A magnifying glass passing over a page.", rest: "rest", engine: loupeEngine },
    el,
    options,
  );
}
