import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma";
import { neon } from "neon";

const neonDb = neon(process.env.DATABASE_URL);
const adapter = new PrismaNeon(neonDb);

export const prisma = new PrismaClient({ adapter });
