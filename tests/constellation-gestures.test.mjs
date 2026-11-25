import assert from 'node:assert/strict';
import test from 'node:test';
import { GraphGestures } from '../lib/constellation/gestures.ts';

function zoom(graph, distance, now = 100) {
  graph.down(1, { x: 100, y: 200 });
  graph.down(2, { x: 200, y: 200 });
  graph.move(2, { x: 100 + distance, y: 200 }, now);
  graph.up(1, now); graph.up(2, now);
}

test('a two-finger pinch magnifies the constellation and is capped at 2.4', () => {
  const graph = new GraphGestures(); graph.resize(390, 776);
  zoom(graph, 200); assert.equal(graph.view.scale, 2);
  zoom(graph, 300); assert.equal(graph.view.scale, 2.4);
});
test('one finger pans only after zoom and cannot move the map out of reach', () => {
  const graph = new GraphGestures(); graph.resize(390, 776);
  graph.down(1, { x: 100, y: 200 }); graph.move(1, { x: 130, y: 240 }, 100); graph.up(1, 100);
  assert.deepEqual(graph.view, { scale: 1, offsetX: 0, offsetY: 0 });
  zoom(graph, 200);
  graph.down(1, { x: 100, y: 200 }); graph.move(1, { x: 125, y: 215 }, 500);
  assert.equal(graph.view.offsetX, 25); assert.equal(graph.view.offsetY, 15);
  graph.move(1, { x: 2000, y: 2000 }, 510);
  assert.ok(Math.abs(graph.view.offsetX) < 200); assert.ok(Math.abs(graph.view.offsetY) < 120);
});
test('zooming back out restores the original view and offsets', () => {
  const graph = new GraphGestures(); graph.resize(768, 900); zoom(graph, 200);
  graph.down(1, { x: 100, y: 200 }); graph.move(1, { x: 140, y: 230 }, 500); graph.up(1, 500);
  zoom(graph, 20, 600);
  assert.deepEqual(graph.view, { scale: 1, offsetX: 0, offsetY: 0 });
});
test('pinch and drag suppress accidental project clicks, ordinary taps remain usable', () => {
  const graph = new GraphGestures(); graph.resize(390, 776);
  graph.down(1, { x: 100, y: 200 }); graph.up(1, 100);
  assert.equal(graph.ignoreClick(100), false);
  zoom(graph, 200, 200);
  assert.equal(graph.ignoreClick(210), true); assert.equal(graph.ignoreClick(461), false);
  graph.down(3, { x: 100, y: 200 }); graph.move(3, { x: 120, y: 200 }, 500); graph.up(3, 510);
  assert.equal(graph.ignoreClick(520), true);
});
test('cancelled gestures release all fingers and the next pinch starts from its own distance', () => {
  const graph = new GraphGestures(); graph.resize(390, 776);
  graph.down(1, { x: 100, y: 200 }); graph.down(2, { x: 200, y: 200 }); graph.cancel(100);
  assert.deepEqual(graph.ids, []);
  zoom(graph, 150, 500); assert.equal(graph.view.scale, 1.5);
});
test('tablet landscape keeps touch zoom while a desktop resize restores the default view', () => {
  const graph = new GraphGestures(); graph.resize(1024, 700); zoom(graph, 200);
  graph.resize(1366, 900, true); assert.equal(graph.view.scale, 2);
  graph.resize(1440, 900, false); assert.deepEqual(graph.view, { scale: 1, offsetX: 0, offsetY: 0 });
});
