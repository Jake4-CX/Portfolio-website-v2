import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import moment from "moment";
import { useTheme } from "../themeProvider";

interface GithubCommitsCardProps {
  githubCommits: GithubCommits;
  monthLabels: string[];
}

const GithubCommitsCard: React.FC<GithubCommitsCardProps> = ({ githubCommits, monthLabels }) => {

  const { theme } = useTheme();

  return (
    <>
      <Card className="flex flex-col relative space-y-[1px] text-card-foreground items-center justify-center p-1">
        <div className="flex flex-row items-center justify-center w-[49.75rem] h-[1.2rem] bg-card rounded-t-sm space-x-[2.90px] p-1 pt-2">
          {
            monthLabels.map((month, index) => (
              <div key={index} className="flex-grow text-sm">
                {month}
              </div>
            ))
          }
        </div>
        <div className="flex flex-row items-center justify-center w-[49.75rem] h-[6.80rem] bg-card rounded-b-sm space-x-[2.90px] p-1">
          {
            githubCommits.user.contributionsCollection.contributionCalendar.weeks.map((week, index) => (
              <div key={index} className="flex flex-col h-full space-y-[2.90px]">
                {
                  week.contributionDays.map((day, index) => {
                    return (
                      <div key={index}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="border-[1px] border-input rounded-[3px] h-[0.75rem] w-[0.75rem] dark:cursor-pointer" style={{ backgroundColor: backgroundColour(day, theme) }}></div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <p>{day.contributionCount} contribution on {moment(day.date).format("MMMM Do, YYYY")}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )
                  })
                }
              </div>
            ))
          }
        </div>
      </Card>
    </>
  )
}

function backgroundColour(day: ContributionDay, theme: "dark" | "light" | "system") {

  switch (theme) {
    case "dark":
      return day.contributionCount > 0 ? day.color : "#020817";
    case "light":
    default:
      return day.color;
  }

}

export default GithubCommitsCard;