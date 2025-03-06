import Cors from 'cors';

// Allowed origins
const allowedOrigins = [
  'https://dashboard.browndailyherald.com',  
  'http://localhost:3000',                   
];

// Middleware to configure CORS
const corsMiddleware = Cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
  allowedHeaders: ['Authorization', 'Content-Type'],     
  credentials: true,                                     
});

export default corsMiddleware;