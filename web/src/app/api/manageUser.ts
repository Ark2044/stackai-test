"use server";
import { db } from "~/server/db";
import { type User } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function getUser(email: string): Promise<User | null> {
  // Guard: Don't attempt database connection without valid email
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return null;
  }

  try {
    const user: User | null = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function createUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user: User = await db.user.create({
    data: {
      name: name,
      email: email,
      password: hash,
    },
  });

  return user;
}

export async function updateUser(id: string, data: Partial<User>) {
  return await db.user.update({ where: { id }, data });
}

export async function deleteUser(id: string) {
  return await db.user.delete({ where: { id } });
}
