// Function to extract location/address from the page
async function extractLocation(page) {
  console.log('Extracting location...');
  
  try {
    let location = null;

    // Method 1: Look for specific location patterns (SAIF Zone, Sharjah, United Arab Emirates)
    try {
      const pageContent = await page.textContent('body');
      const locationMatch = pageContent.match(/[A-Z][^,]*Zone[^,]*,[^,]*,[^,]*Emirates/i);
      if (locationMatch) {
        location = locationMatch[0].trim();
        console.log('Found location with zone pattern:', location);
      }
    } catch (e) {
      console.log('Zone pattern method failed');
    }

    // Method 2: Look for UAE or Emirates in text
    if (!location) {
      try {
        const locationElements = await page.$$eval('*', elements => {
          return elements
            .filter(el => el.textContent && 
              (el.textContent.includes('Emirates') || 
               el.textContent.includes('UAE') || 
               el.textContent.includes('Dubai') || 
               el.textContent.includes('Sharjah') ||
               el.textContent.includes('Abu Dhabi')))
            .map(el => el.textContent.trim())
            .filter(text => text.length > 10 && text.length < 100);
        });
        
        if (locationElements.length > 0) {
          location = locationElements[0];
          console.log('Found location with Emirates search:', location);
        }
      } catch (e) {
        console.log('Emirates search method failed');
      }
    }

    // Method 3: Look for address-like patterns
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
          console.log('Found location with address pattern:', location);
        }
      } catch (e) {
        console.log('Address pattern search failed');
      }
    }

    return location || 'Not found';

  } catch (error) {
    console.error('Error extracting location:', error.message);
    return 'Not found';
  }
}

module.exports= extractLocation;