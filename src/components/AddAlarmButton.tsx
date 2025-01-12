import React from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface AddAlarmButtonProps {
  onClick: () => void;
}

const AddAlarmButton = ({ onClick }: AddAlarmButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default AddAlarmButton;