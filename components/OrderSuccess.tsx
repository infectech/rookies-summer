"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { formatCurrency } from "@/lib/utils";

interface OrderSuccessProps {
  orderId: string | null;
  total: number;
  failed?: boolean;
}

export default function OrderSuccess({
  orderId,
  total,
  failed = false,
}: OrderSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto mt-8 flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-black/5 bg-white p-10 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
      >
        {failed ? (
          <TriangleAlert className="size-16 text-burgundy" strokeWidth={1.5} />
        ) : (
          <CheckCircle2 className="size-16 text-gold" strokeWidth={1.5} />
        )}
      </motion.div>
      <h2 className="font-heading text-2xl font-semibold text-black">
        {failed ? "Order Confirmation Delayed" : "Order Successfully Placed"}
      </h2>
      <p className="text-sm text-muted-foreground">
        {failed
          ? "We're having trouble confirming your order right now. If you were charged or you're unsure, please contact us and we'll sort it out."
          : `Thank you for shopping with ${SITE_CONFIG.name}. Our representative will call you shortly to confirm delivery.`}
      </p>
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-muted p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Order ID</span>
          <span className="font-medium text-black">
            {orderId ?? (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Confirming...
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between text-base">
          <span className="font-semibold text-black">Total Bill</span>
          <span className="font-semibold text-black">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
