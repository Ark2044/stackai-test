"use server";
import { db } from "~/server/db";
import { type Branch } from "@prisma/client";

export async function createBranch(data: {
  name: string;
  repositoryId: string;
}) {
  return await db.branch.create({ data });
}

export async function getBranch(id: string) {
  return await db.branch.findUnique({ where: { id } });
}

export async function updateBranch(id: string, data: Partial<Branch>) {
  return await db.branch.update({ where: { id }, data });
}

export async function deleteBranch(id: string) {
  return await db.branch.delete({ where: { id } });
}
