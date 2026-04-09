import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Leaf, Droplets, Sun, Plus, Trash2, X, MapPin, Calendar, AlignLeft, UploadCloud, Pencil, Search, Filter, Sprout, Bell, BellOff } from 'lucide-react';

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [myPlants, setMyPlants] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Add Modal States
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Edit Modal States
  const [editingPlant, setEditingPlant] = useState(null);
  const [editNickname, setEditNickname] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gardenRes, catalogRes] = await Promise.all([
        api.get('/garden/'),
        api.get('/garden/catalog')
      ]);
      setMyPlants(gardenRes.data);
      setCatalog(catalogRes.data);
    } catch (error) {
      toast.error("Failed to load garden data.");
      if (error.response?.status === 401) { logout(); navigate('/login'); }
    } finally {
      setLoading(false);
    }
  };

  // Catalog filtering
  const sunlightCategories = ['All', 'Full Sun', 'Partial Sun', 'Low Light'];
  const filteredCatalog = catalog.filter((plant) => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          plant.species.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || plant.sunlight_need === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = (plant) => {
    setSelectedPlant(plant);
    setNickname(plant.name);
    setLocation('');
    setNotes('');
    setPlantedDate(new Date().toISOString().split('T')[0]);
    setFile(null);
    setPreview(null);
  };

  const confirmAddPlant = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('plant_id', selectedPlant.id);
      formData.append('nickname', nickname.trim() || selectedPlant.name);
      if (location.trim()) formData.append('location', location.trim());
      if (notes.trim()) formData.append('notes', notes.trim());
      formData.append('planted_date', new Date(plantedDate).toISOString());
      if (file) formData.append('image', file);

      const response = await api.post('/garden/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setMyPlants([...myPlants, response.data]);
      toast.success(`${nickname || selectedPlant.name} added to your garden!`);
      setSelectedPlant(null);
      setIsAdding(false);
    } catch (error) {
      toast.error("Failed to add plant.");
    }
  };

  const removeFromGarden = async (gardenId, plantName) => {
    try {
      await api.delete(`/garden/${gardenId}`);
      setMyPlants(myPlants.filter(p => p.id !== gardenId));
      toast.info(`${plantName} removed from garden.`);
    } catch (error) {
      toast.error("Failed to remove plant.");
    }
  };

  const toggleMute = async (gardenId, currentMute) => {
    try {
      const response = await api.put(`/garden/${gardenId}/mute`, { mute_notifications: !currentMute });
      setMyPlants(myPlants.map(p => p.id === gardenId ? response.data : p));
      toast.success(response.data.mute_notifications ? "Notifications muted" : "Notifications unmuted");
    } catch (error) {
      toast.error("Failed to update notification settings");
    }
  };

  const openEditModal = (entry) => {
    setEditingPlant(entry);
    setEditNickname(entry.nickname || '');
    setEditLocation(entry.location || '');
    setEditNotes(entry.notes || '');
    setEditFile(null);
    setEditPreview(entry.image_url || null);
  };

  const confirmEditPlant = async (e) => {
    e.preventDefault();
    if (!editingPlant) return;
    setEditSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('nickname', editNickname.trim());
      formData.append('location', editLocation.trim());
      formData.append('notes', editNotes.trim());
      if (editFile) formData.append('image', editFile);

      const response = await api.put(`/garden/${editingPlant.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMyPlants(myPlants.map(p => p.id === editingPlant.id ? response.data : p));
      toast.success(`${editNickname || 'Plant'} updated!`);
      setEditingPlant(null);
    } catch (error) {
      toast.error("Failed to update plant.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const getSunlightBadge = (sunlight) => {
    if (sunlight === 'Full Sun') return 'badge-warning';
    if (sunlight === 'Partial Sun') return 'badge-info';
    return 'badge-neutral';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-garden-200 border-t-garden-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium">Loading your garden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isAdding ? 'Plant Catalog' : 'My Garden'}
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              {isAdding ? `${filteredCatalog.length} plants available` : `Caring for ${myPlants.length} plants`}
            </p>
          </div>
          <button
            onClick={() => { setIsAdding(!isAdding); setSearchQuery(''); setCategoryFilter('All'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              isAdding 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'btn-primary'
            }`}
          >
            {isAdding ? <><X className="w-4 h-4" /> Close Catalog</> : <><Plus className="w-4 h-4" /> Add Plant</>}
          </button>
        </div>

        {isAdding ? (
          /* ─── CATALOG VIEW ─── */
          <div className="animate-fade-in">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search plants..."
                  className="input-premium !pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sunlightCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      categoryFilter === cat
                        ? 'bg-garden-600 text-white shadow-sm'
                        : 'bg-white text-gray-500 border border-gray-200 hover:border-garden-300 hover:text-garden-600'
                    }`}
                  >
                    {cat === 'Full Sun' ? '☀️' : cat === 'Partial Sun' ? '⛅' : cat === 'Low Light' ? '🌙' : '🌿'} {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCatalog.map((plant, i) => (
                <div 
                  key={plant.id} 
                  className="card-premium overflow-hidden group animate-fade-in-up flex flex-col"
                  style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
                >
                  {/* Full-bleed image */}
                  <div className="relative h-44 overflow-hidden">
                    {plant.default_image_url ? (
                      <img 
                        src={plant.default_image_url} 
                        alt={plant.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-garden-50 to-teal-50 flex items-center justify-center">
                        <Leaf className="w-12 h-12 text-garden-200" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={getSunlightBadge(plant.sunlight_need)}>
                        {plant.sunlight_need}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{plant.name}</h3>
                    <p className="text-xs text-gray-400 italic mt-0.5 mb-3">{plant.species}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        Every {plant.water_frequency_days}d
                      </div>
                      <div className="flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        {plant.sunlight_need}
                      </div>
                    </div>

                    <button 
                      onClick={() => openAddModal(plant)}
                      className="mt-auto w-full py-2 rounded-xl text-sm font-semibold text-garden-700 bg-garden-50 hover:bg-garden-100 border border-garden-200/60 transition-all duration-200"
                    >
                      <Plus className="w-3.5 h-3.5 inline mr-1" /> Add to Garden
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCatalog.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No plants match your search</p>
                <p className="text-gray-300 text-sm mt-1">Try a different keyword or filter</p>
              </div>
            )}
          </div>
        ) : (
          /* ─── MY GARDEN VIEW ─── */
          <div className="animate-fade-in">
            {myPlants.length === 0 ? (
              <div className="text-center py-24 card-premium max-w-lg mx-auto">
                <div className="bg-garden-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Sprout className="w-10 h-10 text-garden-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Your garden is empty</h3>
                <p className="text-gray-400 mb-6 text-sm">Start by adding some plants from our catalog of 75+ Indian varieties.</p>
                <button onClick={() => setIsAdding(true)} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" /> Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPlants.map((entry, i) => (
                  <div 
                    key={entry.id} 
                    className="card-premium overflow-hidden group flex flex-col animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {/* Full-bleed image */}
                    <div className="relative h-52 overflow-hidden">
                      {entry.image_url ? (
                        <img src={entry.image_url} alt={entry.nickname} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-garden-50 via-teal-50 to-sage-50 flex items-center justify-center">
                          <Leaf className="w-16 h-16 text-garden-200" />
                        </div>
                      )}
                      {/* Hover actions */}
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button 
                          onClick={() => toggleMute(entry.id, entry.mute_notifications)} 
                          className={`p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm transition-colors ${entry.mute_notifications ? 'text-gray-400 hover:text-garden-500' : 'text-garden-500 hover:text-gray-400'}`}
                          title={entry.mute_notifications ? "Unmute alerts" : "Mute alerts"}
                        >
                          {entry.mute_notifications ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                        </button>
                        <button 
                          onClick={() => openEditModal(entry)} 
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-600 hover:text-garden-600 shadow-sm transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => removeFromGarden(entry.id, entry.nickname)} 
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-600 hover:text-red-500 shadow-sm transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {/* Gradient overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="p-5 flex-grow">
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{entry.nickname}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{entry.plant_info?.name}</p>
                      </div>

                      {/* Info pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="badge-info">
                          <Droplets className="w-3 h-3 mr-1" /> Every {entry.plant_info?.water_frequency_days}d
                        </span>
                        <span className={getSunlightBadge(entry.plant_info?.sunlight_need)}>
                          <Sun className="w-3 h-3 mr-1" /> {entry.plant_info?.sunlight_need}
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
                        Planted {new Date(entry.planted_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>

                      {/* Notes */}
                      {entry.notes && (
                        <div className="mt-3 p-3 bg-amber-50/60 border border-amber-100/60 rounded-xl text-xs text-amber-700 flex items-start gap-2">
                          <AlignLeft className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          <p className="italic line-clamp-2">{entry.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── ADD PLANT MODAL ─── */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-garden-100 p-2 rounded-xl">
                <Plus className="w-5 h-5 text-garden-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Add {selectedPlant.name}</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 ml-12">Track the details of your new plant.</p>
            
            <form onSubmit={confirmAddPlant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Nickname</label>
                <input
                  type="text" autoFocus
                  className="input-premium"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={`e.g. Balcony ${selectedPlant.name}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Plant Photo</label>
                <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="space-y-2 text-center">
                    {preview ? (
                      <div className="flex flex-col items-center">
                        <img src={preview} alt="Preview" className="h-28 w-28 object-cover rounded-xl shadow-sm mb-2" />
                        <span className="text-xs text-gray-400 font-medium truncate max-w-xs">{file?.name}</span>
                      </div>
                    ) : (
                      <UploadCloud className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                    )}
                    <div className="flex text-sm text-gray-500 justify-center">
                      <label htmlFor="add-file-upload" className="relative cursor-pointer font-medium text-garden-600 hover:text-garden-700 transition-colors">
                        <span>{preview ? 'Change photo' : 'Upload a photo'}</span>
                        <input id="add-file-upload" type="file" className="sr-only" accept="image/*"
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
                  <input type="text" className="input-premium" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Balcony" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Planted Date</label>
                  <input type="date" className="input-premium" value={plantedDate} onChange={(e) => setPlantedDate(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Notes</label>
                <textarea className="input-premium resize-none" rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Where did you buy it?"></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setSelectedPlant(null)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">Save to Garden</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT PLANT MODAL ─── */}
      {editingPlant && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-garden-100 p-2 rounded-xl">
                <Pencil className="w-5 h-5 text-garden-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Edit Plant</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 ml-12">Update {editingPlant.plant_info?.name || 'plant'} details.</p>
            
            <form onSubmit={confirmEditPlant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Nickname</label>
                <input type="text" autoFocus className="input-premium" value={editNickname} onChange={(e) => setEditNickname(e.target.value)} placeholder="Plant nickname" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Photo</label>
                <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="space-y-2 text-center">
                    {editPreview ? (
                      <div className="flex flex-col items-center">
                        <img src={editPreview} alt="Preview" className="h-28 w-28 object-cover rounded-xl shadow-sm mb-2" />
                        <span className="text-xs text-gray-400 font-medium">{editFile?.name || 'Current photo'}</span>
                      </div>
                    ) : (
                      <UploadCloud className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                    )}
                    <label htmlFor="edit-file-upload" className="relative cursor-pointer font-medium text-sm text-garden-600 hover:text-garden-700 transition-colors">
                      <span>{editPreview ? 'Change photo' : 'Upload a photo'}</span>
                      <input id="edit-file-upload" type="file" className="sr-only" accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setEditFile(e.target.files[0]);
                            setEditPreview(URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Location</label>
                <input type="text" className="input-premium" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} placeholder="e.g. Kitchen Window" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Notes</label>
                <textarea className="input-premium resize-none" rows="2" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Any updates?"></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditingPlant(null)} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={editSubmitting} className="btn-primary disabled:opacity-50">
                  {editSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}