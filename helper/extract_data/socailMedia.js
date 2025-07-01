const validateLength = require('../../validator/validateLength');

async function extractSocialMediaLinks(page) {
  try {
    const socialLinks = [];

    // Facebook
    try {
      const facebookLinks = await page.$$eval('a[href*="facebook"]', links =>
        links.map(link => link.href).filter(href => href.includes('facebook.com'))
      );
      const fb = validateLength(facebookLinks[0], 200);
      if (fb) socialLinks[0] = fb;
    } catch (_) {}

    // Instagram
    try {
      const instagramLinks = await page.$$eval('a[href*="instagram"]', links =>
        links.map(link => link.href).filter(href => href.includes('instagram.com'))
      );
      const ig = validateLength(instagramLinks[0], 200);
      if (ig) socialLinks[1] = ig;
    } catch (_) {}

    // Twitter / X
    try {
      const twitterLinks = await page.$$eval('a[href*="twitter"], a[href*="x.com"]', links =>
        links.map(link => link.href).filter(href => href.includes('twitter.com') || href.includes('x.com'))
      );
      const tw = validateLength(twitterLinks[0], 200);
      if (tw) socialLinks[2] = tw;
    } catch (_) {}

    // LinkedIn
    try {
      const linkedinLinks = await page.$$eval('a[href*="linkedin"]', links =>
        links.map(link => link.href).filter(href => href.includes('linkedin.com'))
      );
      const ln = validateLength(linkedinLinks[0],200);
      if (ln) socialLinks[3] = ln;
    } catch (_) {}

    // WhatsApp
    try {
      const whatsappLinks = await page.$$eval('a[href*="whatsapp"], a[href*="wa.me"]', links =>
        links.map(link => link.href).filter(href => href.includes('whatsapp') || href.includes('wa.me'))
      );
      const wa = validateLength(whatsappLinks[0],200);
      if (wa) socialLinks[4] = wa;
    } catch (_) {}

    if (Object.keys(socialLinks).length > 0) {
      console.log(socialLinks);
      return socialLinks;
    }

    return null;

  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

module.exports = extractSocialMediaLinks;
