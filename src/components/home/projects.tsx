import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import ProjectCard from "./projectCard";

const ProjectsSection: React.FC = () => {

  return (
    <>
      <Card id="projects" className="flex flex-col items-center justify-center h-fit w-full lg:w-fit p-3">

        <CardHeader className="w-full px-8 lg:px-4">
          <CardTitle>Projects</CardTitle>
          <CardDescription>Here are a few projects</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-[6%] lg:px-0 w-full">
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
          </div>
        </CardContent>

      </Card>
    </>
  )
}

export default ProjectsSection;