import { Clock, Mail, MapPin, Phone } from "lucide-react";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  {
    title: "Visit Us",
    subtitle: "New Orlean, USA",
    icon: (
      <MapPin className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Call Us",
    subtitle: "+12 958 648 597",
    icon: (
      <Phone className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Working Hours",
    subtitle: "Mon - Sat: 10:00 AM - 7:00 PM",
    icon: (
      <Clock className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Email Us",
    subtitle: "onize@gmail.com",
    icon: (
      <Mail className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
    ),
  },
];

const FooterTop = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b">
      {data.map((item, index) => (
        <ContactItem
          key={index}
          icon={item.icon}
          title={item.title}
          content={item.subtitle}
        />
      ))}
    </div>
  );
};

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

const ContactItem = ({ icon, title, content }: ContactItemProps) => {
  return (
    <div className="flex items-center gap-3 group hover:bg-muted p-4 transition-colors">
      {icon}
      <div>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mt-1 group-hover:text-foreground transition-colors">
          {content}
        </p>
      </div>
    </div>
  );
};

export default FooterTop;
