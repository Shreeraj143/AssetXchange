"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export default function OrdersFilters({
  currentFilters,
}: {
  currentFilters: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(`/orders?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <Select
        onValueChange={(value) => handleChange("type", value)}
        defaultValue={currentFilters.type}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="BUY">Buy</SelectItem>
          <SelectItem value="SELL">Sell</SelectItem>
        </SelectContent>
      </Select>

      <Input
        className="w-[120px]"
        placeholder="Market"
        defaultValue={currentFilters.market || ""}
        onBlur={(e) => handleChange("market", e.target.value)}
      />

      <Select
        onValueChange={(value) => handleChange("status", value)}
        defaultValue={currentFilters.status}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="SUCCESS">Success</SelectItem>
          <SelectItem value="FAILED">Failed</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={() => router.push("/orders")}>Clear</Button>
    </div>
  );
}
