import dotenv from "dotenv";

dotenv.config();

interface Config {
  PORT: number;
  URLs: Record<string, string>;
}

const config: Config = {
  PORT: Number(process.env.PORT) ?? 3001,
  URLs: {
    jellyfin: process.env.JELLYFIN_URL ?? "http://jellyfin:8096",
  },
};

export default config;
