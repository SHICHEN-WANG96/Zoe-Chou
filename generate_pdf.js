const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const htmlPath = 'file:///' + path.resolve(__dirname, 'resume_cv.html').replace(/\\/g, '/');
  console.log('Opening:', htmlPath);
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });

  // Wait for fonts/images
  await new Promise(r => setTimeout(r, 2000));

  // Generate both PDFs
  // Note: margins are baked into @media print CSS in the HTML,
  // so Puppeteer margin is 0 and the background color is consistent.
  const paths = [
    path.resolve(__dirname, 'Zoe_Resume_Latest.pdf'),
    path.resolve(__dirname, 'ZoeChou_Resume.pdf'),
  ];

  for (const outPath of paths) {
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    });
    console.log('PDF generated:', outPath);
  }

  await browser.close();
  console.log('Done!');
})();
