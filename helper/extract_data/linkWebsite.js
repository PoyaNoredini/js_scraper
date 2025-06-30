const validateLength = require('../../validator/validateLength');
// Function to extract seller website from the page
async function extractSellerWebsite(page) {
  try {
    let website = null;

    // Method 1: Find "Seller Website:" label and extract the link
    try {
      const websiteElement = await page.waitForSelector('text=/Seller Website:/', { timeout: 3000 });
      const parentElement = await websiteElement.locator('..').first();
      const websiteText = await parentElement.textContent();
      const urlMatch = websiteText.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        website = urlMatch[0];
      }
    } catch (_) {}

    // Method 2: Look for external website links
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
        }
      } catch (_) {}
    }

    // Method 3: Fallback - Regex search in body text
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
          }
        }
      } catch (_) {}
    }

    if (website) {
      console.log(website);
      final_url = validateLength(website, 200); // Validate length of the website URL
      return final_url;
    } else {
      return 'Not found';
    }

  } catch (error) {
    console.error('Error:', error.message);
    return 'Not found';
  }
};

module.exports = extractSellerWebsite;



// // Function to extract seller website from the page
// async function extractSellerWebsite(page) {
//   console.log('Extracting seller website...');
  
//   try {
//     let website = null;

//     // Method 1: Look for "Seller Website:" label
//     try {
//       const websiteElement = await page.waitForSelector('text=/Seller Website:/', { timeout: 3000 });
//       const parentElement = await websiteElement.locator('..').first();
//       const websiteText = await parentElement.textContent();
//       const urlMatch = websiteText.match(/https?:\/\/[^\s]+/);
//       if (urlMatch) {
//         website = urlMatch[0];
//         console.log('Found website with label method:', website);
//       }
//     } catch (e) {
//       console.log('Website label method failed, trying alternatives...');
//     }

//     // Method 2: Look for links that seem like company websites
//     if (!website) {
//       try {
//         const websiteLinks = await page.$$eval('a[href^="http"]', links => {
//           return links
//             .map(link => link.href)
//             .filter(href => 
//               !href.includes('yellowpages.ae') && 
//               !href.includes('facebook') && 
//               !href.includes('instagram') && 
//               !href.includes('twitter') && 
//               !href.includes('linkedin') &&
//               !href.includes('whatsapp') &&
//               !href.includes('mailto:')
//             );
//         });
        
//         if (websiteLinks.length > 0) {
//           website = websiteLinks[0];
//           console.log('Found website with link filtering:', website);
//         }
//       } catch (e) {
//         console.log('Link filtering method failed');
//       }
//     }

//     // Method 3: Look for any URL in the page content
//     if (!website) {
//       try {
//         const pageContent = await page.textContent('body');
//         const urlMatches = pageContent.match(/https?:\/\/[^\s]+\.[a-z]{2,}/gi);
//         if (urlMatches) {
//           const filteredUrls = urlMatches.filter(url => 
//             !url.includes('yellowpages.ae') && 
//             !url.includes('facebook') && 
//             !url.includes('instagram')
//           );
//           if (filteredUrls.length > 0) {
//             website = filteredUrls[0];
//             console.log('Found website with URL pattern:', website);
//           }
//         }
//       } catch (e) {
//         console.log('URL pattern search failed');
//       }
//     }

//     return website || 'Not found';

//   } catch (error) {
//     console.error('Error extracting seller website:', error.message);
//     return 'Not found';
//   }
// };



// module.exports = extractSellerWebsite;