import React from 'react'
import { Router, Route, Routes } from '../components'

export default function useRoutes(routes: Routes, defaultPath?: string): React.ReactNode {
  return (
    <Router>
      <Route Routes={routes} defaultPath={defaultPath} />
    </Router>
  )
}
