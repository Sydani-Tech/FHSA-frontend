import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface CompleteProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompleteProfileModal({
  open,
  onOpenChange,
}: CompleteProfileModalProps) {
  const navigate = useNavigate();

  const handleComplete = () => {
    onOpenChange(false);
    navigate("/profile");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            It looks like this is your first time here or your profile is
            incomplete. Please take a moment to set up your profile details.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleComplete}>Complete Profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
