/* eslint-disable @next/next/no-img-element */
"use client";
import { Badge } from "@/components/ui/badge";
import { useBlur } from "@/contexts/blur-context";
import { cn } from "@/lib/utils";

export const Profile = ({
  image,
  nickname,
  name,
  email,
  whatDoYouDo,
  customTraits,
  about,
  plan,
}: {
  image: string;
  nickname: string;
  name: string;
  email: string;
  whatDoYouDo: string;
  customTraits: string[];
  about: string;
  plan: string;
}) => {
  const { isBlurred } = useBlur();
  return (
    <div
      className={cn(
        "flex flex-col items-center space-y-4",
        isBlurred && "blur-sm"
      )}
    >
      <div className="relative">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-600 text-4xl font-bold text-white">
          <img
            src={image}
            alt="Profile"
            width={1280}
            height={1280}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      </div>
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-2xl font-bold">
          {nickname || name}
        </h1>
        <p className="text-muted-foreground">{email}</p>
        <div className="flex items-center justify-center gap-2">
          {whatDoYouDo && (
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground"
            >
              {whatDoYouDo}
            </Badge>
          )}
          {customTraits.length > 0 && (
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground"
            >
              {customTraits.join(", ")}
            </Badge>
          )}
          {about && (
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground"
            >
              {about}
            </Badge>
          )}
        </div>
        {plan && (
          <Badge variant="secondary" className="text-white bg-pink-600">
            {plan}
          </Badge>
        )}
      </div>
    </div>
  );
};
