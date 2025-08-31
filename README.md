## Google Sheets Advanced Web Scraper 📈

A powerful Google Apps Script that uses the Bright Data API to automate sophisticated web scraping directly within Google Sheets. Extract multiple data points, bypass common anti-scraping measures, and populate your spreadsheet with structured data.

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/FS6zD4k_1W0/0.jpg)](https://www.youtube.com/watch?v=FS6zD4k_1W0)

## Features

* **Advanced Scraping Power:** Integrates with the Bright Data API to handle websites with CAPTCHAs, IP blocking, and other anti-scraping technologies.
* **Dynamic & Bulk Extraction:** Reads URLs and CSS selectors from your sheet and extracts all matching elements for a given selector, not just the first one.
* **Flexible Output:** Automatically writes the extracted data into adjacent columns, perfect for lists of features, product specs, or search results.
* **Simple UI:** Includes a custom menu item in your Google Sheet for easy, one-click execution.
* **Responsible & Schedulable:** Comes with a configurable delay and can be scheduled to run automatically using Google Apps Script's built-in triggers.

## How It Works

The workflow leverages a professional scraping service for robustness and reliability:

1. **Read:** The script reads a list of target URLs and their corresponding CSS selectors from your Google Sheet.
2. **Request via Bright Data:** For each URL, it sends a request to the Bright Data API, which intelligently fetches the page content using its advanced proxy network and unlocking technology.
3. **Parse:** The clean HTML returned by the API is loaded into the Cheerio library, enabling jQuery-like traversal of the document.
4. **Extract:** It uses the provided CSS selector to find all matching elements on the page and extracts their text content into an array.
5. **Write:** Finally, it writes this array of data back into the sheet, populating the columns to the right of the URL and selector.

## Technology Stack

* **Google Apps Script:** The serverless JavaScript platform that powers the automation. https://developers.google.com/apps-script
* **Google Sheets:** Acts as both the input database and the output display.
* **Bright Data:** The web data platform used as the proxy and scraping engine to overcome blocks and retrieve clean HTML. https://brightdata.com/
* **Cheerio:** A fast, flexible, and lean implementation of core jQuery used for parsing the HTML. https://github.com/tani/cheeriogs

## Setup

For a detailed walkthrough, please refer to the full guide: https://bestflow.io/blog/posts/how-to-scrape-protected-sites-like-amazon-directly-from-google-sheets-with-bright-data/

➡️ **How to Scrape Protected Sites Like Amazon Directly from Google Sheets with Bright Data**

### 1. Prepare Your Google Sheet

Create a new Google Sheet. Your sheet needs at least three columns:

* **Column A:** The full **URL** of the page you want to scrape.
* **Column B:** The **CSS Selector** that points to the specific elements on the page.
* **Column C onwards:** These columns will be automatically populated with the **Scraped Data**. Each matching element will get its own column.

### 2. Get a Bright Data API Key

This script requires a Bright Data account and an API key.

Sign up for a **Bright Data account**.

Navigate to the "Web Unlocker" product and activate it.

Go to your account settings or the API section to find your API key. 

### 3. Add and Configure the Script Code ⚠️

1. Open your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any boilerplate code in the Code.gs file and paste the new script code.
3. Find the CONFIGURATION section at the top of the script.
4. Paste your actual Bright Data API key directly into the BRIGHT_DATA_API_KEY constant.

```javascript
// --- CONFIGURATION ---
// Replace these with your actual values
const SHEET_NAME = 'Sheet1';
const BRIGHT_DATA_API_KEY = 'YOUR_BRIGHT_DATA_API_KEY'; // <-- Add your Bright Data API key here
const BRIGHT_DATA_ZONE_ID = 'YOUR_BRIGHT_DATA_ZONE_ID'; // <-- Add your Bright Data Zone ID here
```
\*\*Warning:\*\* Because your API key is stored directly in the code, do not share this script file or make it public, as it will expose your private key.
### 4. Add the Cheerio Library ⚙️

This script requires the Cheerio library to parse HTML.

1. In the Apps Script editor, click the **+** icon next to "Libraries".
2. In the "Script ID" field, enter the following ID: 1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0
3. Click **Look up**. Select the latest version and click **Add**.

### 5. Find Your CSS Selectors

1. In Chrome, navigate to the target webpage.
2. Right-click the element you want to scrape and select **Inspect**.
3. In the Developer Tools, right-click the highlighted HTML line, then go to **Copy** > **Copy selector**.
4. Paste this selector into Column B of your spreadsheet.

### 6. Run the Script

Save the project in the Apps Script editor.

Go back to your Google Sheet. You may need to refresh the page. A new menu named "**Scraper**" should appear.

Click **Scraper** > **Run Scraper**.

The first time you run it, Google will ask for permissions. Authorize the script to allow it to access your spreadsheets and fetch external URLs.

### 7. Schedule Automatic Runs (Optional) 🕒

1.  In the Apps Script editor, go to the **Triggers** tab (the clock icon).
2.  Click **+ Add Trigger**.
3.  Configure the trigger to run the main function on a Time-driven basis (e.g., daily).
4.  Click **Save**.

## Limitations

* **External Dependency:** This script relies on the Bright Data service, which is a third-party paid service. You must manage your usage and billing through their platform.
* **Be Ethical:** Even with a powerful tool, you must scrape responsibly. Always respect a website's Terms of Service and avoid making an excessive number of requests.

## License

This project is licensed under the Apache License 2.0 License. See the LICENSE file for details.







