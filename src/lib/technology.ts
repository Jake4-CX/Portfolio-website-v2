
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