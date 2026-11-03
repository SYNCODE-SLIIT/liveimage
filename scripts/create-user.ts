// Create an admin account, or reset the password of an existing one.
// Run in a terminal: npm run user:create
import readline from "node:readline";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let muted = false;

// Hide typed characters while a password is being entered
const rlOutput = rl as unknown as { _writeToOutput: (s: string) => void };
const writeOriginal = rlOutput._writeToOutput.bind(rl);
rlOutput._writeToOutput = (s: string) => {
  if (!muted || s.includes("\n") || s.includes("\r")) writeOriginal(s);
  else writeOriginal("*");
};

// Piped input (non-interactive) is read up front, one answer per line
const pipedLines: Promise<string[]> | null = process.stdin.isTTY
  ? null
  : new Promise((resolve) => {
      const lines: string[] = [];
      rl.on("line", (line) => lines.push(line));
      rl.on("close", () => resolve(lines));
    });

async function ask(question: string, hidden = false): Promise<string> {
  if (pipedLines) {
    process.stdout.write(question + "\n");
    return ((await pipedLines).shift() ?? "").trim();
  }
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      if (hidden) process.stdout.write("\n");
      muted = false;
      resolve(answer.trim());
    });
    muted = hidden;
  });
}

async function main() {
  const email = (await ask("Email: ")).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("That email does not look valid");

  const existing = await prisma.user.findUnique({ where: { email } });
  const name = (await ask(`Name${existing ? ` [${existing.name}]` : ""}: `)) || existing?.name || "";
  if (!name) throw new Error("Name is required");

  const roleAnswer = (await ask(`Role (owner/staff) [${existing?.role ?? "staff"}]: `)).toLowerCase();
  const role = (roleAnswer || existing?.role || "staff") as "owner" | "staff";
  if (role !== "owner" && role !== "staff") throw new Error("Role must be owner or staff");

  const password = await ask("Password (min 10 characters): ", true);
  if (password.length < 10) throw new Error("Password must be at least 10 characters");
  const confirm = await ask("Repeat password: ", true);
  if (password !== confirm) throw new Error("Passwords do not match");

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { name, role, passwordHash },
    create: { email, name, role, passwordHash },
  });

  console.log(`\n${existing ? "Updated" : "Created"} ${role} account for ${email}`);
}

main()
  .catch((e) => {
    console.error(`\nError: ${e instanceof Error ? e.message : e}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (!pipedLines) rl.close();
    await prisma.$disconnect();
  });
