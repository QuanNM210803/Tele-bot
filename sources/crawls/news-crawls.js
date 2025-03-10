import { esClient } from "../config/elastic-config.js";
import { init_browser } from "../common/init-browser.js";
import { geminiResponse } from "../service/gemini-response.js";

const elasticSearch = esClient;

export const newsCrawls = async () => {
  const articles = await crawlNews();
  
  const newsFull = await Promise.all(
    articles.map(async ar => {
      const message = "Hãy tóm tắt nội dung bài báo dưới đây (khoảng 5 câu). Hãy trả lời thẳng vấn đề mội dung tóm tắt luôn, đừng dẫn xuất gì trước và sau khi tóm tắt. Nếu không thể tóm tắt do nội dùng quá ngắn hay bị lỗi hãy trả về \'Lỗi tóm tắt. Vào link để xem chi tiết\'. Nội dung bài viết bên dưới đây:"+ "\n\n" + ar.content.join(" ");
      const summarizedContent = await geminiResponse(message);
      return {
        title: ar.title,
        content: ar.content,
        summarizedContent: summarizedContent,
        link: ar.link,
        publishedAt: ar.publishedAt
      };
    })
  )
  await saveToElasticsearch(newsFull);

  return newsFull;
}

// Hàm crawl dữ liệu từ Google Search
const crawlNews = async () => {
  const browser = init_browser;
  const page = await browser.newPage();

  const searchUrl = "https://www.google.com/search?q=tin+tức+hôm+nay+mới+nhất&tbm=nws";
  await page.goto(searchUrl, { waitUntil: "networkidle2" });

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".WlydOe"))
      .slice(0, 6)
      .map(item => item.href);
  });
  await page.close();

  let articles = [];
  const MAX_CONCURRENT_TABS = 3;

  const processPage = async (link) => {
    const newPage = await browser.newPage();
    try {
      await newPage.goto(link, { waitUntil: "domcontentloaded", timeout: 15000 });

      const articleData = await newPage.evaluate(async () => {
        let title = document.title || null;
        let content = Array.from(document.querySelectorAll("p"))
          .slice(0, 15)
          .map(p => p.innerText.trim());

        let timeElement = document.querySelector("time") || 
                          document.querySelector("[data-role='publishdate']") ||
                          document.querySelector(".date") || 
                          document.querySelector(".post-time") || 
                          document.querySelector("[class*='time']");
        let rawTime = timeElement ? timeElement.getAttribute("datetime") || timeElement.innerText.trim() : null;

        return { title, content, publishedAt: rawTime };
      });
      articleData.link = link;

      return articleData;

    } catch (error) {
      console.error(`❌ Lỗi khi crawl ${link}:`, error.message);
      return null;
    } finally {
      await newPage.close();
    }
  };

  for (let i = 0; i < links.length; i += MAX_CONCURRENT_TABS) {
    const batchLinks = links.slice(i, i + MAX_CONCURRENT_TABS);
    const batchResults = await Promise.all(batchLinks.map(link => processPage(link)));
    articles.push(...batchResults.filter(article => article !== null));
  }

  await browser.close();
  return articles;
};

// Hàm lưu dữ liệu vào Elasticsearch
const saveToElasticsearch = async (articles) => {
  for (let article of articles) {
    article.publishedAt = await convertToDateTime(article.publishedAt);
    await elasticSearch.index({
      index: "news",
      body: {
        title: article.title,
        link: article.link,
        content: article.content,
        summarizedContent: article.summarizedContent,
        publishedAt: article.publishedAt,
        created: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      }
    });
  }
  console.log("Dữ liệu đã được lưu vào Elasticsearch.");
}

// Hàm chuyển đổi thời gian về định dạng chuẩn YYYY-MM-DD HH:mm
const convertToDateTime = async (publishedAt) => {
  if (!publishedAt || publishedAt === null) return publishedAt;
  const message = `Hãy chuyển đổi chuỗi này: ${publishedAt} về định dạng YYYY-MM-DD HH:mm:ss (ZoneTime: Asia/Ho_Chi_Minh). 
                  Chỉ trả về cho tôi đúng chuỗi định dạng 'YYYY-MM-DD HH:mm' này thôi nha, không được thêm text gì thêm.`;
  const dateTime = await geminiResponse(message);
  return dateTime;
};