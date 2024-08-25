import api from "@/axios";

export function getProjects() {
  return api.get(`/projects`);
}

export function getProject(id: number) {
  return api.get(`/projects/${id.toString()}`);
}

export function addProject(data: Project) {
  return api.post(`/projects`, data);
}

export function assignProjectImages(projectID: number, images: string[]) {
  return api.put(`/projects/${projectID.toString()}/images`, { imageURLs: images });
}

export function updateProject(data: Project) {
  return api.put(`/projects/${data.id?.toString()}`, data);
}

export function deleteProject(id: number) {
  return api.delete(`/projects/${id.toString()}`);
}