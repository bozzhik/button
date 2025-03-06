import {NextResponse} from 'next/server'
import {getButtonState, toggleButtonState} from '@/lib/redis'

export async function GET() {
  try {
    const state = await getButtonState()
    return NextResponse.json(state)
  } catch (error) {
    console.error('Redis GET error:', error)
    return NextResponse.json({error: 'Failed to fetch state'}, {status: 500})
  }
}

export async function POST() {
  try {
    const newState = await toggleButtonState()
    return NextResponse.json(newState)
  } catch (error) {
    console.error('Redis POST error:', error)
    return NextResponse.json({error: 'Failed to update state'}, {status: 500})
  }
}
