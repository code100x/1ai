import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings2, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "./badge";
import { features } from "@/constants/data";

export function Features() {
  return (
    <section className="mt-32 py-16 md:py-32">
      <div className="@container mx-auto flex max-w-5xl flex-col items-center justify-center px-6">
        <Badge>Features</Badge>
        <div className="mt-4 text-center">
          <h2 className="text-4xl font-semibold text-balance lg:text-5xl">
            Features which everyone craves for
          </h2>
          <p className="mt-2">
            We have created the most simpler way of using the AI chat which
            makes it very use to use
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16 @min-4xl:max-w-full @min-4xl:grid-cols-3">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="group bg-muted/20 border-muted relative overflow-hidden border p-4 shadow-none"
            >
              <div className="bg-primary absolute -bottom-20 left-1/2 z-[-1] h-40 w-full -translate-x-1/2 translate-y-20 rounded-full opacity-0 blur-[4em] transition-all duration-700 group-hover:-translate-y-2 group-hover:opacity-90" />
              <CardHeader className="pb-3">
                <CardDecorator>
                  <feature.icon className="size-6" aria-hidden />
                </CardDecorator>
                <h3 className="text-secondary-foreground mt-6 text-xl font-semibold">
                  {feature.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground/80 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div
    aria-hidden
    className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_40%,transparent_100%)]"
  >
    <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--primary)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 [--border:black] dark:[--border:white]" />
    <div className="bg-primary drop-shadow-primary absolute inset-0 m-auto flex size-12 items-center justify-center rounded-xl drop-shadow-2xl">
      {children}
    </div>
  </div>
);
