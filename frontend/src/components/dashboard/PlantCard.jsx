import { Droplets, Sun, MapPin, Calendar, AlignLeft, Bell, BellOff, Pencil, Trash2 } from 'lucide-react';
import PlantImage, { getPlantImage } from './PlantImage';

/**
 * A single plant card in the "My Garden" grid.
 * Shows image with hover action overlay, info pills, and notes.
 */
export default function PlantCard({ entry, index, onEdit, onRemove, onToggleMute }) {
  const sunlightNeed = entry.plant_info?.sunlight_need;

  const sunlightBadgeClass =
    sunlightNeed === 'Full Sun'
      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
      : sunlightNeed === 'Partial Sun'
        ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
        : 'bg-gray-100 text-gray-600 border border-gray-200/60';

  return (
    <div
      className="card-botanical overflow-hidden group flex flex-col animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Full-bleed image with fallback */}
      <div className="relative h-56 overflow-hidden">
        <PlantImage
          src={getPlantImage(entry, index)}
          alt={entry.nickname}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover action overlay */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={() => onToggleMute(entry.id, entry.mute_notifications)}
            className={`p-2 glass rounded-xl shadow-sm transition-colors ${
              entry.mute_notifications
                ? 'text-gray-400 hover:text-garden-500'
                : 'text-garden-500 hover:text-gray-400'
            }`}
            title={entry.mute_notifications ? 'Unmute alerts' : 'Mute alerts'}
          >
            {entry.mute_notifications ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onEdit(entry)}
            className="p-2 glass rounded-xl text-gray-600 hover:text-botanical-primary shadow-sm transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onRemove(entry.id, entry.nickname)}
            className="p-2 glass rounded-xl text-gray-600 hover:text-red-500 shadow-sm transition-colors"
            title="Remove"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom gradient for text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 via-black/15 to-transparent" />

        {/* Nickname overlay on image */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-lg font-bold text-white drop-shadow-sm leading-tight">{entry.nickname}</h3>
          <p className="text-xs text-white/80 mt-0.5">{entry.plant_info?.name}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex-grow">
        {/* Info pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="badge-info">
            <Droplets className="w-3 h-3 mr-1" /> Every {entry.plant_info?.water_frequency_days}d
          </span>
          <span className={`badge ${sunlightBadgeClass}`}>
            <Sun className="w-3 h-3 mr-1" /> {sunlightNeed}
          </span>
          {entry.location && (
            <span className="badge-neutral">
              <MapPin className="w-3 h-3 mr-1" /> {entry.location}
            </span>
          )}
        </div>

        {/* Planted date */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          Planted{' '}
          {new Date(entry.planted_date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </div>

        {/* Notes */}
        {entry.notes && (
          <div className="mt-3 p-3 bg-amber-50/60 ghost-border rounded-2xl text-xs text-amber-700 flex items-start gap-2">
            <AlignLeft className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <p className="italic line-clamp-2">{entry.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
