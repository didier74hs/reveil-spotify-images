import React, { useState, useEffect } from "react";
import { Alarm } from "@/components/AlarmList";
import AlarmList from "@/components/AlarmList";
import AddAlarmButton from "@/components/AddAlarmButton";
import AlarmDialog from "@/components/AlarmDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const savedAlarms = localStorage.getItem("alarms");
    return savedAlarms ? JSON.parse(savedAlarms) : [];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | undefined>();
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentDay = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][now.getDay()];

      alarms.forEach((alarm) => {
        if (
          alarm.isActive &&
          alarm.time === currentTime &&
          (alarm.days.length === 0 || alarm.days.includes(currentDay))
        ) {
          triggerAlarm(alarm);
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  const triggerAlarm = async (alarm: Alarm) => {
    setActiveAlarm(alarm);
    document.body.style.backgroundImage = `url(${alarm.image})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';

    try {
      // Jouer un son d'alarme classique d'abord
      const audio = new Audio('/alarm-sound.mp3');
      await audio.play();

      if (alarm.spotifyPlaylistUrl) {
        toast("Réveil !", {
          description: `Il est ${alarm.time}. Cliquez ici pour lancer Spotify.`,
          duration: Infinity,
          action: {
            label: "Lancer Spotify",
            onClick: () => {
              const spotifyWindow = window.open(alarm.spotifyPlaylistUrl, '_blank');
              if (spotifyWindow) {
                spotifyWindow.focus();
              }
              stopAlarm(alarm);
            },
          },
          onDismiss: () => {},
          cancel: {
            label: "Reporter (5min)",
            onClick: () => snoozeAlarm(alarm),
          },
        });
      } else {
        toast("Réveil !", {
          description: `Il est ${alarm.time}`,
          duration: Infinity,
          action: {
            label: "Arrêter",
            onClick: () => stopAlarm(alarm),
          },
          onDismiss: () => {},
          cancel: {
            label: "Reporter (5min)",
            onClick: () => snoozeAlarm(alarm),
          },
        });
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du son:', error);
      toast.error("Impossible de jouer le son de l'alarme");
    }
  };

  const stopAlarm = (alarm: Alarm) => {
    setActiveAlarm(null);
    document.body.style.backgroundImage = '';
    toast.dismiss();
  };

  const snoozeAlarm = (alarm: Alarm) => {
    const [hours, minutes] = alarm.time.split(':').map(Number);
    const alarmTime = new Date();
    alarmTime.setHours(hours);
    alarmTime.setMinutes(minutes);
    alarmTime.setMinutes(alarmTime.getMinutes() + 5);

    const newAlarm: Alarm = {
      ...alarm,
      time: `${String(alarmTime.getHours()).padStart(2, '0')}:${String(alarmTime.getMinutes()).padStart(2, '0')}`,
    };

    const updatedAlarms = alarms.map(a => a.id === alarm.id ? newAlarm : a);
    setAlarms(updatedAlarms);
    localStorage.setItem("alarms", JSON.stringify(updatedAlarms));

    stopAlarm(alarm);
    toast.success("Alarme reportée de 5 minutes");
  };

  const handleAddAlarm = (alarmData: Omit<Alarm, "id" | "isActive">) => {
    if (editingAlarm) {
      const updatedAlarms = alarms.map((alarm) =>
        alarm.id === editingAlarm.id
          ? { ...alarm, ...alarmData }
          : alarm
      );
      setAlarms(updatedAlarms);
      localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
      toast.success(`L'alarme de ${alarmData.time} a été modifiée`);
    } else {
      const newAlarm: Alarm = {
        id: Date.now().toString(),
        ...alarmData,
        isActive: true,
      };
      const updatedAlarms = [...alarms, newAlarm];
      setAlarms(updatedAlarms);
      localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
      toast.success(`Nouvelle alarme configurée pour ${alarmData.time}`);
    }
    setEditingAlarm(undefined);
  };

  const handleDeleteAlarm = (id: string) => {
    const updatedAlarms = alarms.filter((alarm) => alarm.id !== id);
    setAlarms(updatedAlarms);
    localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
    toast.success("L'alarme a été supprimée avec succès");
  };

  const handleToggleAlarm = (id: string) => {
    const updatedAlarms = alarms.map((alarm) =>
      alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
    );
    setAlarms(updatedAlarms);
    localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
    
    const alarm = updatedAlarms.find((a) => a.id === id);
    toast.success(`L'alarme de ${alarm?.time} a été ${alarm?.isActive ? "activée" : "désactivée"}`);
  };

  const handleEditAlarm = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingAlarm(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Mes alarmes</h1>
      {alarms.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          <p>Aucune alarme configurée</p>
          <p className="text-sm">Cliquez sur le bouton + pour commencer</p>
        </div>
      ) : (
        <AlarmList
          alarms={alarms}
          onDelete={handleDeleteAlarm}
          onToggle={handleToggleAlarm}
          onEdit={handleEditAlarm}
        />
      )}
      <AddAlarmButton onClick={() => setDialogOpen(true)} />
      <AlarmDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSave={handleAddAlarm}
        editingAlarm={editingAlarm}
      />
    </div>
  );
};

export default Index;