// Function to extract seller website from the page
async function extractSellerWebsite(page) {
  console.log('Extracting seller website...');
  
  try {
    let website = null;

    // Method 1: Look for "Seller Website:" label
    try {
      const websiteElement = await page.waitForSelector('text=/Seller Website:/', { timeout: 3000 });
      const parentElement = await websiteElement.locator('..').first();
      const websiteText = await parentElement.textContent();
      const urlMatch = websiteText.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        website = urlMatch[0];
        console.log('Found website with label method:', website);
      }
    } catch (e) {
      console.log('Website label method failed, trying alternatives...');
    }

    // Method 2: Look for links that seem like company websites
    if (!website) {
      try {
        const websiteLinks = await page.$$eval('a[href^="http"]', links => {
          return links
            .map(link => link.href)
            .filter(href => 
              !href.includes('yellowpages.ae') && 
              !href.includes('facebook') && 
              !href.includes('instagram') && 
              !href.includes('twitter') && 
              !href.includes('linkedin') &&
              !href.includes('whatsapp') &&
              !href.includes('mailto:')
            );
        });
        
        if (websiteLinks.length > 0) {
          website = websiteLinks[0];
          console.log('Found website with link filtering:', website);
        }
      } catch (e) {
        console.log('Link filtering method failed');
      }
    }

    // Method 3: Look for any URL in the page content
    if (!website) {
      try {
        const pageContent = await page.textContent('body');
        const urlMatches = pageContent.match(/https?:\/\/[^\s]+\.[a-z]{2,}/gi);
        if (urlMatches) {
          const filteredUrls = urlMatches.filter(url => 
            !url.includes('yellowpages.ae') && 
            !url.includes('facebook') && 
            !url.includes('instagram')
          );
          if (filteredUrls.length > 0) {
            website = filteredUrls[0];
            console.log('Found website with URL pattern:', website);
          }
        }
      } catch (e) {
        console.log('URL pattern search failed');
      }
    }

    return website || 'Not found';

  } catch (error) {
    console.error('Error extracting seller website:', error.message);
    return 'Not found';
  }
}

// Function to extract service area from the page
async function extractServiceArea(page) {
  console.log('Extracting service area...');
  
  try {
    let serviceArea = null;

    // Method 1: Look for "Service Area:" label
    try {
      const serviceElement = await page.waitForSelector('text=/Service Area:/', { timeout: 3000 });
      const parentElement = await serviceElement.locator('..').first();
      const serviceText = await parentElement.textContent();
      serviceArea = serviceText.replace('Service Area:', '').trim();
      console.log('Found service area with label method:', serviceArea);
    } catch (e) {
      console.log('Service area label method failed, trying alternatives...');
    }

    // Method 2: Look for city names near "Service" text
    if (!serviceArea) {
      try {
        const serviceElements = await page.$$eval('*', elements => {
          return elements
            .filter(el => el.textContent && el.textContent.toLowerCase().includes('service'))
            .map(el => el.textContent.trim())
            .filter(text => 
              text.includes('Sharjah') || 
              text.includes('Dubai') || 
              text.includes('Abu Dhabi') ||
              text.includes('UAE')
            );
        });
        
        if (serviceElements.length > 0) {
          serviceArea = serviceElements[0].replace(/.*service[^:]*:?\s*/i, '').trim();
          console.log('Found service area with service text search:', serviceArea);
        }
      } catch (e) {
        console.log('Service text search failed');
      }
    }

    // Method 3: Default to location if service area not found specifically
    if (!serviceArea || serviceArea === 'Not found') {
      try {
        const location = await extractLocation(page);
        if (location && location !== 'Not found') {
          // Extract city name from location
          const cityMatch = location.match(/(Sharjah|Dubai|Abu Dhabi)/i);
          if (cityMatch) {
            serviceArea = cityMatch[1];
            console.log('Found service area from location:', serviceArea);
          }
        }
      } catch (e) {
        console.log('Location fallback failed');
      }
    }

    return serviceArea || 'Not found';

  } catch (error) {
    console.error('Error extracting service area:', error.message);
    return 'Not found';
  }
}


module.exports = extractSellerWebsite;