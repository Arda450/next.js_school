// Dependencies: pnpm install lucide-react

import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import { useTodos } from "../todos/TodoContext";

export default function SearchBar() {
  const { setSearchQuery } = useTodos();
  return (
    <div className="space-y-2 mr-4 w-64">
      {/* <Label htmlFor="input-26">Search input with icon and button</Label> */}
      <div className="relative">
        <Input
          id="input-26"
          className="peer pe-9 ps-9"
          placeholder="Search Todos..."
          type="search"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search size={16} strokeWidth={2} />
        </div>
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="button"
        >
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
