import assert from "node:assert/strict";
import test from "node:test";
import { packConstellation } from "../lib/constellation/packing.ts";

const safe = {left:10,right:420,top:200,bottom:537};
const box = p => ({left:p.x+p.left,right:p.x+p.right,top:p.y+p.top,bottom:p.y+p.bottom});
test("zoomed labels crowded against the floor move into free wall space", () => {
  const points = [
    {x:10,y:513,left:0,right:165,top:0,bottom:24},
    {x:150,y:511,left:0,right:114,top:0,bottom:26},
    {x:300,y:500,left:0,right:120,top:0,bottom:37},
    {x:402,y:529,left:0,right:8,top:0,bottom:8},
  ];
  assert.equal(packConstellation(points,safe,7),true);
  const boxes=points.map(box);
  for (const a of boxes) {
    assert.ok(a.left>=safe.left && a.right<=safe.right && a.top>=safe.top && a.bottom<=safe.bottom);
    for (const b of boxes) if(a!==b) assert.ok(Math.min(a.right,b.right)-Math.max(a.left,b.left)<=-6.9 || Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)<=-6.9);
  }
});
test("an uncrowded constellation keeps every original position", () => {
  const points=[{x:50,y:250,left:-12,right:70,top:-12,bottom:12},{x:270,y:330,left:-100,right:12,top:-18,bottom:18}];
  const before=structuredClone(points);
  assert.equal(packConstellation(points,safe,7),true);
  assert.deepEqual(points,before);
});
