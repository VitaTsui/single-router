import { useContext } from 'react'
import { MatchContext } from '../contexts'

export default function useMatch(): string[] | null {
  const match = useContext(MatchContext)?.match

  return match
}
