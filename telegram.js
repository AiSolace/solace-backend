const axios = require("axios");

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const TELEGRAM_CHAT_IDS = [
  process.env.TELEGRAM_CHAT_ID_1,
  process.env.TELEGRAM_CHAT_ID_2
].filter(Boolean);

async function sendTelegram(message) {
  try {
    if (!TELEGRAM_TOKEN) {
      console.log("Telegram error: TELEGRAM_TOKEN is missing in .env");
      return;
    }

    if (TELEGRAM_CHAT_IDS.length === 0) {
      console.log("Telegram error: No Telegram chat IDs found in .env");
      return;
    }

    for (const chatId of TELEGRAM_CHAT_IDS) {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: chatId,
          text: message
        }
      );
    }

    console.log("Telegram messages sent");
  } catch (error) {
    console.log("Telegram error:", error.response?.data || error.message);
  }
}

module.exports = { sendTelegram };