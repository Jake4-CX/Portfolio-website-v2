import LogoComponent from "./logo";

const FooterComponent: React.FC = () => {

  return (
    <>
      <section id="footer" className="flex flex-col items-center justify-center w-full min-h-[18rem] bg-gray-100/40 dark:bg-gray-800/40 border-t mt-12">
        <div id="footer-body" className="flex flex-col h-fit w-full px-[4%] md:px-0 md:w-4/5 lg:w-2/3 space-y-9 mt-12">
          <div id="footer-content" className="flex flex-col sm:flex-row items-center justify-between w-full h-fit space-y-12 sm:space-y-0 sm:space-x-20">
            <section id="footer-left" className="flex flex-col max-w-[24.438rem] w-fit h-full">
              {/* <h1 className="text-5xl font-bold">Title</h1> */}
              <LogoComponent className="pb-2 w-fit" redirectPath="#" />
              <p className="text-muted-foreground line-clamp-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt eget nullam non nisi est. Feugiat in fermentum posuere urna nec tincidunt. Donec enim diam vulputate ut pharetra sit amet aliquam.</p>
            </section>


            <section id="footer-right" className="flex flex-row sm:justify-end max-w-[24.438rem] w-full h-full space-x-12">
              <div id="footer-navigation" className="flex flex-col w-fit h-full space-y-4">
                <h1 className="text-xl font-bold leading-3">Navigation</h1>
                <span className="bg-accent w-[5rem] h-1 rounded-lg"></span>
                <div id="footer-links" className="flex flex-col w-full h-full space-y-2">
                  <a href="#projects" className="hover:text-primary/50 duration-300">Projects</a>
                  <a href="#ghcontributions" className="hover:text-primary/50 duration-300">Github Commits</a>
                  <a href="#contact" className="hover:text-primary/50 duration-300">Contact</a>
                </div>
              </div>

              {/* <div id="footer-legal" className="flex flex-col w-fit h-full space-y-4">
                <h1 className="text-xl font-bold leading-3">Legal</h1>
                <span className="bg-[#4b9838] w-[5rem] h-1 rounded-lg"></span>
                <div id="footer-links" className="flex flex-col w-full h-full space-y-2">
                  <a href="#" className="text-[#838384] hover:text-[#6c88e0] duration-300">Terms of Service</a>
                  <a href="#" className="text-[#838384] hover:text-[#6c88e0] duration-300">Privacy Policy</a>
                  <a href="#" className="text-[#838384] hover:text-[#6c88e0] duration-300">Cookie Policy</a>
                </div>
              </div> */}


            </section>
          </div>
          <div id="footer-bottom" className="flex pb-9">
            <p id="copy" className="text-muted-foreground text-sm">© Copyright Jack - 2024, All rights reserved.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default FooterComponent;