"use client"
import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, Legend } from 'recharts'

type ChartsData = {
  byCategory: { name: string; count: number; value: number }[]
  timeline: { date: string; value: number }[]
  pipeline: { stage: string; count: number }[]
  distribution: { name: string; value: number }[]
}

const COLORS = ['#8884d8','#82ca9d','#ffc658','#ff7f7f','#a28ff0']

export default function DashboardCharts({ data }: { data: ChartsData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm h-80">
        <h3 className="font-semibold mb-2">Categorias — Contagem / Valor</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data.byCategory}> 
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3182CE" name="Contagem" />
            <Bar dataKey="value" fill="#F6AD55" name="Valor" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm h-80">
        <h3 className="font-semibold mb-2">Timeline — Evolução</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data.timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm h-80">
        <h3 className="font-semibold mb-2">Pipeline</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data.pipeline} layout="vertical"> 
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="stage" />
            <Tooltip />
            <Bar dataKey="count" fill="#48BB78" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm h-80">
        <h3 className="font-semibold mb-2">Distribuição</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie dataKey="value" data={data.distribution} outerRadius={80} label>
              {data.distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
