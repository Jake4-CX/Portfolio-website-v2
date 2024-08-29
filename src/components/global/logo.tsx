import { Link } from "react-router-dom";
import { Box } from "lucide-react"

interface LogoComponentProps {
  className?: string;
  redirectPath?: string;
}

const LogoComponent: React.FC<LogoComponentProps> = ({className, redirectPath}) => {

  redirectPath = redirectPath ?? "/";

  return (
    <>
      <Link className={`flex items-center gap-2 font-semibold hover:bg-secondary px-4 py-2 rounded-lg duration-300 ${className}`} to={redirectPath}>
        <Box className="h-6 w-6" />
        <span className="hidden lg:block">Portfolio</span>
      </Link>
    </>
  )
}

export default LogoComponent;