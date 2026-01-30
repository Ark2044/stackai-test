"use server";

import type { Prisma } from "@prisma/client";
import { db } from "~/server/db";

export async function createRepo(repoData: Prisma.RepositoryCreateInput) {
  const repo = await db.repository.create({
    data: repoData,
  });

  await db.branch.create({
    data: {
      name: "main",
      repositoryId: repo.id,
    },
  });

  return repo;
}

export async function getRepos(userId: string) {
  const repos = await db.repository.findMany({
    where: {
      ownerId: userId,
    },
  });

  return repos;
}
