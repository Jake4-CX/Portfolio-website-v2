type GithubCommits = {
  user: {
    contributionsCollection: {
      contributionYears: string[],
      contributionCalendar: {
        totalContributions: number,
        weeks: ContributionWeek[]
      }
    }
  }
}

type ContributionWeek = {
  contributionDays: ContributionDay[]
}

type ContributionDay = {
  weekday: number,
  date: string,
  contributionCount: number,
  color: string
}