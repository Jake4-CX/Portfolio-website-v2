type UserDataType = {
  userId: string,
  userEmail: string,
  userRole: "USER" | "ADMIN",
  userUpdatedDate: string,
  userCreatedDate: string
}

type TokenDataType = {
  accessToken: string,
  refreshToken: string
}

type Project = {
  id: number,
  projectName: string,
  projectDescription: string,
  isFeatured: boolean,
  startDate: Date,
  endDate: Date | null
}

type Technology = {
  id: number,
  technologyName: string,
  technologyType: "LANGUAGE" | "FRAMEWORK" | "DATABASE" | "TOOL" | "OTHER",
  technologyImage: string | null
}

type ProjectImage = {
  id: number,
  projectId: number,
  image: string,
  createdAt: Date,
  updatedAt: Date
}

type ProjectLinks = {
  id: number,
  projectId: number,
  githubURL: string | null,
  websiteURL: string | null,
  youtubeURL: string | null
}