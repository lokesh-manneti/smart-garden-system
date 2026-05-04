import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Droplets, CloudSun, CheckCircle2, AlertCircle, Clock, Leaf, ThermometerSun, Wind, CalendarDays } from 'lucide-react';
import PlantImage from '../components/dashboard/PlantImage';

/* Unsplash fallbacks for schedule plant thumbnails */
const SCHEDULE_FALLBACKS = [
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&q=80',
  'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=200&q=80',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80',
  'https://images.unsplash.com/photo-1501004318855-fce86ee69b5d?w=200&q=80',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=200&q=80',
  'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=200&q=80',
];

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
                    <div className="w-10 h-10 border-3 border-garden-200 border-t-botanical-primary rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-400 font-medium">Calibrating hydration sensors...</p>
                </div>
            </div>
        );
    }

    const overdueOrToday = scheduleData.tasks.filter(t => t.schedule.days_remaining <= 0);
    const upcoming = scheduleData.tasks.filter(t => t.schedule.days_remaining > 0);
    const totalTasks = scheduleData.tasks.length;
    const efficiency = totalTasks > 0 ? Math.round(((totalTasks - overdueOrToday.length) / totalTasks) * 100) : 100;

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ═══ TOP HEADER CARD ═══ */}
                <div className="card-botanical ghost-border overflow-hidden mb-10 animate-fade-in">
                    {/* Header gradient bar */}
                    <div className="h-1.5 botanical-gradient" />

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-botanical-primary tracking-widest uppercase mb-2">
                                    Environmental Automation
                                </p>
                                <h1 className="text-3xl font-bold text-botanical-primary tracking-editorial mb-3">
                                    Hydration Schedule
                                </h1>
                                <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
                                    Your botanical ecosystem is currently operating at <span className="font-bold text-botanical-primary">{efficiency}%</span> efficiency. Environmental sensors have optimized today's tasks based on local humidity and solar intensity.
                                </p>
                            </div>

                            {/* Weather Widget */}
                            <div className="flex items-center gap-4 bg-gradient-to-br from-sky-50/80 via-blue-50/80 to-teal-50/80 px-6 py-5 rounded-4xl ghost-border glass-stat min-w-[280px]">
                                <div className="bg-blue-100 p-3 rounded-2xl flex-shrink-0">
                                    <CloudSun className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-botanical-on-surface">{scheduleData.location || 'Your City'}</p>
                                    {scheduleData.weather ? (
                                        <div className="flex flex-col gap-0.5 mt-1">
                                            <p className="text-xs text-blue-600 font-medium">
                                                {scheduleData.weather.temp}°C · {scheduleData.weather.condition}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                Humidity {scheduleData.weather.humidity}%
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 mt-0.5">Weather sync pending</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ ACTION REQUIRED TODAY ═══ */}
                <div className="mb-12 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-red-100 p-2 rounded-xl">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-botanical-primary">Action Required Today</h2>
                            <p className="text-xs text-gray-400">Plants that need immediate attention</p>
                        </div>
                        {overdueOrToday.length > 0 && (
                            <span className="badge-danger ml-auto">{overdueOrToday.length} plant{overdueOrToday.length > 1 ? 's' : ''}</span>
                        )}
                    </div>

                    {overdueOrToday.length === 0 ? (
                        <div className="card-botanical p-12 text-center ghost-border">
                            <div className="bg-green-50 w-16 h-16 rounded-4xl flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <p className="text-gray-600 font-semibold mb-1">All caught up!</p>
                            <p className="text-gray-400 text-sm">Your plants are well hydrated. No immediate action needed.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {overdueOrToday.map((task, i) => (
                                <div
                                    key={task.garden_id}
                                    className="card-botanical overflow-hidden flex items-stretch animate-fade-in-up ghost-border"
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                >
                                    {/* Left accent bar */}
                                    <div className="w-1.5 bg-gradient-to-b from-red-400 to-red-500 flex-shrink-0" />

                                    {/* Plant thumbnail */}
                                    <div className="w-20 h-20 flex-shrink-0 self-center ml-4 my-3">
                                        <PlantImage
                                            src={SCHEDULE_FALLBACKS[i % SCHEDULE_FALLBACKS.length]}
                                            alt={task.nickname}
                                            className="w-full h-full object-cover rounded-2xl"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-5 flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="font-bold text-botanical-on-surface text-base">{task.nickname}</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">{task.plant_name} {task.location && `· ${task.location}`}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="badge-neutral !text-[10px]">
                                                    <Clock className="w-2.5 h-2.5 mr-1" /> {task.schedule.reason}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            <span className="badge-danger">{task.schedule.status}</span>
                                            <button
                                                onClick={() => handleWaterPlant(task.garden_id)}
                                                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white text-sm font-semibold rounded-full hover:from-blue-600 hover:to-sky-600 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                                            >
                                                <Droplets className="w-3.5 h-3.5" /> Water Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ═══ UPCOMING SCHEDULE ═══ */}
                <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="surface-section p-2 rounded-xl">
                            <CalendarDays className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-botanical-primary">Upcoming Schedule</h2>
                            <p className="text-xs text-gray-400">Planned hydration events</p>
                        </div>
                    </div>

                    {upcoming.length === 0 ? (
                        <p className="text-gray-400 text-sm italic pl-12">No upcoming tasks — add plants to your garden first.</p>
                    ) : (
                        <div className="space-y-3">
                            {upcoming.map((task, i) => (
                                <div
                                    key={task.garden_id}
                                    className="card-botanical overflow-hidden flex items-stretch animate-fade-in-up ghost-border"
                                    style={{ animationDelay: `${0.15 + i * 0.04}s` }}
                                >
                                    {/* Left accent bar — green for upcoming */}
                                    <div className="w-1 bg-gradient-to-b from-garden-300 to-garden-400 flex-shrink-0" />

                                    {/* Plant thumbnail */}
                                    <div className="w-14 h-14 flex-shrink-0 self-center ml-4 my-3">
                                        <PlantImage
                                            src={SCHEDULE_FALLBACKS[i % SCHEDULE_FALLBACKS.length]}
                                            alt={task.nickname}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-4 flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="font-bold text-botanical-on-surface text-sm">{task.nickname}</h3>
                                            <p className="text-xs text-gray-400">{task.plant_name}</p>
                                            <p className="text-[10px] text-gray-300 mt-1 italic">{task.schedule.reason}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="badge-success">{task.schedule.status}</span>
                                            <p className="text-[10px] text-gray-300 mt-1.5">
                                                {new Date(task.schedule.next_watering_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ═══ CLIMATE ALERT ═══ */}
                <div className="card-botanical ghost-border overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-stretch">
                        <div className="w-1.5 bg-gradient-to-b from-amber-400 to-orange-400 flex-shrink-0" />
                        <div className="p-6 flex items-start gap-4">
                            <div className="bg-amber-50 p-2.5 rounded-xl flex-shrink-0">
                                <ThermometerSun className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-botanical-on-surface mb-1">Climate Alert</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {scheduleData.weather
                                        ? `Current conditions: ${scheduleData.weather.temp}°C with ${scheduleData.weather.humidity}% humidity. AI suggests adjusting misting frequency for tropical species.`
                                        : 'Connect your city in Settings to receive personalized climate alerts and AI-optimized watering recommendations.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}