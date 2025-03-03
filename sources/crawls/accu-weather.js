import puppeteer from "puppeteer";

const URL = "https://www.accuweather.com/vi/vn/hanoi/353412/weather-forecast/353412";

export const getWeather = async () => {
  let browser = null;
  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(URL, { waitUntil: "domcontentloaded" });

    const tempCurent = await page.$eval(".temp", (el) => el.textContent);
    const desCurrent = await page.$eval(".phrase", (el) => el.textContent);
    const timeCurrent = await page.$eval(".cur-con-weather-card__subtitle", (el) => el.textContent.trim());
    const airQualityCurrent = await page.evaluate(() => {
      const labels = document.querySelectorAll('.spaced-content.detail .label');
      for (let label of labels) {
        if (label.textContent.trim() === "Chất lượng không khí") {
          return label.nextElementSibling.textContent.trim();
        }
      }
      return null;
    });
    let weatherIconCurrent = "🌥️";
    if (desCurrent.toLocaleLowerCase().includes("nắng")) weatherIconCurrent = "☀️";
    if (desCurrent.toLocaleLowerCase().includes("mưa")) weatherIconCurrent = "🌧️";
    const currentWeather = `⏰ Hiện tại (${timeCurrent}):\n🌡️ ${tempCurent} và ${weatherIconCurrent} ${desCurrent}\n💨 Không khí: ${airQualityCurrent}`;

    const weatherData = await page.evaluate(() => {
      const dailyItems = Array.from(document.querySelectorAll('.daily-list-item'));
      return dailyItems.map(item => {
        const tempHigh = item.querySelector('.temp-hi') ? item.querySelector('.temp-hi').innerText : '';
        const tempLow = item.querySelector('.temp-lo') ? item.querySelector('.temp-lo').innerText : '';
        const phrase = item.querySelector('.phrase .no-wrap') ? item.querySelector('.phrase .no-wrap').innerText : '';
        const precip = item.querySelector('.precip') ? item.querySelector('.precip').innerText : '';
        const icon = item.querySelector('.icon') ? item.querySelector('.icon').src : '';
        return { tempHigh, tempLow, phrase, precip, icon };
      })[1];
    });
    
    let weatherIconTomorrow = "🌥️";
    if (weatherData.phrase.toLocaleLowerCase().includes("nắng")) weatherIconTomorrow = "☀️";
    if (weatherData.phrase.toLocaleLowerCase().includes("mưa")) weatherIconTomorrow = "🌧️";
    const tomorrowWeather = `⏰ Ngày mai:\n🌡️ ${weatherData.tempLow} - ${weatherData.tempHigh}\n${weatherIconTomorrow} ${weatherData.phrase}\n💧 Độ ẩm: ${weatherData.precip}`;
    return currentWeather + "\n\n" + tomorrowWeather;

  } catch (error) {
    console.error("Lỗi lấy dữ liệu thời tiết:", error);
    return "Lỗi lấy dữ liệu thời tiết.";
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};


