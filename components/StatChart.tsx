import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { PokemonStat } from '../types';

interface StatChartProps {
  stats: PokemonStat[];
}

const StatChart: React.FC<StatChartProps> = ({ stats }) => {
  const data = stats.map((s) => ({
    subject: s.stat.name.toUpperCase().replace('-', ' '),
    A: s.base_stat,
    fullMark: 255, 
  }));

  return (
    <div className="w-full h-64 font-bold">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#000" strokeWidth={1} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#000', fontSize: 12, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
          <Radar
            name="Stats"
            dataKey="A"
            stroke="#000"
            strokeWidth={3}
            fill="#fbbf24" /* Amber-400 */
            fillOpacity={0.8}
          />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: '#fff', 
                border: '2px solid #000', 
                boxShadow: '4px 4px 0px 0px #000',
                color: '#000',
                borderRadius: '0px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatChart;