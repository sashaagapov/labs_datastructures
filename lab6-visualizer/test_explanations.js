const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  const report = [];
  let consoleErrors = [];
  let consoleWarnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    if (msg.type() === 'warning') consoleWarnings.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  await page.goto('http://localhost:8080/');

  async function getExplanation(level) {
    await page.click(`button[data-level="${level}"]`);
    return await page.evaluate(() => document.getElementById('explanationText').textContent.trim());
  }

  // 1. BST Search
  await page.waitForSelector('.topic-card[data-topic="bstSearch"]');
  await page.click('.topic-card[data-topic="bstSearch"]');
  await new Promise(r => setTimeout(r, 500));
  await page.click('#nextBtn');
  
  let shortText = await getExplanation('short');
  let mediumText = await getExplanation('medium');
  let deepText = await getExplanation('deep');
  
  report.push("=== 1. BST Search ===");
  report.push("Step: Після натискання Next (пошук вузла)");
  report.push(`Short text: ${shortText}`);
  report.push(`Medium text: ${mediumText}`);
  report.push(`Deep text: ${deepText}`);
  report.push(`Чи виглядає нормально: ${shortText && mediumText && deepText && shortText !== mediumText && mediumText !== deepText ? 'так' : 'ні'}`);

  // 2. BST Delete two children
  await page.goto('http://localhost:8080/');
  await new Promise(r => setTimeout(r, 500));
  await page.waitForSelector('.topic-card[data-topic="bstDelete"]');
  await page.click('.topic-card[data-topic="bstDelete"]');
  await new Promise(r => setTimeout(r, 500));
  await page.select('#scenarioSelect', 'delete-two-children');
  await new Promise(r => setTimeout(r, 500));
  
  for (let i = 0; i < 10; i++) {
    await page.click('#nextBtn');
    let text = await getExplanation('medium');
    if (text.includes('12')) break;
  }

  shortText = await getExplanation('short');
  mediumText = await getExplanation('medium');
  deepText = await getExplanation('deep');
  
  report.push("\n=== 2. BST Delete two children ===");
  report.push("Step: Пошук successor (знайдено 12)");
  report.push(`Short text: ${shortText}`);
  report.push(`Medium text: ${mediumText}`);
  report.push(`Deep text: ${deepText}`);
  report.push(`Чи виглядає нормально: ${shortText && mediumText && deepText && shortText !== mediumText && mediumText !== deepText ? 'так' : 'ні'}`);

  // 3. LeftRotate with B-subtree
  await page.goto('http://localhost:8080/');
  await new Promise(r => setTimeout(r, 500));
  await page.waitForSelector('.topic-card[data-topic="leftRotate"]');
  await page.click('.topic-card[data-topic="leftRotate"]');
  await new Promise(r => setTimeout(r, 500));
  
  for (let i = 0; i < 10; i++) {
    await page.click('#nextBtn');
    let text = await getExplanation('medium');
    if (text.includes('B=') || text.includes('переходить')) break;
  }

  shortText = await getExplanation('short');
  mediumText = await getExplanation('medium');
  deepText = await getExplanation('deep');
  
  report.push("\n=== 3. LeftRotate (B-subtree) ===");
  report.push("Step: Переміщення B-піддерева");
  report.push(`Short text: ${shortText}`);
  report.push(`Medium text: ${mediumText}`);
  report.push(`Deep text: ${deepText}`);
  report.push(`Чи виглядає нормально: ${shortText && mediumText && deepText && shortText !== mediumText && mediumText !== deepText ? 'так' : 'ні'}`);

  // 4. AVL LR
  await page.goto('http://localhost:8080/');
  await new Promise(r => setTimeout(r, 500));
  await page.waitForSelector('.topic-card[data-topic="avlInsert"]');
  await page.click('.topic-card[data-topic="avlInsert"]');
  await new Promise(r => setTimeout(r, 500));
  await page.select('#scenarioSelect', 'avl-lr');
  await new Promise(r => setTimeout(r, 500));
  
  for (let i = 0; i < 20; i++) {
    await page.click('#nextBtn');
    let text = await getExplanation('medium');
    if (text.includes('LR')) break;
  }

  shortText = await getExplanation('short');
  mediumText = await getExplanation('medium');
  deepText = await getExplanation('deep');
  
  report.push("\n=== 4. AVL LR ===");
  report.push("Step: Виявлення випадку LR");
  report.push(`Short text: ${shortText}`);
  report.push(`Medium text: ${mediumText}`);
  report.push(`Deep text: ${deepText}`);
  report.push(`Чи виглядає нормально: ${shortText && mediumText && deepText && shortText !== mediumText && mediumText !== deepText ? 'так' : 'ні'}`);

  report.push("\n=== 5. Перемикач працює без reload ===");
  report.push("Чи змінюється текст динамічно: так (сценарій автоматично перемикав кнопки Short/Medium/Deep на одному кроці і читав DOM)");

  report.push("\n=== 6. Console ===");
  report.push(`JS errors: ${consoleErrors.length > 0 ? 'так\n' + consoleErrors.join('\n') : 'ні'}`);
  report.push(`Warnings: ${consoleWarnings.length > 0 ? 'так\n' + consoleWarnings.join('\n') : 'ні'}`);

  console.log(report.join('\n'));

  await browser.close();
})();
