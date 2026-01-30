"use server";
import { db } from "~/server/db";
import { type PullRequest, PullRequestStatus } from "@prisma/client";

export async function createPullRequest(data: {
  title: string;
  description?: string;
  baseBranchranchId: string;
  newBranchranchId: string;
}) {
  return await db.pullRequest.create({ data });
}

export async function getPullRequest(id: string) {
  return await db.pullRequest.findUnique({ where: { id } });
}

export async function updatePullRequest(
  id: string,
  data: Partial<PullRequest>
) {
  return await db.pullRequest.update({ where: { id }, data });
}

export async function deletePullRequest(id: string) {
  return await db.pullRequest.delete({ where: { id } });
}

export async function listPullRequestsByRepository(branchIds: string[]) {
  return await db.pullRequest.findMany({
    where: {
      OR: [
        { baseBranchranchId: { in: branchIds } },
        { newBranchranchId: { in: branchIds } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listPendingPullRequests() {
  return await db.pullRequest.findMany({
    where: { status: PullRequestStatus.PENDING },
    orderBy: { createdAt: "asc" },
  });
}

export async function setPullRequestStatus(
  prId: string,
  status: PullRequestStatus
) {
  return await db.pullRequest.update({
    where: { id: prId },
    data: { status },
  });
}

export async function getPullRequestWithBranches(id: string) {
  return await db.pullRequest.findUnique({
    where: { id },
    include: {
      baseBranch: true,
      newBranch: true,
    },
  });
}

export async function getPullRequestWithMerges(id: string) {
  return await db.pullRequest.findUnique({
    where: { id },
    include: {
      modelMerges: true,
    },
  });
}
