// dies ist der Todo Form Wrapper

"use client"; // Dies ist eine Client-Komponente
import { useState } from "react";
import TodoForm from "@/components/forms/todo-form";
import { Button } from "@/components/ui/button";
import { MinusIcon } from "lucide-react";
import PlusIcon from "@/components/icons/plus-icon";

export default function AddTodoForm({ session }: { session: any }) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 outline outline-1 outline-solid outline-black">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {/* To-Do-Karten */}
        </div>
        <Button onClick={toggleFormVisibility} className="my-4 w-fit">
          <span className="flex items-center gap-2 transition-all duration-200">
            {isFormVisible ? <MinusIcon /> : <PlusIcon />}
            <span className="transition-all duration-200">
              {isFormVisible ? "Hide Form" : "Create New Todo"}
            </span>
          </span>
        </Button>
        {/* versuche scale einzubauen */}
        {/* <div className='w-full flex items-center'>
        <Button
          type={
            filePaths.length > 0 && filePaths.every(fp => fp.endsWith('.enc'))
              ? 'button'
              : 'submit'
          }
          onClick={handleEncrypt}
          size='lg'
          className={`transition-all duration-200 ${
            filePaths.length > 0 && filePaths.every(fp => fp.endsWith('.enc'))
              ? 'p-0 h-0 w-0 scale-0 m-0'
              : 'grow mr-1'
          }`}
          disabled={
            !passwordValidation.success || isProcessing || filePaths.length <= 0
          }
        >
          {t('encryption.encrypt')}
        </Button>
        <Button
          type={
            filePaths.length > 0 && filePaths.every(fp => !fp.endsWith('.enc'))
              ? 'button'
              : 'submit'
          }
          onClick={handleDecrypt}
          size='lg'
          className={`transition-all duration-200 ${
            filePaths.length > 0 && filePaths.every(fp => !fp.endsWith('.enc'))
              ? 'p-0 h-0 w-0 scale-0 m-0'
              : filePaths.every(fp => fp.endsWith('.enc'))
              ? 'grow mr-1'
              : 'grow mx-1'
          }`}
          disabled={isProcessing || filePaths.length <= 0}
        >
          {t('encryption.decrypt')}
        </Button>
        <Button
          size='lg'
          className='transition-all duration-200 grow ml-1'
          disabled={
            isProcessing || (filePaths.length <= 0 && password.length <= 0)
          }
          onClick={handleReset}
          variant='destructive'
        >
          {t('encryption.reset')}
        </Button>
      </div> */}

        <div
          className={`transition-all duration-300 ease-in-out transform ${
            isFormVisible
              ? "opacity-100 scale-100 max-h-[500px]" // Sichtbar
              : "opacity-0 scale-95 max-0-h pointer-events-none" // Versteckt
          }`}
        >
          <TodoForm />
        </div>
      </div>
    </>
  );
}
