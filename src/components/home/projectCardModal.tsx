import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Github, Youtube } from "lucide-react";

type ProjectCardModalProps = {
  project: Project,
  technologies: Technology[]
};

const ProjectCardModal: React.FC<ProjectCardModalProps> = ({ project, technologies }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="flex justify-center items-center">
        <Button className="w-full md:w-fit" variant={"default"}>
          View More
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="max-w-[36rem]">
          <DialogHeader>
            <DialogTitle>{project.projectName}</DialogTitle>
            <DialogDescription>
              {
                project.isFeatured && (
                  <div className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-1 h-min rounded-xl w-fit absolute top-3 right-12">
                    Featured
                  </div>
                )
              }
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm line-clamp-[16] min-h-[6rem]">
            {project.projectDescription}
          </p>
          <div className="mt-2">
            <h3 className="font-bold text-sm">
              Technologies Used
            </h3>
            <div className="w-full h-[2rem] px-2 py-1 border border-input bg-background rounded-lg relative flex flex-row items-center space-x-3">
              {project.projectTechnologies &&
                project.projectTechnologies.length > 0 &&
                technologies.map((tech, index) => (
                  <Tooltip delayDuration={200} key={index}>
                    <TooltipTrigger asChild>
                      <img src={tech.technologyImage ?? ""} alt={tech.technologyName} className="w-6 h-6 rounded-full" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <h4 className="font-semibold text-sm">{tech.technologyName}</h4>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </div>
          <div className="mt-2">
            <h3 className="font-bold text-sm">Project Images</h3>
            <div className="w-full h-[32rem] p-4 border border-input bg-background rounded-lg">
              <Carousel className="w-fit">
                <CarouselContent>
                  {project.projectImages &&
                    project.projectImages.length > 0 &&
                    project.projectImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <div className="relative w-full h-full">
                            <img
                              src={image.imageURL}
                              alt={image.id.toString()}
                              className="w-full max-h-[30rem] h-fit object-scale-down"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-3" />
                <CarouselNext className="absolute right-3" />
              </Carousel>
            </div>
          </div>
          <div className="flex flex-row items-end justify-end space-x-3 inset-x-0 bottom-0 pt-4">
            {project.projectURLs && (
              <>
                {project.projectURLs.youtubeURL && (
                  <Button onClick={() => window.open(project.projectURLs?.youtubeURL ?? "")} className="w-full md:w-fit" variant={"default"}><Youtube className="h-4 w-4 mr-2" /> Watch Video</Button>
                )}
                {project.projectURLs.githubURL && (
                  <Button onClick={() => window.open(project.projectURLs?.githubURL ?? "")} className="w-full md:w-fit" variant={"default"}><Github className="h-4 w-4 mr-2" /> View Source</Button>
                )}
                {project.projectURLs.websiteURL && (
                  <Button onClick={() => window.open(project.projectURLs?.websiteURL ?? "")} className="w-full md:w-fit" variant={"default"}>Visit Website</Button>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default ProjectCardModal;