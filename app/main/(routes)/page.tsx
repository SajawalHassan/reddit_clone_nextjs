import { ThemeToggler } from "@/components/ui/theme-toggler";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-grow items-center justify-center space-x-2">
      <UserButton afterSignOutUrl="/auth/sign-in" appearance={{ elements: { avatarBox: "h-[48px] w-[48px]" } }} />
      <ThemeToggler />
    </div>
  );
}
