import CartClient from "@/components/CartClient";

export const metadata = { title: "Shopping Cart | ONIZE" };

export default async function CartPage() {
  return (
    <div>
      <CartClient />
    </div>
  );
}
