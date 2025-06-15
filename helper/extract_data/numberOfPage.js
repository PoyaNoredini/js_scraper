async function numberOfPage(page) {
  
  try {
    // Extract only the last page number
    const lastPage = await page.evaluate(() => {
      // Look for all clickable elements that might be page numbers
      const allElements = document.querySelectorAll('a, span, button');
      let maxPageNumber = 0;
      
      allElements.forEach(el => {
        const text = el.textContent.trim();
        
        // Check if it's a page number
        if (/^\d+$/.test(text) && text.length <= 3) { // Assuming page numbers are 1-3 digits
          const pageNum = parseInt(text);
          if (pageNum > maxPageNumber) {
            maxPageNumber = pageNum;
          }
        }
      });

      return maxPageNumber;
    });

    console.log('Last page number:', lastPage);
    return lastPage;

  } catch (error) {
    console.error('Error getting last page number:', error);
    return null;
  } 
};


module.exports = numberOfPage;
