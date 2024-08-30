import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import GithubCommitsCard from "./githubCommitsCard";
import { useQuery } from "@tanstack/react-query";
import { getGithubCommits } from "@/api/github";
import moment from "moment";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import LoadingComponent from "../global/loading";

const GithubCommits: React.FC = () => {

  const getGHCommits = useQuery({
    queryKey: ["githubCommits", "Jake4-CX"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {

      const projectsResponse = await getGithubCommits("Jake4-CX");
      const data = (projectsResponse.data).data as GithubCommits;

      return data;
    }
  });

  const [monthLabels, setMonthLabels] = useState<string[]>([]);

  useEffect(() => {
    if (getGHCommits.data) {
      setMonthLabels(getMonthsLabel(getGHCommits.data.user.contributionsCollection.contributionCalendar.weeks));
    }
  }, [getGHCommits.data]);

  return (
    <>
      <Card id="ghcontributions" className="flex flex-col items-center justify-center h-fit w-full max-w-[60.625rem] p-3">
        <CardHeader className="w-full px-8 lg:px-4">
          <CardTitle>Github Commits</CardTitle>
          <CardDescription>Here is a breakdown of my github contribution history</CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-center w-full">
          <ScrollArea className="w-[75vw] sm:w-[80vw] lg:w-full max-w-fit whitespace-nowrap">
            {
              !getGHCommits.isPending && getGHCommits.data ? (
                <>
                  <GithubCommitsCard githubCommits={getGHCommits.data} monthLabels={monthLabels} />

                </>
              ) : (
                <LoadingComponent />
              )
            }
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}

function getMonthsLabel(weeks: ContributionWeek[]) {
  const monthLabels: string[] = [];

  const startDate = moment(weeks[0]?.contributionDays[0]?.date);
  const endDate = moment(weeks[weeks.length - 1]?.contributionDays[6]?.date);

  if (startDate.isValid() && endDate.isValid()) {
    const currentDate = startDate.clone();

    while (currentDate.isSameOrBefore(endDate)) {
      const monthLabel = currentDate.format("MMM");
      monthLabels.push(monthLabel);
      currentDate.add(1, "month");
    }
  }

  return monthLabels;
}

export default GithubCommits;