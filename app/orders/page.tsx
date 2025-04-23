// app/orders/page.tsx
import { Suspense } from "react";
import OrdersFilters from "../components/orders/OrderFilters";
import OrdersTable from "../components/orders/OrderTable";
import { db } from "../db";
import MaxWidthWrapper from "../components/MaxWidthWrapper";

interface OrdersPageProps {
  searchParams: {
    status?: string;
    type?: "BUY" | "SELL";
    market?: string;
    page?: string;
  };
}

const ORDERS_PER_PAGE = 10;

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const skip = (page - 1) * ORDERS_PER_PAGE;

  const filters: any = {};
  if (searchParams.status) filters.status = searchParams.status;
  if (searchParams.type) filters.type = searchParams.type;
  if (searchParams.market) filters.market = searchParams.market;

  const [orders, totalOrders] = await Promise.all([
    db.order.findMany({
      where: filters,
      take: ORDERS_PER_PAGE,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.order.count({ where: filters }),
  ]);

  const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);

  return (
    <MaxWidthWrapper>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <Suspense fallback={<div>Loading filters...</div>}>
          <OrdersFilters currentFilters={searchParams} />
        </Suspense>
        <OrdersTable
          orders={orders}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </MaxWidthWrapper>
  );
}
