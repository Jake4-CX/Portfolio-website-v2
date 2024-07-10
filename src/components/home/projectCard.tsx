import { sortTechnology } from "@/lib/technology";
import { Card } from "../ui/card";
import moment from "moment";


type ProjectCardProps = {
  project?: Project & {
    projectTechnologies: {
      id: number,
      technology: Technology
    }[],
    projectImages: ProjectImage[],
    projectLinks: ProjectLinks
  }
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

  return (
    <>
      <Card className="relative flex flex-col w-full lg:w-[27.5rem] h-[16rem] border-x-[1px] rounded-xl shadow-lg p-4">
        {
          project ? (
            <>
              <div className="flex flex-row">
                <h2 className="font-extrabold text-xl text-primary">{project.projectName}</h2>
                {/* Start - Finish date */}
                <div className="flex flex-row items-center space-x-2 ml-2">
                  <div className="w-[6px] h-[6px] bg-gray-500 rounded-full" />
                  <p className="text-xs text-gray-500 italic">({moment(project.startDate).format("Do MMM YY")} - {project.endDate ? moment(project.endDate).format("Do MMM YY") : "today"})</p>
                </div>
              </div>
              <p className="text-sm line-clap-3 max-h-[80px]">{project.projectDescription}</p>

              {/* Technologies used */}
              <div className="mt-2">
                <h3 className="font-bold text-sm mt-2">Technologies Used</h3>
                <div className="w-full h-[2rem] px-2 py-1 bg-primary rounded-lg relative flex flex-row items-center space-x-3 mt-2">
                  {
                    project.projectTechnologies && project.projectTechnologies.length > 0 && sortTechnology(project.projectTechnologies.map((tech) => tech.technology)).map((tech, index) => {
                      return (
                        <div key={index}>
                          <img src={tech.technologyImage ?? ""} alt={tech.technologyName} className="w-6 h-6 rounded-full" />
                        </div>
                      )
                    })
                  }
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
                <div className="h-[40px] w-[112px] bg-gray-300 rounded-lg animate-pulse" />
              </div>
            </>
          )
        }
      </Card>
    </>
  )
}

export default ProjectCard;