import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const scrapeWebsite = async (url: string) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const content = await page.evaluate(() => document.body.innerText);

  await browser.close();
  return content.trim().replace(/\s+/g, " ");
};

export default scrapeWebsite;
