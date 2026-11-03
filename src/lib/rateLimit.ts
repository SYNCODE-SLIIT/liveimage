import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

// IPs are stored only as salted hashes
export function hashIp(ip: string) {
  return createHash("sha256")
    .update(`${ip}:${process.env.NEXTAUTH_SECRET ?? ""}`)
    .digest("hex")
    .slice(0, 32);
}

export function clientIp(headers: Headers | Record<string, unknown> | undefined) {
  const get = (name: string) =>
    headers instanceof Headers
      ? headers.get(name)
      : (headers?.[name] as string | undefined);
  return get("x-forwarded-for")?.split(",")[0]?.trim() || get("x-real-ip") || "unknown";
}

export async function countRecent(bucket: string, key: string, windowMs: number) {
  return prisma.rateLimitEvent.count({
    where: { bucket, key, createdAt: { gte: new Date(Date.now() - windowMs) } },
  });
}

export async function recordEvent(bucket: string, key: string) {
  await prisma.rateLimitEvent.create({ data: { bucket, key } });
  // Keep the table small: drop events older than a day
  if (Math.random() < 0.05) {
    await prisma.rateLimitEvent.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - 86_400_000) } },
    });
  }
}

export async function clearEvents(bucket: string, key: string) {
  await prisma.rateLimitEvent.deleteMany({ where: { bucket, key } });
}
