import { db } from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order || order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Order not found or already processed" },
        { status: 400 }
      );
    }

    // Mark order as SUCCESS
    const updatedOrder = await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "SUCCESS",
      },
    });

    // Update the portfolio
    const { userId, symbol, price, quantity } = updatedOrder;

    // Check if the asset already exists in the user's portfolio
    const existing = await db.portfolio.findUnique({
      where: {
        userId_symbol: { userId, symbol }, // compound unique
      },
    });

    if (existing) {
      // Recalculate average price
      const newTotalQty = existing.quantity + quantity;
      const newAvgPrice =
        (existing.quantity * existing.averagePrice + quantity * price) /
        newTotalQty;

      await db.portfolio.update({
        where: {
          userId_symbol: { userId, symbol },
        },
        data: {
          quantity: newTotalQty,
          averagePrice: newAvgPrice,
        },
      });
    } else {
      await db.portfolio.create({
        data: {
          userId,
          symbol,
          quantity,
          averagePrice: price,
        },
      });

      return NextResponse.json({
        message: "Order fulfilled and portfolio updated",
      });
    }
  } catch (error) {
    console.error("Error fulfilling the order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
