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
import { useTodos } from "@/components/todos/TodoContext";
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
  trigger?: React.ReactNode; // Neuer Prop für custom Trigger
};

export default function DeleteButton({
  todo,
  isLoading,
  trigger,
}: DeleteButtonProps) {
  const { deleteTodo } = useTodos();

  const handleDelete = async () => {
    try {
      const res = await deleteTodo(todo.id);
      if (res) {
        toast.success("Todo wurde erfolgreich gelöscht"); // Dialog schließen
      } else {
        toast.error("Fehler beim Löschen des Todos");
      }
    } catch (error) {
      console.error("Fehler:", error);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    }
  };

  return (
    <AlertDialog>
      <Tooltip>
        <AlertDialogTrigger asChild>
          {trigger || (
            <Button
              variant="destructive"
              disabled={isLoading}
              className="transition-opacity duration-200 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Löschen
            </Button>
          )}
        </AlertDialogTrigger>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Todo löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you really want to delete this todo? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">
              <Ban className="h-4 w-4 mr-2" />
              Abbrechen
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
