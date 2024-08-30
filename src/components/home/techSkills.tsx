import { getTechnologies } from "@/api/technologies";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const TechSkillsComponent: React.FC = () => {

  const getTechnologiesQuery = useQuery({
    queryKey: ["technologies"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {

      const technologiesResponse = await getTechnologies();

      const data = (technologiesResponse.data).technologies as Technology[];

      return data;
    }
  });

  return (
    <>
      <Card id="techskills" className="flex flex-col items-center justify-center h-fit w-full max-w-[60.625rem] p-3">

        <CardHeader className="w-full px-8 lg:px-4">
          <CardTitle>Tech Skills</CardTitle>
          <CardDescription>Here are some of the technologies that I have been working with recently</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          {
            getTechnologiesQuery.isPending && !getTechnologiesQuery.data ? (
              <></>
            ) : (
              <>
                <div className="w-full inline-flex flex-nowrap overflow-x-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
                  {
                    [1, 2].map(() => (
                      <>
                        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
                          {
                            getTechnologiesQuery.data?.map((technology: Technology) => (
                              <li key={technology.id}>
                                <Tooltip delayDuration={200}>
                                  <TooltipTrigger asChild>
                                    <img src={technology.technologyImage ?? ""} alt={technology.technologyName} className="w-[60px] max-h-[60px] object-scale-down opacity-70" />
                                  </TooltipTrigger>
                                  <TooltipContent className="z-50"> {/* TODO: Ensure Tooltip is visable - hidden issue */}
                                    <h4 className="font-semibold text-sm">{technology.technologyName}</h4>
                                  </TooltipContent>
                                </Tooltip>
                              </li>
                            ))
                          }
                        </ul>
                      </>
                    ))
                  }
                </div>
              </>
            )
          }
        </CardContent>
      </Card>
    </>
  )
}

export default TechSkillsComponent;