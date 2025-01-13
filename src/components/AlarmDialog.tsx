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
import { compressImage } from "../utils/imageUtils";
import { useToast } from "../hooks/use-toast";

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
  const { toast } = useToast();

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          const compressedImage = await compressImage(base64String);
          setSelectedImage(compressedImage);
          setPreviewImage(compressedImage);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de traiter l'image. Veuillez réessayer avec une image plus petite.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = () => {
    if (!time) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une heure",
        variant: "destructive",
      });
      return;
    }

    try {
      const alarmData = {
        time,
        days: selectedDays,
        image: selectedImage || "/placeholder.svg",
        soundUrl: soundType === SOUND_TYPES.LOCAL ? soundUrl : "",
        spotifyPlaylistUrl: soundType === SOUND_TYPES.SPOTIFY ? spotifyPlaylistUrl : "",
      };

      // Test localStorage capacity
      const testKey = "test_storage";
      try {
        localStorage.setItem(testKey, "test");
        localStorage.removeItem(testKey);
      } catch (e) {
        toast({
          title: "Erreur de stockage",
          description: "L'espace de stockage est plein. Veuillez supprimer d'anciennes alarmes.",
          variant: "destructive",
        });
        return;
      }

      onSave(alarmData);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de l'alarme",
        variant: "destructive",
      });
    }
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
