-- CreateTable
CREATE TABLE "ToolCategory" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'cat_tools',
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolDefinition" (
    "id" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'tools',
    "category" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ToolCategory_key_key" ON "ToolCategory"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ToolDefinition_toolId_key" ON "ToolDefinition"("toolId");

-- CreateIndex
CREATE INDEX "ToolDefinition_category_idx" ON "ToolDefinition"("category");

-- CreateIndex
CREATE INDEX "ToolDefinition_enabled_idx" ON "ToolDefinition"("enabled");

-- AddForeignKey
ALTER TABLE "ToolDefinition" ADD CONSTRAINT "ToolDefinition_category_fkey" FOREIGN KEY ("category") REFERENCES "ToolCategory"("key") ON DELETE RESTRICT ON UPDATE CASCADE;
