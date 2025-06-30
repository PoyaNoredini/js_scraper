const validateLength = require('../../validator/validateLength');
// Function to extract phone number from the page
async function extractPhoneNumber(page) {
  try {
    // Try to find and click the phone reveal button
    const possibleSelectors = [
      'text="+97 Click To View"',
      'text="Click To View"',
      '[class*="click-to-view"]',
      'button:has-text("Click To View")',
      'a:has-text("Click To View")',
      'span:has-text("Click To View")',
      'button:has-text("+97")',
      'text="+97"'
    ];

    let phoneRevealButton = null;

    for (const selector of possibleSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 3000 });
        phoneRevealButton = selector;
        break;
      } catch (_) {}
    }

    if (phoneRevealButton) {
      await page.click(phoneRevealButton);
    } else {
      // Try to click any element that looks like a phone reveal
      const phoneElements = await page.$$eval('*', elements => {
        return elements
          .filter(el => el.textContent && (
            el.textContent.includes('Click To View') || 
            el.textContent.includes('+97') ||
            el.textContent.includes('Show Number')
          ))
          .map(el => el.textContent.trim());
      });

      if (phoneElements.length > 0) {
        await page.click(`text="${phoneElements[0]}"`);
      }
    }

    // Wait for the number to appear
    await page.waitForTimeout(2000);

    let phone = null;

    // Method 1: Regex selector
    try {
      const phoneElement = await page.waitForSelector('text=/\\+971\\d+/', { timeout: 5000 });
      phone = await phoneElement.textContent();
    } catch (_) {}

    // Method 2: DOM search
    if (!phone) {
      try {
        const phoneElements = await page.$$eval('*', elements => {
          return elements
            .filter(el => el.textContent && el.textContent.includes('+97'))
            .map(el => el.textContent.trim())
            .filter(text => text.match(/\+97\d+/));
        });

        if (phoneElements.length > 0) {
          phone = phoneElements[0];
        }
      } catch (_) {}
    }

    // Method 3: Search in full body text
    if (!phone) {
      try {
        const pageContent = await page.textContent('body');
        const phoneMatch = pageContent.match(/\+971[\s\d-]+/);
        if (phoneMatch) {
          phone = phoneMatch[0].replace(/\s/g, '');
        }
      } catch (_) {}
    }

    // Final output
    if (phone) {
      phone = validateLength(phone, 20); // Validate length of the phone number
      return phone;
    } else {
      return null;
    }

  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

module.exports = extractPhoneNumber;