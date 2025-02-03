import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useTodos } from "../todos/todo-context";
import { usePathname } from "next/navigation";

export default function SearchBar() {
  const { setSearchQuery, searchQuery, activeTag, clearFilters } = useTodos();
  const pathname = usePathname();
  const isHomePage = pathname === "/protected";

  if (!isHomePage) {
    return null;
  } // Versteckt die Suchleiste auf anderen Seiten

  return (
    <div className="flex items-center gap-4">
      {/* Aktiver Tag Badge */}
      {activeTag && (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {`Active Filter: ${activeTag}`}
          </span>
        </div>
      )}

      {/* Suchleiste */}
      <div className="relative w-64">
        <Input
          id="input-26"
          value={searchQuery}
          className="peer pe-9 ps-9"
          placeholder="Search Todos..."
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
          <Search size={16} strokeWidth={2} />
        </div>
        {(searchQuery || activeTag) && (
          <button
            onClick={clearFilters}
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
            aria-label="Clear search and filters"
          >
            <X size={16} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}
