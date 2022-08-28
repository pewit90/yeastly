import { useEffect, useState } from "react";

export function usePeriodicConditionalRerender(
  timeInMilis: number,
  condition: () => boolean
) {
  const [, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      if (condition()) {
        setTime(Date.now());
      }
    }, timeInMilis);
    return () => {
      clearInterval(interval);
    };
  }, []);
}
