import Cors from 'cors'
import env from '../../../env'

const cors = Cors({
  origin: '', // Set to * to allow all traffic
  methods: ['GET', 'POST'], // Allowed methods
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        console.log("reject")
        return reject(result)
      }
      console.log(env.ALLOWED_WEBSITE_URL)
      console.log("resolve")
      return resolve(result)
    })
  })
}

const firewall = async (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigin = env.ALLOWED_WEBSITE_URL;
  if (env.NODE_ENV === "development" || env.NODE_ENV === "test") {
    return;
  }
  
  if (origin !== allowedOrigin) {
    console.error(`Blocked request from origin: ${origin}`);
    return res.status(403).json({ error: 'Forbidden: CORS policy does not allow access from this origin.' });
  }

  try {
    await runMiddleware(req, res, cors);
    console.log('CORS check passed:', env.ALLOWED_WEBSITE_URL);
  } catch (err) {
    console.error('CORS check failed:', err.message);
    res.status(500).json({ error: 'CORS failed' });
  }
};

export { firewall }
