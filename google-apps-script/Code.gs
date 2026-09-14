/**
 * Revine — Google Apps Script Backend
 *
 * ORDER CYCLE:
 * Every order belongs to a 7 PM → 7 PM cycle.
 *
 * Example:
 *
 * Orders 2026-08-09
 *   Starts: 2026-08-09 7:00 PM
 *   Ends:   2026-08-10 6:59:59 PM
 *
 * Orders 2026-08-10
 *   Starts: 2026-08-10 7:00 PM
 *   Ends:   2026-08-11 6:59:59 PM
 *
 * Deployment:
 * Extensions > Apps Script
 *
 * Deploy:
 * Deploy > New deployment > Web app
 *
 * Execute as: Me
 * Who has access: Anyone
 *
 * Phone numbers are stored as TEXT so leading zeros
 * such as 01323232323 are preserved.
 *
 * STOCK:
 * A dedicated "Stock" sheet tracks out-of-stock sizes per product code.
 * One row per product code, one column per size (M/L/XL/XXL). Put an "X"
 * in a cell to mark that size out of stock; leave it blank if in stock.
 * Edit this sheet directly in Google Sheets — the website reads it live
 * via GET requests to this same web app (?action=stock).
 */

const BASE_SHEET_NAME = "Orders";
const TIMEZONE = "Asia/Dhaka";
const CYCLE_START_HOUR = 19; // 7 PM

const STOCK_SHEET_NAME = "Stock";
const STOCK_SIZES = ["M", "L", "XL", "XXL"];
const STOCK_PRODUCT_CODES = [
  "RR01", "RR02", "RR03", "RR04", "RR05", "RR06", "RR07", "RR08", "RR09", "RR10",
  "RR11", "RR12", "RR13", "RR14", "RR15", "RR16", "RR17", "RR18", "RR19", "RR20",
  "SS01", "SS02", "SS03", "SS04", "SS05", "SS06", "SS07", "SS08", "SS09", "SS10",
  "TR01", "TR02", "TR03", "TR04", "TR05",
];


/**
 * Returns the date that represents the START of the
 * current 7 PM → 7 PM order cycle.
 *
 * Example:
 *
 * Current time:
 * 2026-08-10 18:30
 *
 * Returns:
 * 2026-08-09
 *
 * Current time:
 * 2026-08-10 19:30
 *
 * Returns:
 * 2026-08-10
 */
function getOrderCycleDate() {
  const now = new Date();

  // Get current date/time in Bangladesh
  const currentDateString = Utilities.formatDate(
    now,
    TIMEZONE,
    "yyyy-MM-dd"
  );

  const currentHour = Number(
    Utilities.formatDate(now, TIMEZONE, "H")
  );

  // If current time is before 7 PM,
  // this order belongs to yesterday's cycle.
  if (currentHour < CYCLE_START_HOUR) {
    const previousDay = new Date(
      new Date(currentDateString + "T00:00:00")
        .getTime() - 24 * 60 * 60 * 1000
    );

    return Utilities.formatDate(
      previousDay,
      TIMEZONE,
      "yyyy-MM-dd"
    );
  }

  // 7 PM or later = today's cycle
  return currentDateString;
}


/**
 * Returns the current order-cycle sheet name.
 *
 * Examples:
 *
 * Orders 2026-08-09
 * Orders 2026-08-10
 */
function getCurrentSheetName() {
  return BASE_SHEET_NAME + " " + getOrderCycleDate();
}


/**
 * Handles POST requests from the website.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();

  lock.waitLock(10000);

  try {
    // Validate request
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Request body is missing.");
    }

    const payload = JSON.parse(e.postData.contents);

    // Get the correct 7 PM → 7 PM sheet
    const sheet = getSheet();

    // Generate order ID
    const orderId = generateOrderId(sheet);

    // Actual order timestamp
    const date = Utilities.formatDate(
      new Date(),
      TIMEZONE,
      "yyyy-MM-dd HH:mm:ss"
    );

    /**
     * Convert phone number to STRING.
     *
     * Example:
     * 01323232323
     *
     * stays:
     * 01323232323
     */
    const phone = String(
      payload.customer.phone ?? ""
    ).trim();
