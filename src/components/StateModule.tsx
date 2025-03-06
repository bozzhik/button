'use client'

import {useState} from 'react'
import {cn} from '@/lib/utils'

import {Button} from '@/components/UI/Button'
import {Loader2} from 'lucide-react'

export function StateModule() {
  const [isBusy, setIsBusy] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const data = null
      setIsBusy(data.isBusy)
      setLastUpdated(data.lastUpdated)
    } catch (error) {
      alert('Ошибка при изменении состояния')
      console.error('Ошибка при изменении состояния:', error)
    } finally {
      setIsLoading(false)
    }
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

      {lastUpdated && <div className="absolute text-xs bottom-4">Изменено: {formatDate(lastUpdated)}</div>}
    </div>
  )
}
