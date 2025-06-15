const { chromium } = require('playwright');
const handlePopup = require('./helper/handlePoupe');
const env = require('dotenv')
const findLinkCompany = require('./helper/FindLinkCompany');
const numberOfPage= require('./helper/extract_data/numberOfPage');
require('dotenv').config();

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath:  process.env.EXECUTABLEPATH// Adjust path as needed
  });
  const timeout = 60000; // Set a timeout for page operations
  const context = await browser.newContext();
  const page = await context.newPage();
  const MainUrl = process.env.MAINURL;
  let companiesData = []; // Define here to avoid undefined error

  try {
    console.log('Loading search page...');
    await page.goto(MainUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await handlePopup(page);
    const total_Page=  await numberOfPage(page);
    const result = await findLinkCompany(page, context , timeout); // Pass context

    if (result) companiesData = result; // Assign if not undefined

      for (let page_number = 2; page_number <= total_Page; page_number++) {

      let url = `${MainUrl}&page=${page_number}`;

      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      const result = await findLinkCompany(page, context); // Pass context
      if (result) companiesData = result; // Assign if not undefined
      
    };

  
  } catch (error) {
    console.error('Error occurred:', error.message);
  } finally {
    if (companiesData.length > 0) {
      console.log(`\nExtracted data for ${companiesData.length} companies`);
    }
    // await browser.close(); // Uncomment when done debugging
  }
})();