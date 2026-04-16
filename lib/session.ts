import { randomUUID } from "crypto";

type Session = {
  id: string;
  username: string;
};

let activeSession: Session | null = null;

export function hasActiveSession() {
  return activeSession !== null;
}

export function createSession(username: string) {
  if (activeSession) {
    return null; // ❌ block new login
  }

  const session = {
    id: randomUUID(),
    username,
  };

  activeSession = session;
  return session;
}

export function getSession(sessionId: string) {
  if (activeSession && activeSession.id === sessionId) {
    return activeSession;
  }
  return null;
}

export function destroySession() {
  activeSession = null;
}