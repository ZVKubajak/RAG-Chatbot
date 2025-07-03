import * as cheerio from "cheerio";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import crypto from "crypto";

puppeteer.use(StealthPlugin());

const junkFilters =
  "header, footer, nav, style, script, noscript, address, .header, .footer, .copyright";

type Result = { url: string; content: string };

function scrapeSite(url: string, single: true): Promise<Result>;
function scrapeSite(url: string, single: false): Promise<Result[]>;

async function scrapeSite(url: string, single: boolean): Promise<any> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    if (single) {
      const html = await page.content();
      const $ = cheerio.load(html);
      $(junkFilters).remove();
      const cleanedText = $("body").text().trim().replace(/\s+/g, " ");

      const scraped = { url, content: cleanedText };
      return scraped;
    } else {
      const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll("a"));
        return anchors
          .map((a) => a.href)
          .filter((href) => href.startsWith(location.origin));
      });

      const uniqueLinks = [...new Set(links)];
      const contentHashes = new Set<string>();
      const scraped: { url: string; content: string }[] = [];

      for (const url of uniqueLinks) {
        const subPage = await browser.newPage();

        try {
          await subPage.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 20000,
          });

          const html = await subPage.content();
          const $ = cheerio.load(html);
          $(junkFilters).remove();

          const cleanedText = $("body").text().trim().replace(/\s+/g, " ");
          if (cleanedText.length < 200) continue;

          const hash = crypto
            .createHash("sha256")
            .update(cleanedText)
            .digest("hex");
          if (contentHashes.has(hash)) {
            console.log(`Skipped duplicate content at ${url}.`);
            continue;
          }

          contentHashes.add(hash);
          scraped.push({ url, content: cleanedText });
        } catch (error) {
          console.warn(`Unable to scrape ${url}:`, error);
          continue;
        } finally {
          await subPage.close();
        }
      }

      return scraped;
    }
  } catch (error) {
    console.error("Error scraping site:", error);
    throw error;
  } finally {
    await page.close();
    await browser.close();
  }
}

export default scrapeSite;
