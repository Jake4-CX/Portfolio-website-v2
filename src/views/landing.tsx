import ContactSection from "@/components/home/contact";
import GithubCommits from "@/components/home/githubCommits";
import HeroSection from "@/components/home/hero";
import ProjectsSection from "@/components/home/projects";
import DefaultLayout from "@/layouts/defaultLayout";

const LandingPage: React.FC = () => {

  // const userRedux = useAppSelector((state) => state.userReduser.value);
  // const navigate = useNavigate();

  return (
    <DefaultLayout className="items-center justify-center">
      {/* Hero */}
      <HeroSection />
      <ProjectsSection />
      <GithubCommits />
      <ContactSection />
    </DefaultLayout>
  )
}

export default LandingPage;