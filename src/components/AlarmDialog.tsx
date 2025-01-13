import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { ImagePlus } from "lucide-react";

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

const AlarmDialog = ({ open, onOpenChange, onSave }: AlarmDialogProps) => {
  const [time, setTime] = useState("07:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!time) {
      alert("Veuillez sélectionner une heure");
      return;
    }
    onSave({
      time,
      days: selectedDays,
      image: selectedImage || "/placeholder.svg",
    });
    // Reset form
    setTime("07:00");
    setSelectedDays([]);
    setSelectedImage("");
    setPreviewImage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>Nouvelle alarme</DialogTitle>
          <DialogDescription>
            Configurez votre nouvelle alarme en remplissant les champs ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="time">Heure</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-muted/5"
              required
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
                  className="w-9 h-9 data-[state=on]:bg-primary"
                >
                  {day.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="grid gap-2">
            <Label>Image</Label>
            <div className="grid gap-4">
              <div
                className={`relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 ${
                  !previewImage ? "p-4" : ""
                }`}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Aperçu"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ImagePlus className="w-8 h-8 mb-2" />
                    <span>Choisir une image</span>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
        <Button onClick={handleSave} className="w-full bg-primary">
          Sauvegarder
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AlarmDialog;