import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Droplets, CloudSun, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function Schedule() {
    const [scheduleData, setScheduleData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const response = await api.get('/schedule/');
            setScheduleData(response.data);
        } catch (error) {
            toast.error("Failed to load your watering schedule.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-garden-600"></div>
            </div>
        );
    }

    const handleWaterPlant = async (gardenId) => {
        try {
            // 1. Tell the backend we watered the plant
            await api.put(`/garden/${gardenId}/water`);
            toast.success("Plant watered successfully!");

            // 2. Refetch the schedule so it calculates the new dates
            fetchSchedule();
        } catch (error) {
            toast.error("Failed to update watering status.");
        }
    };

    // Group tasks into "Action Needed Now" and "Upcoming"
    const overdueOrToday = scheduleData.tasks.filter(t => t.schedule.days_remaining <= 0);
    const upcoming = scheduleData.tasks.filter(t => t.schedule.days_remaining > 0);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Weather Widget */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Smart Watering Schedule</h1>
                        <p className="text-gray-500">Dynamically adjusted based on local weather.</p>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
                        <CloudSun className="w-8 h-8 text-blue-500 mr-3" />
                        <div>
                            <p className="text-sm font-semibold text-blue-900">{scheduleData.location} Weather</p>
                            <p className="text-xs text-blue-700">
                                {scheduleData.weather
                                    ? `${scheduleData.weather.temp}°C, ${scheduleData.weather.condition} (Humidity: ${scheduleData.weather.humidity}%)`
                                    : "Using standard schedule (Weather sync pending...)"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Needed Section */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                        Needs Water Now
                    </h2>

                    {overdueOrToday.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center border border-dashed border-gray-300">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">All caught up! Your plants are hydrated.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {overdueOrToday.map((task) => (
                                <div key={task.garden_id} className="bg-white p-5 rounded-xl shadow-sm border border-red-100 flex justify-between items-center relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{task.nickname}</h3>
                                        <p className="text-sm text-gray-500">{task.plant_name} {task.location && `• ${task.location}`}</p>
                                        <div className="mt-2 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded inline-flex items-center">
                                            <Clock className="w-3 h-3 mr-1" /> {task.schedule.reason}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="block text-red-600 font-bold mb-2">{task.schedule.status}</span>
                                        <button
                                            onClick={() => handleWaterPlant(task.garden_id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
                                        >
                                            <Droplets className="w-4 h-4 mr-1" /> Mark Watered
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Section */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Clock className="w-6 h-6 text-gray-400 mr-2" />
                        Upcoming
                    </h2>

                    {upcoming.length === 0 ? (
                        <p className="text-gray-500 italic">No upcoming plants to water.</p>
                    ) : (
                        <div className="space-y-4">
                            {upcoming.map((task) => (
                                <div key={task.garden_id} className="bg-white p-5 rounded-xl border border-gray-200 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{task.nickname}</h3>
                                        <p className="text-sm text-gray-500">{task.plant_name}</p>
                                        <p className="text-xs text-gray-400 mt-1 italic">{task.schedule.reason}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-gray-600 font-medium">{task.schedule.status}</span>
                                        <span className="block text-xs text-gray-400 mt-1">
                                            {new Date(task.schedule.next_watering_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}