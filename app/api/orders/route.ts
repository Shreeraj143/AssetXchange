import { db } from "@/app/db";
import { OrderStatus, OrderType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, symbol, type, price, quantity } = body;

    if (!userId || !symbol || !type || !price || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const total = price * quantity;

    const order = await db.order.create({
      data: {
        userId,
        symbol,
        type: type as OrderType,
        quantity,
        price,
        total,
        status: OrderStatus.PENDING,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("[ORDER_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
