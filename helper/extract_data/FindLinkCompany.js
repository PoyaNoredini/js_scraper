const { processAllCompanies, displayResults } = require('../processCompnayData');
const Url = process.env.URL;

/**
 * Extract company links from the current page
 * @param {Object} page - Playwright page object
 * @returns {Array} - Array of company objects with name and url
 */
async function extractCompanyLinks(page) {
  return await page.evaluate(() => {
    let links = [];
    const selector1 = Array.from(document.querySelectorAll('a[href*="/sellers/"]')).filter(link => {
      const text = link.textContent.trim();
      return text.length > 0 && !text.includes('View Details') && !text.includes('Click To View');
    });

    if (selector1.length > 0) {
      links = selector1;
    } else {
      const selector2 = Array.from(document.querySelectorAll('strong a, .company-name a, .business-name a'));
      if (selector2.length > 0) {
        links = selector2;
      } else {
        links = Array.from(document.querySelectorAll('a')).filter(link => {
          const href = link.getAttribute('href');
          const text = link.textContent.trim();
          return href && href.includes('/sellers/') && text.length > 5 &&
                 !text.includes('View Details') && !text.includes('Click To View') &&
                 !text.includes('Enquire Now') && !text.includes('WhatsApp');
        });
      }
    }

    return links.map(link => ({
      name: link.textContent.trim(),
      url: link.href.startsWith('http') ? link.href : `${window.location.origin}${link.getAttribute('href')}`
    }));
  });
}

/**
 * Main function to find and process company data from a page
 * @param {Object} page - Playwright page object
 * @param {Object} context - Browser context
 * @param {number} timeout - Timeout for operations
 * @returns {Array} - Array of processed company data
 */
async function findLinkCompany(page, context, timeout = 60000) {
  try {
    console.log('Waiting for search results...');
    await page.waitForSelector('a[title][href*="/sellers/"]', { timeout: timeout });

    const companyList = await extractCompanyLinks(page);

    if (companyList.length === 0) {
      console.log('No company links found');
      return [];
    }

    // Process all companies using the separated function
    const companiesData = await processAllCompanies(companyList, context);

    // Display results
    displayResults(companiesData);

    return companiesData;

  } catch (error) {
    console.error('Error in findLinkCompany:', error.message);
    return [];
  }
}

module.exports = findLinkCompany;