// Function to extract phone number from the page
async function extractPhoneNumber(page) {
  console.log('Starting phone number extraction...');
  
  try {
    // Try multiple selectors for the phone reveal button
    console.log('Looking for phone reveal button...');
    
    let phoneRevealButton = null;
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

    for (const selector of possibleSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 3000 });
        phoneRevealButton = selector;
        console.log(`Found phone button with selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }

    if (!phoneRevealButton) {
      console.log('Phone reveal button not found. Let me check the page structure...');
      
      // Get all text content to debug
      const pageText = await page.textContent('body');
      console.log('Page contains "Click To View":', pageText.includes('Click To View'));
      
      // Try to find any clickable element with phone-related text
      const phoneElements = await page.$$eval('*', elements => {
        return elements
          .filter(el => el.textContent && (
            el.textContent.includes('Click To View') || 
            el.textContent.includes('+97') ||
            el.textContent.includes('Show Number')
          ))
          .map(el => ({
            tagName: el.tagName,
            textContent: el.textContent.trim(),
            className: el.className
          }));
      });
      
      console.log('Found phone-related elements:', phoneElements);
      
      if (phoneElements.length > 0) {
        // Try clicking the first phone-related element
        console.log('Trying to click phone element:', phoneElements[0].textContent);
        await page.click(`text="${phoneElements[0].textContent}"`);
      }
    } else {
      // Click the phone reveal button
      console.log('Clicking phone reveal button...');
      await page.click(phoneRevealButton);
    }

    // Wait a moment for the phone number to be revealed
    await page.waitForTimeout(2000);

    // Try multiple approaches to get the phone number
    let phone = null;
    
    // Method 1: Look for UAE phone number pattern
    try {
      console.log('Trying to find phone with regex pattern...');
      const phoneElement = await page.waitForSelector('text=/\\+971\\d+/', { timeout: 5000 });
      phone = await phoneElement.textContent();
      console.log('Found phone with regex:', phone);
    } catch (e) {
      console.log('Regex method failed, trying alternative methods...');
    }

    // Method 2: Look for any element containing +97
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
          console.log('Found phone with text search:', phone);
        }
      } catch (e) {
        console.log('Text search method failed');
      }
    }

    // Method 3: Extract from page content using regex
    if (!phone) {
      try {
        const pageContent = await page.textContent('body');
        const phoneMatch = pageContent.match(/\+971[\s\d-]+/);
        if (phoneMatch) {
          phone = phoneMatch[0].replace(/\s/g, '');
          console.log('Found phone with page content regex:', phone);
        }
      } catch (e) {
        console.log('Page content regex method failed');
      }
    }

    if (phone) {
      console.log('✅ Phone Number:', phone);
      return phone;
    } else {
      console.log('❌ Phone number not found');
      
      // Debug: Take a screenshot
      await page.screenshot({ path: 'debug_page.png', fullPage: true });
      console.log('Screenshot saved as debug_page.png for debugging');
      return null;
    }

  } catch (error) {
    console.error('Error in phone extraction:', error.message);
    return null;
  }
}

module.exports = extractPhoneNumber;