import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import DeleteButton from "@/components/todos/deleteTodoDialog";
import { Todo } from "@/types/todo";
import { useState } from "react";

interface KebabMenuProps {
  className?: string;
  onEdit: () => void;
  onDelete: () => void;
  todo: Todo;
}

function KebabMenu({ className, onEdit, onDelete, todo }: KebabMenuProps) {
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
          <DropdownMenuItem onClick={onEdit}>Edit Todo</DropdownMenuItem>
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
