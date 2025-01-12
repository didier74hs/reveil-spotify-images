import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface AlarmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (alarm: {
    time: string;
    days: string[];
    image: string;
  }) => void;
}

const DAYS = [
  { label: "L", value: "Lun" },
  { label: "M", value: "Mar" },
  { label: "M", value: "Mer" },
  { label: "J", value: "Jeu" },
  { label: "V", value: "Ven" },
  { label: "S", value: "Sam" },
  { label: "D", value: "Dim" },
];

const IMAGES = [
  "/placeholder.svg",
  "photo-1501854140801-50d01698950b",
  "photo-1500673922987-e212871fec22",
  "photo-1509316975850-ff9c5deb0cd9",
];

const AlarmDialog = ({ open, onOpenChange, onSave }: AlarmDialogProps) => {
  const [time, setTime] = useState("07:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(IMAGES[0]);

  const handleSave = () => {
    onSave({
      time,
      days: selectedDays,
      image: selectedImage,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background-end text-text-primary">
        <DialogHeader>
          <DialogTitle>Nouvelle alarme</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="time">Heure</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-white/5"
            />
          </div>
          <div className="grid gap-2">
            <Label>Jours</Label>
            <ToggleGroup
              type="multiple"
              value={selectedDays}
              onValueChange={setSelectedDays}
              className="justify-between"
            >
              {DAYS.map((day) => (
                <ToggleGroupItem
                  key={day.value}
                  value={day.value}
                  className="w-9 h-9 data-[state=on]:bg-accent"
                >
                  {day.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="grid gap-2">
            <Label>Image</Label>
            <div className="grid grid-cols-2 gap-2">
              {IMAGES.map((image) => (
                <div
                  key={image}
                  className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer ${
                    selectedImage === image
                      ? "ring-2 ring-accent"
                      : "ring-1 ring-white/10"
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt="Alarm"
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button onClick={handleSave} className="w-full bg-accent">
          Sauvegarder
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AlarmDialog;