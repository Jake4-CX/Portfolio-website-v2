import AllTechnologiesComponent from "@/components/dashboard/technologies/allTechnologies";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getTechnologies } from "@/api/technologies";


import DefaultLayout from "@/layouts/defaultLayout";
import { useAppSelector } from "@/redux/store";
import { useQuery } from "@tanstack/react-query";

const DashboardPage: React.FC = () => {

  const userRedux = useAppSelector((state) => state.userReduser.value);
  const userRole = userRedux.userData?.userRole;

  const getTechnologiesQuery = useQuery({
    queryKey: ["technologies"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {

      const technologiesResponse = await getTechnologies();

      const data = (technologiesResponse.data).technologies as Technology[];

      return data;
    }
  })

  return (
    <DefaultLayout>
      <Card className="w-full h-[32rem] mt-[4%]">
        <CardHeader>
          <CardTitle>Portfolio Dashboard</CardTitle>
          <CardDescription>
            Welcome back, {userRedux.userData?.userEmail}!
            You are currently logged in as a {userRole} user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Projects */}

          {/* Technologies */}
          <AllTechnologiesComponent technologies={getTechnologiesQuery.data} />
          
        </CardContent>
      </Card>
    </DefaultLayout>
  )
}


export default DashboardPage;