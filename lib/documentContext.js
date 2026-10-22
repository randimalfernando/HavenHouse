import { prisma } from "@/lib/prisma";

export const MAX_TOTAL_CHARS = 12000;

export async function getActiveDocuments() {
  return prisma.knowledgeDocument.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getDocumentContext() {
  let docs = [];
  try {
    docs = await getActiveDocuments();
  } catch (e) {
    return "";
  }
  if (docs.length === 0) return "";
  let used = 0;
  const parts = [];
  for (const d of docs) {
    const block = `### ${d.title}\n${d.content.trim()}`;
    if (used + block.length > MAX_TOTAL_CHARS) continue;
    parts.push(block);
    used += block.length;
  }
  if (parts.length === 0) return "";
  return (
    "ADDITIONAL REFERENCE DOCUMENTS (approved Haven House material). Answer from these where relevant. If something is not covered here or in the service list, say you are not sure and suggest contacting Haven House directly.\n\n" +
    parts.join("\n\n")
  );
}
