const extractPhoneNumber = require('./extract_data/ExtractPhone');
const handlePopup = require('./handlePoupe'); // Corrected typo
const extractBusinessHours = require('./extract_data/Hours'); // Assuming you have this function
const extractLocation = require('./extract_data/extractLocation');
const extractSellerWebsite = require('./extract_data/linkWebsite')
const extractSocialMediaLinks = require('./extract_data/socailMedia');
const extractServiceArea = require('./extract_data/serviceArea'); // Assuming you have this function
const extractSubcategory = require('./extract_data/subCategory'); // Assuming you have this function
const FindLinkCompany = require('./FindLinkCompany');


async function FinalData(page) {

    try{

    }
    catch (error) {
        console.error('Error extracting final data:', error);
        return null;
    }


}