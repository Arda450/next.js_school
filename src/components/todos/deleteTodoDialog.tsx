"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Todo } from "@/types/todo";
import { useTodos } from "@/components/todos/todo-context";
import { Ban } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

type DeleteButtonProps = {
  todo: Todo;
  isLoading?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onError?: () => void;
  onCancel?: () => void;
};

export default function DeleteButton({
  todo,
  isLoading,
  open,
  onOpenChange,
  onError,
  onCancel,
}: DeleteButtonProps) {
  const { deleteTodo } = useTodos();

  const handleDelete = async () => {
    try {
      const result = await deleteTodo(todo.id);
      if (result.success) {
        toast.success(result.message);
        onOpenChange?.(false);
      } else {
        toast.error(result.message);
        onError?.();
      }
    } catch (error) {
      console.error("Fehler:", error);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
      onError?.();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Todo?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you really want to delete this todo? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onCancel}>
              <Ban className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild className="px-0">
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Confirm
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
