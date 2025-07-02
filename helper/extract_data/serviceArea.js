const { chromium } = require('playwright');
const validateLength = require('../../validator/validateLength');

async function extractServiceArea(page) {

    
    try {

        // Method 2: Extract service area by finding the "Service Area:" label and getting next element
        const serviceArea2 = await page.evaluate(() => {
            // Find the element containing "Service Area:"
            const labels = Array.from(document.querySelectorAll('*'));
            const serviceAreaLabel = labels.find(el => el.textContent?.includes('Service Area:'));
            
            if (serviceAreaLabel) {
                // Look for the next sibling or nearby element with the actual service area
                const parent = serviceAreaLabel.closest('div');
                if (parent) {
                    const serviceAreaSpan = parent.querySelector('span.ng-star-inserted');
                    return serviceAreaSpan ? serviceAreaSpan.textContent.trim() : null;
                }
            }
            return null;
        });

        
        // Method 3: More robust approach - find by structure
        const serviceArea3 = await page.evaluate(() => {
            // Look for the specific structure in the company profile
            const companyProfile = document.querySelector('.seller-company-profile');
            if (companyProfile) {
                const rows = companyProfile.querySelectorAll('.row');
                for (const row of rows) {
                    const text = row.textContent;
                    if (text.includes('Service Area:')) {
                        const serviceAreaSpan = row.querySelector('span.ng-star-inserted');
                        return serviceAreaSpan ? serviceAreaSpan.textContent.trim() : null;
                    }
                }
            }
            return null;
        });

        
        // Return the extracted data
        let result = serviceArea2 || serviceArea3;
         console.log(`Extracted service area: ${result}`);
            result = validateLength(result, 200);
            return result;
    } catch (error) {
        console.error('Error extracting service area:', error);
        return null;
    }
};

module.exports = extractServiceArea;