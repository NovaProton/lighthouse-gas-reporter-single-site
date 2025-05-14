function runLighthouseAuditDesktop() {

  const API_KEY = 'GoogleAPIKey'; // Get from Google Cloud Console
  const MAX_RETRIES = 3;
  const INITIAL_DELAY = 2000; // 2 seconds

  const sheetId = 'SheetId'; // Replace with your Desktop sheet ID
  const combinedSheetId = 'SheetId'; // Replace with the Combined sheet ID
  const sheetName = 'SheetName'; // Replace with your Desktop sheet name
  const combinedSheetName = 'SheetName'; // Name of the combined sheet
  const targetUrl = 'URLtoAudit';

  const lighthouseApiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&category=performance&category=accessibility&category=seo&category=best-practices&strategy=desktop&key=${API_KEY}`;

  let response, data;
  let retryCount = 0;
  let delay = INITIAL_DELAY;

  while (retryCount < MAX_RETRIES) {
    try {
      response = UrlFetchApp.fetch(lighthouseApiUrl, { muteHttpExceptions: true });
      const statusCode = response.getResponseCode();

      if (statusCode === 429) {
        Logger.log(`Quota exceeded. Retry ${retryCount + 1}/${MAX_RETRIES}`);
        Utilities.sleep(delay + Math.random() * 1000);
        delay *= 2;
        retryCount++;
        continue;
      } else if (statusCode >= 500) {
        Logger.log(`Server error. Retry ${retryCount + 1}/${MAX_RETRIES}`);
        Utilities.sleep(delay + Math.random() * 500); // Add jitter here too
        delay *= 2;
        retryCount++;
        continue;
      }

      data = JSON.parse(response.getContentText());
      if (!data?.lighthouseResult) throw new Error('Invalid response structure');
      break;
    } catch (e) {
      Logger.log(`Attempt ${retryCount + 1} failed: ${e.message}`);
      if (retryCount >= MAX_RETRIES - 1) {
        Logger.log('Max retries exceeded. Aborting');
        return; // Instead of throwing, fail gracefully
      }
      Utilities.sleep(delay);
      delay *= 2;
      retryCount++;
    }
  }

  if (!data) {
    Logger.log('Failed to get valid data after retries');
    return;
  }

  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const time = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'HH:mm:ss');
  const dateTimeCombined = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  const metrics = {
    Date: date,
    Time: time,
    DateTimeCombined: dateTimeCombined,
    Performance: data.lighthouseResult.categories.performance.score || 'N/A',
    Accessibility: data.lighthouseResult.categories.accessibility.score || 'N/A',
    BestPractices: data.lighthouseResult.categories['best-practices'].score || 'N/A',
    SEO: data.lighthouseResult.categories.seo.score || 'N/A',
    TotalBlockingTime: data.lighthouseResult.audits['total-blocking-time']?.numericValue || 'N/A',
    FirstContentfulPaint: data.lighthouseResult.audits['first-contentful-paint']?.numericValue || 'N/A',
    SpeedIndex: data.lighthouseResult.audits['speed-index']?.numericValue || 'N/A',
    LargestContentfulPaint: data.lighthouseResult.audits['largest-contentful-paint']?.numericValue || 'N/A',
    CumulativeLayoutShift: data.lighthouseResult.audits['cumulative-layout-shift']?.numericValue || 'N/A',
    TimeToInteractive: data.lighthouseResult.audits['interactive']?.numericValue || 'N/A',
    MaxPotentialFirstInputDelay: data.lighthouseResult.audits['max-potential-fid']?.numericValue || 'N/A',
    ServerResponseTime: data.lighthouseResult.audits['server-response-time']?.numericValue || 'N/A',
    TotalPageSize: data.lighthouseResult.audits['total-byte-weight']?.numericValue || 'N/A',
    NumberOfJsRequests: data.lighthouseResult.audits['network-requests']?.details?.items?.filter(
      (item) => item.resourceType === 'Script'
    ).length || 'N/A',
    JsExecutionTime: data.lighthouseResult.audits['bootup-time']?.numericValue || 'N/A',
  };

  // Append data to Desktop raw report
  const desktopSheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  if (!desktopSheet) {
    throw new Error(`Sheet named ${sheetName} not found in spreadsheet ID ${sheetId}`);
  }

  desktopSheet.appendRow([
    metrics.Date,
    metrics.Time,
    metrics.DateTimeCombined,
    metrics.Performance,
    metrics.Accessibility,
    metrics.BestPractices,
    metrics.SEO,
    metrics.TotalBlockingTime,
    metrics.FirstContentfulPaint,
    metrics.SpeedIndex,
    metrics.LargestContentfulPaint,
    metrics.CumulativeLayoutShift,
    metrics.TimeToInteractive,
    metrics.MaxPotentialFirstInputDelay,
    metrics.ServerResponseTime,
    metrics.TotalPageSize,
    metrics.NumberOfJsRequests,
    metrics.JsExecutionTime,
  ]);

  // Append data to Combined sheet with "Desktop" tag
  const combinedSheet = SpreadsheetApp.openById(combinedSheetId).getSheetByName(combinedSheetName);
  if (!combinedSheet) {
    throw new Error(`Sheet named ${combinedSheetName} not found in spreadsheet ID ${combinedSheetId}`);
  }

  combinedSheet.appendRow([
    metrics.Date,
    metrics.Time,
    metrics.DateTimeCombined,
    metrics.Performance,
    metrics.Accessibility,
    metrics.BestPractices,
    metrics.SEO,
    metrics.TotalBlockingTime,
    metrics.FirstContentfulPaint,
    metrics.SpeedIndex,
    metrics.LargestContentfulPaint,
    metrics.CumulativeLayoutShift,
    metrics.TimeToInteractive,
    metrics.MaxPotentialFirstInputDelay,
    metrics.ServerResponseTime,
    metrics.TotalPageSize,
    metrics.NumberOfJsRequests,
    metrics.JsExecutionTime,
    'Desktop', // Add "Desktop" tag
  ]);
}