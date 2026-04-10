import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { UploadCloud, Activity, Leaf, AlertCircle, Clock, Shield, Sparkles } from 'lucide-react';

export default function PlantDoctor() {
  const [file, setFile] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('');
  const [myPlants, setMyPlants] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchGardenAndHistory(); }, []);

  const fetchGardenAndHistory = async () => {
    try {
      const [gardenRes, historyRes] = await Promise.all([
        api.get('/garden/'),
        api.get('/doctor/history')
      ]);
      setMyPlants(gardenRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDiagnose = async (e) => {
    e.preventDefault();
    if (!file || !symptoms.trim()) {
      toast.error('Please provide both an image and symptoms.');
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('symptoms', symptoms);
      if (selectedPlant) formData.append('plant_name', selectedPlant);

      const response = await api.post('/doctor/diagnose', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      toast.success('Diagnosis complete!');
      fetchGardenAndHistory();
    } catch (error) {
      if (error.response?.status === 503) {
        toast.error('The AI Doctor is experiencing high traffic. Please try again in a few minutes.');
      } else {
        toast.error('Failed to analyze plant. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    const pct = confidence * 100;
    if (pct >= 80) return { bar: 'from-green-400 to-emerald-500', badge: 'badge-success', label: 'High' };
    if (pct >= 50) return { bar: 'from-amber-400 to-orange-500', badge: 'badge-warning', label: 'Medium' };
    return { bar: 'from-red-400 to-red-500', badge: 'badge-danger', label: 'Low' };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="botanical-gradient p-2.5 rounded-xl shadow-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-botanical-primary tracking-editorial">AI Plant Doctor</h2>
        </div>
        <p className="text-gray-400 text-sm ml-12">
          Upload a photo of your sick plant — Gemini AI will diagnose the issue and prescribe a treatment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Input Form */}
        <div className="card-premium p-6 animate-fade-in-up ghost-border">
          <form onSubmit={handleDiagnose} className="space-y-5">

            {/* Plant selector */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Select Plant <span className="text-gray-300">(optional)</span></label>
              <select
                className="input-premium"
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
              >
                <option value="">-- Choose from your garden --</option>
                {myPlants.map((plant) => (
                  <option key={plant.id} value={plant.nickname || plant.plant_info.name}>
                    {plant.nickname || plant.plant_info.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Plant Photo</label>
              <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-4xl surface-section hover:bg-gray-100/60 transition-colors">
                <div className="space-y-2 text-center">
                  {preview ? (
                    <div className="flex flex-col items-center">
                      <img src={preview} alt="Preview" className="h-32 w-32 object-cover rounded-2xl shadow-soft mb-2" />
                      <span className="text-xs text-gray-400 font-medium truncate max-w-xs">{file?.name}</span>
                    </div>
                  ) : (
                    <UploadCloud className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  )}
                  <label htmlFor="doctor-file-upload" className="relative cursor-pointer font-medium text-sm text-botanical-primary hover:text-garden-700 transition-colors">
                    <span>{preview ? 'Change photo' : 'Upload a photo'}</span>
                    <input id="doctor-file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
                  {!preview && <p className="text-xs text-gray-300">PNG, JPG up to 5MB</p>}
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Symptoms</label>
              <textarea
                rows={4}
                className="input-premium resize-none"
                placeholder="e.g., Leaves are turning yellow with brown spots on the edges..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing with Gemini...
                </div>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Diagnose Plant</>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        {result ? (
          <div className="card-premium p-6 animate-slide-up ghost-border">
            <h3 className="text-lg font-bold text-botanical-primary mb-5 flex items-center gap-2">
              <Shield className="w-5 h-5 text-garden-500" /> Diagnosis Results
            </h3>

            <div className="space-y-4">
              {/* Diagnosis */}
              <div className="bg-red-50/60 ghost-border p-5 rounded-4xl">
                <h4 className="text-sm font-bold text-red-700 flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4" /> Suspected Issue
                </h4>
                <p className="text-red-600 text-sm leading-relaxed">{result.diagnosis}</p>
              </div>

              {/* Treatment */}
              <div className="bg-blue-50/60 ghost-border p-5 rounded-4xl">
                <h4 className="text-sm font-bold text-blue-700 mb-2">Recommended Treatment</h4>
                <p className="text-blue-600 text-sm whitespace-pre-wrap leading-relaxed">{result.treatment}</p>
              </div>

              {/* Confidence */}
              <div className="surface-section ghost-border p-4 rounded-4xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">AI Confidence</span>
                  <span className={getConfidenceColor(result.confidence).badge}>
                    {getConfidenceColor(result.confidence).label} · {(result.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${getConfidenceColor(result.confidence).bar} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${Math.round(result.confidence * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-premium p-10 flex flex-col items-center justify-center text-center animate-fade-in ghost-border">
            <div className="surface-section w-16 h-16 rounded-4xl flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-garden-200" />
            </div>
            <h3 className="font-bold text-gray-400">No diagnosis yet</h3>
            <p className="text-sm text-gray-300 mt-1">Upload a photo and describe symptoms to get started</p>
          </div>
        )}
      </div>

      {/* Diagnostic History */}
      {history.length > 0 && (
        <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="surface-section p-1.5 rounded-lg">
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-botanical-primary">Recent Consultations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((record, i) => (
              <div
                key={record.id}
                className="card-premium p-5 animate-fade-in-up ghost-border"
                style={{ animationDelay: `${0.2 + i * 0.05}s` }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="badge-success !text-[10px]">
                    {record.plant_name || 'Unknown Plant'}
                  </span>
                  <span className="text-[10px] text-gray-300">
                    {new Date(record.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <h4 className="text-botanical-on-surface font-bold text-sm mb-1.5 line-clamp-2">{record.diagnosis}</h4>
                <p className="text-gray-400 text-xs line-clamp-2 mb-3">{record.treatment}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
                  <Shield className="w-3 h-3" />
                  Confidence: {(parseFloat(record.confidence) * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}