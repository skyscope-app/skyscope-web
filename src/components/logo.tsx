import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Rotate3D } from "lucide-react";
import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <figure className={cn("flex items-center gap-2", className)}>
      <LogoIcon size="xs" variant="transparent" />
      <LogoText />
    </figure>
  );
}

const logoIconVariants = cva("flex items-center justify-center", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      muted: "bg-accent/25 text-muted-foreground",
      transparent: "bg-transparent text-foreground",
    },
    size: {
      default: "w-9 h-9 p-1.5 rounded-lg",
      xs: "w-6 h-6",
      sm: "w-8 h-8 p-1 rounded-lg",
      lg: "h-10 w-10 p-1.5 rounded-xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface LogoIconProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof logoIconVariants> {
  className?: string;
}
export function LogoIcon({
  href = "/",
  className,
  variant,
  size,
  ...props
}: LogoIconProps) {
  return (
    <Link
      href={href}
      className={cn(logoIconVariants({ variant, size }), className)}
      {...props}
    >
      <Rotate3D className="h-full w-full" />
    </Link>
  );
}

export function LogoText({ className }: { className?: string }) {
  return (
    <figcaption className={cn("text-2xl leading-6 text-foreground", className)}>
      <strong className="font-extrabold">sky</strong>
      <span className="font-normal text-accent-foreground">scope</span>
    </figcaption>
  );
}