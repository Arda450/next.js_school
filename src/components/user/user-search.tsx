import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface SearchResult {
  id: string;
  username: string;
}

interface SelectedUser {
  username: string;
}

// diese werden im TodoForm verwendet
type UserSearchProps = {
  onSelect: (username: string) => void;
  selectedUsers: string[];
  placeholder?: string;
};

export function UserSearch({
  onSelect,
  selectedUsers,
  placeholder,
}: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const searchUsers = async () => {
      setError(null);

      if (searchTerm.length < 2) {
        setUsers([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?term=${encodeURIComponent(searchTerm)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Search request failed");
        }
        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setError("Invalid response format");
          setUsers([]);
        }
      } catch (error) {
        console.error("Error searching users:", error);
        setError(
          error instanceof Error ? error.message : "Error searching users"
        );
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    const timeoutId = setTimeout(searchUsers, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="relative w-full space-y-2">
      <Input
        id="user-search"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder || "Type username to share..."}
        aria-label="Search users"
        disabled={isLoading}
      />

      {/* anzeige für die ausgewählten benutzer */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedUsers.map((username) => (
            <div
              key={username}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 rounded-md"
            >
              <span>{username}</span>
              <button
                onClick={() => onSelect(username)} // Entfernt den User
                className="text-muted-foreground hover:text-destructive"
                type="button"
              >
                <X />
              </button>
            </div>
          ))}
        </div>
      )}

      {isLoading && <div className="absolute right-2 top-2">Loading...</div>}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      {users.length > 0 && (
        <ScrollArea className="absolute z-10 w-full max-h-48 mt-1 border rounded-md bg-white shadow-lg">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(user.username);
                setSearchTerm("");
                setUsers([]);
              }}
            >
              {user.username}
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
}
