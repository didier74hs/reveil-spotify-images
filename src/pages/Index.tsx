import React, { useState } from "react";
import { Alarm } from "@/components/AlarmList";
import AlarmList from "@/components/AlarmList";
import AddAlarmButton from "@/components/AddAlarmButton";
import AlarmDialog from "@/components/AlarmDialog";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
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
    setAlarms([...alarms, newAlarm]);
    toast({
      title: "Alarme ajoutée",
      description: `Nouvelle alarme configurée pour ${time}`,
    });
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
    toast({
      title: "Alarme supprimée",
      description: "L'alarme a été supprimée avec succès",
    });
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-start to-background-end text-text-primary p-6">
      <h1 className="text-3xl font-bold mb-8">Mes alarmes</h1>
      {alarms.length === 0 ? (
        <div className="text-center text-text-secondary py-12">
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