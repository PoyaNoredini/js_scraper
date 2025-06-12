// Function to extract business hours from the page
async function extractBusinessHours(page) {
  console.log('Extracting business hours...');
  
  try {
    // Try multiple selectors for business hours
    const possibleSelectors = [
      'text=/Business Hours:/',
      'text=/Monday.*Saturday.*\d{2}:\d{2}/',
      '[class*="business-hours"]',
      '[class*="hours"]',
      'text=/\d{2}:\d{2}.*\d{2}:\d{2}/',
      'div:has-text("Business Hours")',
      'span:has-text("Business Hours")'
    ];

    let businessHours = null;

    // Method 1: Look for "Business Hours:" label and extract following text
    try {
      const hoursElement = await page.waitForSelector('text=/Business Hours:/', { timeout: 3000 });
      const parentElement = await hoursElement.locator('..').first();
      businessHours = await parentElement.textContent();
      businessHours = businessHours.replace('Business Hours:', '').trim();
      console.log('Found business hours with label method:', businessHours);
    } catch (e) {
      console.log('Business hours label method failed, trying alternatives...');
    }

    // Method 2: Look for time pattern (Monday - Saturday 09:00 18:00)
    if (!businessHours) {
      try {
        const pageContent = await page.textContent('body');
        const hoursMatch = pageContent.match(/Monday\s*-\s*Saturday\s+\d{2}:\d{2}\s+\d{2}:\d{2}/i);
        if (hoursMatch) {
          businessHours = hoursMatch[0].trim();
          console.log('Found business hours with pattern match:', businessHours);
        }
      } catch (e) {
        console.log('Pattern match method failed');
      }
    }

    // Method 3: Look for any element containing time patterns
    if (!businessHours) {
      try {
        const hoursElements = await page.$$eval('*', elements => {
          return elements
            .filter(el => el.textContent && el.textContent.match(/\d{2}:\d{2}/))
            .map(el => el.textContent.trim())
            .filter(text => text.includes('Monday') || text.includes('09:00') || text.includes('18:00'));
        });
        
        if (hoursElements.length > 0) {
          businessHours = hoursElements[0];
          console.log('Found business hours with time pattern search:', businessHours);
        }
      } catch (e) {
        console.log('Time pattern search failed');
      }
    }

    return businessHours || 'Not found';

  } catch (error) {
    console.error('Error extracting business hours:', error.message);
    return 'Not found';
  }
}
 module.exports = extractBusinessHours;