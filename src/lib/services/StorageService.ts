import localforage from 'localforage'
import { UserProgress, ReviewItem } from '../models/types'

// Configure localForage instance for the quantum mechanics app
const storage = localforage.createInstance({
  name: 'quantum-mechanics-study-app',
  storeName: 'user-data',
  version: 1.0,
  description: 'Offline storage for quantum mechanics study progress and data'
})

// Fallback to file-based storage in Node.js environment (for tests)
const isNode = typeof window === 'undefined'

// File-based fallback for Node environment
let fileStorage: any = {}
if (isNode) {
  try {
    const fs = require('fs')
    const path = require('path')
    const dataFile = path.join(process.cwd(), 'content', 'progress.json')
    
    fileStorage = {
      getItem: (key: string) => {
        try {
          if (fs.existsSync(dataFile)) {
            const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
            return Promise.resolve(data[key] || null)
          }
          return Promise.resolve(null)
        } catch {
          return Promise.resolve(null)
        }
      },
      setItem: (key: string, value: any) => {
        try {
          let data = {}
          if (fs.existsSync(dataFile)) {
            data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
          }
          data = { ...data, [key]: value }
          fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
          return Promise.resolve(value)
        } catch (error) {
          return Promise.reject(error)
        }
      },
      removeItem: (key: string) => {
        try {
          if (fs.existsSync(dataFile)) {
            const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
            delete data[key]
            fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
          }
          return Promise.resolve()
        } catch (error) {
          return Promise.reject(error)
        }
      },
      clear: () => {
        try {
          if (fs.existsSync(dataFile)) {
            fs.writeFileSync(dataFile, '{}')
          }
          return Promise.resolve()
        } catch (error) {
          return Promise.reject(error)
        }
      }
    }
  } catch {
    // If fs is not available, use memory storage
    const memStorage: any = {}
    fileStorage = {
      getItem: (key: string) => Promise.resolve(memStorage[key] || null),
      setItem: (key: string, value: any) => {
        memStorage[key] = value
        return Promise.resolve(value)
      },
      removeItem: (key: string) => {
        delete memStorage[key]
        return Promise.resolve()
      },
      clear: () => {
        Object.keys(memStorage).forEach(key => delete memStorage[key])
        return Promise.resolve()
      }
    }
  }
}

const activeStorage = isNode ? fileStorage : storage

export class StorageService {
  // User Progress Management
  static async getUserProgress(): Promise<UserProgress> {
    try {
      const progress = await activeStorage.getItem('userProgress')
      return progress || {
        user_id: null,
        completed_modules: [],
        module_states: {},
        study_streak: 0,
        total_study_time: 0,
        completion_percentage: 0
      }
    } catch (error) {
      console.error('Failed to get user progress:', error)
      return {
        user_id: null,
        completed_modules: [],
        module_states: {},
        study_streak: 0,
        total_study_time: 0,
        completion_percentage: 0
      }
    }
  }

  static async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      await activeStorage.setItem('userProgress', progress)
    } catch (error) {
      console.error('Failed to save user progress:', error)
      throw error
    }
  }

  // Review Items Management (for spaced repetition)
  static async getReviewItems(): Promise<ReviewItem[]> {
    try {
      const reviews = await activeStorage.getItem('reviewItems')
      return reviews || []
    } catch (error) {
      console.error('Failed to get review items:', error)
      return []
    }
  }

  static async saveReviewItems(reviews: ReviewItem[]): Promise<void> {
    try {
      await activeStorage.setItem('reviewItems', reviews)
    } catch (error) {
      console.error('Failed to save review items:', error)
      throw error
    }
  }

  // Module Content Cache (for offline access)
  static async cacheModuleContent(moduleId: string, content: any): Promise<void> {
    try {
      await activeStorage.setItem(`module_content_${moduleId}`, content)
    } catch (error) {
      console.error(`Failed to cache module content for ${moduleId}:`, error)
      throw error
    }
  }

  static async getCachedModuleContent(moduleId: string): Promise<any> {
    try {
      return await activeStorage.getItem(`module_content_${moduleId}`)
    } catch (error) {
      console.error(`Failed to get cached module content for ${moduleId}:`, error)
      return null
    }
  }

  // Settings Management
  static async getSettings(): Promise<any> {
    try {
      const settings = await activeStorage.getItem('appSettings')
      return settings || {
        theme: 'light',
        notifications: true,
        spaced_repetition_enabled: true,
        daily_goal_minutes: 30
      }
    } catch (error) {
      console.error('Failed to get settings:', error)
      return {
        theme: 'light',
        notifications: true,
        spaced_repetition_enabled: true,
        daily_goal_minutes: 30
      }
    }
  }

  static async saveSettings(settings: any): Promise<void> {
    try {
      await activeStorage.setItem('appSettings', settings)
    } catch (error) {
      console.error('Failed to save settings:', error)
      throw error
    }
  }

  // Data Export/Import
  static async exportData(): Promise<any> {
    try {
      const [progress, reviews, settings] = await Promise.all([
        this.getUserProgress(),
        this.getReviewItems(),
        this.getSettings()
      ])

      return {
        version: '1.0',
        exported_at: new Date().toISOString(),
        data: {
          progress,
          reviews,
          settings
        }
      }
    } catch (error) {
      console.error('Failed to export data:', error)
      throw error
    }
  }

  static async importData(exportData: any): Promise<void> {
    try {
      if (!exportData || !exportData.data) {
        throw new Error('Invalid export data format')
      }

      const { progress, reviews, settings } = exportData.data

      await Promise.all([
        progress && this.saveUserProgress(progress),
        reviews && this.saveReviewItems(reviews),
        settings && this.saveSettings(settings)
      ])
    } catch (error) {
      console.error('Failed to import data:', error)
      throw error
    }
  }

  // Storage Management
  static async clearAllData(): Promise<void> {
    try {
      await activeStorage.clear()
    } catch (error) {
      console.error('Failed to clear all data:', error)
      throw error
    }
  }

  static async getStorageInfo(): Promise<{ used: number; available: number }> {
    try {
      if (isNode) {
        return { used: 0, available: Infinity }
      }

      // Check IndexedDB storage quota
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate()
        return {
          used: estimate.usage || 0,
          available: (estimate.quota || 0) - (estimate.usage || 0)
        }
      }

      return { used: 0, available: Infinity }
    } catch (error) {
      console.error('Failed to get storage info:', error)
      return { used: 0, available: 0 }
    }
  }
}