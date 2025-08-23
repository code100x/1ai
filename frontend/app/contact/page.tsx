import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  EnvelopeIcon, 
  ChatCircleIcon,
  ClockIcon,
  QuestionIcon 
} from "@phosphor-icons/react/dist/ssr";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-primary drop-shadow-primary flex size-16 items-center justify-center rounded-2xl drop-shadow-lg">
              <EnvelopeIcon
                className="size-8"
                weight="duotone"
                fill="var(--foreground)"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-lg">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-muted/40 bg-muted/10">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <EnvelopeIcon className="size-5 text-primary" weight="duotone" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                For general inquiries, support requests, or feedback, reach out to us at:
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <a 
                  href="mailto:100xdevs@gmail.com"
                  className="text-primary hover:text-primary/80 transition-colors duration-200 font-semibold text-lg"
                >
                  100xdevs@gmail.com
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Click the email address above to open your default email client
              </p>
            </CardContent>
          </Card>

          <Card className="border-muted/40 bg-muted/10">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <ClockIcon className="size-5 text-primary" weight="duotone" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                We strive to respond to all inquiries within:
              </p>
              <ul className="space-y-2 text-foreground/90">
                <li>• <strong>General Questions:</strong> 24-48 hours</li>
                <li>• <strong>Technical Support:</strong> 12-24 hours</li>
                <li>• <strong>Billing Issues:</strong> 6-12 hours</li>
                <li>• <strong>Urgent Matters:</strong> Same day</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Response times may vary during weekends and holidays
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-muted/40 bg-muted/10 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <QuestionIcon className="size-6 text-primary" weight="duotone" />
              What Can We Help You With?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Account & Billing</h3>
                <ul className="space-y-2 text-foreground/90">
                  <li>• Subscription management</li>
                  <li>• Payment issues</li>
                  <li>• Account settings</li>
                  <li>• Refund requests</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Technical Support</h3>
                <ul className="space-y-2 text-foreground/90">
                  <li>• Platform troubleshooting</li>
                  <li>• Feature requests</li>
                  <li>• Bug reports</li>
                  <li>• Integration help</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">General Inquiries</h3>
                <ul className="space-y-2 text-foreground/90">
                  <li>• Product information</li>
                  <li>• Partnership opportunities</li>
                  <li>• Press and media</li>
                  <li>• Career opportunities</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Educational Support</h3>
                <ul className="space-y-2 text-foreground/90">
                  <li>• Course guidance</li>
                  <li>• Learning resources</li>
                  <li>• Skill assessment</li>
                  <li>• Community questions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted/40 bg-muted/10 mb-12">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <ChatCircleIcon className="size-5 text-primary" weight="duotone" />
              Before You Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/90">
              To help us assist you better, please include the following information in your email:
            </p>
            <ul className="space-y-2 text-foreground/90 list-disc list-inside">
              <li>Your account email address (if applicable)</li>
              <li>Detailed description of your issue or question</li>
              <li>Screenshots or error messages (if relevant)</li>
              <li>Steps you've already taken to resolve the issue</li>
              <li>Your preferred method of response</li>
            </ul>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                💡 Tip: Check our Terms & Conditions and Refund Policy pages for answers to common questions
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-x-4">
          <Button className="h-12 px-8" asChild>
            <a href="mailto:100xdevs@gmail.com">Send Email</a>
          </Button>
          <Button variant="outline" className="h-12 px-8" asChild>
            <a href="/about">About Us</a>
          </Button>
          <Button variant="outline" className="h-12 px-8" asChild>
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
