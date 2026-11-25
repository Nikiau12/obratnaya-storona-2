import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium, webkit } from "playwright";
import { cartPersistence, storageFallback } from "../tests/browser/storage.mjs";

const baseUrl = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const output = new URL("../outputs/cart-audit/", import.meta.url);
await mkdir(output, { recursive:true });
const results = [];
const firstTitle = "Острые крыши";
const profiles = [[320,568,"white"],[390,844,"white"],[390,844,"black"],[768,1024,"white"],[1440,1000,"white"],[1440,1000,"black"]];

async function setup(browser, width, height, theme, items) {
  const context = await browser.newContext({viewport:{width,height},hasTouch:width<1100,isMobile:width<600});
  await context.addInitScript(({theme,items}) => {
    localStorage.setItem("obratnaya-storona-theme",theme);
    localStorage.setItem("obratnaya-storona-cart-v1",JSON.stringify(items));
  }, {theme,items});
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror",error=>errors.push(error.message));
  page.on("console",message=>{if(message.type()==="error")errors.push(message.text());});
  await page.goto(baseUrl+"/books",{waitUntil:"networkidle"});
  await page.evaluate(()=>document.fonts.ready);
  return {context,page,errors};
}

async function open(page, width) {
  if (width<600) await page.getByRole("button",{name:"Открыть меню",exact:true}).click();
  await page.getByRole("button",{name:"Корзина",exact:true}).click();
  const cart = page.getByRole("dialog",{name:"Корзина",exact:true});
  await cart.waitFor();
  return cart;
}

for (const engine of [chromium,webkit]) {
  const browser = await engine.launch();
  try {
    for (const [width,height,theme] of profiles) {
      const {context,page,errors}=await setup(browser,width,height,theme,[{slug:"sketch-01",quantity:1},{slug:"sketch-02",quantity:2}]);
      try {
        const before=await page.evaluate(()=>({overflow:document.documentElement.style.overflow,top:scrollY}));
        const cart=await open(page,width);
        const box=await cart.boundingBox();
        assert.ok(Math.abs(box.x)<1 && Math.abs(box.y)<1);
        // WebKit rounds dvh to subpixels; allow less than one physical pixel.
        assert.ok(Math.abs(box.width-width)<1 && Math.abs(box.height-height)<1);
        assert.equal(await cart.locator("li").count(),2);
        const background=page.locator("body > :not(dialog,script,style,link)");
        const filters=await background.evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).filter));
        assert.ok(filters.length>0 && filters.every(filter=>filter.includes("blur(")));
        assert.equal(await cart.evaluate(node=>getComputedStyle(node).filter),"none");
        const wash=await cart.evaluate(node=>getComputedStyle(node,"::backdrop").backgroundColor);
        assert.match(wash,theme==="black"?/rgba\(0, 0, 0, 0\./:/rgba\(255, 255, 255, 0\./);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
        await page.screenshot({path:fileURLToPath(new URL(`${engine.name()}-${width}-${theme}-filled.png`,output))});
        const amount=cart.getByRole("group",{name:`Количество книги «${firstTitle}»`,exact:true});
        await amount.getByRole("button",{name:`Увеличить количество: ${firstTitle}`,exact:true}).click();
        assert.equal(await amount.locator("span").textContent(),"2");
        await amount.getByRole("button",{name:`Уменьшить количество: ${firstTitle}`,exact:true}).click();
        assert.equal(await amount.locator("span").textContent(),"1");
        assert.equal(await amount.getByRole("button",{name:`Уменьшить количество: ${firstTitle}`,exact:true}).isDisabled(),true);
        await cart.locator("li").last().getByRole("button",{name:/^Удалить:/}).click();
        await cart.getByRole("button",{name:`Удалить: ${firstTitle}`,exact:true}).click();
        assert.equal(await cart.locator("li").count(),0);
        const empty=cart.getByText("В корзине пока пусто",{exact:true});
        const message=await empty.boundingBox();
        assert.ok(Math.abs(message.x+message.width/2-width/2)<2);
        await page.screenshot({path:fileURLToPath(new URL(`${engine.name()}-${width}-${theme}-empty.png`,output))});
        await page.keyboard.press("Escape");
        await cart.waitFor({state:"hidden"});
        assert.equal(await page.evaluate(()=>document.documentElement.style.overflow),before.overflow);
        assert.ok((await background.evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).filter))).every(filter=>filter==="none"));
        assert.equal(await page.getByRole("button",{name:width<600?"Открыть меню":"Корзина",exact:true}).evaluate(n=>document.activeElement===n),true);
        assert.deepEqual(errors,[]);
        results.push({engine:engine.name(),width,height,theme,status:"passed"});
        console.log(`PASS ${engine.name()} ${width}×${height} ${theme}: full viewport, blur, quantity, removal, empty state and focus`);
      } finally { await context.close(); }
    }

    const {context,page,errors}=await setup(browser,390,568,"white",Array.from({length:6},(_,i)=>({slug:`sketch-0${i+1}`,quantity:1})));
    try {
      let cart=await open(page,390);
      assert.equal(await cart.locator("li").count(),6);
      const top=await page.evaluate(()=>scrollY);
      await cart.locator("li").last().scrollIntoViewIfNeeded();
      const closeBox=await cart.getByRole("button",{name:"Закрыть",exact:true}).boundingBox();
      assert.ok(closeBox.y>=0 && closeBox.y+closeBox.height<=90,"Close must stay reachable above the scrolling book list");
      assert.equal(await page.evaluate(()=>scrollY),top);
      await cart.getByRole("button",{name:"Закрыть",exact:true}).click();
      cart=await open(page,390);
      await cart.getByRole("link",{name:firstTitle,exact:true}).last().click();
      await page.waitForURL("**/books/sketch-01");
      await cart.waitFor({state:"hidden"});
      const selected=page.getByRole("button",{name:"В корзине",exact:true});
      await selected.waitFor();
      assert.equal(await selected.count(),1);
      assert.deepEqual(errors,[]);
      console.log(`PASS ${engine.name()}: long cart scroll, fixed close and book navigation`);
    } finally { await context.close(); }
    await storageFallback(browser,baseUrl);
    await cartPersistence(browser,baseUrl);
    console.log(`PASS ${engine.name()}: blocked storage, persistence and cross-tab cart`);
  } finally { await browser.close(); }
}
await writeFile(new URL("results.json",output),JSON.stringify({baseUrl,results},null,2));
