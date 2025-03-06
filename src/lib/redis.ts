import {createClient} from 'redis'

const REDIS_KEY = 'button_state'

export type ButtonState = {
  isBusy: boolean
  lastUpdated: string
}

export const getRedisClient = async () => {
  const client = createClient({
    url: process.env.REDIS_URL,
  })
  await client.connect()
  return client
}

export const getButtonState = async (): Promise<ButtonState> => {
  const redis = await getRedisClient()
  try {
    const state = await redis.get(REDIS_KEY)

    if (!state) {
      const initialState: ButtonState = {
        isBusy: false,
        lastUpdated: new Date().toISOString(),
      }
      await redis.set(REDIS_KEY, JSON.stringify(initialState))
      return initialState
    }

    return JSON.parse(state)
  } finally {
    await redis.quit()
  }
}

export const toggleButtonState = async (): Promise<ButtonState> => {
  const redis = await getRedisClient()
  try {
    const currentState = await redis.get(REDIS_KEY)

    const newState: ButtonState = {
      isBusy: currentState ? !JSON.parse(currentState).isBusy : true,
      lastUpdated: new Date().toISOString(),
    }

    await redis.del(REDIS_KEY)
    await redis.set(REDIS_KEY, JSON.stringify(newState))
    return newState
  } finally {
    await redis.quit()
  }
}

export const clearAllData = async (): Promise<void> => {
  const redis = await getRedisClient()
  try {
    await redis.flushDb()
  } finally {
    await redis.quit()
  }
}
