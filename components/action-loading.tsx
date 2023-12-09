import { Loader2 } from "lucide-react";

export const ActionLoading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div>
      <div className="fixed inset-0 m-auto w-full h-full z-50" />
      <div
        className="fixed top-14 inset-x-0 mx-auto p-4 w-max rounded-md bg-white shadow-xl shadow-black data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-500 z-50"
        data-state={isLoading ? "open" : "closed"}>
        <Loader2 className="animate-spin" />
      </div>
    </div>
  );
};
