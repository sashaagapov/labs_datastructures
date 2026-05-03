const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const report = [];

  try {
    await page.goto('http://localhost:8080/');
    
    // 1. BST Search
    await page.waitForSelector('.topic-card[data-topic="bstSearch"]');
    await page.click('.topic-card[data-topic="bstSearch"]');
    await new Promise(r => setTimeout(r, 500));
    
    await page.click('#defenseModeToggle');
    await new Promise(r => setTimeout(r, 100));
    
    let isHidden = await page.evaluate(() => document.getElementById('defenseHintCard').classList.contains('hidden'));
    let text = await page.evaluate(() => document.getElementById('defenseHintText').textContent.trim());
    report.push(`BST Search - Defense Card hidden: ${isHidden}`);
    report.push(`BST Search - Hint starts with: ${text.substring(0, 50)}...`);

    // 2. BST Delete
    await page.click('#backToTopicsBtn');
    await new Promise(r => setTimeout(r, 500));
    await page.waitForSelector('.topic-card[data-topic="bstDelete"]');
    await page.click('.topic-card[data-topic="bstDelete"]');
    await new Promise(r => setTimeout(r, 500));
    
    // defense mode should stay toggled on maybe? Oh wait, it resets if not tracked.
    isHidden = await page.evaluate(() => document.getElementById('defenseHintCard').classList.contains('hidden'));
    text = await page.evaluate(() => document.getElementById('defenseHintText').textContent.trim());
    report.push(`BST Delete - Defense Card hidden: ${isHidden}`);
    report.push(`BST Delete - Hint starts with: ${text.substring(0, 50)}...`);
    
    // 3. AVL Insert (AVL LL)
    await page.click('#backToTopicsBtn');
    await new Promise(r => setTimeout(r, 500));
    await page.waitForSelector('.topic-card[data-topic="avlInsert"]');
    await page.click('.topic-card[data-topic="avlInsert"]');
    await new Promise(r => setTimeout(r, 500));
    
    isHidden = await page.evaluate(() => document.getElementById('defenseHintCard').classList.contains('hidden'));
    text = await page.evaluate(() => document.getElementById('defenseHintText').textContent.trim());
    report.push(`AVL Insert - Defense Card hidden: ${isHidden}`);
    report.push(`AVL Insert - Hint starts with: ${text.substring(0, 50)}...`);

  } catch (e) {
    report.push(`Error: ${e}`);
  }

  console.log(report.join('\n'));
  await browser.close();
})();
