import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid place-content-center h-full">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
}
