import { useEffect, useState } from 'react';

function CountdownTimer({ trigger, setTrigger }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (trigger) setCount(3);
  }, [trigger]);

  useEffect(() => {
    if (count === null) return;
    if (count === 0) {
      setTrigger(false);
      setCount(null);
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    count !== null && (
      <div className="absolute inset-0 flex items-center justify-center z-40">
        <div className="text-[5rem] font-black text-white bg-black bg-opacity-80 px-10 py-6 rounded-full shadow-xl">
          {count}
        </div>
      </div>
    )
  );
}

export default CountdownTimer;
