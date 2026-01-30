import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      password: true,
    },
  });

  console.log(`\nFound ${users.length} user(s) in the database:\n`);

  if (users.length === 0) {
    console.log("No users found. Use the signup page or run create-test-user script.");
  } else {
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || "No name"} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email Verified: ${user.emailVerified || "No"}`);
      console.log(`   Has Password: ${user.password ? "Yes (hash: " + user.password.substring(0, 20) + "...)" : "No"}`);
      console.log("");
    });
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
