import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Droplets, CloudSun, CheckCircle2, AlertCircle, Clock, Thermometer, Wind } from 'lucide-react';

export default function Schedule() {
    const [scheduleData, setScheduleData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchSchedule(); }, []);

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

    const handleWaterPlant = async (gardenId) => {
        try {
            await api.put(`/garden/${gardenId}/water`);
            toast.success("Plant watered successfully!");
            fetchSchedule();
        } catch (error) {
            toast.error("Failed to update watering status.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-garden-200 border-t-garden-600 rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-400 font-medium">Loading schedule...</p>
                </div>
            </div>
        );
    }

    const overdueOrToday = scheduleData.tasks.filter(t => t.schedule.days_remaining <= 0);
    const upcoming = scheduleData.tasks.filter(t => t.schedule.days_remaining > 0);

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Weather Widget */}
                <div className="card-premium p-6 mb-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Watering Schedule</h1>
                            <p className="text-gray-400 text-sm mt-1">Dynamically adjusted based on local weather</p>
                        </div>

                        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-sky-50 px-5 py-3.5 rounded-2xl border border-blue-100/60">
                            <div className="bg-blue-100 p-2 rounded-xl">
                                <CloudSun className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{scheduleData.location}</p>
                                <p className="text-xs text-blue-600">
                                    {scheduleData.weather
                                        ? `${scheduleData.weather.temp}°C · ${scheduleData.weather.condition} · ${scheduleData.weather.humidity}% humidity`
                                        : "Standard schedule (Weather sync pending)"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Needed Section */}
                <div className="mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="bg-red-100 p-1.5 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Needs Water Now</h2>
                        {overdueOrToday.length > 0 && (
                            <span className="badge-danger ml-2">{overdueOrToday.length}</span>
                        )}
                    </div>

                    {overdueOrToday.length === 0 ? (
                        <div className="card-premium p-10 text-center">
                            <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <p className="text-gray-500 font-medium">All caught up!</p>
                            <p className="text-gray-300 text-sm mt-1">Your plants are well hydrated</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {overdueOrToday.map((task, i) => (
                                <div 
                                    key={task.garden_id} 
                                    className="card-premium p-5 flex justify-between items-center relative overflow-hidden animate-fade-in-up"
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-red-500 rounded-r"></div>

                                    <div className="pl-3">
                                        <h3 className="font-bold text-gray-900">{task.nickname}</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">{task.plant_name} {task.location && `· ${task.location}`}</p>
                                        <span className="badge-neutral mt-2 !text-[10px]">
                                            <Clock className="w-2.5 h-2.5 mr-1" /> {task.schedule.reason}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className="badge-danger">{task.schedule.status}</span>
                                        <button
                                            onClick={() => handleWaterPlant(task.garden_id)}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-sky-600 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                                        >
                                            <Droplets className="w-3.5 h-3.5" /> Water Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Section */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-2 mb-5">
                        <div className="bg-gray-100 p-1.5 rounded-lg">
                            <Clock className="w-4 h-4 text-gray-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Upcoming</h2>
                    </div>

                    {upcoming.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No upcoming tasks — add plants to your garden first.</p>
                    ) : (
                        <div className="space-y-3">
                            {upcoming.map((task, i) => (
                                <div 
                                    key={task.garden_id} 
                                    className="card-premium p-5 flex justify-between items-center animate-fade-in-up"
                                    style={{ animationDelay: `${0.2 + i * 0.04}s` }}
                                >
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{task.nickname}</h3>
                                        <p className="text-xs text-gray-400">{task.plant_name}</p>
                                        <p className="text-[10px] text-gray-300 mt-1 italic">{task.schedule.reason}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="badge-success">{task.schedule.status}</span>
                                        <p className="text-[10px] text-gray-300 mt-1.5">
                                            {new Date(task.schedule.next_watering_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </p>
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