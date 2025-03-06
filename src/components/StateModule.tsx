'use client'

import type {ButtonState} from '@/lib/redis'

import {useState, useEffect} from 'react'
import axios from 'axios'
import {cn} from '@/lib/utils'

import {Button} from '@/components/UI/Button'
import {Loader2} from 'lucide-react'

export function StateModule() {
  const [isLoading, setIsLoading] = useState(false)

  const [isBusy, setIsBusy] = useState<boolean | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const [isWatcherActive, setIsWatcherActive] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const fetchState = async () => {
    try {
      const {data} = await axios.get<ButtonState>('/api/state')
      setIsBusy(data.isBusy)
      setLastUpdated(data.lastUpdated)
    } catch (error) {
      console.error('Ошибка при получении состояния:', error)
    }
  }

  useEffect(() => {
    fetchState()

    let intervalId: NodeJS.Timeout | null = null
    let countdownId: NodeJS.Timeout | null = null

    if (isWatcherActive) {
      intervalId = setInterval(fetchState, 5000)

      countdownId = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 5))
      }, 1000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (countdownId) clearInterval(countdownId)
    }
  }, [isWatcherActive])

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const {data} = await axios.post<ButtonState>('/api/state')
      setIsBusy(data.isBusy)
      setLastUpdated(data.lastUpdated)
    } catch (error) {
      console.error('Ошибка при изменении состояния:', error)
      alert('Ошибка при изменении состояния')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleWatcher = () => {
    setIsWatcherActive(!isWatcherActive)
    setCountdown(5)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const containerStyles = 'flex flex-col items-center gap-4 sm:gap-3.5'

  if (isBusy === null) {
    return (
      <div className={containerStyles}>
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-lg">Загрузка данных...</p>
      </div>
    )
  }

  return (
    <div className={cn(containerStyles, 'text-lg text-neutral-400')}>
      <div>
        Текущее состояние:
        <span className={isBusy ? 'text-red-500 font-bold ml-1.5' : 'text-green-500 font-bold ml-1.5'}>{isBusy ? 'Занято' : 'Свободно'}</span>
      </div>

      <Button onClick={handleToggle} disabled={isLoading} variant={isBusy ? 'destructive' : 'default'} className="w-40">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Обновление...
          </>
        ) : isBusy ? (
          'Освободить'
        ) : (
          'Занять'
        )}
      </Button>

      <div className={cn('absolute bottom-4 text-xs', 'flex flex-col items-center gap-1.5')}>
        <div className={cn('text-white cursor-pointer', !isWatcherActive && 'animate-pulse')} onClick={toggleWatcher}>
          <span>Синхронизация {isWatcherActive ? `включена: ${countdown} сек` : 'отключена'}</span>
        </div>

        {lastUpdated && <div>Изменено: {formatDate(lastUpdated)}</div>}
      </div>
    </div>
  )
}
