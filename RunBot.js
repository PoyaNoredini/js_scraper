const { chromium } = require('playwright');
const handlePopup = require('./helper/handlePoupe');
const findLinkCompany = require('./helper/extract_data/FindLinkCompany');
const numberOfPage = require('./helper/extract_data/numberOfPage');
require('dotenv').config();

module.exports = async function runBot(keyword) {
  const baseURL = process.env.MAINURL;
  const searchURL = `${baseURL}/${encodeURIComponent(keyword)}?field=bkeyword`;

  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.EXECUTABLEPATH,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  let companiesData = [];

  try {
    console.log('Navigating to:', searchURL);
    await page.goto(searchURL, { waitUntil: 'networkidle', timeout: 60000 });
    await handlePopup(page);

    const total_Page = await numberOfPage(page);

    const firstResult = await findLinkCompany(page, context);
    if (firstResult) companiesData.push(...firstResult);

    for (let page_number = 2; page_number <= total_Page; page_number++) {
      let pageURL = `${searchURL}&page=${page_number}`;
      await page.goto(pageURL, { waitUntil: 'networkidle', timeout: 60000 });

      const result = await findLinkCompany(page, context);
      if (result) companiesData.push(...result);
    }

    console.log(`✅ Finished scraping. Found ${companiesData.length} companies.`);
    // You can optionally save to file or database here

  } catch (err) {
    console.error('❌ Bot error:', err.message);
    throw err;
  } finally {
    await browser.close();
  }
};
