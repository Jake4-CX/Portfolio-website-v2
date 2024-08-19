import api from "@/axios";

export function getTechnologies() {
  return api.get(`/technologies`);
}

export function addTechnology(data: { technologyName: string; technologyType: string; technologyImage: string }) {
  return api.post(`/technologies`, data);
}

export function updateTechnology(data: { technologyID: number, technologyName: string; technologyType: string; technologyImage: string }) {
  return api.put(`/technologies`, data);
}

export function deleteTechnology(id: number) {
  return api.delete(`/technologies/${id.toString()}`);
}