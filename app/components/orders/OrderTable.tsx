import { Order } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrdersTable({
  orders,
  currentPage,
  totalPages,
}: {
  orders: Order[];
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="space-y-4">
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Market</TableHead>
            <TableHead className="text-center">Amount</TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="py-8">
          {orders.map((order) => (
            <TableRow key={order.id} className="h-16 text-center">
              <TableCell>{order.type}</TableCell>
              <TableCell>{order.symbol}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>{order.price}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between">
        <Button asChild disabled={currentPage <= 1}>
          <Link href={`/orders?page=${currentPage - 1}`}>Previous</Link>
        </Button>
        <Button asChild disabled={currentPage >= totalPages}>
          <Link href={`/orders?page=${currentPage + 1}`}>Next</Link>
        </Button>
      </div>
    </div>
  );
}
