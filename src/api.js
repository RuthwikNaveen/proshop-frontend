import axios from 'axios';

// THIS IS THE CRITICAL STEP:
// Paste the live backend URL you just copied from Render here.
const API_ENDPOINT = 'https://proshop-backend-2lo3.onrender.com';

const api = axios.create({
  // This line of code is the "brain".
  // If the website is in "production" (live on the internet), it uses your Render URL.
  // Otherwise (on your computer), it uses a relative path, which works with the proxy.
  baseURL: process.env.NODE_ENV === 'production' ? API_ENDPOINT : '',
});

export default api;

