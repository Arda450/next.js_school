"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";

interface ModalProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export const Modal = ({
  title = "Modal",
  description,
  children,
}: ModalProps) => {
  // this router is needed so that we can handle whenever the user
  // clicks the close button or clicks somewhere outside the modal range
  // since we are on a different route, we need to use the router to handle this
  const router = useRouter();

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={() => router.back()}>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {/* here we pass the children inside the modal, because this is the modal body  */}
          {children}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
