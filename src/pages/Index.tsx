import React, { useState } from "react";
import { Alarm } from "@/components/AlarmList";
import AlarmList from "@/components/AlarmList";
import AddAlarmButton from "@/components/AddAlarmButton";
import AlarmDialog from "@/components/AlarmDialog";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const savedAlarms = localStorage.getItem("alarms");
    return savedAlarms ? JSON.parse(savedAlarms) : [];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddAlarm = ({
    time,
    days,
    image,
  }: {
    time: string;
    days: string[];
    image: string;
  }) => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time,
      days,
      isActive: true,
      image,
    };
    const updatedAlarms = [...alarms, newAlarm];
    setAlarms(updatedAlarms);
    localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
    
    toast({
      title: "Alarme ajoutée",
      description: `Nouvelle alarme configurée pour ${time}`,
    });
  };

  const handleDeleteAlarm = (id: string) => {
    const updatedAlarms = alarms.filter((alarm) => alarm.id !== id);
    setAlarms(updatedAlarms);
    localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
    
    toast({
      title: "Alarme supprimée",
      description: "L'alarme a été supprimée avec succès",
    });
  };

  const handleToggleAlarm = (id: string) => {
    const updatedAlarms = alarms.map((alarm) =>
      alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
    );
    setAlarms(updatedAlarms);
    localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
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
        />
      )}
      <AddAlarmButton onClick={() => setDialogOpen(true)} />
      <AlarmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleAddAlarm}
      />
    </div>
  );
};

export default Index;