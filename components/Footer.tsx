import Link from "next/link";
import Logo from "./new/Logo";
import FooterTop from "./new/FooterTop";
import SocialMedia from "./new/SocialMedia";
import { categoriesData, quickLinksData } from "@/constants";
import FooterNewsletterForm from "./new/FooterNewsletterForm";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section with contact info */}
        <FooterTop />

        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo>ONIZE</Logo>
            <p className="text-muted-foreground text-sm">
              Discover curated furniture collections at ONIZE, blending style
              and comfort to elevate your living spaces.
            </p>
            <SocialMedia
              className="text-primary/60"
              iconClassName="border-primary/60 hover:border-primary hover:text-primary"
              tooltipClassName="bg-primary text-primary-foreground"
            />
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium hoverEffect"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <ul className="space-y-3">
              {categoriesData.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/category${item?.href}`}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium hoverEffect"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Newsletter</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to our newsletter to receive updates and exclusive
              offers.
            </p>
            <FooterNewsletterForm />
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="py-6 border-t border-border text-center text-sm text-muted-foreground">
          <Link href="https://reactbd.com">
            © {new Date().getFullYear()} reactbd. All rights reserved.
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
