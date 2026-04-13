const { BUSINESS } = require("../config/business");
const { sendTelegram } = require("../services/telegram");
const { getSession } = require("../services/session");

function includesAny(message, phrases = []) {
  return phrases.some((phrase) => message.includes(phrase));
}

function normalizeMessage(message) {
  return message
    .toLowerCase()
    .trim()
    .replace(/[^\w\s']/g, "")
    .replace(/\s+/g, " ");
}

function fixCommonTypos(message) {
  const fixes = {
    "yhank you": "thank you",
    "thnak you": "thank you",
    "tank you": "thank you",
    "thsanks": "thanks",
    "thnks": "thanks",
    "thnaks": "thanks",
    "prcing": "pricing",
    "pakage": "package",
    "pakages": "packages",
    "solice": "solace",
    "solace aii": "solace ai",
    "how dose it work": "how does it work",
    "how doees it work": "how does it work",
    "how dose solace work": "how does solace work",
    "contcat": "contact",
    "contcat team": "contact team",
    "yeraly": "yearly",
    "annually": "annual",
    "costom": "custom"
  };

  return fixes[message] || message;
}

function buildResponse(...messages) {
  const cleanMessages = messages.filter(Boolean);

  if (cleanMessages.length <= 1) {
    return { reply: cleanMessages[0] || "" };
  }

  return { replies: cleanMessages };
}

function pick(options = []) {
  return options[Math.floor(Math.random() * options.length)];
}

function isYes(message) {
  return includesAny(message, [
    "yes",
    "yes please",
    "yeah",
    "yeah sure",
    "yep",
    "yup",
    "sure",
    "sure thing",
    "okay",
    "ok",
    "sounds good",
    "that sounds good",
    "lets do it",
    "let's do it",
    "go ahead",
    "continue",
    "move forward",
    "let's move forward",
    "lets move forward",
    "i'd like to",
    "i would like to",
    "absolutely",
    "definitely",
    "im ready",
    "i'm ready",
    "ready",
    "lets continue",
    "let's continue"
  ]);
}

function isNo(message) {
  return includesAny(message, [
    "no",
    "nope",
    "nah",
    "not right now",
    "maybe later",
    "thats all",
    "that's all",
    "thats it",
    "that's it",
    "no thats all",
    "no that's all",
    "nah thats it",
    "nah that's it",
    "nope thats all",
    "nope that's all",
    "all good",
    "im good",
    "i'm good",
    "we're good",
    "were good",
    "nothing else",
    "thats everything",
    "that's everything",
    "no im good",
    "no i'm good",
    "thats enough",
    "that's enough",
    "im done",
    "i'm done"
  ]);
}

function wantsThanks(message) {
  return includesAny(message, [
    "thank you",
    "thanks",
    "thanks so much",
    "appreciate it",
    "thank you very much"
  ]);
}

function wantsPricing(message) {
  return includesAny(message, [
    "pricing",
    "price",
    "prices",
    "package",
    "packages",
    "cost",
    "how much",
    "plans",
    "plan"
  ]);
}

function wantsYearly(message) {
  return includesAny(message, [
    "yearly",
    "annual",
    "annually",
    "year plan",
    "yearly pricing",
    "annual pricing",
    "per year"
  ]);
}

function wantsCustomPlan(message) {
  return includesAny(message, [
    "custom",
    "custom plan",
    "enterprise",
    "enterprise plan",
    "tailored",
    "big company",
    "large company",
    "agency plan"
  ]);
}

function wantsGrowthPlan(message) {
  return includesAny(message, [
    "growth",
    "growth plan",
    "most popular"
  ]);
}

function wantsProPlan(message) {
  return includesAny(message, [
    "pro",
    "pro plan"
  ]);
}

function wantsStarterPlan(message) {
  return includesAny(message, [
    "starter",
    "starter plan"
  ]);
}

function wantsEstimate(message) {
  return includesAny(message, [
    "estimate",
    "i want an estimate",
    "give me an estimate",
    "can i get an estimate",
    "quote",
    "pricing quote",
    "rough idea"
  ]);
}

function wantsStart(message) {
  return (
    message === "start" ||
    includesAny(message, [
      "let's start",
      "lets start",
      "get started",
      "start building",
      "build ai",
      "build chatbot",
      "want to get started",
      "ready to start",
      "ready to get started",
      "move forward",
      "lets begin",
      "let's begin"
    ])
  );
}

function wantsHowItWorks(message, name) {
  const loweredName = name.toLowerCase();

  return (
    message.includes(`how ${loweredName} works`) ||
    message.includes(`how does ${loweredName} work`) ||
    message.includes("how it works") ||
    message.includes("how does it work")
  );
}

function wantsContact(message) {
  return includesAny(message, [
    "contact",
    "contact team",
    "speak to your team",
    "talk to your team",
    "reach out",
    "get in touch",
    "connect me",
    "contact sales",
    "talk to us"
  ]);
}

function wantsAbout(message, name) {
  const loweredName = name.toLowerCase();

  return (
    message.includes(`what is ${loweredName}`) ||
    message.includes(`what is ${loweredName} ai`) ||
    message.includes(`tell me about ${loweredName}`) ||
    message.includes(`what does ${loweredName} do`) ||
    message.includes(`about ${loweredName}`) ||
    message.includes("tell me more") ||
    message.includes("more about")
  );
}

function wantsFounderInfo(message) {
  return includesAny(message, [
    "who created it",
    "who made it",
    "who built it",
    "who founded it",
    "who started it",
    "founder",
    "founders",
    "who created solace",
    "who made solace"
  ]);
}

function wantsWhy(message) {
  return includesAny(message, [
    "why",
    "why was it created",
    "why was this created",
    "why did you create it"
  ]);
}

function wantsWhen(message) {
  return includesAny(message, [
    "when",
    "when was it founded",
    "when was it created",
    "when did it start",
    "founded",
    "founded when"
  ]);
}

function wantsUseCases(message) {
  return includesAny(message, [
    "use cases",
    "who is it for",
    "what businesses",
    "what kind of businesses",
    "saas",
    "local businesses",
    "agencies",
    "e commerce",
    "ecommerce"
  ]);
}

function wantsResults(message) {
  return includesAny(message, [
    "results",
    "benefits",
    "outcomes",
    "what results",
    "what benefits",
    "why should i use it"
  ]);
}

function saveReturnPoint(convo) {
  if (!convo.returnStep && convo.step && convo.step !== "returnPrompt") {
    convo.returnStep = convo.step;
  }
}

function clearReturnPoint(convo) {
  convo.returnStep = null;
}

function getResumeLabel(step, businessName) {
  switch (step) {
    case "pricingOffer":
    case "businessType":
    case "visitors":
    case "proceed":
    case "company":
    case "name":
    case "contact":
      return "with pricing";
    case "directContactName":
    case "directContactInfo":
    case "directContactMessage":
      return "with getting in touch with our team";
    case "aboutFollowup":
      return `learning more about ${businessName}`;
    default:
      return "where we left off";
  }
}

function getResumePrompt(step, businessName) {
  switch (step) {
    case "pricingOffer":
      return `Would you like me to walk you through pricing now?`;
    case "businessType":
      return `To continue, what type of business or company do you run?`;
    case "visitors":
      return `About how many monthly visitors does your website receive?\n\nA rough estimate is completely fine.`;
    case "proceed":
      return `Would you like to move forward?`;
    case "company":
      return `What is the name of your company?`;
    case "name":
      return `What name should our team put down for this inquiry?`;
    case "contact":
      return `What’s the best contact information for our team to reach you? You can share your email address, phone number, or whichever you prefer.`;
    case "directContactName":
      return `What’s your name?`;
    case "directContactInfo":
      return `What’s the best way for our team to reach you? You can share your email or phone number — whichever you prefer.`;
    case "directContactMessage":
      return `What would you like to speak with our team about?`;
    case "aboutFollowup":
      return `What would you like to know about ${businessName}?\n\n• What it is\n• Why it was created\n• When it was founded\n• Who created it`;
    default:
      return `What would you like help with?`;
  }
}

function getReturnQuestion(convo, businessName) {
  if (!convo.returnStep) return "";
  return `Would you like to continue ${getResumeLabel(convo.returnStep, businessName)}, or do you have more questions?`;
}

function getAboutReply(businessName) {
  return `${businessName} is a business automation and website assistant service designed to help companies respond faster, guide visitors more effectively, and create a better experience for the people visiting their site.

In simple terms, it gives your website a more helpful and responsive front end.`;
}

function getHowItWorksReply(businessName) {
  return `${businessName} works as an intelligent assistant built directly into your website.

It engages visitors in real time, answers common questions, and guides them toward the information or next step they’re looking for.

At the same time, it captures useful context — such as visitor intent, business needs, and contact details — so your team can follow up with a clearer understanding of the conversation.

The result is a smoother experience for your visitors and a more effective way for your business to manage incoming opportunities.`;
}

function getWhyReply(businessName) {
  return `${businessName} was created to solve a common problem: businesses often miss opportunities simply because they cannot respond quickly or clearly enough online.

The goal was to build a smarter, always-available system that helps guide visitors, improve communication, and support business growth.`;
}

function getWhenReply(businessName) {
  return `${businessName} was founded in 2026 with the vision of creating a more modern and effective way for businesses to engage with visitors online.`;
}

function getWhoReply(businessName) {
  return `${businessName} was created by SaVaughn Piggott and Andrew Beaulieu, with a shared focus on building a more intelligent and effective way for businesses to communicate online.`;
}

function getUseCasesReply() {
  return `Solace is a strong fit for a few different kinds of businesses.

It works especially well for:
• SaaS websites
• Local businesses
• Agencies
• E-commerce brands

The common thread is simple: businesses that want a better way to guide visitors, answer questions, and capture more qualified inquiries.`;
}

function getResultsReply() {
  return `The biggest benefits are speed, clarity, and better lead capture.

Businesses usually care about results like:
• more qualified leads captured
• instant replies 24/7
• fewer missed opportunities
• a faster handoff to the team

In simple terms, Solace helps turn more website traffic into real conversations and cleaner opportunities.`;
}

function getPricingReply() {
  return `We keep pricing simple.

Starter — $29/month
• up to 500 conversations

Growth — $79/month
• up to 2,000 conversations

Pro — $149/month
• up to 6,000 conversations

Custom — tailored pricing
• for higher volume, tailored AI behavior, and more advanced needs

Free setup on yearly plans.`;
}

function getYearlyReply() {
  return `We do offer yearly pricing.

The cleanest way to position it is:
• Starter — $290/year
• Growth — $790/year
• Pro — $1490/year

That gives the client a discount compared with paying monthly, and yearly plans include free setup.`;
}

function getCustomReply() {
  return `Our custom plan is for businesses that need a more tailored setup.

That usually includes things like:
• higher conversation volume
• tailored AI behavior
• more advanced lead capture
• enterprise or agency-style needs

For custom work, we scope pricing based on usage, goals, and support needs rather than showing one flat price.`;
}

function getPlanReply(plan) {
  if (plan === "starter") {
    return `Starter is $29/month and is best for smaller businesses getting started.

It includes:
• up to 500 conversations
• lead capture
• basic support`;
  }

  if (plan === "growth") {
    return `Growth is $79/month and is the strongest middle option.

It includes:
• up to 2,000 conversations
• a stronger lead capture flow
• priority responses

It’s usually the best fit for growing businesses.`;
  }

  if (plan === "pro") {
    return `Pro is $149/month and is built for heavier usage.

It includes:
• up to 6,000 conversations
• priority support
• more flexibility for busier websites`;
  }

  return "";
}

async function handleChat(req, res) {
  try {
    const rawMessage = req.body.message || "";
    const normalizedMessage = normalizeMessage(rawMessage);
    const message = fixCommonTypos(normalizedMessage);
    const sessionId = req.body.session || "default";

    const convo = getSession(sessionId);
    convo.data = convo.data || {};

    let reply = "";

    if (isNo(message) && convo.step && convo.step !== "returnPrompt") {
      convo.step = null;
      clearReturnPoint(convo);

      return res.json(
        buildResponse(
          `No problem at all.`,
          `If you ever need anything else, feel free to come back anytime.`
        )
      );
    }

    if (
      convo.step &&
      wantsAbout(message, BUSINESS.name) &&
      convo.step !== "aboutFollowup" &&
      convo.step !== "returnPrompt"
    ) {
      saveReturnPoint(convo);
      convo.step = convo.returnStep ? "returnPrompt" : null;

      return res.json(
        buildResponse(
          getAboutReply(BUSINESS.name),
          getReturnQuestion(convo, BUSINESS.name)
        )
      );
    }

    if (
      convo.step &&
      wantsHowItWorks(message, BUSINESS.name) &&
      convo.step !== "returnPrompt"
    ) {
      saveReturnPoint(convo);
      convo.step = convo.returnStep ? "returnPrompt" : null;

      return res.json(
        buildResponse(
          getHowItWorksReply(BUSINESS.name),
          getReturnQuestion(convo, BUSINESS.name)
        )
      );
    }

    if (convo.step === "returnPrompt") {
      if (
        isYes(message) ||
        message.includes("continue") ||
        message.includes("where we left off") ||
        message.includes("pick up")
      ) {
        const stepToResume = convo.returnStep;
        clearReturnPoint(convo);
        convo.step = stepToResume || null;

        return res.json(
          buildResponse(
            pick(["Of course.", "Absolutely.", "Sure thing."]),
            getResumePrompt(stepToResume, BUSINESS.name)
          )
        );
      }

      if (wantsPricing(message)) {
        clearReturnPoint(convo);
        convo.step = null;
        return res.json(buildResponse(getPricingReply()));
      }

      if (wantsContact(message)) {
        clearReturnPoint(convo);
        convo.step = "directContactName";
        return res.json(buildResponse(`Of course.`, `What’s your name?`));
      }

      if (wantsHowItWorks(message, BUSINESS.name)) {
        clearReturnPoint(convo);
        convo.step = null;
        return res.json(buildResponse(getHowItWorksReply(BUSINESS.name)));
      }

      if (
        wantsAbout(message, BUSINESS.name) ||
        message.includes("more questions") ||
        message.includes("another question") ||
        message.includes("ask something else") ||
        message.includes("i have more") ||
        message === "more"
      ) {
        clearReturnPoint(convo);
        convo.step = null;
        return res.json(buildResponse(`Of course — what would you like to know?`));
      }

      if (isNo(message) || wantsThanks(message)) {
        convo.step = null;
        clearReturnPoint(convo);
        return res.json(
          buildResponse(
            `You're all set.`,
            `If you ever need anything else, feel free to come back anytime. Have a great day.`
          )
        );
      }

      return res.json(buildResponse(getReturnQuestion(convo, BUSINESS.name)));
    }

    if (wantsYearly(message) && !convo.step) {
      reply = getYearlyReply();
    }

    else if (wantsCustomPlan(message) && !convo.step) {
      reply = `${getCustomReply()}

If you'd like, I can also help you get in touch with our team about a custom setup.`;
    }

    else if (wantsGrowthPlan(message) && !convo.step) {
      reply = getPlanReply("growth");
    }

    else if (wantsStarterPlan(message) && !convo.step) {
      reply = getPlanReply("starter");
    }

    else if (wantsProPlan(message) && !convo.step) {
      reply = getPlanReply("pro");
    }

    else if (wantsUseCases(message) && !convo.step) {
      reply = getUseCasesReply();
    }

    else if (wantsResults(message) && !convo.step) {
      reply = getResultsReply();
    }

    else if (wantsPricing(message) && !convo.step) {
      convo.step = "pricingOffer";

      return res.json(
        buildResponse(
          getPricingReply(),
          `If you'd like, I can also walk you through a quick recommendation based on your business and traffic.`
        )
      );
    }

    else if (convo.step === "pricingOffer") {
      if (isYes(message) || wantsStart(message) || wantsEstimate(message)) {
        convo.step = "businessType";

        reply = pick([
          `Great.

To begin, what type of business or company do you run?`,
          `Sounds good.

What type of business or company do you run?`
        ]);
      } else if (isNo(message)) {
        convo.step = null;
        clearReturnPoint(convo);

        reply = `No problem at all.

If you'd like, I can still explain how ${BUSINESS.name} works or connect you directly with our team.`;
      } else {
        reply = `Whenever you're ready, I can walk you through a few quick questions so our team can put together the right recommendation.`;
      }
    }

    else if (wantsEstimate(message) && !convo.step) {
      convo.step = "businessType";

      reply = `Of course.

To point you in the right direction, what type of business or company do you run?`;
    }

    else if (wantsStart(message) && !convo.step) {
      convo.step = "businessType";

      reply = `Absolutely.

To start, what type of business or company do you run?`;
    }

    else if (convo.step === "businessType") {
      convo.data.type = rawMessage.trim();
      convo.step = "visitors";

      reply = `Thanks — that helps.

About how many monthly visitors does your website receive?

A rough estimate is completely fine.`;
    }

    else if (convo.step === "visitors") {
      convo.data.visitors = rawMessage.trim();

      const visitors = Number(message.replace(/,/g, ""));
      let direction = "custom";

      if (visitors >= 10000) {
        direction = "high-volume";
      } else if (visitors >= 5000) {
        direction = "growth-focused";
      } else if (visitors >= 1000) {
        direction = "established";
      }

      convo.data.recommendedDirection = direction;
      convo.step = "proceed";

      reply = `Based on what you've shared, we have a clear sense of the kind of solution that would fit your business best.

The next step would be to have our team learn a little more about your goals and put together the right recommendation for you.

Would you like to move forward?`;
    }

    else if (convo.step === "proceed") {
      if (isYes(message)) {
        convo.step = "company";

        reply = `Great.

What is the name of your company?`;
      } else if (isNo(message)) {
        convo.step = null;
        clearReturnPoint(convo);

        reply = `No problem at all.

If you'd like, I can still help with pricing, explain how ${BUSINESS.name} works, or connect you with our team.`;
      } else {
        reply = `Just let me know if you'd like to move forward, and I’ll guide you through the next step.`;
      }
    }

    else if (convo.step === "company") {
      convo.data.company = rawMessage.trim();
      convo.step = "name";

      reply = `Perfect.

And what name should our team put down for this inquiry?`;
    }

    else if (convo.step === "name") {
      convo.data.name = rawMessage.trim();
      convo.step = "contact";

      reply = `Thanks.

What’s the best contact information for our team to reach you? You can share your email address, phone number, or whichever you prefer.`;
    }

    else if (convo.step === "contact") {
      convo.data.contact = rawMessage.trim();

      await sendTelegram(`🚨 New ${BUSINESS.name} Lead

Company: ${convo.data.company}

Business Type: ${convo.data.type}

Monthly Visitors: ${convo.data.visitors}

Suggested Direction: ${convo.data.recommendedDirection}

Contact Name: ${convo.data.name}

Contact Info: ${convo.data.contact}

Time: ${new Date().toLocaleString()}
`);

      reply = `Perfect — everything has been sent to the ${BUSINESS.name} team.

Someone will reach out shortly.

Is there anything else you'd like help with?`;

      convo.step = "end";
      clearReturnPoint(convo);
    }

    else if (convo.step === "directContactName") {
      const name = rawMessage.trim();
      convo.data.directName = name;
      convo.step = "directContactInfo";

      reply = `Thanks ${name}.

What’s the best way for our team to reach you? You can share your email or phone number — whichever you prefer.`;
    }

    else if (convo.step === "directContactInfo") {
      convo.data.directContact = rawMessage.trim();
      convo.step = "directContactMessage";

      reply = `Got it.

What would you like to speak with our team about?`;
    }

    else if (convo.step === "directContactMessage") {
      convo.data.directMessage = rawMessage.trim();

      await sendTelegram(`📩 New ${BUSINESS.name} Contact Request

Name: ${convo.data.directName}
Contact Info: ${convo.data.directContact}
Message: ${convo.data.directMessage}

Time: ${new Date().toLocaleString()}`);

      reply = `Perfect — your message has been sent to the ${BUSINESS.name} team.

Someone will follow up with you shortly.

Is there anything else you'd like help with?`;

      convo.step = "end";
      clearReturnPoint(convo);
    }

    else if (convo.step === "end") {
      if (isYes(message)) {
        convo.step = null;

        reply = `Of course — what else can I help you with?

You can ask about:
• pricing
• yearly plans
• custom plans
• how it works
• use cases
• results`;
      } else if (isNo(message) || wantsThanks(message)) {
        convo.step = null;
        clearReturnPoint(convo);

        reply = `You're all set.

If you ever need anything else, feel free to come back anytime. Have a great day.`;
      } else {
        reply = `Just let me know if there's anything else you'd like help with.`;
      }
    }

    else if (wantsThanks(message)) {
      reply = `You're very welcome.

If anything else comes up, I'm here to help.`;

      convo.step = null;
      clearReturnPoint(convo);
    }

    else if (wantsHowItWorks(message, BUSINESS.name)) {
      reply = getHowItWorksReply(BUSINESS.name);
    }

    else if (wantsContact(message)) {
      convo.step = "directContactName";

      reply = `Of course.

I can help you get in touch with the ${BUSINESS.name} team.

What’s your name?`;
    }

    else if (wantsAbout(message, BUSINESS.name)) {
      reply = getAboutReply(BUSINESS.name);
    }

    else if (wantsFounderInfo(message)) {
      reply = getWhoReply(BUSINESS.name);
    }

    else if (wantsWhy(message)) {
      reply = getWhyReply(BUSINESS.name);
    }

    else if (wantsWhen(message)) {
      reply = getWhenReply(BUSINESS.name);
    }

    else {
      reply = pick([
        `I'm ${BUSINESS.name}, your virtual assistant.

I can help with pricing, yearly plans, custom packages, explain how ${BUSINESS.name} works, or connect you with our team.

What would you like to explore?`,
        `I can help with pricing, yearly plans, custom packages, explain how ${BUSINESS.name} works, or connect you with our team.

What would you like to explore?`
      ]);
    }

    res.json(buildResponse(reply));
  } catch (error) {
    console.log("Chat route error FULL:", error);
    res.json(
      buildResponse("I ran into a small issue just now. Please try again.")
    );
  }
}

module.exports = { handleChat };