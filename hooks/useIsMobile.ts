import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const useIsMobile = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = useMediaQuery({
    query: "(max-width: 767px)",
  });
  return mounted ? isMobile : false;
};

export default useIsMobile;
