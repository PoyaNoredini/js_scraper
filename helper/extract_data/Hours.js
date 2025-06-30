const validateLength = require('../../validator/validateLength');

// Function to extract business hours from the page
async function extractBusinessHours(page) {
  try {
    let businessHours = null;

    // Method 1: Find "Business Hours:" label and get following text
    try {
      const hoursElement = await page.waitForSelector('text=/Business Hours:/', { timeout: 3000 });
      const parentElement = await hoursElement.locator('..').first();
      businessHours = await parentElement.textContent();
      businessHours = businessHours.replace('Business Hours:', '').trim();
    } catch (_) {}

    // Method 2: Regex search in full page content
    if (!businessHours) {
      try {
        const pageContent = await page.textContent('body');
        const hoursMatch = pageContent.match(/Monday\s*-\s*Saturday\s+\d{2}:\d{2}\s+\d{2}:\d{2}/i);
        if (hoursMatch) {
          businessHours = hoursMatch[0].trim();
        }
      } catch (_) {}
    }

    // Method 3: Search in elements with time patterns
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
        }
      } catch (_) {}
    }

    if (businessHours) {
      console.log(businessHours);
      // Validate length of the business hours string
      businessHours = validateLength(businessHours, 200);
      // Return the validated business hours
      return businessHours;
    } else {
      return 'Not found';
    }

  } catch (error) {
    console.error('Error:', error.message);
    return 'Not found';
  }
}

module.exports = extractBusinessHours;
