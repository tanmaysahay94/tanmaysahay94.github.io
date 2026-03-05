import { describe, it, expect } from 'vitest';
import { buildScramble, bubbleSortStep, bubbleSortToCompletion } from './scramble';

describe('buildScramble', () => {
  it('produces a string with the same characters as the input', () => {
    const text = 'tanmaysahay94@gmail.com';
    const result = buildScramble(text);
    expect(result.display.split('').sort().join('')).toBe(text.split('').sort().join(''));
    expect(result.indices.length).toBe(text.length);
  });

  it('produces a valid permutation of indices', () => {
    const text = 'hello';
    const result = buildScramble(text);
    expect([...result.indices].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
  });

  it('indices correctly map to display characters', () => {
    const text = 'abcde';
    const result = buildScramble(text);
    // display[position] should equal text[indices[position]]
    for (let pos = 0; pos < text.length; pos++) {
      expect(result.display[pos]).toBe(text[result.indices[pos]]);
    }
  });
});

describe('bubbleSortStep', () => {
  it('makes progress toward sorted order', () => {
    const text = 'abcd';
    const scrambled = buildScramble(text);
    const bookmark: [number] = [0];
    const changed: [boolean] = [false];

    // Run a few steps and verify no crash
    let current = scrambled;
    for (let i = 0; i < 20; i++) {
      const result = bubbleSortStep(current, bookmark, changed);
      current = result.state;
      if (result.done) break;
    }
  });

  it('eventually produces sorted indices', () => {
    const text = 'test';
    const scrambled = buildScramble(text);
    const bookmark: [number] = [0];
    const changed: [boolean] = [false];

    let current = scrambled;
    let done = false;
    for (let i = 0; i < 100; i++) {
      const result = bubbleSortStep(current, bookmark, changed);
      current = result.state;
      if (result.done) {
        done = true;
        break;
      }
    }

    expect(done).toBe(true);
    expect(current.indices).toEqual([0, 1, 2, 3]);
  });
});

describe('bubbleSortToCompletion', () => {
  it('unscrambles email correctly', () => {
    const text = 'tanmaysahay94@gmail.com';
    const scrambled = buildScramble(text);
    expect(bubbleSortToCompletion(scrambled)).toBe(text);
  });

  it('unscrambles phone number correctly', () => {
    const text = '+1-650-705-7651';
    const scrambled = buildScramble(text);
    expect(bubbleSortToCompletion(scrambled)).toBe(text);
  });

  it('unscrambles linkedin correctly', () => {
    const text = 'linkedin.com/in/tanmaysahay';
    const scrambled = buildScramble(text);
    expect(bubbleSortToCompletion(scrambled)).toBe(text);
  });

  it('handles single character', () => {
    const text = 'a';
    const scrambled = buildScramble(text);
    expect(bubbleSortToCompletion(scrambled)).toBe(text);
  });

  it('handles two characters', () => {
    const text = 'ab';
    const scrambled = buildScramble(text);
    expect(bubbleSortToCompletion(scrambled)).toBe(text);
  });

  it('works for 100 random scrambles of a long string', () => {
    const text = 'tanmaysahay94@gmail.com';
    for (let trial = 0; trial < 100; trial++) {
      const scrambled = buildScramble(text);
      expect(bubbleSortToCompletion(scrambled)).toBe(text);
    }
  });
});
