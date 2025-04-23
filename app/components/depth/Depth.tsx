"use client";

import { useEffect, useState } from "react";
import {
  getDepth,
  getKlines,
  getTicker,
  getTrades,
} from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "../../utils/SignalingManager";

export function Depth({ market }: { market: string }) {
  const [bids, setBids] = useState<[string, string][]>();
  const [asks, setAsks] = useState<[string, string][]>();
  const [price, setPrice] = useState<string>();

  //   useEffect(() => {
  //     SignalingManager.getInstance().registerCallback(
  //       "depth",
  //       (data: any) => {
  //         console.log("depth has been updated");
  //         console.log(data);

  //         setBids((originalBids) => {
  //           const bidsAfterUpdate = [...(originalBids || [])];

  //           for (let i = 0; i < bidsAfterUpdate.length; i++) {
  //             for (let j = 0; j < data.bids.length; j++) {
  //               if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
  //                 bidsAfterUpdate[i][1] = data.bids[j][1];
  //                 if (Number(bidsAfterUpdate[i][1]) === 0) {
  //                   bidsAfterUpdate.splice(i, 1);
  //                 }
  //                 break;
  //               }
  //             }
  //           }

  //           for (let j = 0; j < data.bids.length; j++) {
  //             if (
  //               Number(data.bids[j][1]) !== 0 &&
  //               !bidsAfterUpdate.map((x) => x[0]).includes(data.bids[j][0])
  //             ) {
  //               bidsAfterUpdate.push(data.bids[j]);
  //               break;
  //             }
  //           }
  //           bidsAfterUpdate.sort((x, y) =>
  //             Number(y[0]) > Number(x[0]) ? -1 : 1
  //           );
  //           return bidsAfterUpdate;
  //         });

  //         setAsks((originalAsks) => {
  //           const asksAfterUpdate = [...(originalAsks || [])];

  //           for (let i = 0; i < asksAfterUpdate.length; i++) {
  //             for (let j = 0; j < data.asks.length; j++) {
  //               if (asksAfterUpdate[i][0] === data.asks[j][0]) {
  //                 asksAfterUpdate[i][1] = data.asks[j][1];
  //                 if (Number(asksAfterUpdate[i][1]) === 0) {
  //                   asksAfterUpdate.splice(i, 1);
  //                 }
  //                 break;
  //               }
  //             }
  //           }

  //           for (let j = 0; j < data.asks.length; j++) {
  //             if (
  //               Number(data.asks[j][1]) !== 0 &&
  //               !asksAfterUpdate.map((x) => x[0]).includes(data.asks[j][0])
  //             ) {
  //               asksAfterUpdate.push(data.asks[j]);
  //               break;
  //             }
  //           }
  //           asksAfterUpdate.sort((x, y) =>
  //             Number(y[0]) > Number(x[0]) ? 1 : -1
  //           );
  //           return asksAfterUpdate;
  //         });
  //       },
  //       `DEPTH-${market}`
  //     );

  //     SignalingManager.getInstance().sendMessage({
  //       method: "SUBSCRIBE",
  //       params: [`depth.200ms.${market}`],
  //     });

  //     getDepth(market).then((d) => {
  //       setBids(d.bids.reverse());
  //       setAsks(d.asks);
  //     });

  //     getTicker(market).then((t) => setPrice(t.lastPrice));
  //     getTrades(market).then((t) => setPrice(t[0].price));

  //     return () => {
  //       SignalingManager.getInstance().sendMessage({
  //         method: "UNSUBSCRIBE",
  //         params: [`depth.200ms.${market}`],
  //       });
  //       SignalingManager.getInstance().deRegisterCallback(
  //         "depth",
  //         `DEPTH-${market}`
  //       );
  //     };
  //   }, [market]);

  useEffect(() => {
    const signaling = SignalingManager.getInstance();

    const updateDepth = (data: any) => {
      // console.log("Depth update received:", data);

      setBids((prevBids) => {
        const bidMap = new Map(prevBids);
        data.bids.forEach(([price, size]: [string, string]) => {
          if (Number(size) === 0) {
            bidMap.delete(price);
          } else {
            bidMap.set(price, size);
          }
        });

        return Array.from(bidMap).sort((a, b) => Number(b[0]) - Number(a[0]));
      });

      setAsks((prevAsks) => {
        const askMap = new Map(prevAsks);
        data.asks.forEach(([price, size]: [string, string]) => {
          if (Number(size) === 0) {
            askMap.delete(price);
          } else {
            askMap.set(price, size);
          }
        });

        return Array.from(askMap).sort((a, b) => Number(a[0]) - Number(b[0]));
      });
    };

    signaling.registerCallback("depth", updateDepth, `DEPTH-${market}`);

    signaling.sendMessage({
      method: "SUBSCRIBE",
      params: [`depth.200ms.${market}`],
    });

    getDepth(market).then((d) => {
      setBids(d.bids.reverse());
      setAsks(d.asks);
    });

    getTicker(market).then((t) => setPrice(t.lastPrice));
    getTrades(market).then((t) => setPrice(t[0].price));

    return () => {
      signaling.sendMessage({
        method: "UNSUBSCRIBE",
        params: [`depth.200ms.${market}`],
      });
      signaling.deRegisterCallback("depth", `DEPTH-${market}`);
    };
  }, [market]);

  return (
    <div>
      <TableHeader />
      {asks && <AskTable asks={asks} />}
      {price && <div className="text-center text-lg font-bold">{price}</div>}
      {bids && <BidTable bids={bids} />}
    </div>
  );
}

function TableHeader() {
  return (
    <div className="flex justify-between text-xs">
      <div className="text-white">Price</div>
      <div className="text-slate-500">Size</div>
      <div className="text-slate-500">Total</div>
    </div>
  );
}
