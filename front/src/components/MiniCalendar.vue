<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Calendrier</h3>
      <router-link 
        to="/calendar"
        class="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
      >
        Voir tout
      </router-link>
    </div>
    
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <button 
          @click="goToPreviousMonth"
          class="p-1 rounded hover:bg-gray-100"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <h4 class="text-sm font-medium text-gray-700">
          {{ currentMonthYear }}
        </h4>
        
        <button 
          @click="goToNextMonth"
          class="p-1 rounded hover:bg-gray-100"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      
      <div class="grid grid-cols-7 gap-1 mb-1">
        <div 
          v-for="day in daysOfWeek" 
          :key="day"
          class="text-xs text-center text-gray-500 py-1"
        >
          {{ day }}
        </div>
      </div>
      
      <div class="grid grid-cols-7 gap-1">
        <div 
          v-for="day in calendarDays" 
          :key="day.date"
          class="aspect-square flex items-center justify-center text-xs relative cursor-pointer rounded hover:bg-gray-100"
          :class="getDayClasses(day)"
          @click="goToCalendar(day.date)"
        >
          <span 
            :class="day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'"
          >
            {{ day.day }}
          </span>
          
          <div 
            v-if="day.events.length > 0"
            class="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1"
          >
            <div 
              v-for="(event, index) in day.events.slice(0, 3)" 
              :key="index"
              class="w-1 h-1 rounded-full"
              :class="getEventIndicatorClass(event.type)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <div>
      <h4 class="text-sm font-medium text-gray-700 mb-2">Prochains événements</h4>
      <div v-if="upcomingEvents.length === 0" class="text-xs text-gray-500">
        Aucun événement à venir
      </div>
      <div v-else class="space-y-1">
        <div 
          v-for="event in upcomingEvents.slice(0, 3)" 
          :key="event.id"
          class="flex items-center space-x-2 text-xs"
        >
          <div 
            class="w-2 h-2 rounded-full flex-shrink-0"
            :class="getEventIndicatorClass(event.type)"
          ></div>
          <span class="text-gray-600 truncate">{{ event.title }}</span>
          <span class="text-gray-400 text-xs">{{ formatEventDate(event.date) }}</span>
        </div>
        <div 
          v-if="upcomingEvents.length > 3"
          class="text-xs text-gray-500 text-center pt-1"
        >
          +{{ upcomingEvents.length - 3 }} autres
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  parcours: {
    type: Array,
    default: () => []
  }
})

const currentDate = ref(new Date())
const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const monthNames = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
  'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
]

const currentMonthYear = computed(() => {
  const month = monthNames[currentDate.value.getMonth()]
  const year = currentDate.value.getFullYear()
  return `${month} ${year}`
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  const endDate = new Date(lastDay)
  
  startDate.setDate(startDate.getDate() - (startDate.getDay() || 7) + 1)
  endDate.setDate(endDate.getDate() + (7 - endDate.getDay()) % 7)
  
  const days = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    const dayEvents = getEventsForDate(current)
    
    days.push({
      date: new Date(current),
      day: current.getDate(),
      isCurrentMonth: current.getMonth() === month,
      isToday: isSameDay(current, new Date()),
      events: dayEvents
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return days
})

const upcomingEvents = computed(() => {
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  const events = []
  
  props.parcours.forEach(p => {
    p.modules?.forEach(module => {
      if (module.dateCible) {
        const deadline = new Date(module.dateCible)
        if (deadline >= today && deadline <= nextWeek) {
          events.push({
            id: `deadline-${module.id}`,
            title: `${module.titre}`,
            date: module.dateCible,
            type: 'deadline'
          })
        }
      }
      
      if (module.dateDebut) {
        const start = new Date(module.dateDebut)
        if (start >= today && start <= nextWeek) {
          events.push({
            id: `start-${module.id}`,
            title: `Début: ${module.titre}`,
            date: module.dateDebut,
            type: 'start'
          })
        }
      }
    })
  })
  
  return events.sort((a, b) => new Date(a.date) - new Date(b.date))
})

function goToPreviousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function goToNextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

function goToCalendar(date) {
  const dateString = date.toISOString().split('T')[0]
  router.push(`/calendar?date=${dateString}`)
}

function getDayClasses(day) {
  let classes = []
  
  if (day.isToday) {
    classes.push('bg-emerald-100 text-emerald-800 font-semibold')
  }
  
  if (day.events.length > 0) {
    classes.push('font-medium')
  }
  
  return classes.join(' ')
}

function getEventIndicatorClass(type) {
  const classes = {
    'deadline': 'bg-red-500',
    'start': 'bg-blue-500',
    'in-progress': 'bg-yellow-500',
    'completed': 'bg-green-500'
  }
  return classes[type] || 'bg-gray-500'
}

function getEventsForDate(date) {
  const events = []
  
  props.parcours.forEach(p => {
    p.modules?.forEach(module => {
      if (module.dateCible && isSameDay(new Date(module.dateCible), date)) {
        events.push({
          id: `deadline-${module.id}`,
          title: `Échéance: ${module.titre}`,
          type: 'deadline'
        })
      }
      
      if (module.dateDebut && isSameDay(new Date(module.dateDebut), date)) {
        events.push({
          id: `start-${module.id}`,
          title: `Début: ${module.titre}`,
          type: 'start'
        })
      }
    })
  })
  
  return events
}

function isSameDay(date1, date2) {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

function formatEventDate(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  
  if (isSameDay(date, today)) {
    return 'Aujourd\'hui'
  } else if (isSameDay(date, tomorrow)) {
    return 'Demain'
  } else {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }
}
</script>
