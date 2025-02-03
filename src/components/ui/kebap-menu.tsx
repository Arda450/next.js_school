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

interface KebabMenuProps {
  className?: string;
  onEdit: () => void;
  todo: Todo; // Neuer Prop
}

function KebabMenu({ className, onEdit, todo }: KebabMenuProps) {
  return (
    <div className={cn(className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            <MoreVertical />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onEdit}>Edit Todo</DropdownMenuItem>
          <DeleteButton
            todo={todo}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Delete Todo
              </DropdownMenuItem>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default KebabMenu;
