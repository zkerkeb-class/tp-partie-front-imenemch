import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Pokemon } from '../types';

interface StatChartProps {
  base: Pokemon['base'];
}

const StatChart: React.FC<StatChartProps> = ({ base }) => {
  const data = [
    { subject: 'HP', A: base.HP, fullMark: 255 },
    { subject: 'ATTACK', A: base.Attack, fullMark: 255 },
    { subject: 'DEFENSE', A: base.Defense, fullMark: 255 },
    { subject: 'SP ATK', A: base.SpecialAttack, fullMark: 255 },
    { subject: 'SP DEF', A: base.SpecialDefense, fullMark: 255 },
    { subject: 'SPEED', A: base.Speed, fullMark: 255 },
  ];

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
            fill="#fbbf24"
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
