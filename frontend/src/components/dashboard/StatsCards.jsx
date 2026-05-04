import { Sprout, Droplets, Sun, Bell } from 'lucide-react';

/**
 * Stats row displayed in the conservatory header.
 * Shows active plants, water-needing, full-sun, and monitored counts.
 */
export default function StatsCards({ myPlants }) {
  const needsWater = myPlants.filter(p => {
    const daysSince = Math.floor(
      (Date.now() - new Date(p.last_watered_date).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSince >= (p.plant_info?.water_frequency_days || 7);
  }).length;

  const fullSun = myPlants.filter(p => p.plant_info?.sunlight_need === 'Full Sun').length;
  const monitored = myPlants.filter(p => !p.mute_notifications).length;

  const stats = [
    {
      icon: <Sprout className="w-3.5 h-3.5" />,
      label: 'Active Plants',
      value: myPlants.length,
      color: 'text-botanical-primary',
    },
    {
      icon: <Droplets className="w-3.5 h-3.5 text-blue-400" />,
      label: 'Needs Water',
      value: needsWater,
      color: 'text-blue-600',
    },
    {
      icon: <Sun className="w-3.5 h-3.5 text-amber-400" />,
      label: 'Full Sun',
      value: fullSun,
      color: 'text-amber-600',
    },
    {
      icon: <Bell className="w-3.5 h-3.5 text-garden-400" />,
      label: 'Monitored',
      value: monitored,
      color: 'text-garden-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ icon, label, value, color }) => (
        <div
          key={label}
          className="glass-stat rounded-2xl p-4 text-center transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-1">
            {icon} {label}
          </div>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
