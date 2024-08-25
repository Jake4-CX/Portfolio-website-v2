import api from "@/axios";

export function getTechnologies() {
  return api.get(`/technologies`);
}

export function getTechnology(id: number) {
  return api.get(`/technologies/${id.toString()}`);
}

export function addTechnology(data: { technologyName: string; technologyType: string; technologyImage: string }) {
  return api.post(`/technologies`, data);
}

export function updateTechnology(data: { technologyID: number, technologyName: string; technologyType: string; technologyImage: string }) {
  return api.put(`/technologies/${data.technologyID.toString()}`, {
    technologyName: data.technologyName,
    technologyType: data.technologyType,
    technologyImage: data.technologyImage
  });
}

export function deleteTechnology(id: number) {
  return api.delete(`/technologies/${id.toString()}`);
}