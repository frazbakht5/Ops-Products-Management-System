import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// MUI popper/menus warn if anchorEl has no layout rects (JSDOM). Provide a mock.
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
const originalGetClientRects = Element.prototype.getClientRects;

Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
  return {
    x: 0,
    y: 0,
    width: 100,
    height: 20,
    top: 0,
    left: 0,
    right: 100,
    bottom: 20,
    toJSON() {
      return {};
    },
  } as DOMRect;
};

Element.prototype.getClientRects = function getClientRects() {
  const rect = this.getBoundingClientRect();
  return {
    length: 1,
    item: () => rect,
    0: rect,
    [Symbol.iterator]: function* () {
      yield rect;
    },
  } as unknown as DOMRectList;
};

afterEach(() => {
  cleanup();
});

// Note: we intentionally keep the mocked geometry methods for the duration of tests
// to satisfy MUI Popper anchor checks in jsdom.
