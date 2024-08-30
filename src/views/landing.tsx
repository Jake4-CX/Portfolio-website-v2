import ContactSection from "@/components/home/contact";
import GithubCommits from "@/components/home/githubCommits";
import HeroSection from "@/components/home/hero";
import ProjectsSection from "@/components/home/projects";
import TechSkillsComponent from "@/components/home/techSkills";
import DefaultLayout from "@/layouts/defaultLayout";

const LandingPage: React.FC = () => {

  // const userRedux = useAppSelector((state) => state.userReduser.value);
  // const navigate = useNavigate();

  return (
    <DefaultLayout>
      {/* Hero */}
      <HeroSection />
      <ProjectsSection />
      <TechSkillsComponent />
      <GithubCommits />
      <ContactSection />
    </DefaultLayout>
  )
}

export default LandingPage;