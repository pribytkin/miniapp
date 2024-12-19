import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Telegram WebApp type
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready(): void
        close(): void
        expand(): void
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          show(): void
          hide(): void
          onClick(callback: () => void): void
          offClick(callback: () => void): void
          enable(): void
          disable(): void
        }
        BackButton: {
          isVisible: boolean
          show(): void
          hide(): void
          onClick(callback: () => void): void
          offClick(callback: () => void): void
        }
        onEvent(eventType: string, callback: () => void): void
        offEvent(eventType: string, callback: () => void): void
        sendData(data: string): void
        openLink(url: string): void
      }
    }
  }
}

// Initialize Telegram WebApp
export function initTelegramApp() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready()
    window.Telegram.WebApp.expand()
  }
}

// Format price with currency
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

// Format duration to human readable string
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} хв`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0
    ? `${hours}год ${remainingMinutes}хв`
    : `${hours}год`
}
