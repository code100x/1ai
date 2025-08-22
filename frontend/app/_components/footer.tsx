import { ChatCircleIcon } from "@phosphor-icons/react/dist/ssr";

export const Footer = () => {
  return (
    <>
      <div className="bg-muted/40 mx-auto mt-20 flex h-40 w-full max-w-6xl items-center justify-center rounded-xl border">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="from-primary drop-shadow-primary flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr to-pink-500 drop-shadow-md">
              <ChatCircleIcon weight="bold" className="size-5" />
            </div>
            <h1 className="mt-4 font-semibold">1AI</h1>
            <div>Copyright &copy; {new Date().getFullYear()}</div>
          </div>
        </div>
      </div>
    </>
  );
};
