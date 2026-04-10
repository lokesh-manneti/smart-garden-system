import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Leaf, Droplets, Sun, Plus, Trash2, X, MapPin, Calendar, AlignLeft, UploadCloud, Pencil, Search, Sprout, Bell, BellOff, Thermometer, Wind } from 'lucide-react';

/* Unsplash fallback images for plants without photos */
const PLANT_FALLBACKS = [
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80',
  'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=80',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
  'https://images.unsplash.com/photo-1501004318855-fce86ee69b5d?w=600&q=80',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80',
  'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&q=80',
];

const getPlantImage = (entry, index) => {
  if (entry.image_url) return entry.image_url;
  if (entry.plant_info?.default_image_url) return entry.plant_info.default_image_url;
  return PLANT_FALLBACKS[index % PLANT_FALLBACKS.length];
};

const getCatalogImage = (plant, index) => {
  if (plant.default_image_url) return plant.default_image_url;
  return PLANT_FALLBACKS[index % PLANT_FALLBACKS.length];
};

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-garden-200 border-t-botanical-primary rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading your conservatory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ═══ CONSERVATORY HEADER ═══ */}
        {!isAdding && (
          <div className="card-premium p-6 mb-10 ghost-border animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-botanical-primary tracking-widest uppercase mb-1">AI-Powered Growth Monitoring</p>
                <h1 className="text-3xl font-bold text-botanical-primary tracking-editorial">My Conservatory</h1>
              </div>
              <button
                onClick={() => { setIsAdding(true); setSearchQuery(''); setCategoryFilter('All'); }}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" /> Expand Garden
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="surface-section rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-1">
                  <Sprout className="w-3.5 h-3.5" /> Active Plants
                </div>
                <p className="text-2xl font-bold text-botanical-primary">{myPlants.length}</p>
              </div>
              <div className="surface-section rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" /> Needs Water
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {myPlants.filter(p => {
                    const daysSinceWatered = Math.floor((Date.now() - new Date(p.last_watered_date).getTime()) / (1000*60*60*24));
                    return daysSinceWatered >= (p.plant_info?.water_frequency_days || 7);
                  }).length}
                </p>
              </div>
              <div className="surface-section rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Full Sun
                </div>
                <p className="text-2xl font-bold text-amber-600">
                  {myPlants.filter(p => p.plant_info?.sunlight_need === 'Full Sun').length}
                </p>
              </div>
              <div className="surface-section rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-1">
                  <Bell className="w-3.5 h-3.5 text-garden-400" /> Monitored
                </div>
                <p className="text-2xl font-bold text-garden-600">
                  {myPlants.filter(p => !p.mute_notifications).length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PAGE TOGGLE HEADER (Catalog Mode) ═══ */}
        {isAdding && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-botanical-primary tracking-editorial">Plant Catalog</h2>
              <p className="text-gray-400 mt-1 text-sm">{filteredCatalog.length} species available</p>
            </div>
            <button
              onClick={() => { setIsAdding(false); setSearchQuery(''); setCategoryFilter('All'); }}
              className="btn-secondary"
            >
              <X className="w-4 h-4 mr-2" /> Back to Garden
            </button>
          </div>
        )}

        {isAdding ? (
          /* ═══ CATALOG VIEW ═══ */
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
                    className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      categoryFilter === cat
                        ? 'botanical-gradient text-white shadow-sm'
                        : 'surface-card text-gray-500 ghost-border hover:text-botanical-primary'
                    }`}
                  >
                    {cat === 'Full Sun' ? '☀️' : cat === 'Partial Sun' ? '⛅' : cat === 'Low Light' ? '🌙' : '🌿'} {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCatalog.map((plant, i) => (
                <div
                  key={plant.id}
                  className="card-premium overflow-hidden group animate-fade-in-up flex flex-col"
                  style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
                >
                  {/* Full-bleed image — ALWAYS present */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={getCatalogImage(plant, i)}
                      alt={plant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className={`badge ${plant.sunlight_need === 'Full Sun' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' : plant.sunlight_need === 'Partial Sun' ? 'bg-sky-50 text-sky-700 border border-sky-200/60' : 'bg-gray-100 text-gray-600 border border-gray-200/60'}`}>
                        {plant.sunlight_need}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="font-bold text-botanical-on-surface text-sm leading-tight">{plant.name}</h3>
                    <p className="text-xs text-gray-400 italic mt-0.5 mb-4">{plant.species}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-5">
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
                      className="mt-auto w-full py-2.5 rounded-full text-sm font-semibold text-botanical-primary surface-section hover:bg-garden-50 transition-all duration-200"
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
          /* ═══ MY GARDEN — STITCH CARD GRID ═══ */
          <div className="animate-fade-in">
            {myPlants.length === 0 ? (
              <div className="text-center py-24 card-premium max-w-lg mx-auto ghost-border">
                <div className="surface-section w-20 h-20 rounded-4xl flex items-center justify-center mx-auto mb-5">
                  <Sprout className="w-10 h-10 text-garden-300" />
                </div>
                <h3 className="text-lg font-bold text-botanical-on-surface mb-2">Your conservatory is empty</h3>
                <p className="text-gray-400 mb-6 text-sm">Start by adding plants from our catalog of 75+ Indian varieties.</p>
                <button onClick={() => setIsAdding(true)} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" /> Expand Garden
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
                    {/* Full-bleed image — ALWAYS rendered with Unsplash fallback */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={getPlantImage(entry, i)}
                        alt={entry.nickname}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Hover action overlay */}
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={() => toggleMute(entry.id, entry.mute_notifications)}
                          className={`p-2 glass rounded-xl shadow-sm transition-colors ${entry.mute_notifications ? 'text-gray-400 hover:text-garden-500' : 'text-garden-500 hover:text-gray-400'}`}
                          title={entry.mute_notifications ? "Unmute alerts" : "Mute alerts"}
                        >
                          {entry.mute_notifications ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => openEditModal(entry)}
                          className="p-2 glass rounded-xl text-gray-600 hover:text-botanical-primary shadow-sm transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeFromGarden(entry.id, entry.nickname)}
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
                        <span className={`badge ${entry.plant_info?.sunlight_need === 'Full Sun' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' : entry.plant_info?.sunlight_need === 'Partial Sun' ? 'bg-sky-50 text-sky-700 border border-sky-200/60' : 'bg-gray-100 text-gray-600 border border-gray-200/60'}`}>
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
                        <div className="mt-3 p-3 bg-amber-50/60 ghost-border rounded-2xl text-xs text-amber-700 flex items-start gap-2">
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

      {/* ═══ ADD PLANT MODAL ═══ */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="surface-card rounded-4xl shadow-ambient p-7 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto ghost-border">
            <div className="flex items-center gap-3 mb-1">
              <div className="botanical-gradient p-2 rounded-xl shadow-sm">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-botanical-primary">Add {selectedPlant.name}</h3>
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
                      <label htmlFor="add-file-upload" className="relative cursor-pointer font-medium text-botanical-primary hover:text-garden-700 transition-colors">
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
                <textarea className="input-premium resize-none" rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Where did you buy it?" />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setSelectedPlant(null)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">Save to Garden</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ EDIT PLANT MODAL ═══ */}
      {editingPlant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="surface-card rounded-4xl shadow-ambient p-7 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto ghost-border">
            <div className="flex items-center gap-3 mb-1">
              <div className="botanical-gradient p-2 rounded-xl shadow-sm">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-botanical-primary">Edit Plant</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 ml-12">Update {editingPlant.plant_info?.name || 'plant'} details.</p>

            <form onSubmit={confirmEditPlant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Nickname</label>
                <input type="text" autoFocus className="input-premium" value={editNickname} onChange={(e) => setEditNickname(e.target.value)} placeholder="Plant nickname" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Photo</label>
                <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-4xl surface-section hover:bg-gray-100/60 transition-colors">
                  <div className="space-y-2 text-center">
                    {editPreview ? (
                      <div className="flex flex-col items-center">
                        <img src={editPreview} alt="Preview" className="h-28 w-28 object-cover rounded-2xl shadow-sm mb-2" />
                        <span className="text-xs text-gray-400 font-medium">{editFile?.name || 'Current photo'}</span>
                      </div>
                    ) : (
                      <UploadCloud className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                    )}
                    <label htmlFor="edit-file-upload" className="relative cursor-pointer font-medium text-sm text-botanical-primary hover:text-garden-700 transition-colors">
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
                <textarea className="input-premium resize-none" rows="2" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Any updates?" />
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