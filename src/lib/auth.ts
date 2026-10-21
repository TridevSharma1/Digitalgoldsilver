/** Mock authentication stored in localStorage. */
import { useEffect, useState } from "react";
import { read, write } from "./store";
import type { User } from "@/mock";

const USER_KEY = "dgs:session";
const ADMIN_KEY = "dgs:admin";
const evt = "dgs-auth";

export function login(email: string, password: string, remember: boolean) {
  const u = read("users").find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
  if (!u) return "Invalid email or password";
  if (!u.active) return "Your account is deactivated. Contact support.";
  (remember ? localStorage : sessionStorage).setItem(USER_KEY, u.email);
  window.dispatchEvent(new Event(evt));
  return null;
}

export function register(data: Pick<User, "name" | "email" | "phone" | "password">) {
  const users = read("users");
  if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) return "Email already registered";
  const u: User = {
    id: "u" + Date.now(), ...data, active: true, wallet: 0, gold: 0, silver: 0, invested: 0,
    pan: "", aadhaar: "", address: "", bank: "", kyc: "Not Submitted",
  };
  write("users", [...users, u]);
  localStorage.setItem(USER_KEY, u.email);
  window.dispatchEvent(new Event(evt));
  return null;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(evt));
}

export function adminLogin(u: string, p: string) {
  if (u !== "admin" || p !== "admin123") return false;
  localStorage.setItem(ADMIN_KEY, "1");
  return true;
}
export const adminLogout = () => localStorage.removeItem(ADMIN_KEY);
export const isAdmin = () => typeof window !== "undefined" && localStorage.getItem(ADMIN_KEY) === "1";

/** Returns [email|null, ready] — ready is false until browser storage was read. */
export function useSession() {
  const [state, setState] = useState<{ email: string | null; ready: boolean }>({ email: null, ready: false });
  useEffect(() => {
    const sync = () =>
      setState({ email: localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY), ready: true });
    sync();
    window.addEventListener(evt, sync);
    return () => window.removeEventListener(evt, sync);
  }, []);
  return state;
}
