import {chromium, test} from "@playwright/test"

test("Film List Test", async ()=>{
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('http://localhost:4200/');


}) 