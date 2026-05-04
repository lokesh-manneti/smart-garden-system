import { Droplets, Sun, Plus, Search } from 'lucide-react';
import PlantImage, { getCatalogImage } from './PlantImage';

/**
 * Filterable catalog grid. Lets users search, filter by sunlight, and add plants.
 */
export default function CatalogGrid({ catalog, searchQuery, onSearchChange, categoryFilter, onCategoryChange, onAdd }) {
  const sunlightCategories = ['All', 'Full Sun', 'Partial Sun', 'Low'];

  const filteredCatalog = catalog.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || plant.sunlight_need === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sunlightCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                categoryFilter === cat
                  ? 'botanical-gradient text-white shadow-sm'
                  : 'surface-card text-gray-500 ghost-border hover:text-botanical-primary'
              }`}
            >
              {cat === 'Full Sun' ? '☀️' : cat === 'Partial Sun' ? '⛅' : cat === 'Low' ? '🌙' : '🌿'} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Plant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCatalog.map((plant, i) => (
          <div
            key={plant.id}
            className="card-botanical overflow-hidden group animate-fade-in-up flex flex-col"
            style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
          >
            {/* Full-bleed image with fallback */}
            <div className="relative h-44 overflow-hidden">
              <PlantImage
                src={getCatalogImage(plant, i)}
                alt={plant.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              <div className="absolute top-3 right-3">
                <span
                  className={`badge ${
                    plant.sunlight_need === 'Full Sun'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      : plant.sunlight_need === 'Partial Sun'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                        : 'bg-gray-100 text-gray-600 border border-gray-200/60'
                  }`}
                >
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
                onClick={() => onAdd(plant)}
                className="mt-auto w-full py-2.5 rounded-full text-sm font-semibold text-botanical-primary glass-stat hover:bg-garden-50 transition-all duration-200"
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
  );
}
