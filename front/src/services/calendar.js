// Calendar utility functions
export function formatDateForCalendar(date) {
  return new Date(date).toISOString().split('T')[0]
}

export function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export function isWeekend(date) {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function subtractDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

export function isSameMonth(date1, date2) {
  return date1.getMonth() === date2.getMonth() && 
         date1.getFullYear() === date2.getFullYear()
}

export function isToday(date) {
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

export function formatTime(date) {
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export function getDateRangeText(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const startStr = start.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  })
  
  const endStr = end.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  })
  
  if (start.getTime() === end.getTime()) {
    return startStr
  }
  
  return `${startStr} - ${endStr}`
}

export function getUpcomingEvents(events, days = 7) {
  const today = new Date()
  const futureDate = addDays(today, days)
  
  return events.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate >= today && eventDate <= futureDate
  }).sort((a, b) => new Date(a.date) - new Date(b.date))
}

export function groupEventsByDate(events) {
  const grouped = {}
  
  events.forEach(event => {
    const dateKey = formatDateForCalendar(event.date)
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(event)
  })
  
  return grouped
}

export function getDaysDifference(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
  return Math.round((date1 - date2) / oneDay)
}

export function isOverdue(date) {
  const today = new Date()
  const targetDate = new Date(date)
  return targetDate < today
}

export function getUrgencyLevel(date) {
  const today = new Date()
  const targetDate = new Date(date)
  const daysDiff = getDaysDifference(targetDate, today)
  
  if (daysDiff < 0) return 'overdue'
  if (daysDiff === 0) return 'today'
  if (daysDiff === 1) return 'tomorrow'
  if (daysDiff <= 3) return 'soon'
  if (daysDiff <= 7) return 'thisWeek'
  return 'later'
}

export function getUrgencyColor(urgencyLevel) {
  const colors = {
    'overdue': 'red',
    'today': 'red',
    'tomorrow': 'orange',
    'soon': 'yellow',
    'thisWeek': 'blue',
    'later': 'gray'
  }
  return colors[urgencyLevel] || 'gray'
}

export function generateCalendarEvents(parcours) {
  const events = []
  
  parcours.forEach(p => {
    p.modules?.forEach(module => {
      if (module.dateCible) {
        const urgency = getUrgencyLevel(module.dateCible)
        events.push({
          id: `deadline-${module.id}`,
          title: `Échéance: ${module.titre}`,
          date: module.dateCible,
          type: 'deadline',
          urgency: urgency,
          color: getUrgencyColor(urgency),
          parcours: p.titre,
          module: module,
          parcoursId: p.id
        })
      }
      
      if (module.dateDebut) {
        events.push({
          id: `start-${module.id}`,
          title: `Début: ${module.titre}`,
          date: module.dateDebut,
          type: 'start',
          urgency: 'later',
          color: 'blue',
          parcours: p.titre,
          module: module,
          parcoursId: p.id
        })
      }
    })
  })
  
  return events.sort((a, b) => new Date(a.date) - new Date(b.date))
}
