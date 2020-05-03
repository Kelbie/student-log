import { useState, useEffect } from 'react';

// this determines if the user has an active connection
function useNetwork() {
  const [isOnline, setNetwork] = useState(window.navigator.onLine);

  const updateNetwork = () => {
    setNetwork(window.navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener('offline', () => setNetwork(window.navigator.onLine));
    window.addEventListener('online', () => setNetwork(window.navigator.onLine));

    return () => {
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('online', updateNetwork);
    };
  }, []);

  return { isOnline };
}

export default useNetwork;
