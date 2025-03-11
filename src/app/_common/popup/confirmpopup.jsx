import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    // AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CircleAlertIcon } from "lucide-react";

export default function ConfirmComponent({ isOpen, onClose, confirm }) {


    const handleDelete = () => {
        confirm();
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            {/* <AlertDialogTrigger asChild>
                <Button variant="outline">Alert dialog with icon</Button>
            </AlertDialogTrigger> */}
            <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                    >
                        <CircleAlertIcon className="opacity-80" size={30} />
                    </div>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this data?.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
