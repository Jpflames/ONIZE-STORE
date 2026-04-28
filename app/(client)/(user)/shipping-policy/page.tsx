import Container from "@/components/Container";
import type { Metadata } from "next";
import {
  Package,
  Clock,
  Truck,
  Globe,
  BadgeDollarSign,
  MapPin,
  AlertTriangle,
  RefreshCcw,
  ShieldCheck,
  MessageCircle,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy | Onize Crochets",
  description:
    "Processing times, shipping timelines, fees, tracking, and customs information for Onize Crochets orders.",
};

const sections = [
  {
    icon: Package,
    number: "01",
    title: "📦 SHIPPING POLICY",
    body: "Last Updated: April 2026\n\nAt Onize Crochets, every item is carefully handmade with love and attention to detail. This means your order goes through a thoughtful creation process before it gets shipped.\n\nEvery piece from Onize Crochets is handcrafted using high-quality yarn and carefully selected materials to ensure beauty that lasts.",
  },
  {
    icon: Clock,
    number: "02",
    title: "Processing Time",
    body: "All our products are handmade, so please allow:\n\n• 3–7 working days for production before shipping\n• Processing time may vary slightly depending on order volume or complexity of the design\n\nOnce your order is ready, it will be prepared and dispatched immediately.",
  },
  {
    icon: Truck,
    number: "03",
    title: "🚚 Shipping Time & Delivery",
    body: "Within Nigeria:\n\n• Estimated delivery time: 2–5 working days after dispatch\n\nInternational Orders:\n\n• Delivery time varies depending on destination\n• Typically between 7–14 working days\n\nPlease note that delivery times are estimates and may vary due to factors beyond our control.",
  },
  {
    icon: BadgeDollarSign,
    number: "04",
    title: "💰 Shipping Fees",
    body: "Shipping fees are based on your location and shown at checkout.\n\n• Within Nigeria: $20\n• International Orders: $40\n\nFor custom or bulk orders, shipping costs may vary and will be communicated before payment.",
  },
  {
    icon: MapPin,
    number: "05",
    title: "Order Tracking",
    body: "Once your order has been shipped, you may receive a tracking number (where applicable). This allows you to monitor your delivery progress in real time.",
  },
  {
    icon: AlertTriangle,
    number: "06",
    title: "Delays",
    body: "While we aim to deliver within the estimated timeframe, delays may occur due to:\n\n• Courier service issues\n• Weather conditions\n• Public holidays\n• High demand periods\n\nOnize Crochets is not responsible for delays once the package has been dispatched, but we will always assist you in tracking your order.",
  },
  {
    icon: RefreshCcw,
    number: "07",
    title: "Incorrect Address",
    body: "Please ensure that all shipping details are correct before placing your order.\n\n• We are not responsible for orders shipped to incorrect addresses provided by customers\n• If you notice an error, contact us immediately before your order is dispatched",
  },
  {
    icon: ShieldCheck,
    number: "08",
    title: "📦 Failed Delivery / Returned Orders",
    body: "If a delivery fails due to:\n\n• Incorrect address\n• Unavailability to receive the package\n\nThe order may be returned to us. In such cases:\n\n• The customer may be required to pay for re-shipping",
  },
  {
    icon: Globe,
    number: "09",
    title: "🌍 Customs & Duties (For International Orders)",
    body: "Customers are responsible for any customs fees, import duties, or taxes required by their country. These charges are not included in our product or shipping prices.",
  },
  {
    icon: MessageCircle,
    number: "10",
    title: "💬 Need Help?",
    body: "If you have any questions about your order or shipping:\n\nWhatsApp: +234 9058775521\nEmail: onizecrochets@gmail.com",
  },
];

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="space-y-3">
      {text.split("\n\n").map((p) => (
        <p key={p} className="text-sm text-muted-foreground leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}

export default function ShippingPolicyPage() {
  return (
    <div>
      <section className="border-b border-border bg-card">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <Container className="py-16 md:py-20 relative">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Legal
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Shipping Policy
            </h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Processing times, delivery estimates, fees, tracking, and customs
              information for Onize Crochets orders. Last updated:{" "}
              <span className="font-semibold text-foreground">April 2026</span>.
            </p>
          </Container>
        </div>
      </section>

      <Container className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.number}
                className="group bg-card border border-border rounded-2xl p-7 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mt-0.5">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="w-full">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Section {s.number}
                    </p>
                    <h2 className="text-lg font-bold mb-2">{s.title}</h2>
                    <Paragraphs text={s.body} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto mt-10 p-5 rounded-2xl border border-border bg-muted/30 text-sm text-muted-foreground text-center">
          Need help with shipping?{" "}
          <span className="inline-flex items-center gap-2 font-semibold text-foreground">
            <Mail className="w-4 h-4" />
            onizecrochets@gmail.com
          </span>
        </div>
      </Container>
    </div>
  );
}

