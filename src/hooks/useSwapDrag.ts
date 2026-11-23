import { useRef, useState } from "react";

export interface DragState {
  from: number;
  /** Index the pointer is over, or -1. */
  over: number;
  /** True once the pointer travelled far enough to count as a drag. */
  moved: boolean;
  x: number;
  y: number;
}

/** Pixels the pointer must travel before a press becomes a drag. */
export const DRAG_THRESHOLD = 6;

/** Attribute that marks a drop target; its value is the item index. */
export const DROP_TARGET_ATTR = "data-pair";

/**
 * Reorder items by swapping two of them: tap one then another, or drag one
 * onto another with mouse or touch (pointer events). Drop targets are
 * found by the `data-pair` attribute under the pointer.
 */
export const useSwapDrag = <T>(initial: () => T[], enabled: boolean) => {
  const [items, setItems] = useState<T[]>(initial);
  const [selected, setSelected] = useState<number | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const startRef = useRef({ x: 0, y: 0 });
  // A drag ends with a click on the same tile; that click must not select it.
  const suppressClickRef = useRef(false);

  const swap = (i: number, j: number) =>
    setItems((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const tap = (i: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (!enabled) return;
    if (selected === null) setSelected(i);
    else if (selected === i) setSelected(null);
    else {
      swap(selected, i);
      setSelected(null);
    }
  };

  const onPointerDown = (i: number, e: React.PointerEvent<HTMLElement>) => {
    if (!enabled || e.button !== 0) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDrag({ from: i, over: -1, moved: false, x: e.clientX, y: e.clientY });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag) return;
    const moved =
      drag.moved ||
      Math.abs(e.clientX - startRef.current.x) +
        Math.abs(e.clientY - startRef.current.y) >
        DRAG_THRESHOLD;
    const tile = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest<HTMLElement>(`[${DROP_TARGET_ATTR}]`);
    const over = tile ? Number(tile.getAttribute(DROP_TARGET_ATTR)) : -1;
    setDrag({
      from: drag.from,
      over: over === drag.from ? -1 : over,
      moved,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const onPointerUp = () => {
    if (!drag) return;
    if (drag.moved) {
      suppressClickRef.current = true;
      if (drag.over >= 0) swap(drag.from, drag.over);
      setSelected(null);
    }
    setDrag(null);
  };

  /** Props for the tile at index `i`. */
  const itemProps = (i: number) => ({
    [DROP_TARGET_ATTR]: i,
    onClick: () => tap(i),
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => onPointerDown(i, e),
    onPointerMove,
    onPointerUp,
    onPointerCancel: () => setDrag(null),
  });

  return { items, selected, drag, itemProps };
};
