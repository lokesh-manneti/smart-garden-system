import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Leaf, Droplets, Sun, Plus, Trash2, X, MapPin, Calendar, AlignLeft } from 'lucide-react';

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [myPlants, setMyPlants] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split('T')[0]); // Defaults to today (YYYY-MM-DD)

  useEffect(() => {
    fetchData();
  }, []);

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
      if (error.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openAddModal = (plant) => {
    setSelectedPlant(plant);
    setNickname(plant.name);
    setLocation('');
    setNotes('');
    setPlantedDate(new Date().toISOString().split('T')[0]);
  };

  const confirmAddPlant = async (e) => {
    e.preventDefault();
    try {
      // Ensure date is sent in ISO format for PostgreSQL
      const isoDate = new Date(plantedDate).toISOString();

      const response = await api.post('/garden/add', {
        plant_id: selectedPlant.id,
        nickname: nickname.trim() || selectedPlant.name,
        location: location.trim() || null,
        notes: notes.trim() || null,
        planted_date: isoDate
      });
      
      setMyPlants([...myPlants, response.data]);
      toast.success(`${nickname || selectedPlant.name} added to your garden!`);
      
      // Reset and close modal
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-garden-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Navbar
      <nav className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="bg-garden-100 p-2 rounded-lg">
            <Leaf className="w-6 h-6 text-garden-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Smart Garden</h1>
        </div>
        <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
          Sign Out
        </button>
      </nav> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isAdding ? 'Plant Catalog' : 'My Digital Garden'}
            </h2>
            <p className="text-gray-500 mt-1">
              {isAdding ? 'Browse and add new plants to your collection.' : `Tracking ${myPlants.length} plants.`}
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              isAdding ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-garden-600 text-white hover:bg-garden-700'
            }`}
          >
            {isAdding ? <><X className="w-5 h-5 mr-2" /> Cancel</> : <><Plus className="w-5 h-5 mr-2" /> Add New Plant</>}
          </button>
        </div>

        {isAdding ? (
          /* --- CATALOG VIEW --- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalog.map((plant) => (
              <div key={plant.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900">{plant.name}</h3>
                <p className="text-sm text-gray-500 italic mb-4">{plant.species}</p>
                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <div className="flex items-center"><Droplets className="w-4 h-4 text-blue-500 mr-2" /> Water every {plant.water_frequency_days} days</div>
                  <div className="flex items-center"><Sun className="w-4 h-4 text-yellow-500 mr-2" /> {plant.sunlight_need}</div>
                </div>
                <button 
                  onClick={() => openAddModal(plant)}
                  className="w-full bg-garden-50 text-garden-700 font-medium py-2 rounded-lg hover:bg-garden-100 transition-colors border border-garden-200"
                >
                  Add to Garden
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* --- MY GARDEN VIEW --- */
          <>
            {myPlants.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your garden is empty</h3>
                <p className="text-gray-500 mb-6">Start by adding some plants from the catalog.</p>
                <button onClick={() => setIsAdding(true)} className="bg-garden-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-garden-700 transition-colors">
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPlants.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-garden-100 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-garden-500"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{entry.nickname}</h3>
                        <p className="text-sm text-gray-500">{entry.plant_info.name}</p>
                      </div>
                      <button onClick={() => removeFromGarden(entry.id, entry.nickname)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100" title="Remove plant">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 mb-4 text-sm text-gray-700">
                      <div className="flex items-center"><Droplets className="w-4 h-4 text-blue-500 mr-2" /><span className="font-medium">Schedule:</span>&nbsp;Every {entry.plant_info.water_frequency_days} days</div>
                      <div className="flex items-center"><Sun className="w-4 h-4 text-yellow-500 mr-2" /><span className="font-medium">Light:</span>&nbsp;{entry.plant_info.sunlight_need}</div>
                      {entry.location && <div className="flex items-center"><MapPin className="w-4 h-4 text-red-400 mr-2" /><span className="font-medium">Location:</span>&nbsp;{entry.location}</div>}
                      <div className="flex items-center"><Calendar className="w-4 h-4 text-green-500 mr-2" /><span className="font-medium">Planted:</span>&nbsp;{new Date(entry.planted_date).toLocaleDateString()}</div>
                    </div>
                    
                    {entry.notes && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800 flex items-start">
                        <AlignLeft className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="italic">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* --- ADD PLANT MODAL --- */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add {selectedPlant.name}</h3>
            <p className="text-gray-500 text-sm mb-6">Track the details of your new plant.</p>
            
            <form onSubmit={confirmAddPlant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
                <input
                  type="text"
                  autoFocus
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-garden-500 outline-none"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={`e.g. Balcony ${selectedPlant.name}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-garden-500 outline-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Living Room"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planted Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-garden-500 outline-none"
                    value={plantedDate}
                    onChange={(e) => setPlantedDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-garden-500 outline-none resize-none"
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Where did you buy it? Any initial issues?"
                ></textarea>
              </div>

              <div className="flex space-x-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedPlant(null)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-garden-600 text-white font-medium rounded-lg hover:bg-garden-700 transition-colors"
                >
                  Save to Garden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}