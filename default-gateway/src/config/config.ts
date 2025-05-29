import dotenv from "dotenv";
import { CorsOptions } from "cors";

dotenv.config();

const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:4300",
    "http://localhost:5173",
    "https://deesnotes.cloud",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

interface Config {
  port: number;
  corsOptions: CorsOptions;
  URLs: Record<string, string>;
  privateKey: string;
  publicKey: string;
}

const config: Config = {
  port: Number(process.env.PORT) ?? 3000,
  corsOptions,
  URLs: {
    MEDIA_SERVICE_URL: process.env.MEDIA_SERVICE_URL ?? "http://media:3001",
    DOCUMENT_SERVICE_URL:
      process.env.DOCUMENT_SERVICE_URL ?? "http://document:3002",
    JELLYFIN_URL: process.env.JELLYFIN_URL ?? "http://localhost:8096",
    ORIGIN: process.env.ORIGIN ?? "http://localhost:3000",
  },
  privateKey: process.env.JWT_PRIVATE_KEY as string,
  publicKey: process.env.JWT_PUBLIC_KEY as string,
};

export default config;
