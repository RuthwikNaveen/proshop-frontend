import { useState, useEffect } from 'react';

const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create a new script element
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    // Set up a function to run when the script has loaded successfully
    script.onload = () => {
      setIsLoaded(true);
    };

    // Set up a function to run if the script fails to load
    script.onerror = () => {
      console.error('Razorpay SDK failed to load.');
      setIsLoaded(false);
    };

    // Add the script to the page
    document.body.appendChild(script);

    // This is a cleanup function that will remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // The empty array ensures this effect only runs once

  return isLoaded;
};

export default useRazorpay;
