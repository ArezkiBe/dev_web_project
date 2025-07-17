<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Calendrier</h1>
      <p class="text-gray-600">Visualisez vos échéances et activités</p>
    </div>

    <!-- Calendar Header -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <button 
            @click="goToPreviousMonth"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <h2 class="text-2xl font-bold text-gray-900">
            {{ currentMonthYear }}
          </h2>
          
          <button 
            @click="goToNextMonth"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="goToToday"
            class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Aujourd'hui
          </button>
          
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Vue:</label>
            <select 
              v-model="viewMode" 
              class="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="month">Mois</option>
              <option value="week">Semaine</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div v-if="viewMode === 'month'" class="grid grid-cols-7 gap-1">
        <!-- Days of week header -->
        <div 
          v-for="day in daysOfWeek" 
          :key="day"
          class="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg"
        >
          {{ day }}
        </div>
        
        <div 
          v-for="day in calendarDays" 
          :key="day.date"
          class="min-h-[120px] p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          :class="getDayClasses(day)"
          @click="selectDay(day)"
        >
          <div class="flex items-center justify-between mb-2">
            <span 
              class="text-sm font-medium"
              :class="day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'"
            >
              {{ day.day }}
            </span>
            <span 
              v-if="day.isToday"
              class="w-2 h-2 bg-emerald-500 rounded-full"
            ></span>
          </div>
          
          <div class="space-y-1">
            <div 
              v-for="event in day.events.slice(0, 3)" 
              :key="event.id"
              class="text-xs px-2 py-1 rounded-full truncate"
              :class="getEventClass(event.type)"
              :title="event.title"
            >
              {{ event.title }}
            </div>
            <div 
              v-if="day.events.length > 3"
              class="text-xs text-gray-500 px-2"
            >
              +{{ day.events.length - 3 }} autres
            </div>
          </div>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="grid grid-cols-8 gap-2">
          <div class="p-3 text-sm font-medium text-gray-500"></div>
          <div 
            v-for="day in weekDays" 
            :key="day.date"
            class="p-3 text-center"
            :class="day.isToday ? 'bg-emerald-50 rounded-lg' : ''"
          >
            <div class="text-sm font-medium text-gray-900">{{ day.dayName }}</div>
            <div class="text-lg font-bold" :class="day.isToday ? 'text-emerald-600' : 'text-gray-700'">
              {{ day.day }}
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-8 gap-2">
          <div class="space-y-4">
            <div 
              v-for="hour in timeSlots" 
              :key="hour"
              class="h-16 flex items-center justify-end pr-2 text-sm text-gray-500"
            >
              {{ hour }}:00
            </div>
          </div>
          
          <div 
            v-for="day in weekDays" 
            :key="day.date"
            class="space-y-4"
          >
            <div 
              v-for="hour in timeSlots" 
              :key="hour"
              class="h-16 border-t border-gray-200 relative"
            >
              <div 
                v-for="event in getEventsForHour(day, hour)" 
                :key="event.id"
                class="absolute left-0 right-0 mx-1 p-1 rounded text-xs"
                :class="getEventClass(event.type)"
                :style="{ top: `${event.offsetTop}px`, height: `${event.height}px` }"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Légende</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span class="text-sm text-gray-700">Échéances</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span class="text-sm text-gray-700">Modules à commencer</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span class="text-sm text-gray-700">En cours</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span class="text-sm text-gray-700">Terminés</span>
        </div>
      </div>
    </div>

    <!-- Selected Day Details -->
    <div 
      v-if="selectedDay && selectedDay.events.length > 0"
      class="bg-white rounded-lg shadow-md p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Détails du {{ formatDate(selectedDay.date) }}
      </h3>
      
      <div class="space-y-4">
        <div 
          v-for="event in selectedDay.events" 
          :key="event.id"
          class="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ event.title }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ event.description }}</p>
              <div class="flex items-center mt-2 space-x-4">
                <span class="text-xs px-2 py-1 rounded-full" :class="getEventClass(event.type)">
                  {{ getEventTypeText(event.type) }}
                </span>
                <span class="text-xs text-gray-500">
                  Parcours: {{ event.parcours }}
                </span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ event.time }}</p>
              <button 
                v-if="event.moduleId"
                @click="goToModule(event.moduleId, event.parcoursId)"
                class="text-xs text-emerald-600 hover:text-emerald-800 mt-1"
              >
                Voir le module
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { getParcours } from '../services/parcours'

