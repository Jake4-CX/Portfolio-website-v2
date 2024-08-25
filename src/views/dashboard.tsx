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
import AddTechnologyComponent from "@/components/dashboard/technologies/addTechnology";
import AllProjectsComponent from "@/components/dashboard/projects/allProjects";
import { getProjects } from "@/api/projects";
import AddProjectComponent from "@/components/dashboard/projects/addProject";

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
    <DefaultLayout>
      <Card className="w-full min-h-[32rem] mt-[4%]">
        <CardHeader>
          <CardTitle>Portfolio Dashboard</CardTitle>
          <CardDescription>
            Welcome back, {userRedux.userData?.userEmail}!
            You are currently logged in as a {userRole} user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Projects */}
          <div className="flex flex-col mt-4 mb-2">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Projects</h3>
            <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper tortor dolor, id imperdiet erat fermentum ac. Aenean quis ex turpis. Sed posuere sodales tempus.</p>
          </div>
          <AllProjectsComponent projects={getProjectsQuery.data} />
          <AddProjectComponent />

          {/* Technologies */}
          <div className="flex flex-col mt-4 mb-2">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Technologies</h3>
              <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper tortor dolor, id imperdiet erat fermentum ac. Aenean quis ex turpis. Sed posuere sodales tempus.</p>
          </div>
          <AllTechnologiesComponent technologies={getTechnologiesQuery.data} />
          <AddTechnologyComponent />
          
        </CardContent>
      </Card>
    </DefaultLayout>
  )
}


export default DashboardPage;