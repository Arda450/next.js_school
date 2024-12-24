import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface KebabMenuProps {
  className?: string;
  onEdit: () => void;
  onDelete: () => void;
}

function KebabMenu({ className, onEdit, onDelete }: KebabMenuProps) {
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
          <DropdownMenuItem onClick={onDelete}>Delete Todo</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default KebabMenu;
