import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import ProjectCard from "./projectCard";
import { getProjects } from "@/api/projects";
import FeaturedProjectCard from "./featuredProjectCard";

const ProjectsSection: React.FC = () => {

  const getProjectsQuery = useQuery({
    queryKey: ["projects"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {

      const projectsResponse = await getProjects();

      const data = (projectsResponse.data).projects as Project[];

      return data;
    }
  })

  return (
    <>
      <Card id="projects" className="flex flex-col items-center justify-center h-fit w-full lg:w-fit p-3">

        <CardHeader className="w-full px-8 lg:px-4">
          <CardTitle>Projects</CardTitle>
          <CardDescription>Here are a few projects</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-[6%] lg:px-0 w-full">
            {
              getProjectsQuery.isPending ? (
                <>
                  <FeaturedProjectCard />
                  <ProjectCard />
                  <ProjectCard />
                </>
              ) : (
                getProjectsQuery.data?.map((project: Project) => (
                  project.isFeatured ? (
                    <FeaturedProjectCard key={project.id} project={project} />
                  ) : (
                    <ProjectCard key={project.id} project={project} />
                  )
                ))
              )
            }
          </div>
        </CardContent>

      </Card>
    </>
  )
}

export default ProjectsSection;