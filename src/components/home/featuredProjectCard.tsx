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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type FeaturedProjectCardProps = {
  project?: Project
}

const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({ project }) => {

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
    <Card className="relative flex flex-col w-full h-[16rem] border-x-[1px] rounded-xl shadow-lg p-4 max-w-[896px] lg:col-span-2">
      {
        project ? (
          <>
            <>
              <div className="w-full h-full flex flex-row sm:space-x-6">
                <div className="w-fit h-full sm:block hidden">
                  <div className="w-[9rem] max-w-[18rem] h-full bg-gray-300 rounded-lg overflow-hidden">
                    <Carousel className="w-full h-full">
                      <CarouselContent>
                        {project.projectImages &&
                          project.projectImages.length > 0 &&
                          project.projectImages.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="relative w-full h-full">
                                <img
                                  src={image.imageURL}
                                  alt={image.id.toString()}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute left-3" />
                      <CarouselNext className="absolute right-3" />
                    </Carousel>
                  </div>
                </div>

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
                    <div className="w-full h-[2rem] px-2 py-1 border border-input bg-background rounded-lg relative flex flex-row items-center space-x-3 mt-2">
                      {
                        project.projectTechnologies && project.projectTechnologies.length > 0 && sortTechnology(convertProjectTechnologyToTechnology(project.projectTechnologies as ProjectTechnology[])).map((tech, index) => {
                          return (
                            <div key={index}>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                  <img src={tech.technologyImage ?? ""} alt={tech.technologyName} className="w-6 h-6 rounded-full" />
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
                  </div>

                  <div className="absolute flex flex-row items-end justify-end space-x-3 inset-x-0 bottom-0 p-4">
                    <ProjectCardModal project={project} technologies={convertProjectTechnologyToTechnology(project.projectTechnologies as ProjectTechnology[])} />
                  </div>
                </div>
              </div>
              <div className="absolute flex top-2 right-2">
                <h2 className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-1 rounded-xl">Featured</h2>
              </div>
            </>
          </>
        ) : (
          <>
            <div className="w-full h-full flex flex-row sm:space-x-6">
              <div className="w-fit h-full sm:block hidden">
                <div className="w-[9rem] max-w-[18rem] h-full bg-gray-300 animate-pulse rounded-lg">
                </div>
              </div>

              <div className="relative w-full h-full">
                <div className="h-[28px] w-[9rem] bg-gray-300 rounded-lg animate-pulse" />

                <div className="h-[16px] w-full bg-gray-300 rounded-lg animate-pulse mt-2" />
                <div className="h-[16px] w-full bg-gray-300 rounded-lg animate-pulse mt-2" />
                <div className="h-[16px] w-[70%] bg-gray-300 rounded-lg animate-pulse mt-2" />

                {/* Technologies used */}
                <div className="mt-2">
                  <div className="h-[20px] max-w-[122px] w-[30%] bg-gray-300 rounded-lg animate-pulse mt-2" />
                  <div className="h-[2rem] w-full bg-gray-300 rounded-lg animate-pulse mt-2" />
                </div>

                <div className="absolute flex flex-row items-end justify-end space-x-3 inset-x-0 bottom-0">
                  <div className="h-[40px] w-[112px] bg-gray-300 rounded-lg animate-pulse" />
                </div>

              </div>
            </div>
            <div className="absolute flex top-2 right-2">
              <div className="text-xs font-semibold bg-gray-300 animate-pulse w-[67.59px] h-[1.5rem] px-2 py-1 rounded-xl" />
            </div>
          </>
        )
      }
    </Card>
  )
}

export default FeaturedProjectCard;