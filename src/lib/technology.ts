
// sorting technology[] by technologyType
export function sortTechnology(technologies: Technology[]) {

  // TechnologyType order: Language, Framework, Database, Other

  return technologies.sort((a, b) => {
    if (a.technologyType === "LANGUAGE") {
      return -1;
    } else if (a.technologyType === "FRAMEWORK") {
      if (b.technologyType === "LANGUAGE") {
        return 1;
      } else {
        return -1;
      }
    } else if (a.technologyType === "DATABASE") {
      if (b.technologyType === "LANGUAGE" || b.technologyType === "FRAMEWORK") {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (b.technologyType === "OTHER") {
        return 0;
      } else {
        return 1;
      }
    }
  });
}

export async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const mimeType = blob.type;

  // Handle special cases for extensions
  let extension = mimeType.split("/")[1];
  if (extension === "svg+xml") {
    extension = "svg";
  }

  return new File([blob], `${filename}.${extension}`, { type: mimeType });
}
