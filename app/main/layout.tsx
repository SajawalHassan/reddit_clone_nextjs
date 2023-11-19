import { Header } from "@/components/header/header";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      {children}
    </div>
  );
};

export default MainLayout;
