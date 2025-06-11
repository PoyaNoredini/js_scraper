async function handlePopup(page) {
  console.log('Checking for popup notification...');
  try {
    // Wait for the popup to appear (short timeout since it should be immediate)
    await page.waitForSelector('text="Please click on OK to subscribe for push notifications."', { timeout: 5000 });
    console.log('Popup found! Clicking OK...');
   
    // Click the OK button
    await page.click('button:has-text("Ok")');
    console.log('Popup dismissed successfully');
   
    // Wait a moment for the popup to disappear
    await page.waitForTimeout(1000);
   
  } catch (e) {
    console.log('No popup found or popup already dismissed');
  }
}


module.exports = handlePopup;