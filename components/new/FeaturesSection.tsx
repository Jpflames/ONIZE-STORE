import { Truck, ShieldCheck, CreditCard, Clock } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On all orders over $100. Delivered to your door.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "We use 256-bit encryption to protect your data.",
    },
    {
      icon: CreditCard,
      title: "Flexible Financing",
      description: "Pay over time with Affirm or Klarna.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our dedicated team is here for you anytime.",
    },
  ];

  return (
    <section className="py-20 border-t border-border mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-6 bg-muted/20 border border-border/50 rounded-2xl hover:bg-muted/40 transition-colors duration-300"
          >
            <div className="w-14 h-14 bg-background border border-border flex items-center justify-center rounded-full mb-6 shadow-sm">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold tracking-tight mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
