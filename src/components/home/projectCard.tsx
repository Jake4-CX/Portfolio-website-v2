import { sortTechnology } from "@/lib/technology";
import { Card } from "../ui/card";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getTechnologies } from "@/api/technologies";
import ProjectCardModal from "./projectCardModal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";



type ProjectCardProps = {
  project?: Project
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

  const getTechnologiesQuery = useQuery({
    queryKey: ["technologies"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {

      const technologiesResponse = await getTechnologies();

      const data = (technologiesResponse.data).technologies as Technology[];

      return data;
    }
  })

  // convert ProjectTechnology[] to Technology[]
  function convertProjectTechnologyToTechnology(projectTechnologies: ProjectTechnology[]): Technology[] {
    const technologies: Technology[] = [];

    projectTechnologies.forEach((projectTech) => {
      const technology = getTechnologiesQuery.data?.find((tech: Technology) => tech.id === projectTech.technologyId);
      if (technology) {
        technologies.push(technology);
      }
    });

    return technologies;
  }

  return (
    <>
      <Card className="relative flex flex-col w-full lg:w-[27.5rem] h-[16rem] border-x-[1px] rounded-xl shadow-lg p-4">
        {
          project ? (
            <>
              <div className="relative w-full h-full">
                <div className="flex flex-col sm:flex-row">
                  <h2 className="font-extrabold text-xl text-primary">{project.projectName}</h2>
                  {/* Start - Finish date */}
                  <div className="flex flex-row items-center sm:space-x-2 sm:ml-2">
                    <div className="hidden sm:block w-[6px] h-[6px] bg-gray-500 rounded-full" />
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-gray-500 italic">({moment(project.startDate).format("Do MMM YY")} - {project.endDate ? moment(project.endDate).format("Do MMM YY") : "today"})</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        {/* Duration - in days */}
                        <p className="font-semibold text-sm">{moment(project.endDate).diff(moment(project.startDate), 'days')} days</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <p className="text-sm line-clamp-2 sm:line-clamp-3 max-h-[80px]">{project.projectDescription}</p>

                {/* Technologies used */}
                <div className="mt-2">
                  <h3 className="font-bold text-sm">Technologies Used</h3>
                  <ScrollArea className="whitespace-nowrap w-full min-h-[2rem] flex items-center justify-center border border-input bg-background rounded-lg mt-2">
                    <div className="flex flex-row min-w-fit w-full h-full items-center justify-start space-x-3 relative px-2">
                      {
                        project.projectTechnologies && project.projectTechnologies.length > 0 && sortTechnology(convertProjectTechnologyToTechnology(project.projectTechnologies as ProjectTechnology[])).map((tech, index) => {
                          return (
                            <div key={index} className="shrink-0">
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                  <img src={tech.technologyImage ?? ""} alt={tech.technologyName} width={24} height={24} className="rounded-full" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <h4 className="font-semibold text-sm">{tech.technologyName}</h4>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          )
                        })
                      }
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>

                <div className="absolute flex flex-row items-end justify-end space-x-3 inset-x-0 bottom-0">
                  <ProjectCardModal project={project} technologies={convertProjectTechnologyToTechnology(project.projectTechnologies as ProjectTechnology[])} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="h-[28px] w-[9rem] bg-gray-300 rounded-lg animate-pulse" />

              <div className="h-[16px] w-full bg-gray-300 rounded-lg animate-pulse mt-1" />
              <div className="h-[16px] w-full bg-gray-300 rounded-lg animate-pulse mt-1" />
              <div className="h-[16px] w-[70%] bg-gray-300 rounded-lg animate-pulse mt-1" />

              {/* Technologies used */}
              <div className="mt-2">
                <div className="h-[20px] max-w-[122px] w-[30%] bg-gray-300 rounded-lg animate-pulse mt-2" />
                <div className="h-[2rem] w-full bg-gray-300 rounded-lg animate-pulse mt-2" />
              </div>

              <div className="absolute flex flex-row items-end justify-end space-x-3 inset-x-0 bottom-0 p-4">
                <div className="h-[40px] w-full sm:w-[112px] bg-gray-300 rounded-lg animate-pulse" />
              </div>
            </>
          )
        }
      </Card>
    </>
  )
}

export default ProjectCard;