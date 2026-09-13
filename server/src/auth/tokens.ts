import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET: string =
  process.env.JWT_SECRET ??
  (() => {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  })();

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export interface AccessTokenPayload {
  id: string;
  type: "access";
}

export interface RefreshTokenPayload {
  id: string;
  type: "refresh";
}

export function signAccessToken(userId: string): string {
  return jwt.sign(
    {
      id: userId,
      type: "access",
    },
    JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  );
}

export function signRefreshToken(userId: string): string {
  return jwt.sign(
    {
      id: userId,
      type: "refresh",
    },
    JWT_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    },
  );
}

function verifyToken(token: string): JwtPayload {
  const payload = jwt.verify(token, JWT_SECRET);

  if (typeof payload === "string") {
    throw new Error("Invalid token");
  }

  return payload;
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = verifyToken(token);

  if (typeof payload.id !== "string" || payload.type !== "access") {
    throw new Error("Invalid access token");
  }

  return {
    id: payload.id,
    type: "access",
  };
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = verifyToken(token);

  if (typeof payload.id !== "string" || payload.type !== "refresh") {
    throw new Error("Invalid refresh token");
  }

  return {
    id: payload.id,
    type: "refresh",
  };
}
