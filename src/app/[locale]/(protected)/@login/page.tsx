import { LogoIcon } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { JoinButton } from "../../(public)/auth/_components/join-button";
import { LoginForm } from "../../(public)/auth/_components/login-form";
import { SupportCard } from "../../(public)/auth/_components/support-card";

interface LoginPageProps {}

export default function LoginPage({}: LoginPageProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-8 px-4 py-8">
      <LogoIcon variant="muted" />

      <main className="mx-auto flex w-full max-w-56 flex-col gap-5">
        <header className="mb-6 flex flex-col">
          <h1 className="text-lg font-bold text-secondary-foreground">
            Login title
          </h1>
          <span className="text-sm text-muted-foreground">Login subtitle</span>
        </header>

        <LoginForm />

        <Link
          href="/auth/forgot-password"
          className={buttonVariants({
            variant: "link",
            className: "text-xs",
          })}
        >
          Forgot password Text
        </Link>

        <JoinButton />
        <SupportCard />
      </main>

      <footer className="flex items-center">
        <span className="text-xs text-muted-foreground">
          &copy; {new Date().getUTCFullYear()} {siteConfig.name}
        </span>
      </footer>
    </div>
  );
}