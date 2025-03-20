import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import { appRoutes } from './routes';
import swaggerSpec from "./swagger";
import swaggerUi from "swagger-ui-express";
import cors from 'cors';

import dotenv from "dotenv"
import path from "path";

dotenv.config({ path: `./config/.env.${process.env.NODE_ENV || 'local'}` });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/public", express.static("public"));
app.use("/storage", express.static("storage"));
app.use(express.static(path.join(__dirname, "../front")));

appRoutes(app);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../front", "index.html"));
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.MONGO_URI) {
      reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;