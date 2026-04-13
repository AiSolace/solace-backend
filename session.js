const sessions = new Map();

function createSession(sessionId) {
  return {
    session: sessionId,
    data: {
      businessType: null,
      visitors: null,
      recommendedPackage: null,
      company: null,
      name: null,
      contact: null
    },
    step: null
  };
}

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, createSession(sessionId));
  }

  return sessions.get(sessionId);
}

function resetSession(sessionId) {
  sessions.set(sessionId, createSession(sessionId));
}

module.exports = {
  getSession,
  resetSession
};