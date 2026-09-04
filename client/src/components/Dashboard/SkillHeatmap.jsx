import React, { useState, useEffect } from 'react';
import progressService from '../../services/progressService';

const SkillHeatmap = () => {
    const [heatmapData, setHeatmapData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHeatmap();
    }, []);

    const fetchHeatmap = async () => {
        try {
            const response = await progressService.getSkillHeatmap(14);
            setHeatmapData(response.data.heatmap);
        } catch (error) {
            console.error('Heatmap fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="card h-48 animate-pulse bg-dark-400" />;
    if (!heatmapData) return null;

    const { skills, dates, heatmapData: cells, legend } = heatmapData;

    // Intensity to color mapping
    const intensityColors = {
        0: '#1e1e2e',
        1: '#0e4429',
        2: '#006d32',
        3: '#26a641',
        4: '#39d353'
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
                🔥 Skill Heatmap (Last 14 Days)
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-xs text-dark-200 pb-2 pr-3">Skill</th>
                            {dates.map(date => (
                                <th key={date} className="text-center text-xs text-dark-200 pb-2 px-1">
                                    {new Date(date).getDate()}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map(skill => (
                            <tr key={skill}>
                                <td className="text-sm text-dark-100 pr-3 py-1 capitalize font-medium">
                                    {skill}
                                </td>
                                {dates.map(date => {
                                    const cell = cells.find(
                                        c => c.skill === skill && c.date === date
                                    );
                                    const intensity = cell?.intensity || 0;

                                    return (
                                        <td key={`${skill}-${date}`} className="px-0.5 py-0.5">
                                            <div
                                                className="w-6 h-6 rounded-sm cursor-pointer
                                                    transition-all duration-200 hover:scale-125
                                                    hover:ring-2 hover:ring-primary-500/50"
                                                style={{
                                                    backgroundColor: intensityColors[intensity]
                                                }}
                                                title={`${skill} - ${date}: ${cell?.timeSpent || 0} min`}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 justify-end">
                <span className="text-xs text-dark-200">Less</span>
                {legend.map(item => (
                    <div
                        key={item.level}
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: item.color }}
                        title={item.label}
                    />
                ))}
                <span className="text-xs text-dark-200">More</span>
            </div>
        </div>
    );
};

export default SkillHeatmap;