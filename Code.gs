/**
 * Fetches data from URLs in a Google Sheet using the Bright Data API
 * and updates the sheet with the extracted data.
 */

// --- CONFIGURATION ---
// Replace these with your actual values
const SHEET_NAME = 'Sheet1';
const BRIGHT_DATA_API_KEY = 'YOUR_BRIGHT_DATA_API_KEY'; // <-- Add your Bright Data API key here
const BRIGHT_DATA_ZONE_ID = 'YOUR_BRIGHT_DATA_ZONE_ID'; // <-- Add your Bright Data Zone ID here

// Column configuration
const URLS_COLUMN_ID = 1; // Column containing URLs (A = 1)
const CSS_SELECTOR_COLUMN = 2; // Column containing CSS selectors (B = 2)
const DATA_COLUMN = 3; // Column to start writing the extracted data (C = 3)
const REQUEST_DELAY = 1000; // Delay between requests in milliseconds (1 second)

/**
 * Creates a custom menu in the spreadsheet UI when the file is opened.
 */
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Scraper')
      .addItem('Run Scraper', 'main')
      .addToUi();
}

/**
 * Main function to run the script.
 * This function orchestrates the process of reading URLs, fetching data, and writing back to the sheet.
 */
function main() {
  const urlData = getUrlsFromSheet();
  if (urlData.length === 0) {
    Logger.log("No URLs to process.");
    return;
  }

  if (!BRIGHT_DATA_API_KEY || BRIGHT_DATA_API_KEY === 'YOUR_BRIGHT_DATA_API_KEY') {
    Logger.log("ERROR: Please set your BRIGHT_DATA_API_KEY in the configuration section.");
    return;
  }

  const extractedData = [];
  for (let i = 0; i < urlData.length; i++) {
    const url = urlData[i].url;
    const selector = urlData[i].selector;

    if (!url) {
      Logger.log(`Skipping row ${i + 2} because URL is empty.`);
      extractedData.push([]); // Add an empty array for empty rows
      continue;
    }

    const html = fetchHtmlWithBrightData(url);
    const dataItems = extractData(html, selector); // This will now be an array
    extractedData.push(dataItems);
    Utilities.sleep(REQUEST_DELAY); // Be respectful to the API and add a delay
    Logger.log(`Processed URL ${i + 1}/${urlData.length}: ${url}, Found ${dataItems.length} items.`);
  }

  updateSheet(extractedData);
}


/**
 * Opens the spreadsheet and gets the URLs and selectors from the specified columns.
 * @return {Array<{url: string, selector: string}>} An array of objects, each containing a URL and its corresponding CSS selector.
 */
function getUrlsFromSheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet(); // Get the active spreadsheet
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      Logger.log(`Sheet with name "${SHEET_NAME}" not found.`);
      return [];
    }
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return []; // Handle empty or header-only sheet

    const range = sheet.getRange(2, 1, lastRow - 1, 2);
    const values = range.getValues();

    const urlData = values.map(row => ({
      url: row[URLS_COLUMN_ID - 1],
      selector: row[CSS_SELECTOR_COLUMN - 1]
    }));

    return urlData;
  } catch (e) {
    Logger.log(`Error accessing the spreadsheet. Please check SHEET_ID and SHEET_NAME. Details: ${e}`);
    return [];
  }
}


/**
 * Fetches the HTML content of a URL using the Bright Data API.
 * @param {string} url The URL to fetch.
 * @return {string|null} The HTML content as a string, or null if there's an error.
 */
function fetchHtmlWithBrightData(url) {
  const brightDataUrl = 'https://api.brightdata.com/request';

  // Construct the payload for the Bright Data API
  const payload = {
    zone: BRIGHT_DATA_ZONE_ID,
    url: url,
    format: "raw", // We want the raw HTML content
    method: "GET"
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${BRIGHT_DATA_API_KEY}`
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // Important to handle non-200 responses gracefully
  };

  try {
    const response = UrlFetchApp.fetch(brightDataUrl, options);
    const responseCode = response.getResponseCode();
    const content = response.getContentText();

    Logger.log(`Bright Data response for ${url} | Status: ${responseCode} | Content Length: ${content ? content.length : 0}`);

    if (responseCode === 200) {
      return content;
    } else {
      Logger.log(`Error fetching ${url} via Bright Data. See full response in the log above.`);
      return null;
    }
  } catch (error) {
    Logger.log(`Failed to make request to Bright Data for URL ${url}: ${error}`);
    return null;
  }
}


/**
 * Extracts all matching data elements from the HTML content using a CSS selector.
 * @param {string} html The HTML content of the page.
 * @param {string} selector The CSS selector for the data elements.
 * @return {Array<string>} An array of the extracted text content. Returns an empty array if not found.
 */
function extractData(html, selector) {
  if (!html || !selector) {
    Logger.log("Cannot extract data: HTML content or CSS selector is missing.");
    return [];
  }

  try {
    const $ = Cheerio.load(html);
    const elements = $(selector);
    
    if (elements.length === 0) {
      Logger.log("Data element not found using selector: " + selector);
      return [];
    }

    // Map over all found elements and get their text
    const dataArray = elements.map((i, el) => $(el).text().trim()).get();
    
    return dataArray;
  } catch (error) {
    Logger.log("Error during data extraction with Cheerio: " + error);
    return [];
  }
}


/**
 * Updates the Google Sheet with the extracted data, placing each item in a separate column.
 * @param {Array<Array<string>>} data An array of arrays, where each inner array contains the data for one URL.
 */
function updateSheet(data) {
  if (data.length === 0) {
    Logger.log("No data to update.");
    return;
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet(); // Get the active spreadsheet
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    // Clear old data from the data columns to avoid leftover values
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const lastCol = sheet.getLastColumn();
      if (lastCol >= DATA_COLUMN) {
        sheet.getRange(2, DATA_COLUMN, lastRow - 1, lastCol - DATA_COLUMN + 1).clearContent();
      }
    }

    // Write the new data row by row
    data.forEach((rowData, index) => {
      const rowIndex = index + 2; // Data starts from row 2
      if (rowData && rowData.length > 0) {
        // Write the array of data horizontally starting from DATA_COLUMN
        sheet.getRange(rowIndex, DATA_COLUMN, 1, rowData.length).setValues([rowData]);
      }
    });

    Logger.log("Sheet update complete.");
  } catch (e) {
    Logger.log(`Error updating the sheet. Please check permissions and configuration. Details: ${e}`);
  }
}
