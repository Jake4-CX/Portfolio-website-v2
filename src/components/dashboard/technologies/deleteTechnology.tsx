import { deleteTechnology } from "@/api/technologies";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteTechnologyModalProps {
  technology: Technology
}

const DeleteTechnologyModal: React.FC<DeleteTechnologyModalProps> = ({ technology }) => {

  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTechnology,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`technologies`] });
      toast.success("Technology deleted successfully");
      setIsOpen(false);

    },
    onError: () => {
      toast.error("Failed to delete technology");
    }
  });

  function onClick() {
    mutate(technology.id);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild className="flex justify-center items-center">
        <Button className="w-full md:w-fit" variant="outline" size="sm">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the technology and remove it from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onClick} disabled={isPending}>
              {
                isPending ? (
                  "Deleting Technology..."
                ) : (
                  "Delete Technology"
                )
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  )
}

export default DeleteTechnologyModal;