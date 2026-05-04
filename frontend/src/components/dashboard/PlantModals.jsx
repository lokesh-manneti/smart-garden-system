import { Plus, Pencil, UploadCloud, X } from 'lucide-react';
import { useState } from 'react';

/**
 * Modal for adding a new plant to the garden.
 */
export function AddPlantModal({ plant, onClose, onSubmit }) {
  const [nickname, setNickname] = useState(plant.name);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nickname, location, notes, plantedDate, file, plant });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="surface-card rounded-4xl shadow-ambient p-7 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto ghost-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="botanical-gradient p-2 rounded-xl shadow-sm">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-botanical-primary">Add {plant.name}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-6 ml-12">Track the details of your new plant.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Nickname</label>
            <input
              type="text"
              autoFocus
              className="input-premium"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={`e.g. Balcony ${plant.name}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Plant Photo</label>
            <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-4xl surface-section hover:bg-gray-100/60 transition-colors cursor-pointer">
              <div className="space-y-2 text-center">
                {preview ? (
                  <div className="flex flex-col items-center">
                    <img src={preview} alt="Preview" className="h-28 w-28 object-cover rounded-2xl shadow-sm mb-2" />
                    <span className="text-xs text-gray-400 font-medium truncate max-w-xs">{file?.name}</span>
                  </div>
                ) : (
                  <UploadCloud className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                )}
                <div className="flex text-sm text-gray-500 justify-center">
                  <label
                    htmlFor="add-file-upload"
                    className="relative cursor-pointer font-medium text-botanical-primary hover:text-garden-700 transition-colors"
                  >
                    <span>{preview ? 'Change photo' : 'Upload a photo'}</span>
                    <input
                      id="add-file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFile(e.target.files[0]);
                          setPreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />
                  </label>
                </div>
                {!preview && <p className="text-xs text-gray-300">PNG, JPG up to 5MB</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Location</label>
              <input
                type="text"
                className="input-premium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Balcony"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Planted Date</label>
              <input
                type="date"
                className="input-premium"
                value={plantedDate}
                onChange={(e) => setPlantedDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Notes</label>
            <textarea
              className="input-premium resize-none"
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Where did you buy it?"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save to Garden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Modal for editing an existing garden plant.
 */
export function EditPlantModal({ entry, onClose, onSubmit }) {
  const [nickname, setNickname] = useState(entry.nickname || '');
  const [location, setLocation] = useState(entry.location || '');
  const [notes, setNotes] = useState(entry.notes || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(entry.image_url || null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ nickname, location, notes, file, entry });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="surface-card rounded-4xl shadow-ambient p-7 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto ghost-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="botanical-gradient p-2 rounded-xl shadow-sm">
            <Pencil className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-botanical-primary">Edit Plant</h3>
        </div>
        <p className="text-gray-400 text-sm mb-6 ml-12">
          Update {entry.plant_info?.name || 'plant'} details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Nickname</label>
            <input
              type="text"
              autoFocus
              className="input-premium"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Plant nickname"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Photo</label>
            <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-4xl surface-section hover:bg-gray-100/60 transition-colors">
              <div className="space-y-2 text-center">
                {preview ? (
                  <div className="flex flex-col items-center">
                    <img src={preview} alt="Preview" className="h-28 w-28 object-cover rounded-2xl shadow-sm mb-2" />
                    <span className="text-xs text-gray-400 font-medium">{file?.name || 'Current photo'}</span>
                  </div>
                ) : (
                  <UploadCloud className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                )}
                <label
                  htmlFor="edit-file-upload"
                  className="relative cursor-pointer font-medium text-sm text-botanical-primary hover:text-garden-700 transition-colors"
                >
                  <span>{preview ? 'Change photo' : 'Upload a photo'}</span>
                  <input
                    id="edit-file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                        setPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Location</label>
            <input
              type="text"
              className="input-premium"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kitchen Window"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Notes</label>
            <textarea
              className="input-premium resize-none"
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any updates?"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