console.log("PHONE RECEIVED:", phone);
console.log("PHONE TYPE:", typeof phone);
    /**
     * Product codes + sizes.
     *
     * Example:
     * P001-M x2
     * P002-XL x1
     */
    const codesAndSizes = payload.items
      .map(
        (item) =>
          `${item.productCode}-${item.size} x${item.quantity}`
      )
      .join("\n");

    /**
     * Product names.
     */
    const productNames = payload.items
      .map((item) => item.productName)
      .join("\n");

    /**
     * Total quantity.
     */
    const totalQuantity = payload.items.reduce(
      (sum, item) => sum + Number(item.quantity),
      0
    );

    /**
     * Save order.
     *
     * Apostrophe forces Google Sheets to treat
     * the phone number as TEXT.
     *
     * Google Sheets displays:
     *
     * 01323232323
     *
     * instead of:
     *
     * 1323232323
     */
    sheet.appendRow([
      orderId,
      date,
      "'" + phone,
      codesAndSizes,
      payload.total,
      productNames,
      totalQuantity,
      payload.customer.name,
      payload.customer.address,
      payload.customer.district,
      payload.customer.area,
      payload.deliveryCharge,
      "Pending",
    ]);

    return jsonResponse({
      success: true,
      orderId: orderId,
    });

  } catch (err) {

    return jsonResponse({
      success: false,
      message: err.message,
    });

  } finally {

    lock.releaseLock();

  }
}


/**
 * Handles GET requests from the website.
 *
 * ?action=stock -> returns current out-of-stock sizes per product code.
 */
function doGet(e) {
  const action = e && e.parameter && e.parameter.action;

  if (action === "stock") {
    try {
      return jsonResponse({
        success: true,
        stock: getStockData(),
      });
    } catch (err) {
      return jsonResponse({
        success: false,
        message: err.message,
      });
    }
  }

  return jsonResponse({
    success: false,
    message: "Unknown action.",
  });
}


/**
 * Gets the correct sheet for the current
 * 7 PM → 7 PM order cycle.
 *
 * If it doesn't exist, create it.
 */
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheetName = getCurrentSheetName();

  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = createDailySheet();
  }

  return sheet;
}


/**
 * Creates the sheet for the CURRENT 7 PM → 7 PM cycle.
 *
 * Example:
 *
 * At 2026-08-10 2:00 PM:
 * Orders 2026-08-09
 *
 * At 2026-08-10 8:00 PM:
 * Orders 2026-08-10
 */
function createDailySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheetName = getCurrentSheetName();

  // Check if already exists
  let sheet = ss.getSheetByName(sheetName);

  if (sheet) {
    return sheet;
  }

  // Create new sheet
  sheet = ss.insertSheet(sheetName);

  // Header row
  sheet.appendRow([
    "Order ID",
    "Date",
    "Phone",
    "Product Codes + Sizes",
    "Total Bill",
    "Product Names",
    "Quantity",
    "Customer Name",
    "Address",
    "District",
    "Area",
    "Delivery Charge",
    "Status",
  ]);

  /**
   * Phone column = Column C.
   *
   * Set it as Plain Text so leading zeros
   * are preserved for manual entries too.
   */
  sheet.getRange("C:C").setNumberFormat("@");

  // Bold header
  const headerRange = sheet.getRange(
    1,
    1,
    1,
    13
  );

  headerRange.setFontWeight("bold");

  // Freeze header
  sheet.setFrozenRows(1);

  return sheet;
}


/**
 * Generates order ID based on the current
 * 7 PM → 7 PM order cycle.
 *
 * Example:
 *
 * ORD-20260809-0001
 * ORD-20260809-0002
 * ORD-20260809-0003
 */
function generateOrderId(sheet) {

  const cycleDate = getOrderCycleDate();

  const orderIdDate = cycleDate.replace(/-/g, "");

  const prefix = "ORD-" + orderIdDate + "-";

  const lastRow = sheet.getLastRow();

  let maxSeq = 0;

  if (lastRow > 1) {

    const ids = sheet
      .getRange(2, 1, lastRow - 1, 1)
      .getValues();

    ids.forEach((row) => {

      const id = String(row[0]);

      if (id.indexOf(prefix) === 0) {

        const seq = parseInt(
          id.substring(prefix.length),
          10
        );

        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }

    });
  }

  const nextSeq = String(
    maxSeq + 1
  ).padStart(4, "0");

  return prefix + nextSeq;
}


/**
 * Gets or creates the Stock sheet.
 *
 * Layout:
 * Product Code | M | L | XL | XXL
 *
 * An "X" in a size column means that size is OUT OF STOCK.
 * Blank means in stock.
 */
function getStockSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName(STOCK_SHEET_NAME);

  if (!sheet) {
    sheet = createStockSheet();
  }

  return sheet;
}


/**
 * Creates the Stock sheet, seeded with every known
 * product code (RR01-RR20, SS01-SS10, TR01-TR05), all marked in stock.
 */
function createStockSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName(STOCK_SHEET_NAME);

  if (sheet) {
    return sheet;
  }

  sheet = ss.insertSheet(STOCK_SHEET_NAME);

  // Header row
  sheet.appendRow(["Product Code"].concat(STOCK_SIZES));

  // Seed one row per known product code, all blank (in stock).
  STOCK_PRODUCT_CODES.forEach((code) => {
    sheet.appendRow([code, "", "", "", ""]);
  });

  // Bold header
  sheet
    .getRange(1, 1, 1, STOCK_SIZES.length + 1)
    .setFontWeight("bold");

  // Freeze header
  sheet.setFrozenRows(1);

  return sheet;
}


/**
 * Backfills the Stock sheet with any product codes from
 * STOCK_PRODUCT_CODES that don't have a row yet (e.g. TR01-TR05
 * after adding the trousers line). Existing rows — and any
 * out-of-stock marks already set on them — are left untouched.
 *
 * createStockSheet() only seeds a brand-new sheet, so once the
 * Stock sheet already exists (as it does in production) newly
 * added product codes need this to actually show up as rows.
 *
 * Run this function ONCE manually after adding new product codes:
 *
 * Apps Script
 *   ↓
 * Run
 *   ↓
 * addMissingStockRows
 */
function addMissingStockRows() {
  const sheet = getStockSheet();

  const lastRow = sheet.getLastRow();
  const existingCodes = new Set();

  if (lastRow >= 2) {
    sheet
      .getRange(2, 1, lastRow - 1, 1)
      .getValues()
      .forEach((row) => {
        const code = String(row[0]).trim();
        if (code) existingCodes.add(code);
      });
  }

  const missingCodes = STOCK_PRODUCT_CODES.filter(
    (code) => !existingCodes.has(code)
  );

  missingCodes.forEach((code) => {
    sheet.appendRow([code, "", "", "", ""]);
  });

  return missingCodes;
}


/**
 * Reads the Stock sheet and returns out-of-stock sizes
 * per product code.
 *
 * Example:
 *
 * {
 *   RR02: ["M", "L", "XL", "XXL"],
 *   RR09: ["L"],
 *   SS01: []
 * }
 */
function getStockData() {
  const sheet = getStockSheet();

  const lastRow = sheet.getLastRow();

  const result = {};

  if (lastRow < 2) {
    return result;
  }

  const values = sheet
    .getRange(2, 1, lastRow - 1, STOCK_SIZES.length + 1)
    .getValues();

  values.forEach((row) => {
    const code = String(row[0]).trim();

    if (!code) {
      return;
    }

    const outOfStockSizes = [];

    STOCK_SIZES.forEach((size, index) => {
      const cell = String(row[index + 1]).trim();

      if (cell) {
        outOfStockSizes.push(size);
      }
    });

    result[code] = outOfStockSizes;
  });

  return result;
}


/**
 * Returns JSON response.
 */
function jsonResponse(obj) {

  return ContentService
    .createTextOutput(
      JSON.stringify(obj)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );
}


/**
 * Creates the daily 7 PM trigger.
 *
 * Run this function ONCE manually:
 *
 * Apps Script
 *   ↓
 * Run
 *   ↓
 * installDailyTrigger
 *
 * The trigger will execute every day during
 * the 7 PM hour.
 */
function installDailyTrigger() {

  // Remove existing createDailySheet triggers
  // to prevent duplicates.
  ScriptApp
    .getProjectTriggers()
    .forEach((trigger) => {

      if (
        trigger.getHandlerFunction() ===
        "createDailySheet"
      ) {

        ScriptApp.deleteTrigger(trigger);

      }

    });

  // Create new daily trigger.
  ScriptApp
    .newTrigger("createDailySheet")
    .timeBased()
    .everyDays(1)
    .atHour(19)
    .inTimezone(TIMEZONE)
    .create();

  Logger.log(
    "7 PM daily order-cycle trigger installed successfully."
  );
}
