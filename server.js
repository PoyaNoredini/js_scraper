const { chromium } = require('playwright');
const handlePopup = require('./helper/handlePoupe');
const findLinkCompany = require('./helper/FindLinkCompany');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  const MainUrl = 'https://www.yellowpages.ae/search/cloth?field=bkeyword';
  let companiesData = []; // Define here to avoid undefined error

  try {
    console.log('Loading search page...');
    await page.goto(MainUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await handlePopup(page);
    const result = await findLinkCompany(page, context); // Pass context
    if (result) companiesData = result; // Assign if not undefined

  
  } catch (error) {
    console.error('Error occurred:', error.message);
  } finally {
    if (companiesData.length > 0) {
      console.log(`\nExtracted data for ${companiesData.length} companies`);
    }
    // await browser.close(); // Uncomment when done debugging
  }
})();