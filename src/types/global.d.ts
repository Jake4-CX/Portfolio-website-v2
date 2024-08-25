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
  id: number | undefined,
  projectName: string,
  projectDescription: string,
  isFeatured: boolean,
  startDate: Date | number,
  endDate: Date | number | null,
  projectImages: ProjectImage[] | [] | null | undefined,
  projectTechnologies: ProjectTechnology[] | number[] | null | undefined,
  projectURLs: ProjectLinks | null | undefined
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
  imageURL: string,
  createdAt: Date,
  updatedAt: Date
}

type ProjectTechnology = {
  id: number,
  projectId: number,
  technologyId: number
}

type ProjectLinks = {
  id: number | undefined,
  projectId: number | undefined,
  githubURL: string | null | undefined,
  websiteURL: string | null | undefined,
  youtubeURL: string | null | undefined
}