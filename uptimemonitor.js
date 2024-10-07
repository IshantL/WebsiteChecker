const axios = require('axios');
const xlsx = require('xlsx');
const fs = require('fs');

// List of websites to check
const websites = [
  'https://www.asiantechnologyhub.com',
  'https://www.asianinfrahub.com/',
  'https://www.asian-technology.com/',
  'https://asiatekspace.com/',
  'https://www.asianinteriorhub.com/',
];

// Function to check website uptime
async function checkUptime(url) {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return { website: url, status: 'Website is up', timestamp: new Date().toLocaleString() };
    }
  } catch (error) {
    return { website: url, status: 'Website is down', timestamp: new Date().toLocaleString() };
  }
}

// Function to generate an Excel report with timestamp in the filename
function generateExcelReport(data) {
  const workbook = xlsx.utils.book_new(); // Create a new workbook
  const worksheetData = data.map(item => [item.website, item.status, item.timestamp]);

  // Create worksheet
  const worksheet = xlsx.utils.aoa_to_sheet([['Website', 'Status', 'Timestamp'], ...worksheetData]);

  // Append worksheet to workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Uptime Report');

  // Get current date and time for filename
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10); // Format: YYYY-MM-DD
  const timeStr = now.toLocaleTimeString().replace(/:/g, '-'); // Format: HH-MM-SS (replace colon for file name)

  // Write Excel file with date and time in the filename
  const filename = `uptime_report_${dateStr}_${timeStr}.xlsx`;
  xlsx.writeFile(workbook, filename);
  console.log(`Report saved as ${filename}`);
}

// Monitor websites
async function monitorWebsites() {
  const report = [];
  
  for (const website of websites) {
    const status = await checkUptime(website);
    report.push(status);
    console.log(status);
  }
  
  // Generate the Excel report after the check
  generateExcelReport(report);
}

// Schedule monitoring every hour (can be adjusted as needed)
setInterval(monitorWebsites, 3600000); // 1 hour interval

// Run initially when the script starts
monitorWebsites();
