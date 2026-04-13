function normalizeMessage(message = "") {
  return String(message).toLowerCase().trim();
}

function isGreeting(message = "") {
  return ["hi", "hello", "hey", "yo"].some((word) =>
    message.includes(word)
  );
}

function isYes(message = "") {
  return ["yes", "yep", "yeah", "sure", "ok", "okay"].some((word) =>
    message.includes(word)
  );
}

function isNo(message = "") {
  return ["no", "nope", "nah"].some((word) =>
    message.includes(word)
  );
}

function parseVisitorCount(message = "") {
  const cleaned = String(message).toLowerCase().replace(/,/g, "").trim();

  if (cleaned.includes("k")) {
    const num = parseFloat(cleaned.replace("k", ""));
    return isNaN(num) ? 0 : num * 1000;
  }

  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

function isValidContact(value = "") {
  const text = String(value).trim();

  const emailRegex = /\S+@\S+\.\S+/;
  const phoneRegex = /^[\d\s()+-]{7,}$/;

  return emailRegex.test(text) || phoneRegex.test(text);
}

module.exports = {
  normalizeMessage,
  isGreeting,
  isYes,
  isNo,
  parseVisitorCount,
  isValidContact
};