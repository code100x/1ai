import { cn } from "@/lib/utils";
import Image from "next/image";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Image
      src={"./logotsx.svg"}
      alt="the custom size logo svg"
      height={60}
      width={60}
      className={cn("size-4", className)}
    />
  );
};
