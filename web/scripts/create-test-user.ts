import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "mahekgupta0702@gmail.com";
  const password = "lab-password";
  const name = "Mahek Gupta";

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("✓ User already exists!");
    console.log("User details:", {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      hasPassword: !!existingUser.password,
    });
    return;
  }

  // Create new user with hashed password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
    },
  });

  console.log("✓ User created successfully!");
  console.log("User details:", {
    id: user.id,
    email: user.email,
    name: user.name,
  });
  console.log("\nYou can now login with:");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
