// Analytics service for dashboard data
export function calculateAnalytics(parcours) {
  const analytics = {
    totalParcours: parcours.length,
    totalModules: 0,
    modulesByStatus: {
      'not-started': 0,
      'in-progress': 0,
      'completed': 0
    },
    averageProgress: 0,
    upcomingDeadlines: [],
    recentActivity: [],
    productivityStats: {
      thisWeek: 0,
      thisMonth: 0,
      streak: 0
    }
  }

  parcours.forEach(p => {
    if (p.modules) {
      analytics.totalModules += p.modules.length
      
      p.modules.forEach(module => {
        analytics.modulesByStatus[module.statut]++
        
        if (module.dateCible) {
          const deadline = new Date(module.dateCible)
          const today = new Date()
          const diffTime = deadline - today
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays >= 0 && diffDays <= 7) {
            analytics.upcomingDeadlines.push({
              ...module,
              daysUntilDeadline: diffDays,
              parcoursTitre: p.titre
            })
          }
        }
      })
    }
  })

  if (analytics.totalModules > 0) {
    analytics.averageProgress = Math.round(
      (analytics.modulesByStatus.completed / analytics.totalModules) * 100
    )
  }

  analytics.upcomingDeadlines.sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline)

  return analytics
}

export function getMotivationalMessage(analytics) {
  const { averageProgress, modulesByStatus } = analytics
  
  if (averageProgress === 100) {
    return {
      type: 'success',
      message: '🎉 Félicitations ! Vous avez terminé tous vos modules !',
      suggestion: 'Créez un nouveau parcours pour continuer à apprendre.'
    }
  }
  
  if (averageProgress >= 75) {
    return {
      type: 'success',
      message: '🚀 Excellent travail ! Vous êtes sur la bonne voie !',
      suggestion: 'Plus que quelques modules à terminer.'
    }
  }
  
  if (averageProgress >= 50) {
    return {
      type: 'warning',
      message: '💪 Bon travail ! Vous avez franchi la moitié !',
      suggestion: 'Continuez sur cette lancée.'
    }
  }
  
  if (averageProgress >= 25) {
    return {
      type: 'info',
      message: '📚 Vous avez fait un bon début !',
      suggestion: 'Prenez le temps de planifier vos prochaines sessions.'
    }
  }
  
  if (modulesByStatus['not-started'] > 0) {
    return {
      type: 'info',
      message: '🌟 Prêt à commencer votre parcours ?',
      suggestion: 'Commencez par un module simple pour prendre de l\'élan.'
    }
  }
  
  return {
    type: 'info',
    message: '✨ Bienvenue dans votre espace d\'apprentissage !',
    suggestion: 'Créez votre premier parcours pour commencer.'
  }
}

export function getTimeBasedGreeting() {
  const hour = new Date().getHours()
  
  if (hour < 12) {
    return '🌅 Bonjour'
  } else if (hour < 17) {
    return '☀️ Bon après-midi'
  } else {
    return '🌆 Bonsoir'
  }
}

export function formatTimeAgo(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `il y a ${days} jour${days > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`
  } else if (minutes > 0) {
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
  } else {
    return 'à l\'instant'
  }
}
