const extractPhoneNumber = require('./ExtractPhone');
const handlePopup = require('./handlePoupe'); // Corrected typo

async function findLinkCompany(page, context) {
  const companiesData = [];

  console.log('Waiting for search results...');
  await page.waitForSelector('a[title][href*="/sellers/"]', { timeout: 15000 });

  const companyList = await page.evaluate(() => {
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
      url: link.href.startsWith('http') ? link.href : `https://www.yellowpages.ae${link.getAttribute('href')}`
    }));
  });

  if (companyList.length === 0) {
    console.log('No company links found');
    return companiesData; // Return empty array instead of undefined
  }

  console.log(`Found ${companyList.length} companies to process`);

  for (let i = 0; i < companyList.length; i++) {
    try {
      const { name: companyName, url: fullUrl } = companyList[i];

      console.log(`\n--- Processing Company ${i + 1}/${companyList.length} ---`);
      console.log(`Company: ${companyName}`);
      console.log(`URL: ${fullUrl}`);

      const companyPage = await context.newPage();
      await companyPage.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });

      await handlePopup(companyPage);

      const phoneNumber = await extractPhoneNumber(companyPage);

      const companyData = {
        name: companyName,
        url: fullUrl,
        phoneNumber: phoneNumber || 'Not found'
      };

      companiesData.push(companyData);

      console.log(`Phone: ${phoneNumber || 'Not found'}`);

      await companyPage.close();

      await page.waitForTimeout(2000);
    } catch (error) {
      console.error(`Error processing company ${i + 1}:`, error.message);
      continue;
    }
  }

  console.log('\n=== FINAL RESULTS ===');
  console.log(`Total companies processed: ${companiesData.length}`);
  console.log('\nCompanies with phone numbers:');

  companiesData.forEach((company, index) => {
    console.log(`${index + 1}. ${company.name}`);
    console.log(`   Phone: ${company.phoneNumber}`);
    console.log(`   URL: ${company.url}`);
    console.log('');
  });

  return companiesData;
}

module.exports = findLinkCompany;