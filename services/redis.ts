import Redis from "ioredis"
import { env } from "~/env"

const createRedisClient = () => {
  if (!env.REDIS_URL) {
    return null
  }

  try {
    return new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })
  } catch (error) {
    console.error("Failed to create Redis client:", error)
    return null
  }
}

declare const globalThis: {
  redisGlobal: ReturnType<typeof createRedisClient>
} & typeof global

const redis = globalThis.redisGlobal ?? createRedisClient()

export { redis }

if (process.env.NODE_ENV !== "production") globalThis.redisGlobal = redis
