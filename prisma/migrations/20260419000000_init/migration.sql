CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(384) NOT NULL,
    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);