-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 10000.00,
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stocks" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "type" "OrderType" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holdings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "avg_buy_price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Holdings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stocks_symbol_key" ON "Stocks"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Holdings_user_id_stock_id_key" ON "Holdings"("user_id", "stock_id");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "Stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holdings" ADD CONSTRAINT "Holdings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holdings" ADD CONSTRAINT "Holdings_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "Stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
