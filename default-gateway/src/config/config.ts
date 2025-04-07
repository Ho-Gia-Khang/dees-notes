import dotenv from "dotenv";
import { CorsOptions } from "cors";

dotenv.config();

const corsOptions: CorsOptions = {
  origin: ["http://localhost:4300", "https://deesnotes.cloud"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

interface Config {
  port: number;
  corsOptions: CorsOptions;
  URLs: Record<string, string>;
}

const config: Config = {
  port: Number(process.env.PORT) ?? 3000,
  corsOptions,
  URLs: {
    MEDIA_SERVICE_URL: process.env.MEDIA_SERVICE_URL ?? "http://localhost:4000",
    DOCUMENT_SERVICE_URL:
      process.env.DOCUMENT_SERVICE_URL ?? "http://localhost:5000",
  },
};

export default config;
