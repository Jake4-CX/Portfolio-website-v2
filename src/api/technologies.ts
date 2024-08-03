import api from "@/axios";

export function getTechnologies() {
  return api.get(`/technologies`);
}