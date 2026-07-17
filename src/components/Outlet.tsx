import React, { useContext } from 'react'
import { OutletContext, OutletValueContext } from '../contexts'

interface OutletProps {
  /** Context value passed down to child routes, read inside them via useOutletContext() */
  context?: unknown
}

/** Renders the currently matched child route (used with useRoutes children) */
const Outlet: React.FC<OutletProps> = (props) => {
  const { context } = props
  const { element } = useContext(OutletContext)

  if (!element) return null

  return <OutletValueContext.Provider value={context}>{element}</OutletValueContext.Provider>
}

export default Outlet
