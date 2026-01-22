'use client'

import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function SalesChart({ sales = [], type = 'line' }) {
  const chartData = useMemo(() => {
    if (!sales || sales.length === 0) {

      const defaultDates = []
      const defaultValues = []
      const today = new Date()
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        defaultDates.push(date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }))
        defaultValues.push(0)
      }

      return {
        labels: defaultDates,
        datasets: [
          {
            label: 'Ventes',
            data: defaultValues,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: type === 'line',
            tension: 0.4,
          },
        ],
      }
    }

    if (type === 'pie') {

      const categoryMap = {}
      
      sales.forEach((sale) => {
        const category = sale.category || 'Autre'
        const total = sale.totalPrice || (sale.quantity * sale.unitPrice) || 0
        
        if (categoryMap[category]) {
          categoryMap[category] += total
        } else {
          categoryMap[category] = total
        }
      })

      const colors = [
        'rgba(59, 130, 246, 0.8)',   
        'rgba(16, 185, 129, 0.8)',  
        'rgba(245, 158, 11, 0.8)', 
        'rgba(239, 68, 68, 0.8)',   
        'rgba(139, 92, 246, 0.8)',   
        'rgba(236, 72, 153, 0.8)', 
      ]

      return {
        labels: Object.keys(categoryMap),
        datasets: [
          {
            label: 'Ventes par catégorie',
            data: Object.values(categoryMap),
            backgroundColor: colors.slice(0, Object.keys(categoryMap).length),
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      }
    }


    const salesByDate = {}
    
    sales.forEach((sale) => {
      const date = new Date(sale.date || sale.createdAt || new Date())
      const dateKey = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
      const total = sale.totalPrice || (sale.quantity * sale.unitPrice) || 0
      
      if (salesByDate[dateKey]) {
        salesByDate[dateKey] += total
      } else {
        salesByDate[dateKey] = total
      }
    })

    // Trier les dates
    const sortedDates = Object.keys(salesByDate).sort((a, b) => {
      const dateA = new Date(a.split('/').reverse().join('-'))
      const dateB = new Date(b.split('/').reverse().join('-'))
      return dateA - dateB
    })

    // Si moins de 7 jours de données, remplir avec des zéros
    const today = new Date()
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      last7Days.push(date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }))
    }

    const labels = sortedDates.length >= 7 ? sortedDates : last7Days
    const data = labels.map((label) => salesByDate[label] || 0)

    return {
      labels,
      datasets: [
        {
          label: 'Ventes ($)',
          data,
          borderColor: type === 'line' ? 'rgb(59, 130, 246)' : 'rgb(59, 130, 246)',
          backgroundColor: type === 'line' 
            ? 'rgba(59, 130, 246, 0.1)' 
            : 'rgba(59, 130, 246, 0.8)',
          fill: type === 'line',
          tension: type === 'line' ? 0.4 : 0,
          borderWidth: 2,
        },
      ],
    }
  }, [sales, type])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            if (type === 'pie') {
              return `${context.label}: $${context.parsed.toFixed(2)}`
            }
            return `Ventes: $${context.parsed.y.toFixed(2)}`
          },
        },
      },
    },
    scales: type !== 'pie' ? {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#6B7280',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#6B7280',
          callback: function(value) {
            return '$' + value.toFixed(0)
          },
        },
      },
    } : undefined,
  }

  return (
    <div className="w-full h-[300px] sm:h-[350px]">
      {type === 'line' && <Line data={chartData} options={options} />}
      {type === 'bar' && <Bar data={chartData} options={options} />}
      {type === 'pie' && <Pie data={chartData} options={options} />}
    </div>
  )
}
