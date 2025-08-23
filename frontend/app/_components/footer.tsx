import { ChatCircleIcon } from "@phosphor-icons/react/dist/ssr";

export const Footer = () => {
  return (
    <>
      <div className="bg-muted/40 mx-auto mt-20 flex w-full max-w-6xl flex-col items-center justify-center rounded-xl border p-8">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="from-primary drop-shadow-primary flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr to-pink-500 drop-shadow-md">
              <ChatCircleIcon weight="bold" className="size-5" />
            </div>
            <h1 className="mt-4 font-semibold">1AI</h1>
            <div className="text-sm text-muted-foreground">Copyright &copy; {new Date().getFullYear()}</div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          <a 
            href="/about" 
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            About Us
          </a>
          <span className="text-muted-foreground/50">•</span>
          <a 
            href="/contact" 
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            Contact
          </a>
          <span className="text-muted-foreground/50">•</span>
          <a 
            href="/pricing" 
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            Pricing
          </a>
          <span className="text-muted-foreground/50">•</span>
          <a 
            href="/terms" 
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            Terms
          </a>
          <span className="text-muted-foreground/50">•</span>
          <a 
            href="/refund" 
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            Refund Policy
          </a>
        </div>
      </div>
    </>
  );
};
