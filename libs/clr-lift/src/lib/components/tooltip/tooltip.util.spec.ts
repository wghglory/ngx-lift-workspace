import {afterEach, describe, expect, it, vi} from 'vitest';

import {collisionDetection, getTooltipCoords, isElementClickable, isElementInsideCollection} from './tooltip.util';

function withRect(rect: Partial<DOMRect>): HTMLElement {
  const element = document.createElement('div');
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    left: rect.left ?? 0,
    top: rect.top ?? 0,
    right: rect.right ?? 0,
    bottom: rect.bottom ?? 0,
    width: rect.width ?? 0,
    height: rect.height ?? 0,
    x: rect.left ?? 0,
    y: rect.top ?? 0,
    toJSON: () => ({}),
  });
  return element;
}

describe('tooltip helpers', () => {
  afterEach(() => vi.restoreAllMocks());

  it('places the arrow from the tooltip class', () => {
    const trigger = withRect({left: 10, top: 20, right: 110, bottom: 60, width: 100, height: 40});
    expect(getTooltipCoords(trigger, 'tooltip-top-left')).toEqual({x: 60, y: 20});
    expect(getTooltipCoords(trigger, 'tooltip-bottom-right')).toEqual({x: 60, y: 60});
    expect(getTooltipCoords(trigger, 'tooltip-right')).toEqual({x: 110, y: 40});
    expect(getTooltipCoords(trigger, 'unknown')).toEqual({x: 10, y: 20});
    expect(getTooltipCoords(null as unknown as HTMLElement, 'tooltip-left')).toEqual({x: 0, y: 0});
  });

  it('detects clickable ancestors and collection membership', () => {
    const button = document.createElement('button');
    const span = document.createElement('span');
    button.append(span);
    expect(isElementClickable(span)).toBe(true);
    expect(isElementClickable(span, button)).toBe(false);
    expect(isElementClickable(document.createElement('div'))).toBe(false);

    const parent = document.createElement('div');
    parent.append(span);
    expect(isElementInsideCollection(span, parent.children)).toBe(true);
    expect(isElementInsideCollection(button, parent.children)).toBe(false);
  });

  it('detects edge collisions against a reference element', () => {
    const target = withRect({left: -5, top: 10, right: 20, bottom: 110});
    const reference = withRect({left: 0, top: 0, right: 100, bottom: 100});
    expect(collisionDetection(target, reference)).toMatchObject({left: true, bottom: true});
  });
});
