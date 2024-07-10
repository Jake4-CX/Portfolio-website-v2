import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import { Download, Github } from "lucide-react";
import { Button } from "../ui/button";

const HeroSection: React.FC = () => {

  return (
    <>
      <Card id="hero" className="flex flex-col items-center justify-center w-full h-fit max-w-[896px]">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-y-4 gap-x-16 py-4 sm:p-4">
          <div className="w-[92%] max-w-[24rem]">
            <h1 className="text-2xl font-extrabold tracking-tight text-primary">Welcome</h1>
            <p className="text-primary line-clamp-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt eget nullam non nisi est. Feugiat in fermentum posuere urna nec tincidunt. Donec enim diam vulputate ut pharetra sit amet aliquam.</p>
            <div className="w-full flex flex-col md:flex-row space-y-3 md:space-x-3 md:space-y-0 mt-4">
              {/* <button className="flex flex-row bg-[#4b9838] hover:bg-[#4b9838]/80 duration-300 text-[#f8f8f9] text-sm font-medium space-x-3 py-2 px-4 rounded-lg">
                <Download className="w-4 h-4 my-auto" />
                <span>Download CV</span>
              </button> */}
              {/* Download CV */}
              <Button variant={"outline"} className="flex flex-row bg-[#4b9838] hover:bg-[#4b9838]/80 duration-300 text-[#f8f8f9] text-sm font-medium space-x-3 py-2 px-4 rounded-lg">
                <Download className="w-4 h-4 my-auto" />
                <span>Download CV</span>
              </Button>

              {/* Visit Github */}
              <Link to={`https://github.com/${import.meta.env.VITE_GITHUB_PROFILE}`} target="_blank" rel="noopener noreferrer">
                <Button variant={"outline"} className="flex flex-row bg-[#171515]/95 dark:bg-secondary/75 hover:bg-[#171515]/80 dark:hover:bg-secondary/50 duration-300 text-[#f8f8f9] text-sm font-medium space-x-3 py-2 px-4 rounded-lg w-full">
                  <Github className="w-4 h-4 my-auto" />
                  <span>Visit Github</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full bg-foreground min-h-[12rem] md:w-[24rem] md:h-[16rem] rounded-lg">

          </div>
        </div>
      </Card>
    </>
  )
}

export default HeroSection;