import prisma from "./client";
import { signJwt, verifyJwt } from "../utils/jwt";
import get from "lodash/get";
import { findUser } from "./userService";

export async function createSession({ userId }: { userId: string }) {
  const session = await prisma.session.create({
    data: { userId: userId, valid: true },
  });

  return session;
}

export async function findSessions({
  userId,
  valid,
}: {
  userId: string;
  valid?: boolean;
}) {
  return prisma.session.findMany({ where: { userId: userId, valid: valid } });
}

export async function updateSession({
  query,
  update,
}: {
  query: string;
  update: boolean;
}) {
  return prisma.session.updateMany({
    where: {
      userId: query,
    },
    data: {
      valid: update,
    },
  });
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  // verify the refresh token
  const { decoded } = verifyJwt(refreshToken);

  // check if the session is valid
  if (!decoded || !get(decoded, "session")) {
    return false;
  }

  // if not, throw an error
  const session = await prisma.session.findUnique({
    where: { id: get(decoded, "session") },
  });
  if (!session || !session.valid) {
    return false;
  }

  const user = await findUser(session.userId);

  if (!user) {
    return false;
  }

  // if valid, issue a new access token
  const accessToken = signJwt(
    { ...user, session: session.id },
    { expiresIn: "30m" }
  );
  return accessToken;
}

export async function deleteSessions({
  userId,
  valid,
}: {
  userId: string;
  valid?: boolean;
}) {
  return prisma.session.deleteMany({
    where: { userId: userId, valid: valid },
  });
}
