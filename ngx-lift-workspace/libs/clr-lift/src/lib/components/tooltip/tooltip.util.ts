/**
 * Get the coordinates for the tooltip (arrow coordinates) based on the given trigger element's bounding client rect and tooltip class.
 *
 * @param {HTMLElement} triggerElement - The tooltip trigger element. For example, <button cllTooltip>Hover me</button>, where the button is the trigger element.
 * @param {string} tooltipClass - The class of the tooltip.
 * @returns {{ x: number; y: number }} The x and y coordinates for the tooltip (arrow origin).
 */
export function getTooltipCoords(triggerElement: HTMLElement, tooltipClass: string) {
  const rect = triggerElement.getBoundingClientRect();

  if (tooltipClass.includes('tooltip-top-')) {
    // tooltip-top-left', 'tooltip-top-right'
    return {
      x: rect.left + rect.width / 2,
      y: rect.top,
    };
  } else if (tooltipClass.includes('tooltip-bottom-')) {
    // 'tooltip-bottom-left', 'tooltip-bottom-right'
    return {
      x: rect.left + rect.width / 2,
      y: rect.bottom,
    };
  } else if (tooltipClass.includes('tooltip-right')) {
    return {
      x: rect.right,
      y: rect.top + rect.height / 2,
    };
  } else if (tooltipClass.includes('tooltip-left')) {
    return {
      x: rect.left,
      y: rect.top + rect.height / 2,
    };
  } else {
    return {x: rect.left, y: rect.top};
  }
}

/**
 * Check if the given element is clickable (button, link, or element with role="button").
 *
 * @param {HTMLElement} el - The element to check.
 * @returns {boolean} True if the element is clickable, otherwise false.
 */
export function isElementClickable(el: HTMLElement) {
  return (
    el.tagName.toLowerCase() === 'button' || el.tagName.toLowerCase() === 'a' || el.getAttribute('role') === 'button'
  );
}

/**
 * Check if the given element is inside the specified collection.
 *
 * @param {HTMLElement} el - The element to check.
 * @param {HTMLCollection} collection - The collection to check against.
 * @returns {boolean} True if the element is inside the collection, otherwise false.
 */
export function isElementInsideCollection(el: HTMLElement, collection: HTMLCollection) {
  return Array.from(collection).some((element) => element.contains(el));
}

/**
 * Perform collision detection for the target element against the reference element (default is window).
 *
 * @param {HTMLElement} targetElement - The target element for collision detection.
 * @param {HTMLElement|Window} [referenceElement=window] - The reference element for collision detection. Defaults to the window.
 * @returns {{ left: boolean; right: boolean; top: boolean; bottom: boolean }} Object indicating which edges are colliding.
 */
export function collisionDetection(targetElement: HTMLElement, referenceElement: HTMLElement | Window = window) {
  const elementRect = targetElement.getBoundingClientRect();
  const referenceRect =
    referenceElement instanceof Window
      ? {top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight}
      : referenceElement.getBoundingClientRect();

  let left = false;
  let right = false;
  let top = false;
  let bottom = false;

  const isCollidingWithLeftEdge = elementRect.left <= referenceRect.left;
  const isCollidingWithRightEdge = elementRect.right >= referenceRect.right;
  const isCollidingWithTopEdge = elementRect.top <= referenceRect.top;
  const isCollidingWithBottomEdge = elementRect.bottom >= referenceRect.bottom;

  if (isCollidingWithLeftEdge) {
    left = true;
  }
  if (isCollidingWithRightEdge) {
    right = true;
  }
  if (isCollidingWithTopEdge) {
    top = true;
  }
  if (isCollidingWithBottomEdge) {
    bottom = true;
  }

  return {left, right, top, bottom};
}
