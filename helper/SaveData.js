const CompanyYellow = require('../models/CompanyYellow');

/**
 * Save a single company's data to the database.
 * @param {Object} companyData - The processed company data object.
 * @returns {Promise<Object>} - The created database record.
 */
async function saveCompanyData(companyData) {
  try {
    // Social media is an array: [facebook, instagram, twitter, linkedin, whatsapp]
    const social = companyData.socialMedia || [];
    const saved = await CompanyYellow.create({
      name: companyData.name,
      link_web: companyData.Website,
      phone_number: companyData.phoneNumber,
      link_yellow_page: companyData.url,
      location: companyData.Location,
      facebook_link: social[0] || null,
      instagram_link: social[1] || null,
      twitter_link: social[2] || null,
      linkedin_link: social[3] || null,
      whatsapp_link: social[4] || null,
      business_hours: companyData.BusinessHours,
      city: companyData.city || null,
      category_id: companyData.category_id || null,
      sub_category: companyData.subCategory
    });
    return saved;
  } catch (error) {
    console.error('Error saving company data:', error.message);
    throw error;
  }
}

module.exports = { saveCompanyData };