// Scramble/unscramble animation to protect PII from bots
// Adapted from scramble.js by Jeff Donahue (2011)

export interface ScrambleState {
  display: string;
  indices: number[];
}

export function buildScramble(text: string): ScrambleState {
  const chars = text.split('');
  const indices = chars.map((_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return { display: indices.map(i => chars[i]).join(''), indices };
}

/**
 * Perform one step of animated bubble sort.
 * Returns the new state and whether the sort is complete.
 * `bookmark` is mutated in-place (single-element array) to track position across calls.
 * `changed` is mutated in-place to track if any swap happened in the current full pass.
 */
export function bubbleSortStep(
  state: ScrambleState,
  bookmark: [number],
  changed: [boolean],
): { state: ScrambleState; done: boolean } {
  const indices = [...state.indices];
  const chars = state.display.split('');

  // Wrap around when we reach the end
  if (bookmark[0] >= indices.length - 1) {
    // We completed a full pass from some earlier point — check if anything changed
    // If bookmark wrapped and we haven't seen i===0 yet in this pass, we need another pass
    if (!changed[0]) {
      return { state: { display: chars.join(''), indices }, done: true };
    }
    bookmark[0] = 0;
    changed[0] = false;
  }

  // Reset changed flag at the start of each full pass
  if (bookmark[0] === 0) {
    changed[0] = false;
  }

  for (let i = bookmark[0]; i < indices.length - 1; i++) {
    if (indices[i] > indices[i + 1]) {
      changed[0] = true;
      [indices[i], indices[i + 1]] = [indices[i + 1], indices[i]];
      [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
      bookmark[0] = i + 1;
      return {
        state: { display: chars.join(''), indices },
        done: false,
      };
    }
  }

  // Reached end of array without finding a swap in this scan
  bookmark[0] = 0;
  if (!changed[0]) {
    return { state: { display: chars.join(''), indices }, done: true };
  }
  // Need another pass — changed was true earlier in this pass but no swaps at the tail
  changed[0] = false;
  return { state: { display: chars.join(''), indices }, done: false };
}

/**
 * Run bubble sort to completion (for testing).
 * Returns the fully sorted display string.
 */
export function bubbleSortToCompletion(initial: ScrambleState): string {
  let current = { ...initial, indices: [...initial.indices] };
  const bookmark: [number] = [0];
  const changed: [boolean] = [false];
  const maxSteps = initial.display.length * initial.display.length * 2; // safety limit

  for (let step = 0; step < maxSteps; step++) {
    const result = bubbleSortStep(current, bookmark, changed);
    current = { display: result.state.display, indices: [...result.state.indices] };
    if (result.done) return current.display;
  }

  return current.display; // should not reach here
}
