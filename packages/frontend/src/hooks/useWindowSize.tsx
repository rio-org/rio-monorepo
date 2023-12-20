import { useEffect, useState } from 'react';

function useWindowSize(win?: Window) {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  });

  function handleResize() {
    // Set window width/height to state
    setWindowSize({
      width: win?.innerWidth ?? 0,
      height: win?.innerHeight ?? 0
    });
  }

  useEffect(() => {
    if (win !== undefined) {
      // only execute all the code below in client side
      // Handler to call on window resize

      // Add event listener
      win?.addEventListener('resize', handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      win?.removeEventListener('resize', handleResize);
      // return () => win?.removeEventListener('resize', handleResize);
      // return removeListener;
    }
  }, [win]); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default useWindowSize;
