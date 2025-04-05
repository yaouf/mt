import http from 'http';
import listen from 'test-listen';
import { URL } from 'url'; // Ensure you import URL from the 'url' module

// test/server.js
const createTestServer = async (handler) => {
  const requestHandler = (req, res) => {
    return handler(req, res);
  };
  const server = http.createServer(requestHandler);
  const url = await listen(server);

  // Use the URL module to parse the url and extract the port
  const urlObject = new URL(url);
  const port = urlObject.port; // This will extract the port number
  console.log('port', port); // Log the port number to the console
  return { server, url, port }; // Now also returns the port
};

export default createTestServer;
