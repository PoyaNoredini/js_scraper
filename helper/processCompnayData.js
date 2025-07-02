const extractPhoneNumber = require('./extract_data/ExtractPhone');
const handlePopup = require('./handlePoupe'); // Corrected typo
const extractBusinessHours = require('./extract_data/Hours');
const extractLocation = require('./extract_data/extractLocation');
const extractSellerWebsite = require('./extract_data/linkWebsite');
const extractSocialMediaLinks = require('./extract_data/socailMedia');
const extractServiceArea = require('./extract_data/serviceArea');
const extractSubcategory = require('./extract_data/subCategory');
const { saveCompanyData } = require('./SaveData');

/**
 * Process a single company's data by extracting all relevant information
 * @param {Object} company - Company object with name and url
 * @param {Object} context - Browser context for creating new pages
 * @param {number} index - Current company index (for logging)
 * @param {number} total - Total number of companies (for logging)
 * @returns {Object|null} - Company data object or null if error
 */
async function processSingleCompany(company, context, index, total) {
  try {
    const { name: companyName, url: fullUrl } = company;

    console.log(`\n--- Processing Company ${index + 1}/${total} ---`);
    console.log(`Company: ${companyName}`);
    console.log(`URL: ${fullUrl}`);

    const companyPage = await context.newPage();
    await companyPage.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });

    await handlePopup(companyPage);

    // Extract data from the page
    const phoneNumber = await extractPhoneNumber(companyPage);
    const BusinessHours = await extractBusinessHours(companyPage);
    const location = await extractLocation(companyPage);
    const website = await extractSellerWebsite(companyPage);
    const social = await extractSocialMediaLinks(companyPage);
    const serviceArea = await extractServiceArea(companyPage);
    const subCategory = await extractSubcategory(companyPage);

    const companyData = {
      name: companyName,
      url: fullUrl,
      BusinessHours: BusinessHours,
      Location: location,
      Website: website,
      serviceArea: serviceArea || 'Not found',
      socialMedia: social,
      subCategory: subCategory || 'Not found',
      phoneNumber: phoneNumber || 'Not found'
    };

    console.log(`Phone: ${phoneNumber || 'Not found'}`);
    console.log(companyData);
    
    await companyPage.close();

    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (companyData) {
      await saveCompanyData(companyData);
    }

    return companyData;

  } catch (error) {
    console.error(`Error processing company ${index + 1}:`, error.message);
    return null;
  }
}

/**
 * Process all companies in the list
 * @param {Array} companyList - Array of company objects
 * @param {Object} context - Browser context
 * @returns {Array} - Array of processed company data
 */
async function processAllCompanies(companyList, context) {
  const companiesData = [];
  
  console.log(`Found ${companyList.length} companies to process`);

  for (let i = 0; i < companyList.length; i++) {
    const companyData = await processSingleCompany(companyList[i], context, i, companyList.length);
    
    if (companyData) {
      companiesData.push(companyData);
    }
  }

  return companiesData;
}

/**
 * Display final results summary
 * @param {Array} companiesData - Array of processed company data
 */
function displayResults(companiesData) {
  console.log('\n=== FINAL RESULTS ===');
  console.log(`Total companies processed: ${companiesData.length}`);
  console.log('\nCompanies with phone numbers:');

  companiesData.forEach((company, index) => {
    console.log(`${index + 1}. ${company.name}`);
    console.log(`   Phone: ${company.phoneNumber}`);
    console.log(`   Business Hours: ${company.BusinessHours || 'Not found'}`);
    console.log(`   Location: ${company.Location || 'Not found'}`);
    console.log(`   Website: ${company.Website}`);
    console.log(`   Social Media: ${company.socialMedia}`);
    console.log(`   Service Area: ${company.serviceArea}`);
    console.log(`   Sub-Category: ${company.subCategory}`);
    console.log(`   URL: ${company.url}`);
    console.log('');
  });
}

module.exports = {
  processSingleCompany,
  processAllCompanies,
  displayResults
};