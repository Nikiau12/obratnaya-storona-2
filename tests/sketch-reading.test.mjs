import assert from "node:assert/strict";
import test from "node:test";
import { readingStops, readingIndex } from "../lib/sketch-reading.ts";

test("scrolling visits every story even when shorter neighbours share a row", () => {
  const boxes = [{top:305,height:340},{top:325,height:250},{top:360,height:290},{top:730,height:300},{top:1120,height:290},{top:1190,height:320}];
  for (const [height,maxScroll] of [[900,800],[720,980],[1100,600]]) {
    const stops=readingStops(boxes,height,maxScroll);
    const visited=new Set();
    for(let top=0;top<=maxScroll;top++) visited.add(readingIndex(top,stops));
    assert.deepEqual([...visited],[0,1,2,3,4,5]);
    assert.ok(stops[5]<maxScroll,"the final book activates before reaching the footer");
    for(let i=5;i>=0;i--)assert.equal(readingIndex(stops[i],stops),i,"reverse scrolling uses the same boundaries");
  }
});

test("an unscrollable page keeps the first story active", () => {
  const stops=readingStops([{top:20,height:40},{top:20,height:60}],900,0);
  assert.equal(readingIndex(0,stops),0);
  assert.equal(readingIndex(0,readingStops([],900,0)),0);
});
