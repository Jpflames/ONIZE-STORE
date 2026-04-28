"use client";

import useCartStore from "@/store";
import { Check, Home, Package, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { useUser } from "@clerk/nextjs";
import { QueryResult } from "@/sanity.types";

const SuccessPage = () => {
  const [orders, setOrders] = useState<QueryResult>([]);
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const clearCart = useCartStore((state) => state.resetCart);
  const { user } = useUser();
  const userId = user?.id;

  const query =
    defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderData desc){
  ...,products[]{
    ...,product->
  }
}`);

  useEffect(() => {
    if (orderNumber) {
      clearCart();
    }
  }, [orderNumber, clearCart]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        return;
      }

      try {
        const ordersData = await client.fetch(query, { userId });
        setOrders(ordersData);
      } catch {
        setOrders([]);
      }
    };

    fetchData();
  }, [userId, query]);

  return (
    <div className="py-10 bg-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-2xl shadow-2xl px-8 py-12 max-w-xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
        >
          <Check className="text-primary-foreground w-12 h-12" />
        </motion.div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          Order Confirmed!
        </h1>
        <div className="space-y-4 mb-8 text-left">
          <p className="text-muted-foreground">
            Thank you for your purchase. We&apos;re processing your order and
            will ship it soon. A confirmation email with your order details will
            be sent to your inbox shortly.
          </p>
          <p className="text-muted-foreground">
            Order Number:{" "}
            <span className="text-foreground font-semibold">{orderNumber}</span>
          </p>
        </div>

        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-foreground mb-2">
            What&apos;s Next?
          </h2>
          <ul className="text-muted-foreground text-sm space-y-1">
            <li>Check your email for order confirmation</li>
            <li>We&apos;ll notify you when your order ships</li>
            <li>Track your order status anytime</li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-foreground mb-2">Recent Orders</h3>
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order?._id}
                className="flex justify-between items-center bg-muted/50 p-2 rounded"
              >
                <span className="text-muted-foreground text-sm font-medium">
                  {order?._id}
                </span>
                <span className="text-sm font-medium px-2 py-1 bg-muted rounded-full">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
          <Link
            href="/user/orders"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-card text-foreground border border-foreground/10 rounded-lg hover:bg-muted transition-all duration-300 shadow-md"
          >
            <Package className="w-5 h-5 mr-2" />
            Orders
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
