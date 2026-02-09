import { PrismaClient, Category } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.dailyLog.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.backendSkill.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const password = await bcrypt.hash("demo123", 12);
  const user = await prisma.user.create({
    data: {
      name: "Demo Developer",
      email: "demo@example.com",
      password,
      bio: "Full-stack dev on a DSA & backend mastery journey 🚀",
      isPublic: true,
    },
  });

  console.log("✅ Created demo user:", user.email);

  // Create sample topics
  const topics = await Promise.all([
    prisma.topic.create({
      data: { userId: user.id, name: "Arrays", category: Category.DSA },
    }),
    prisma.topic.create({
      data: { userId: user.id, name: "Graphs", category: Category.DSA },
    }),
    prisma.topic.create({
      data: { userId: user.id, name: "Dynamic Programming", category: Category.DSA },
    }),
    prisma.topic.create({
      data: { userId: user.id, name: "Trees", category: Category.DSA },
    }),
    prisma.topic.create({
      data: { userId: user.id, name: "REST APIs", category: Category.Backend },
    }),
    prisma.topic.create({
      data: { userId: user.id, name: "Database Design", category: Category.Backend },
    }),
    prisma.topic.create({
      data: { userId: user.id, name: "System Design", category: Category.Custom },
    }),
  ]);

  console.log("✅ Created", topics.length, "topics");

  // Create sample daily logs (last 14 days)
  const logs = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Random topic
    const topic = topics[Math.floor(Math.random() * topics.length)];

    logs.push(
      prisma.dailyLog.create({
        data: {
          userId: user.id,
          topicId: topic.id,
          date,
          energy: Math.floor(Math.random() * 5) + 1,
          problemsSolved: Math.floor(Math.random() * 8),
          revisionVolume: Math.floor(Math.random() * 15),
          techUsed: ["Node.js", "TypeScript", "PostgreSQL", "Redis"][
            Math.floor(Math.random() * 4)
          ],
          notes: [
            "Great session today!",
            "Need more practice",
            "Finally understood the concept",
            "Reviewed old problems",
            "",
          ][Math.floor(Math.random() * 5)],
          stars: Math.floor(Math.random() * 3) + 3,
          isPublic: Math.random() > 0.2,
        },
      })
    );
  }
  await Promise.all(logs);
  console.log("✅ Created", logs.length, "daily logs");

  // Create backend skills
  const skills = await Promise.all([
    prisma.backendSkill.create({
      data: {
        userId: user.id,
        skill: "Node.js",
        practiced: true,
        usedInProject: true,
        confidence: 4,
      },
    }),
    prisma.backendSkill.create({
      data: {
        userId: user.id,
        skill: "PostgreSQL",
        practiced: true,
        usedInProject: true,
        confidence: 4,
      },
    }),
    prisma.backendSkill.create({
      data: {
        userId: user.id,
        skill: "Redis",
        practiced: true,
        usedInProject: false,
        confidence: 2,
      },
    }),
    prisma.backendSkill.create({
      data: {
        userId: user.id,
        skill: "Docker",
        practiced: true,
        usedInProject: true,
        confidence: 3,
      },
    }),
    prisma.backendSkill.create({
      data: {
        userId: user.id,
        skill: "Kubernetes",
        practiced: false,
        usedInProject: false,
        confidence: 1,
      },
    }),
    prisma.backendSkill.create({
      data: {
        userId: user.id,
        skill: "GraphQL",
        practiced: true,
        usedInProject: false,
        confidence: 2,
      },
    }),
  ]);

  console.log("✅ Created", skills.length, "backend skills");

  // Create a second public user
  const user2Password = await bcrypt.hash("test123", 12);
  const user2 = await prisma.user.create({
    data: {
      name: "Code Ninja",
      email: "ninja@example.com",
      password: user2Password,
      bio: "Learning DSA one problem at a time 💪",
      isPublic: true,
    },
  });

  // Create topics for user2
  const user2Topics = await Promise.all([
    prisma.topic.create({
      data: { userId: user2.id, name: "Linked Lists", category: Category.DSA },
    }),
    prisma.topic.create({
      data: { userId: user2.id, name: "Recursion", category: Category.DSA },
    }),
  ]);

  // Create some logs for user2
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    await prisma.dailyLog.create({
      data: {
        userId: user2.id,
        topicId: user2Topics[Math.floor(Math.random() * user2Topics.length)].id,
        date,
        energy: Math.floor(Math.random() * 5) + 1,
        problemsSolved: Math.floor(Math.random() * 6) + 1,
        revisionVolume: Math.floor(Math.random() * 10),
        stars: Math.floor(Math.random() * 2) + 4,
        isPublic: true,
      },
    });
  }

  console.log("✅ Created second user with sample data");
  console.log("\n🎉 Seeding complete!\n");
  console.log("Demo credentials:");
  console.log("  Email: demo@example.com");
  console.log("  Password: demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
