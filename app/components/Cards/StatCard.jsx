'use client'

import { ChevronUp, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'

const colorClasses = {
  green: {
    iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100',
    iconColor: 'text-green-600',
    iconGradient: 'from-green-500 to-emerald-600',
    borderColor: 'border-green-200',
    changePositive: 'text-green-600',
    changeNegative: 'text-red-600',
    bgGradient: 'from-green-50/50 to-emerald-50/50',
  },
  blue: {
    iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    iconColor: 'text-blue-600',
    iconGradient: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-200',
    changePositive: 'text-green-600',
    changeNegative: 'text-red-600',
    bgGradient: 'from-blue-50/50 to-indigo-50/50',
  },
  orange: {
    iconBg: 'bg-gradient-to-br from-orange-100 to-amber-100',
    iconColor: 'text-orange-600',
    iconGradient: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-200',
    changePositive: 'text-green-600',
    changeNegative: 'text-red-600',
    bgGradient: 'from-orange-50/50 to-amber-50/50',
  },
  purple: {
    iconBg: 'bg-gradient-to-br from-purple-100 to-pink-100',
    iconColor: 'text-purple-600',
    iconGradient: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-200',
    changePositive: 'text-green-600',
    changeNegative: 'text-red-600',
    bgGradient: 'from-purple-50/50 to-pink-50/50',
  },
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  change,
  changeType = 'positive',
}) {
  const colors = colorClasses[color] || colorClasses.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl border ${colors.borderColor} p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden card-hover`}
    >

      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`${colors.iconBg} p-3 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
            {Icon && (
              <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.iconColor} drop-shadow-sm`} />
            )}
          </div>
          {change && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold backdrop-blur-sm ${
                changeType === 'positive'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {changeType === 'positive' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{change}</span>
            </motion.div>
          )}
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2 uppercase tracking-wide">{title}</p>
          <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${colors.iconGradient} bg-clip-text text-transparent`}>
            {value}
          </p>
        </div>
      </div>
      

      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colors.iconGradient} opacity-5 rounded-bl-full -z-0`}></div>
    </motion.div>
  )
}
