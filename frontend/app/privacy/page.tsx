import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-primary drop-shadow-primary flex size-16 items-center justify-center rounded-2xl drop-shadow-lg">
              <ShieldCheckIcon
                className="size-8"
                weight="duotone"
                fill="var(--foreground)"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Your privacy is important to us. Learn how we collect, use, and protect your data.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card className="border-muted/40 bg-muted/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              Welcome to 1AI ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI chat service and website.
            </p>
            <p>
              By using our service, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use our service.
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted/40 bg-muted/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Personal Information</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Email address (for account creation and communication)</li>
                <li>Username and profile information</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communication preferences and settings</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Usage Information</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Chat messages and conversations with our AI models</li>
                <li>Usage patterns and frequency of service use</li>
                <li>Feature preferences and customization settings</li>
                <li>Performance and error logs for service improvement</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Technical Information</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Operating system and platform details</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted/40 bg-muted/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>We use the collected information for the following purposes:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Service Provision:</strong> To provide, maintain, and improve our AI chat services</li>
              <li><strong>Account Management:</strong> To create and manage your user account</li>
              <li><strong>Communication:</strong> To send important updates, security alerts, and support messages</li>
              <li><strong>Personalization:</strong> To customize your experience and remember your preferences</li>
              <li><strong>Analytics:</strong> To understand usage patterns and improve our service quality</li>
              <li><strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted/40 bg-muted/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90 leading-relaxed">
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary">Service Providers</h3>
              <p>We may share information with trusted third-party service providers who assist us in operating our service, including:</p>
              <ul className="space-y-1 list-disc list-inside mt-2">
                <li>AI model providers for processing chat requests</li>
                <li>Payment processors for handling billing</li>
                <li>Cloud hosting and storage providers</li>
                <li>Analytics and monitoring services</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary">Legal Requirements</h3>
              <p>We may disclose information when required by law or to:</p>
              <ul className="space-y-1 list-disc list-inside mt-2">
                <li>Comply with legal process or government requests</li>
                <li>Protect our rights, property, or safety</li>
                <li>Protect the rights, property, or safety of our users</li>
                <li>Investigate potential violations of our terms of service</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted/40 bg-muted/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Monitoring and logging of system activities</li>
            </ul>
            <p>
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted/40 bg-muted/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>You have the following rights regarding your personal information:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Restriction:</strong> Request restriction of processing under certain circumstances</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided below. We will respond to your request within a reasonable timeframe.
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted/40 bg-muted/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. Specific retention periods include:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Account Information:</strong> Until you delete your account or request deletion</li>
              <li><strong>Chat History:</strong> According to your preferences and applicable legal requirements</li>
              <li><strong>Usage Logs:</strong> Typically retained for 12-24 months for security and analytics</li>
              <li><strong>Payment Records:</strong> As required by applicable financial and tax regulations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted/40 bg-muted/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our service. These may include:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Essential Cookies:</strong> Required for basic service functionality</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how our service is used</li>
              <li><strong>Security Cookies:</strong> Help detect and prevent security threats</li>
            </ul>
            <p>
              You can control cookies through your browser settings, but disabling certain cookies may affect service functionality.
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted/40 bg-muted/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted/40 bg-muted/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p>
              We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted/40 bg-muted/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p><strong>Email:</strong> privacy@1ai.co</p>
              <p><strong>Address:</strong> Noida, Uttar Pradesh, India</p>
              <p><strong>Response Time:</strong> We aim to respond within 5 business days</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="h-12 px-8" asChild>
              <a href="/">Back to Home</a>
            </Button>
            <Button variant="outline" className="h-12 px-8" asChild>
              <a href="/terms">Terms of Service</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
