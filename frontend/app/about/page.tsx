import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChatCircleIcon, 
  RocketLaunchIcon, 
  UsersIcon, 
  LightbulbIcon,
  TargetIcon 
} from "@phosphor-icons/react/dist/ssr";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary drop-shadow-primary flex size-16 items-center justify-center rounded-2xl drop-shadow-lg">
              <ChatCircleIcon
                className="size-8"
                weight="duotone"
                fill="var(--foreground)"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            About 1AI
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your intelligent AI chat companion - Experience the power of advanced AI conversations in one seamless platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="border-muted/40 bg-muted/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <RocketLaunchIcon className="size-6 text-primary" weight="duotone" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90 leading-relaxed">
              <p>
                At 1AI, we believe in making powerful AI technology accessible to everyone. 
                Our mission is to provide a seamless, intuitive chat interface that connects you 
                with advanced AI models, helping you get answers, solve problems, and explore ideas.
              </p>
              <p className="mt-4">
                We are committed to delivering fast, reliable, and intelligent conversations 
                that enhance your productivity and creativity, all through one unified platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-muted/40 bg-muted/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <TargetIcon className="size-6 text-primary" weight="duotone" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90 leading-relaxed">
              <p>
                We envision a future where AI assistance is as natural as having a conversation 
                with a knowledgeable friend. Our goal is to create the most intuitive and 
                powerful AI chat experience that adapts to your unique needs and communication style.
              </p>
              <p className="mt-4">
                Through continuous innovation and user-centric design, we aim to make AI 
                conversations more helpful, engaging, and accessible for everyone.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-muted/40 bg-muted/10 mb-16">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <LightbulbIcon className="size-6 text-primary" weight="duotone" />
              What We Offer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Chat Features</h3>
                <ul className="space-y-2 text-foreground/90">
                  <li>• Multi-model AI conversations</li>
                  <li>• Real-time response streaming</li>
                  <li>• Conversation history & sync</li>
                  <li>• Context-aware responses</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Platform Benefits</h3>
                <ul className="space-y-2 text-foreground/90">
                  <li>• Lightning-fast responses</li>
                  <li>• Cross-device synchronization</li>
                  <li>• Clean, intuitive interface</li>
                  <li>• 24/7 AI availability</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted/40 bg-muted/10 mb-16">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <UsersIcon className="size-6 text-primary" weight="duotone" />
              100xDevs Community
            </CardTitle>
          </CardHeader>
          <CardContent className="text-foreground/90 leading-relaxed">
            <p className="mb-4">
              Our platform is built with the principles of simplicity, reliability, and user-first 
              design that define the 100xDevs philosophy.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="font-medium text-center">
                Join thousands of users who are already enhancing their productivity with 1AI
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-primary">Ready to Chat with AI?</h2>
          <p className="text-muted-foreground">
            Start having intelligent conversations with our advanced AI models today
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="h-12 px-8" asChild>
              <a href="/ask">Try 1AI Now</a>
            </Button>
            <Button variant="outline" className="h-12 px-8" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
            <Button variant="outline" className="h-12 px-8" asChild>
              <a href="/pricing">View Pricing</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
