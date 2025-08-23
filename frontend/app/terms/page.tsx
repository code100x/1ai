import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScalesIcon } from "@phosphor-icons/react/dist/ssr";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-primary drop-shadow-primary flex size-16 items-center justify-center rounded-2xl drop-shadow-lg">
              <ScalesIcon
                className="size-8"
                weight="duotone"
                fill="var(--foreground)"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            Terms and Conditions
          </h1>
          <p className="text-muted-foreground text-lg">
            Please read these terms carefully before using our service
          </p>
        </div>

        <Card className="border-muted/40 bg-muted/10">
          <CardHeader>
            <CardTitle className="text-2xl">Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90 leading-relaxed">
            <p>
              Welcome, if you continue to browse and use this website you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern 100xDevs relationship with you in relation to this website.
            </p>
            
            <p>
              The term '100xDevs' or 'us' or 'we' refers to the owner of the website. The term 'you' refers to the user or viewer of our website.
            </p>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Terms of Use</h3>
              <p className="mb-4">The use of this website is subject to the following terms of use:</p>
              
              <ul className="space-y-3 list-disc list-inside">
                <li>The content of the pages of this website is for your general information and use only. It is subject to change without notice.</li>
                
                <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose.</li>
                
                <li>You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</li>
                
                <li>Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable.</li>
                
                <li>It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.</li>
                
                <li>This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics.</li>
                
                <li>Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
                
                <li>All trademarks reproduced in this website which is not the property of, or licensed to, the operator is acknowledged on the website.</li>
                
                <li>Unauthorized use of this website by you may give rise to a claim for damages and/or be a criminal offense. From time to time this website may also include links to other websites.</li>
                
                <li>These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We take no responsibility for the content of the linked website(s).</li>
                
                <li>You may not create a link to this website from another website or document without 100xDevs prior consent.</li>
                
                <li>Your use of this website and any dispute arising out of such use of the website is subject to the laws of India or other regulatory authority.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Additional Terms</h3>
              <ul className="space-y-3 list-disc list-inside">
                <li><strong>Credit Card Orders:</strong> Credit Card orders will commence on receiving the authorization/confirmation from the Credit Card/respective Payment Gateway companies.</li>
                
                <li><strong>Educational Purpose Only:</strong> This app is designed solely for educational purposes to help users develop skills. We do not guarantee any income or financial success from using this app.</li>
                
                <li><strong>No Income Assurance:</strong> The skills and knowledge provided are for personal growth and learning. We do not promise or imply any job placement, business success, or earnings.</li>
                
                <li><strong>Non-Refundable:</strong> All payments made in the app are final. No refunds will be provided under any circumstances.</li>
                
                <li><strong>User Responsibility:</strong> You are responsible for how you use the skills learned from this app. The app creators are not liable for any outcomes resulting from your usage.</li>
              </ul>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-8">
              <p className="text-center font-medium">
                By continuing to use the app, you accept and agree to these terms.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <Button variant="outline" className="h-12 px-8" asChild>
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
