// components/Loader.js
import { ImSpinner9 } from "react-icons/im";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ImSpinner9 className="animate-spin text-6xl text-sky-500" />
    </div>
  );
};

export default Loader;
