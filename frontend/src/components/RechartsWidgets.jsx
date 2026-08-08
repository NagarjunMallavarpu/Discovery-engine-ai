import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';

export function RevenueTrendChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
          <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} fontWeight={600} />
          <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `₹${v/1000}k`} fontWeight={600} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
            formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Sales Revenue']}
          />
          <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IntentPieChart({ data }) {
  if (!data || data.length === 0) return null;
  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={6}
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--bg-card)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem', fontSize: '0.78rem', fontWeight: 700 }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[idx % COLORS.length] }} />
            <span>{item.name}: {item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecommendationConversionChart() {
  const conversionData = [
    { type: 'Category Rec', clicks: 450, sales: 120 },
    { type: 'Brand Similar', clicks: 380, sales: 95 },
    { type: 'AI Intent', clicks: 620, sales: 210 },
    { type: 'Explainable AI', clicks: 790, sales: 340 }
  ];

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={conversionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
          <XAxis dataKey="type" stroke="var(--text-muted)" fontSize={11} fontWeight={600} />
          <YAxis stroke="var(--text-muted)" fontSize={11} fontWeight={600} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
          />
          <Bar dataKey="clicks" name="Recommendation Clicks" fill="#6366f1" radius={[6, 6, 0, 0]} />
          <Bar dataKey="sales" name="Converted Purchases" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SearchKeywordsChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
          <XAxis type="number" stroke="var(--text-muted)" fontSize={11} fontWeight={600} />
          <YAxis dataKey="keyword" type="category" stroke="var(--text-muted)" fontSize={11} width={90} fontWeight={600} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)' }}
            formatter={(val) => [`${val} searches`, 'Volume']}
          />
          <Bar dataKey="count" fill="#818cf8" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SearchVolumeTrendChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
          <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} fontWeight={600} />
          <YAxis stroke="var(--text-muted)" fontSize={12} fontWeight={600} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)' }}
          />
          <Area type="monotone" dataKey="searches" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSearches)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CustomerFunnelChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
          <XAxis dataKey="step" stroke="var(--text-muted)" fontSize={11} fontWeight={600} />
          <YAxis stroke="var(--text-muted)" fontSize={11} fontWeight={600} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)' }}
            formatter={(val, name, item) => [`${val} Users (${item.payload.percentage}% of Traffic)`, 'Funnel Count']}
          />
          <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RecFeedbackFunnelChart({ data }) {
  if (!data || data.length === 0) return null;
  const COLORS = ['#3b82f6', '#7c3aed', '#f59e0b', '#10b981'];

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
          <XAxis dataKey="stage" stroke="var(--text-muted)" fontSize={12} fontWeight={600} />
          <YAxis stroke="var(--text-muted)" fontSize={12} fontWeight={600} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)' }}
          />
          <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RecTypePerformanceChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
          <XAxis dataKey="type" stroke="var(--text-muted)" fontSize={11} fontWeight={600} />
          <YAxis stroke="var(--text-muted)" fontSize={11} unit="%" fontWeight={600} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)' }}
            formatter={(val) => [`${val}% CTR`, 'Click-Through Rate']}
          />
          <Bar dataKey="ctr" fill="#f59e0b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
