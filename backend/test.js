import fs from "node:fs/promises";

const meals = await fs.readFile("./data/available-meals.json", "utf8");
console.log(meals);
console.log(typeof meals);
res.json(JSON.parse(meals));
