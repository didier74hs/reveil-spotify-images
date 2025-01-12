import React from "react";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

export interface Alarm {
  id: string;
  time: string;
  days: string[];
  isActive: boolean;
  image: string;
}

interface AlarmListProps {
  alarms: Alarm[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const AlarmList = ({ alarms, onDelete, onToggle }: AlarmListProps) => {
  const getDaysString = (days: string[]) => {
    if (days.length === 7) return "Tous les jours";
    if (days.length === 0) return "Une fois";
    return days.join(", ");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {alarms.map((alarm) => (
        <div
          key={alarm.id}
          className="bg-white/5 backdrop-blur-lg rounded-lg p-4 flex items-center justify-between animate-slide-up"
        >
          <div className="flex items-center space-x-4">
            <Clock className="text-accent h-6 w-6" />
            <div>
              <h3 className="text-text-primary text-xl font-semibold">
                {alarm.time}
              </h3>
              <p className="text-text-secondary text-sm">
                {getDaysString(alarm.days)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Switch
              checked={alarm.isActive}
              onCheckedChange={() => onToggle(alarm.id)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(alarm.id)}
              className="text-text-secondary hover:text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlarmList;