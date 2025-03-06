import {NextResponse} from 'next/server'
import {clearAllData} from '@/lib/redis'

export async function POST() {
  try {
    await clearAllData()
    return NextResponse.json({message: 'All data cleared successfully'})
  } catch (error) {
    console.error('Redis clear error:', error)
    return NextResponse.json({error: 'Failed to clear data'}, {status: 500})
  }
}
