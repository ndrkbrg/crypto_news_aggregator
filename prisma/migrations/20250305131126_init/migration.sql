-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "platform" TEXT,
    "author" TEXT,
    "ticker" TEXT NOT NULL,
    "sentiment" INTEGER NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);
