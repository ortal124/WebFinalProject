import initApp from "./server";
import dotenv from "dotenv"
import http from 'http';
import * as https from 'https';
import fs from 'fs';

dotenv.config();

initApp().then((app) => {
  if(process.env.NODE_ENV != 'production') {
    console.log('development');
    http.createServer(app).listen(process.env.PORT);
    console.log(`app listening at http://localhost:${process.env.PORT}`);
  }
  else{
    const options: https.ServerOptions = {
      key: fs.readFileSync('./client-key.pem'),
      cert: fs.readFileSync('./client-cert.pem')
    }
    https.createServer(options, app).listen(process.env.HTTPS_PORT);
    console.log(`app listening at https://localhost:${process.env.HTTPS_PORT}`);
    http.createServer(app).listen(process.env.PORT, () => {
      console.log(`App also listening at http://localhost:${process.env.PORT}`);
    });
  }
});