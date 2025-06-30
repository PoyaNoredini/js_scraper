const validateLength = require('../../validator/validateLength'); 
// Function to extract location/address from the page
async function extractLocation(page) {
  try {
    let location = null;

    // Method 1: Match zone + Emirates pattern
    try {
      const pageContent = await page.textContent('body');
      const locationMatch = pageContent.match(/[A-Z][^,]*Zone[^,]*,[^,]*,[^,]*Emirates/i);
      if (locationMatch) {
        location = locationMatch[0].trim();
      }
    } catch (_) {}

    // Method 2: Search for Emirates-related keywords
    if (!location) {
      try {
        const locationElements = await page.$$eval('*', elements => {
          return elements
            .filter(el => el.textContent && (
              el.textContent.includes('Emirates') ||
              el.textContent.includes('UAE') ||
              el.textContent.includes('Dubai') ||
              el.textContent.includes('Sharjah') ||
              el.textContent.includes('Abu Dhabi')
            ))
            .map(el => el.textContent.trim())
            .filter(text => text.length > 10 && text.length < 100);
        });

        if (locationElements.length > 0) {
          location = locationElements[0];
        }
      } catch (_) {}
    }

    // Method 3: Search for general address-like patterns
    if (!location) {
      try {
        const addressElements = await page.$$eval('*', elements => {
          return elements
            .filter(el => el.textContent && el.textContent.includes(','))
            .map(el => el.textContent.trim())
            .filter(text => {
              const commaCount = (text.match(/,/g) || []).length;
              return commaCount >= 2 && text.length > 15 && text.length < 100;
            });
        });

        if (addressElements.length > 0) {
          location = addressElements[0];
        }
      } catch (_) {}
    }

    if (location) {
      console.log(location);
      // Validate length of the location string
      location = validateLength(location, 200);
      return location;
    } else {
      return 'Not found';
    }

  } catch (error) {
    console.error('Error:', error.message);
    return 'Not found';
  }
}

module.exports = extractLocation;