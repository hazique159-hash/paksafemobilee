import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "hazique159@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "arshu162";
  const adminPhone = process.env.ADMIN_PHONE || "03035605118";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        phone: adminPhone,
        password: hashedPassword,
        role: "ADMIN",
        isEmailVerified: true,
        isApproved: true,
        isActive: true,
      },
    });
    console.log("✅ Admin account created successfully");
  } else {
    console.log("ℹ️ Admin account already exists");
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
