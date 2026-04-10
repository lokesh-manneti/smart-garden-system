import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Settings, X, Clock, MapPin, Save } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [notificationTime, setNotificationTime] = useState('08:00');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchSettings();
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/auth/me');
      const user = response.data;
      if (user.notification_time) {
        setNotificationTime(user.notification_time.substring(0, 5));
      }
      if (user.city) setCity(user.city);
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await api.put('/auth/settings', {
        notification_time: notificationTime + ':00',
        city: city.trim(),
      });
      toast.success("Settings saved!");
      onClose();
    } catch (error) {
      toast.error("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="surface-card rounded-4xl shadow-ambient p-7 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto ghost-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="botanical-gradient p-2 rounded-xl shadow-sm">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-botanical-primary">Settings</h3>
              <p className="text-xs text-gray-400">Customize your garden experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="space-y-5">

          {/* Daily Digest Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 text-botanical-primary" />
              Daily Digest Time
            </label>
            <p className="text-xs text-gray-400 mb-2">When should we send your daily garden tips email?</p>
            <input
              type="time"
              className="input-premium"
              value={notificationTime}
              onChange={(e) => setNotificationTime(e.target.value)}
            />
          </div>

          {/* City */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 text-botanical-primary" />
              Your City
            </label>
            <p className="text-xs text-gray-400 mb-2">Used for weather-based watering adjustments.</p>
            <input
              type="text"
              className="input-premium"
              placeholder="e.g. Hyderabad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end mt-8 pt-5 border-t border-gray-100">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button
            onClick={saveSettings}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Save Settings</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
