import React from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { formatCurrencyCompact } from '../data/mockData'

const CashFlowChart = ({ 
  data = [], 
  selectedMonth, 
  onMonthSelect,
  height = 280 
}) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null
    
    const monthData = payload[0]?.payload
    if (!monthData) return null
    
    const cashFlow = monthData.inflow - monthData.outflow
    
    return (
      <div className="bg-white rounded-xl border border-[#E8E8E8] shadow-lg p-4 min-w-[180px]">
        <p className="text-14 font-semibold text-[#18181A] mb-3">
          {new Date(monthData.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              <span className="text-13 text-[#656565]">Total Balance</span>
            </div>
            <span className="text-13 font-medium text-[#18181A]">{formatCurrencyCompact(monthData.balance)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span className="text-13 text-[#656565]">Inflow</span>
            </div>
            <span className="text-13 font-medium text-[#50942A]">{formatCurrencyCompact(monthData.inflow)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <span className="text-13 text-[#656565]">Outflow</span>
            </div>
            <span className="text-13 font-medium text-[#F13B3B]">-{formatCurrencyCompact(monthData.outflow)}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-[#E8E8E8] flex items-center justify-between">
            <span className="text-13 text-[#656565]">Cash Flow</span>
            <span className={`text-13 font-medium px-2 py-0.5 rounded-full ${
              cashFlow >= 0 
                ? 'bg-[#E8F5E9] text-[#50942A]' 
                : 'bg-[#FFEBEE] text-[#F13B3B]'
            }`}>
              {cashFlow >= 0 ? '+' : ''}{formatCurrencyCompact(cashFlow)}
            </span>
          </div>
        </div>
      </div>
    )
  }
  
  // Handle bar click
  const handleBarClick = (data) => {
    if (data && data.month) {
      onMonthSelect?.(data.month)
    }
  }
  
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E8E8E8] p-6">
        <p className="text-14 text-[#8D8D8D] text-center">No data available</p>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-xl border border-[#E8E8E8] p-5">
      <h3 className="text-14 font-medium text-[#18181A] mb-4">Balance overview</h3>
      
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
          barGap={4}
        >
          <XAxis 
            dataKey="label" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <YAxis 
            yAxisId="bars"
            orientation="left"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickFormatter={(value) => formatCurrencyCompact(value)}
            width={50}
          />
          <YAxis 
            yAxisId="line"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickFormatter={(value) => formatCurrencyCompact(value)}
            width={50}
            domain={['dataMin - 5000', 'dataMax + 5000']}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
          />
          
          {/* Outflow bars (red) */}
          <Bar 
            yAxisId="bars"
            dataKey="outflow" 
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
            onClick={handleBarClick}
            cursor="pointer"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`outflow-${index}`}
                fill={entry.month === selectedMonth ? '#DC2626' : '#EF4444'}
                fillOpacity={entry.month === selectedMonth ? 1 : 0.85}
              />
            ))}
          </Bar>
          
          {/* Inflow bars (green) */}
          <Bar 
            yAxisId="bars"
            dataKey="inflow" 
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
            onClick={handleBarClick}
            cursor="pointer"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`inflow-${index}`}
                fill={entry.month === selectedMonth ? '#16A34A' : '#22C55E'}
                fillOpacity={entry.month === selectedMonth ? 1 : 0.85}
              />
            ))}
          </Bar>
          
          {/* Balance line (blue) */}
          <Line 
            yAxisId="line"
            type="monotone"
            dataKey="balance" 
            stroke="#3B82F6"
            strokeWidth={2.5}
            dot={{ fill: '#3B82F6', strokeWidth: 2, stroke: '#fff', r: 4 }}
            activeDot={{ fill: '#3B82F6', strokeWidth: 2, stroke: '#fff', r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CashFlowChart
