import api from "@/axios";

export function contact(data: { name: string, email: string, message: string, recaptcha: string }) {
  return api.post("/contact", data);
}