"use client"
import React from 'react'
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

export default function DashboardChartsLocal({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-sm h-72">
        <h3 className="font-semibold mb-3">Timeline</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data.timeline || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm h-72">
        <h3 className="font-semibold mb-3">Categorias</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.byCategory || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm h-72">
        <h3 className="font-semibold mb-3">Pipeline</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.pipeline || []} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="stage" />
            <Tooltip />
            <Bar dataKey="count" fill="#48BB78" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm h-72">
        <h3 className="font-semibold mb-3">Distribuição</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data.distribution || []} dataKey="value" outerRadius={80} fill="#8884d8" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
