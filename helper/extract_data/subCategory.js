
async function extractSubcategory(page) {

  try {

    // Method 4: Most robust approach - find the subcategory container
    const subcategoryContainer = await page.locator('[class*="sub-category"]').first();
    
    if (await subcategoryContainer.count() > 0) {
      const subcategoryText = await subcategoryContainer.textContent();
      const cleanSubcategory = subcategoryText.replace(/Sub-Category:\s*/i, '').trim();
      console.log('Subcategory:', cleanSubcategory);
      return cleanSubcategory;
      }
    return null;
    
  } catch (error) {
    console.error('Error extracting subcategory:', error);
    return null;
  }
}

module.exports = extractSubcategory;