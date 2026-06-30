import { useState } from "react";
import AwakeningLoader from "@/components/AwakeningLoader";
import Portfolio from "@/components/Portfolio";

function App() {
  const [loaderComplete, setLoaderComplete] = useState(false);

  return (
    <>
      {/* The loader renders on top of everything and handles its own fade out */}
      <AwakeningLoader onComplete={() => setLoaderComplete(true)} />
      
      {/* 
        The portfolio is always rendered but might be hidden behind the loader initially.
        Once the loader finishes its sequence, it sets opacity to 0 and pointer-events to none.
      */}
      <Portfolio />
    </>
  );
}

export default App;
