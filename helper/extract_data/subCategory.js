
const { chromium } = require('playwright');

async function extractSubcategory(page) {


  try {


 

    // Method 4: Most robust approach - find the subcategory container
    const subcategoryContainer = await page.locator('[class*="sub-category"]').first();
    
    if (await subcategoryContainer.count() > 0) {
      const subcategoryText = await subcategoryContainer.textContent();
      const cleanSubcategory = subcategoryText.replace(/Sub-Category:\s*/i, '').trim();
      console.log('Subcategory:', cleanSubcategory);
    }

    // // Return the subcategory (using the most reliable method)
    // let finalSubcategory = null;
    
    // try {
    //   const element = await page.locator('text=/Sub-Category:/').first();
    //   const fullText = await element.textContent();
    //   finalSubcategory = fullText.replace(/Sub-Category:\s*/i, '').trim();
    // } catch (error) {
    //   console.log('Primary method failed, trying alternative...');
      
    //   try {
    //     const linkElement = await page.locator('a[href*="/subcategory/"]').first();
    //     finalSubcategory = await linkElement.textContent();
    //     finalSubcategory = finalSubcategory.trim();
    //   } catch (error2) {
    //     console.log('Alternative method also failed');
    //   }
    // }
    // console.log('Final Subcategory:', finalSubcategory);
    return cleanSubcategory;


  } catch (error) {
    console.error('Error extracting subcategory:', error);
    return null;
  }
}

module.exports = extractSubcategory;