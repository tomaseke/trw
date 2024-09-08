import puppeteer from "puppeteer";
import _ from "lodash";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const campuses = {
  travel: "/01GGDHJAQMA1D0VMK8WV22BJJN/01HTYZPR5T7REDAGHN618DQBN0",
  gm: "/01GGDHJAQMA1D0VMK8WV22BJJN/01HK2B2DWW42VSZ4TZ59QSP7T2",
};

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

const login = async () => {
  await page.goto("https://app.jointherealworld.com/auth/login", {
    waitUntil: "networkidle0",
  });
  await page.type("#email", "tomasekerbenu@gmail.com");
  await page.type("#password", process.env.PASSWORD);
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find((el) => el.innerText.trim() === "LOG IN");
    button?.click();
  });
  await page.waitForNetworkIdle();
};

const navigateToCampus = async (campus) => {
  await page.goto(`https://app.jointherealworld.com/chat${campuses[campus]}`);
  await new Promise((resolve) => setTimeout(resolve, 5000));
};

const getImage = async (query) => {
  const res = await (
    await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=5`, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    })
  ).json();
  const filtered = res.photos.filter((e) => e.src);
  const url = filtered[_.random(filtered.length - 1)].src.original;
  return url;
};

const getRandomCity = async () => {
  const cities = (await fs.promises.readFile(`./worldcities.csv`))
    .toString()
    .split("\n")
    .map((e) => e.split(",")[0].replaceAll('"', ""));
  return cities[_.random(cities.length - 1)];
};

const postTravelPic = async () => {
  await navigateToCampus("travel");
  const city = await getRandomCity();
  const url = await getImage(`${city}+sightseeing`);
  const image = await (await fetch(url)).arrayBuffer();
  const imagePath = `/Users/cen55497/trw/cities/${city}_${new Date().toISOString()}.jpeg`;
  fs.writeFileSync(imagePath, Buffer.from(image));
  const inputFileSelector = 'input[type="file"]';
  await page.waitForSelector(inputFileSelector);
  const inputElement = await page.$(inputFileSelector);
  await inputElement.uploadFile(imagePath);
  await page.type("#chat-input", city);
  await page.keyboard.press("Enter");
};

const sayGM = async () => {
  await navigateToCampus("gm");
  await page.type("#chat-input", "GM");
  await page.keyboard.press("Enter");
};

const main = async () => {
  await login();
  await postTravelPic();
  await sayGM();
};

await main();