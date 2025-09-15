/*
  Warnings:

  - Added the required column `host` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Tenant" ADD COLUMN     "host" TEXT NOT NULL;
