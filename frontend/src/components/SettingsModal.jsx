import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { X, Bell, Mail, Save } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [notificationTime, setNotificationTime] = useState('08:00:00');

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      setFirstName(res.data.first_name || '');
      setLastName(res.data.last_name || '');
      setMarketingConsent(res.data.marketing_consent !== false);
      setNotificationTime(res.data.notification_time || '08:00:00');
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/auth/settings', {
        first_name: firstName,
        last_name: lastName,
        marketing_consent: marketingConsent,
        notification_time: notificationTime
      });
      toast.success('Settings saved successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-garden-100 p-2 rounded-xl">
              <Bell className="w-5 h-5 text-garden-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Your Settings</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-3 border-garden-200 border-t-garden-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={saveSettings} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">First Name</label>
                <input type="text" className="input-premium text-sm" value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Last Name</label>
                <input type="text" className="input-premium text-sm" value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Daily Digest Time</label>
              <input 
                type="time" 
                className="input-premium text-sm" 
                value={notificationTime ? notificationTime.substring(0, 5) : '08:00'} 
                onChange={e => setNotificationTime(e.target.value ? e.target.value + ':00' : '08:00:00')} 
              />
              <p className="text-xs text-gray-400 mt-1.5 ml-1">When should we send your watering alerts and daily tips?</p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center pt-0.5">
                  <input type="checkbox" className="sr-only" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} />
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${marketingConsent ? 'bg-garden-500 border-garden-500' : 'border-gray-300 group-hover:border-garden-400'}`}>
                    <svg className={`w-3.5 h-3.5 text-white transition-opacity ${marketingConsent ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Daily Garden Digest</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Receive daily emails with personalized watering schedules, weather forecasts, and expert gardening tips.</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-6">
              <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><Save className="w-4 h-4" /> Save Preferences</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
