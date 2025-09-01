
import { BackButton } from "@/components/back-button";
import { OrderRefillsClient } from "./order-refills-client";

export default function OrderRefillsPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Order Medicines &amp; Refills</h1>
        <p className="text-muted-foreground mb-6">
          Track your medication supply, get smart reminders, and re-order with a single tap.
        </p>
        <OrderRefillsClient />
      </div>
  );
}