const router = useRouter()
const userStore = useUserStore()

const currentDate = ref(new Date())
const selectedDay = ref(null)
const viewMode = ref('month')
const parcours = ref([])
const isLoading = ref(false)

const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8) // 8:00 to 19:00

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

const weekDays = computed(() => {
  const startOfWeek = new Date(currentDate.value)
  startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1)
  
  const days = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    
    days.push({
      date: new Date(day),
      day: day.getDate(),
      dayName: daysOfWeek[i],
      isToday: isSameDay(day, new Date()),
      events: getEventsForDate(day)
    })
  }
  
  return days
})

function goToPreviousMonth() {
  if (viewMode.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  } else {
    currentDate.value = new Date(currentDate.value.getTime() - 7 * 24 * 60 * 60 * 1000)
  }
}

function goToNextMonth() {
  if (viewMode.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  } else {
    currentDate.value = new Date(currentDate.value.getTime() + 7 * 24 * 60 * 60 * 1000)
  }
}

function goToToday() {
  currentDate.value = new Date()
}

function selectDay(day) {
  selectedDay.value = day
}

function getDayClasses(day) {
  let classes = []
  
  if (day.isToday) {
    classes.push('bg-emerald-50 border-emerald-300')
  }
  
  if (day.events.length > 0) {
    classes.push('bg-blue-50')
  }
  
  if (selectedDay.value && isSameDay(day.date, selectedDay.value.date)) {
    classes.push('ring-2 ring-emerald-500')
  }
  
  return classes.join(' ')
}

function getEventClass(type) {
  const classes = {
    'deadline': 'bg-red-100 text-red-800 border border-red-300',
    'start': 'bg-blue-100 text-blue-800 border border-blue-300',
    'in-progress': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    'completed': 'bg-green-100 text-green-800 border border-green-300'
  }
  return classes[type] || 'bg-gray-100 text-gray-800 border border-gray-300'
}

function getEventTypeText(type) {
  const texts = {
    'deadline': 'Échéance',
    'start': 'Début',
    'in-progress': 'En cours',
    'completed': 'Terminé'
  }
  return texts[type] || 'Événement'
}

function getEventsForDate(date) {
  const events = []
  
  parcours.value.forEach(p => {
    p.modules?.forEach(module => {
      if (module.dateCible && isSameDay(new Date(module.dateCible), date)) {
        events.push({
          id: `deadline-${module.id}`,
          title: `Échéance: ${module.titre}`,
          description: `Échéance pour le module "${module.titre}"`,
          type: 'deadline',
          time: 'Toute la journée',
          parcours: p.titre,
          moduleId: module.id,
          parcoursId: p.id
        })
      }
      
      if (module.dateDebut && isSameDay(new Date(module.dateDebut), date)) {
        events.push({
          id: `start-${module.id}`,
          title: `Début: ${module.titre}`,
          description: `Début du module "${module.titre}"`,
          type: 'start',
          time: 'Toute la journée',
          parcours: p.titre,
          moduleId: module.id,
          parcoursId: p.id
        })
      }
      
      if (module.statut === 'in-progress' && 
          (!module.dateDebut || new Date(module.dateDebut) <= date) &&
          (!module.dateCible || new Date(module.dateCible) >= date)) {
        events.push({
          id: `progress-${module.id}`,
          title: module.titre,
          description: `Module en cours: "${module.titre}"`,
          type: 'in-progress',
          time: 'En cours',
          parcours: p.titre,
          moduleId: module.id,
          parcoursId: p.id
        })
      }
    })
  })
  
  return events.sort((a, b) => {
    const priority = { 'deadline': 1, 'start': 2, 'in-progress': 3, 'completed': 4 }
    return priority[a.type] - priority[b.type]
  })
}

function getEventsForHour(day, hour) {
  return day.events.filter(event => {
    const eventHour = event.type === 'deadline' ? 9 : 
                     event.type === 'start' ? 10 : 
                     event.type === 'in-progress' ? 11 : 12
    return eventHour === hour
  }).map(event => ({
    ...event,
    offsetTop: 0,
    height: 60
  }))
}

function isSameDay(date1, date2) {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

function formatDate(date) {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function goToModule(moduleId, parcoursId) {
  router.push(`/parcours/${parcoursId}#module-${moduleId}`)
}

async function loadData() {
  if (!userStore.user) return
  
  try {
    isLoading.value = true
    const data = await getParcours()
    parcours.value = data || []
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
