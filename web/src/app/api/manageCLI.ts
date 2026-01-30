"use server";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignJWT } from "jose";

export async function authCLI({
  sessionId,
  email,
  password,
}: {
  sessionId: string;
  email: string;
  password: string;
}) {
  const user = await db.user.findUnique({
    where: { email: email },
  });

  console.log(user, password);
  if (user && bcrypt.compareSync(password, user.password)) {
    await issueCLIToken(user.id, sessionId);
    return 200;
  } else {
    return 403;
  }
}

// async function issueCLIToken(userId: string, sessionId: string) {
//   const token = jwt.sign(
//     { sub: userId, type: "cli" },
//     process.env.AUTH_SECRET!,
//     { expiresIn: "1h" }
//   );

//   await db.session.create({
//     data: {
//       id: sessionId,
//       sessionToken: token,
//       userId,
//       expires: new Date(Date.now() + 3600 * 1000),
//     },
//   });

//   return token;
// }

async function issueCLIToken(userId: string, sessionId: string) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

  const token = await new SignJWT({ sub: userId, type: "cli" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  await db.session.create({
    data: {
      id: sessionId,
      sessionToken: token,
      userId,
      expires: new Date(Date.now() + 3600 * 1000),
    },
  });

  return token;
}
