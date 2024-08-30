import { RefreshCw } from "lucide-react";

const LoadingComponent: React.FC = () => {

  return (
    <>
      <div className="flex w-full h-[60px] items-center justify-center">
        <RefreshCw className="animate-spin w-4 h-4 mr-2" />
        <h4 className="font-semibold text-sm">Loading...</h4>
      </div>
    </>
  )
}

export default LoadingComponent;