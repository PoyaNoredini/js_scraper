async function extractSocialMediaLinks(page) {
  console.log('Extracting social media links...');
  
  try {
    const socialLinks = {};

    // Extract Facebook links
    try {
      const facebookLinks = await page.$$eval('a[href*="facebook"]', links => 
        links.map(link => link.href).filter(href => href.includes('facebook.com'))
      );
      if (facebookLinks.length > 0) {
        socialLinks.facebook = facebookLinks[0];
        console.log('Found Facebook link:', facebookLinks[0]);
      }
    } catch (e) {
      console.log('No Facebook links found');
    }

    // Extract Instagram links
    try {
      const instagramLinks = await page.$$eval('a[href*="instagram"]', links => 
        links.map(link => link.href).filter(href => href.includes('instagram.com'))
      );
      if (instagramLinks.length > 0) {
        socialLinks.instagram = instagramLinks[0];
        console.log('Found Instagram link:', instagramLinks[0]);
      }
    } catch (e) {
      console.log('No Instagram links found');
    }

    // Extract Twitter links
    try {
      const twitterLinks = await page.$$eval('a[href*="twitter"], a[href*="x.com"]', links => 
        links.map(link => link.href).filter(href => href.includes('twitter.com') || href.includes('x.com'))
      );
      if (twitterLinks.length > 0) {
        socialLinks.twitter = twitterLinks[0];
        console.log('Found Twitter link:', twitterLinks[0]);
      }
    } catch (e) {
      console.log('No Twitter links found');
    }

    // Extract LinkedIn links
    try {
      const linkedinLinks = await page.$$eval('a[href*="linkedin"]', links => 
        links.map(link => link.href).filter(href => href.includes('linkedin.com'))
      );
      if (linkedinLinks.length > 0) {
        socialLinks.linkedin = linkedinLinks[0];
        console.log('Found LinkedIn link:', linkedinLinks[0]);
      }
    } catch (e) {
      console.log('No LinkedIn links found');
    }

    // Extract WhatsApp links
    try {
      const whatsappLinks = await page.$$eval('a[href*="whatsapp"], a[href*="wa.me"]', links => 
        links.map(link => link.href).filter(href => href.includes('whatsapp') || href.includes('wa.me'))
      );
      if (whatsappLinks.length > 0) {
        socialLinks.whatsapp = whatsappLinks[0];
        console.log('Found WhatsApp link:', whatsappLinks[0]);
      }
    } catch (e) {
      console.log('No WhatsApp links found');
    }

    return Object.keys(socialLinks).length > 0 ? socialLinks : null;

  } catch (error) {
    console.error('Error extracting social media links:', error.message);
    return null;
  }
}

module.exports = extractSocialMediaLinks;