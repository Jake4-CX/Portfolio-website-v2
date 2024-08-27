import api from "@/axios";

export function getGithubCommits(userName: string) {
  return api.get(`/github/commits?user=${userName}`);
}