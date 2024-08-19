import api from "@/axios";

export function createPresignedUrl(uploadCategory: "PROJECT_IMAGE" | "TECHNOLOGY_IMAGE") {
  return api.post("storage/create-presigned-url", { uploadCategory });
}