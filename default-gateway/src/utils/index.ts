import IUser, { UserInput } from "../models/userModel";
import { signJwt, verifyJwt } from "./jwt";

interface TokensPair {
  accessToken: string;
  refreshToken: string;
}
export function generateTokens(
  user: Omit<IUser, "password">,
  sessionId: string
): TokensPair {
  const accessTokenExpiry = "30m";
  const accessToken = signJwt(
    { ...user, session: sessionId },
    { expiresIn: accessTokenExpiry }
  );

  const refreshTokenExpiry = "30d";
  const refreshToken = signJwt(
    { ...user, session: sessionId },
    { expiresIn: refreshTokenExpiry }
  );
  return { accessToken, refreshToken };
}

export function getUserInfo(accessToken: string): IUser | undefined {
  const { decoded } = verifyJwt(accessToken);
  console.log(" decoded:", decoded);

  return;
}
