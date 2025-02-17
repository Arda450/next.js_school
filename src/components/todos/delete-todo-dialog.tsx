"use client";

import {
  AlertDialog,
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
import CancelButton from "@/components/buttons/cancel-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  open,
  onOpenChange,
  onError,
  onCancel,
}: DeleteButtonProps) {
  const { deleteTodo } = useTodos();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
            <CancelButton
              onClick={() => {
                onCancel?.();
              }}
              showIcon={true}
              className="w-full"
            />
          </AlertDialogCancel>
          <AlertDialogAction asChild className="px-0">
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              variant="destructive"
              className="w-full"
            >
              {isLoading ? "Deleting..." : "Confirm"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
