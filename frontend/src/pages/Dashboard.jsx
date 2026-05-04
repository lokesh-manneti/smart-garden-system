import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Plus, X, Sprout } from 'lucide-react';

// Extracted components
import StatsCards from '../components/dashboard/StatsCards';
import PlantCard from '../components/dashboard/PlantCard';
import CatalogGrid from '../components/dashboard/CatalogGrid';
import { AddPlantModal, EditPlantModal } from '../components/dashboard/PlantModals';

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [myPlants, setMyPlants] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal targets
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [editingPlant, setEditingPlant] = useState(null);

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

  // ── Handlers ──────────────────────────────────────────────────

  const handleAddPlant = async ({ nickname, location, notes, plantedDate, file, plant }) => {
    try {
      const formData = new FormData();
      formData.append('plant_id', plant.id);
      formData.append('nickname', nickname.trim() || plant.name);
      if (location.trim()) formData.append('location', location.trim());
      if (notes.trim()) formData.append('notes', notes.trim());
      formData.append('planted_date', new Date(plantedDate).toISOString());
      if (file) formData.append('image', file);

      const response = await api.post('/garden/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMyPlants(prev => [...prev, response.data]);
      toast.success(`${nickname || plant.name} added to your garden!`);
      setSelectedPlant(null);
      setIsAdding(false);
    } catch {
      toast.error("Failed to add plant.");
    }
  };

  const handleEditPlant = async ({ nickname, location, notes, file, entry }) => {
    try {
      const formData = new FormData();
      formData.append('nickname', nickname.trim());
      formData.append('location', location.trim());
      formData.append('notes', notes.trim());
      if (file) formData.append('image', file);

      const response = await api.put(`/garden/${entry.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMyPlants(prev => prev.map(p => p.id === entry.id ? response.data : p));
      toast.success(`${nickname || 'Plant'} updated!`);
      setEditingPlant(null);
    } catch {
      toast.error("Failed to update plant.");
    }
  };

  const removeFromGarden = async (gardenId, plantName) => {
    try {
      await api.delete(`/garden/${gardenId}`);
      setMyPlants(prev => prev.filter(p => p.id !== gardenId));
      toast.info(`${plantName} removed from garden.`);
    } catch {
      toast.error("Failed to remove plant.");
    }
  };

  const toggleMute = async (gardenId, currentMute) => {
    try {
      const response = await api.put(`/garden/${gardenId}/mute`, { mute_notifications: !currentMute });
      setMyPlants(prev => prev.map(p => p.id === gardenId ? response.data : p));
      toast.success(response.data.mute_notifications ? "Notifications muted" : "Notifications unmuted");
    } catch {
      toast.error("Failed to update notification settings");
    }
  };

  // ── Render ────────────────────────────────────────────────────

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
          <div className="card-botanical p-6 mb-10 ghost-border animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-botanical-primary tracking-widest uppercase mb-1">
                  AI-Powered Growth Monitoring
                </p>
                <h1 className="text-3xl font-bold text-botanical-primary tracking-editorial">My Conservatory</h1>
              </div>
              <button
                onClick={() => { setIsAdding(true); setSearchQuery(''); setCategoryFilter('All'); }}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" /> Expand Garden
              </button>
            </div>
            <StatsCards myPlants={myPlants} />
          </div>
        )}

        {/* ═══ PAGE TOGGLE HEADER (Catalog Mode) ═══ */}
        {isAdding && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-botanical-primary tracking-editorial">Plant Catalog</h2>
              <p className="text-gray-400 mt-1 text-sm">{catalog.length} species available</p>
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
          <CatalogGrid
            catalog={catalog}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            onAdd={setSelectedPlant}
          />
        ) : (
          /* ═══ MY GARDEN — PLANT GRID ═══ */
          <div className="animate-fade-in">
            {myPlants.length === 0 ? (
              <div className="text-center py-24 card-botanical max-w-lg mx-auto ghost-border">
                <div className="glass-stat w-20 h-20 rounded-4xl flex items-center justify-center mx-auto mb-5">
                  <Sprout className="w-10 h-10 text-garden-300" />
                </div>
                <h3 className="text-lg font-bold text-botanical-on-surface mb-2">Your conservatory is empty</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Start by adding plants from our catalog of 25+ curated species.
                </p>
                <button onClick={() => setIsAdding(true)} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" /> Expand Garden
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPlants.map((entry, i) => (
                  <PlantCard
                    key={entry.id}
                    entry={entry}
                    index={i}
                    onEdit={setEditingPlant}
                    onRemove={removeFromGarden}
                    onToggleMute={toggleMute}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ═══ MODALS ═══ */}
      {selectedPlant && (
        <AddPlantModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onSubmit={handleAddPlant}
        />
      )}

      {editingPlant && (
        <EditPlantModal
          entry={editingPlant}
          onClose={() => setEditingPlant(null)}
          onSubmit={handleEditPlant}
        />
      )}
    </div>
  );
}