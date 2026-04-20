import Container from "@/components/Container";
import HomeBanner from "@/components/new/HomeBanner";
import ProductGrid from "@/components/ProductGrid";
import PromotionalBanners from "@/components/new/PromotionalBanners";
import FeaturesSection from "@/components/new/FeaturesSection";
import NewsletterSection from "@/components/new/NewsletterSection";
import DealsSection from "@/components/new/DealsSection";

export default function Home() {
  return (
    <Container className="py-10">
      <HomeBanner />
      <ProductGrid />
      <DealsSection />
      <PromotionalBanners />
      <FeaturesSection />
      <NewsletterSection />
    </Container>
  );
}
