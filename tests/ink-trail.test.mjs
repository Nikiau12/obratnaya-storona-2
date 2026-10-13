import assert from "node:assert/strict";
import test from "node:test";
import { inkOpacity, inkWidth, INK_LIFETIME } from "../lib/ink-trail.ts";

test("ink fades continuously and disappears completely within four seconds", () => {
  let previous = inkOpacity(0);
  for (let age = 50; age <= INK_LIFETIME; age += 50) {
    const opacity = inkOpacity(age);
    assert.ok(opacity <= previous && opacity >= 0);
    previous = opacity;
  }
  assert.equal(inkOpacity(INK_LIFETIME), 0);
  assert.equal(inkOpacity(INK_LIFETIME * 2), 0);
});

test("fast movement makes a thinner line without vanishing or making a blot", () => {
  assert.ok(inkWidth(.1) > inkWidth(2));
  for (const speed of [0, .1, 1, 10, 1000]) assert.ok(inkWidth(speed) >= .7 && inkWidth(speed) <= 1.75);
});
