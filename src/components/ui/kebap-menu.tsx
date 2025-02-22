import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface KebabMenuProps {
  className?: string;
  onEdit: () => void;
  onDelete: () => void;
}

function KebabMenu({ className, onEdit, onDelete }: KebabMenuProps) {
  // initial ist open auf false
  const [open, setOpen] = useState(false);

  return (
    <div className={cn(className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            <MoreVertical />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/*beim klick wird onEdit ausgeführt -> todolist.tsx*/}
          <DropdownMenuItem onClick={onEdit}>Edit Todo</DropdownMenuItem>

          {/*beim klick wird onDelete ausgeführt -> todolist.tsx*/}
          <DropdownMenuItem
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            Delete Todo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default KebabMenu;
