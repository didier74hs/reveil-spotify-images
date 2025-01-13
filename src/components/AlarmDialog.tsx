import React, { useState, useEffect } from "react";
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
import { ImagePlus, Music } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alarm } from "./AlarmList";

interface AlarmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (alarm: Omit<Alarm, "id" | "isActive">) => void;
  editingAlarm?: Alarm;
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

const SOUND_TYPES = {
  LOCAL: "local",
  SPOTIFY: "spotify",
};

const AlarmDialog = ({ open, onOpenChange, onSave, editingAlarm }: AlarmDialogProps) => {
  const [time, setTime] = useState("07:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [soundType, setSoundType] = useState(SOUND_TYPES.LOCAL);
  const [soundUrl, setSoundUrl] = useState("");
  const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState("");

  useEffect(() => {
    if (editingAlarm) {
      setTime(editingAlarm.time);
      setSelectedDays(editingAlarm.days);
      setSelectedImage(editingAlarm.image);
      setPreviewImage(editingAlarm.image);
      setSoundUrl(editingAlarm.soundUrl || "");
      setSpotifyPlaylistUrl(editingAlarm.spotifyPlaylistUrl || "");
      setSoundType(editingAlarm.spotifyPlaylistUrl ? SOUND_TYPES.SPOTIFY : SOUND_TYPES.LOCAL);
    }
  }, [editingAlarm]);

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

  const handleSoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSoundUrl(reader.result as string);
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
      soundUrl: soundType === SOUND_TYPES.LOCAL ? soundUrl : "",
      spotifyPlaylistUrl: soundType === SOUND_TYPES.SPOTIFY ? spotifyPlaylistUrl : "",
    });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTime("07:00");
    setSelectedDays([]);
    setSelectedImage("");
    setPreviewImage("");
    setSoundUrl("");
    setSpotifyPlaylistUrl("");
    setSoundType(SOUND_TYPES.LOCAL);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>{editingAlarm ? "Modifier l'alarme" : "Nouvelle alarme"}</DialogTitle>
          <DialogDescription>
            Configurez votre alarme en remplissant les champs ci-dessous.
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
            <Label>Image de fond</Label>
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
          <div className="grid gap-2">
            <Label>Son</Label>
            <Select value={soundType} onValueChange={setSoundType}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir le type de son" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SOUND_TYPES.LOCAL}>Fichier audio local</SelectItem>
                <SelectItem value={SOUND_TYPES.SPOTIFY}>Playlist Spotify</SelectItem>
              </SelectContent>
            </Select>
            {soundType === SOUND_TYPES.LOCAL ? (
              <div className="relative">
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={handleSoundChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center h-10 px-4 border rounded-md border-input bg-muted/5">
                  <Music className="w-4 h-4 mr-2" />
                  <span>{soundUrl ? "Son sélectionné" : "Choisir un son"}</span>
                </div>
              </div>
            ) : (
              <Input
                type="url"
                placeholder="URL de la playlist Spotify"
                value={spotifyPlaylistUrl}
                onChange={(e) => setSpotifyPlaylistUrl(e.target.value)}
                className="bg-muted/5"
              />
            )}
          </div>
        </div>
        <Button onClick={handleSave} className="w-full bg-primary">
          {editingAlarm ? "Modifier" : "Sauvegarder"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AlarmDialog;