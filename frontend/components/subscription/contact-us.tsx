import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lightbulb,
  Bug,
  AlertCircle,
  Users,
  Shield,
  FileText,
} from "lucide-react";

const contactData = [
  {
    id: 1,
    icon: Lightbulb,
    title: "Have a cool feature idea?",
    description: "Vote on upcoming features or suggest your own",
    color: "text-pink-500",
  },
  {
    id: 2,
    icon: Bug,
    title: "Found a non-critical bug?",
    description: "UI glitches or formatting issues? Report them here :)",
    color: "text-orange-500",
  },
  {
    id: 3,
    icon: AlertCircle,
    title: "Having account or billing issues?",
    description: "Email us for priority support - support@ping.gg",
    color: "text-red-500",
  },
  {
    id: 4,
    icon: Users,
    title: "Want to join the community?",
    description:
      "Come hang out in our Discord! Chat with the team and other users",
    color: "text-purple-500",
  },
  {
    id: 5,
    icon: Shield,
    title: "Privacy Policy",
    description: "Read our privacy policy and data handling practices",
    color: "text-blue-500",
  },
  {
    id: 6,
    icon: FileText,
    title: "Terms of Service",
    description: "Review our terms of service and usage guidelines",
    color: "text-green-500",
  },
];

const ContactCard = ({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) => {
  return (
    <Card className="border-border bg-accent/30 hover:bg-accent/50 h-fit max-w-md cursor-pointer p-0 transition-colors">
      <CardContent className="p-0">
        <div className="flex items-center gap-4">
          <div className={`${color}`}>
            <Icon className="text-primary size-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-foreground font-semibold">{title}</h3>
            <p className="text-muted-foreground text-xs font-medium">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ContactUsPage = () => {
  return (
    <div className="bg-background mx-auto w-full max-w-4xl">
      {/* Header */}
      <div className="mt-5 mb-3">
        <h1 className="mb-2 text-2xl font-bold">We're here to help!</h1>
      </div>

      {/* Contact Cards */}
      <div className="space-y-4">
        {contactData.map((contact) => (
          <ContactCard
            key={contact.id}
            icon={contact.icon}
            title={contact.title}
            description={contact.description}
            color={contact.color}
          />
        ))}
      </div>
    </div>
  );
};
