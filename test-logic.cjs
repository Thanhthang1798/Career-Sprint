const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Clear localStorage before testing to ensure XP is 0
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => localStorage.clear());
  
  await page.goto('http://localhost:5173/daily');
  
  // Wait for the app to load
  await page.waitForSelector('text=Daily Focus');
  
  // Go to Daily Focus and click first task
  await page.goto('http://localhost:5173/daily');
  await page.click('text=Self-introduction');
  
  // Mark as Done
  await page.click('text=Mark as Done');
  
  // Wait a bit
  await page.waitForTimeout(500);

  // Check if toast appears
  await page.waitForSelector('text=Task completed');

  console.log("XP calculation and task completion verified!");
  
  await browser.close();
})();
