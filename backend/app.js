import fs from "node:fs/promises";

import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(bodyParser.json());
// 使用 body-parser 中間件來解析 HTTP 請求的主體（body），並將其轉換為 JavaScript 的物件，方便你在後端使用

app.use(express.static("public"));
// 這個函數會將 public 資料夾中的檔案作為靜態資源，對外開放，讓用戶端可以直接透過 URL 訪問這些檔案。換句話說，任何放在 public 資料夾中的檔案都可以被當作靜態內容提供給前端，而無需特別設定路由。

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// 設置cros標頭回傳時給瀏覽器篩選

// 當收到/mealsget請求，用utf8的方式讀取成json字串檔
app.get("/meals", async (req, res) => {
  const meals = await fs.readFile("./data/available-meals.json", "utf8");

  // 把JSON檔轉為可以操作的物件，之後再轉為JSON檔坐回傳
  res.json(JSON.parse(meals));
});

// 使用者點餐完成傳送點餐內容至後端
app.post("/orders", async (req, res) => {
  const orderData = req.body.order;

  // 如果透過請求所傳來的主體中ITEM為空或0，就是沒有傳任何的點餐內容，則回傳"Missing data."
  if (
    orderData === null ||
    orderData.items === null ||
    orderData.items.length === 0
  ) {
    return res.status(400).json({ message: "Missing data." });
  }

  // 如果透過請求所傳來的主體中的EMAIL不正確，或資料為空漏填了則回傳400
  if (
    orderData.customer.email === null ||
    !orderData.customer.email.includes("@") ||
    orderData.customer.name === null ||
    orderData.customer.name.trim() === "" ||
    orderData.customer.street === null ||
    orderData.customer.street.trim() === "" ||
    orderData.customer["postal-code"] === null ||
    orderData.customer["postal-code"].trim() === "" ||
    orderData.customer.city === null ||
    orderData.customer.city.trim() === ""
  ) {
    return res.status(400).json({
      message:
        "Missing data: Email, name, street, postal code or city is missing.",
    });
  }

  // 以上都正確沒有RETURN東西回去的話，則將傳來的主體展開並且加入ID
  const newOrder = {
    ...orderData,
    id: (Math.random() * 1000).toString(),
  };

  // 讀取已經存在資料庫中的資料
  const orders = await fs.readFile("./data/orders.json", "utf8");
  // 將資料庫中的資料變成物件方便操作
  const allOrders = JSON.parse(orders);
  // 將新獲得的資料加入到資料庫中的資料
  allOrders.push(newOrder);

  // 新增完後將整個資料重新寫入JSON檔案中，並會傳成功點餐
  // JSON.stringify(allOrders)：表示要寫入的內容。JSON.stringify(allOrders) 將 JavaScript 的物件 allOrders 轉換為 JSON 字符串格式
  await fs.writeFile("./data/orders.json", JSON.stringify(allOrders));
  res.status(201).json({ message: "Order created!" });
});

//預警請求時回傳200
app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not found" });
});

app.listen(3000);
// listen() 是 Express 提供的方法，用來啟動伺服器，並指定應用程式在哪個**埠號（port）**上等待客戶端請求。
// 當你啟動伺服器後，可以透過瀏覽器或 API 工具發送請求到 http://localhost:3000，伺服器會根據設置的路由處理這些請求。
