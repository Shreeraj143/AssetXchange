"use client";

import { MarketBar } from "@/app/components/MarketBar";
import PredictionBanner from "@/app/components/PredictionBanner";
import PricePrediction from "@/app/components/PricePrediction";
import { SwapUI } from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import { Depth } from "@/app/components/depth/Depth";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { market } = useParams();

  return (
    <div className="flex flex-row flex-1 bg-slate-100">
      <div className="flex flex-col flex-1">
        <MarketBar market={market as string} />
        <div className="flex flex-row flex-grow border-y border-slate-800 overflow-hidden">
          <div className="flex flex-col flex-1">
            <TradeView market={market as string} />
            <div className="w-full">
              <PricePrediction symbol={market as string} />
            </div>
          </div>

          <div className="flex flex-col w-[250px] overflow-hidden">
            <Depth market={market as string} />
          </div>
        </div>
      </div>
      <div className="w-[2px] flex-col border-slate-800 border-l"></div>
      <div>
        <div className="flex flex-col w-[250px]">
          <SwapUI market={market as string} />
        </div>
      </div>
    </div>
  );
}
