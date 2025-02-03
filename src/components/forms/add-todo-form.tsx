// dies ist der Todo Form Wrapper

"use client"; // Dies ist eine Client-Komponente
import { useState } from "react";
import TodoForm from "@/components/forms/todo-form";
import { Button } from "@/components/ui/button";
import { MinusIcon } from "lucide-react";
import PlusIcon from "@/components/icons/plus-icon";
import { Session } from "next-auth";

interface AddTodoFormProps {
  session: Session;
}

export default function AddTodoForm({ session }: AddTodoFormProps) {
  // State wird im parent definiert
  const [isFormVisible, setIsFormVisible] = useState(false);

  // funktion wird im parent definiert und wird als prop an die kindkomponente übergeben
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="w-full">
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold">My To-Dos</h1>
          <Button
            disabled={isFormVisible}
            onClick={toggleFormVisibility}
            className="text-xs sm:text-md my-4 w-fit transition-all duration-200"
          >
            <span className="flex items-center gap-2 transition-all duration-200">
              <PlusIcon />
              <span className="transition-all duration-200">
                Create New Todo
              </span>
            </span>
          </Button>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isFormVisible
              ? "max-h-[800px] opacity-100 scale-100" // Sichtbar
              : "max-h-0 opacity-0 scale-95 pointer-events-none" // Versteckt
          }`}
        >
          {/* Funktion wird als Prop an die Kindkomponente (TodoForm) übergeben */}
          <TodoForm onCancel={toggleFormVisibility} session={session} />
        </div>
      </div>
    </div>
  );
}
