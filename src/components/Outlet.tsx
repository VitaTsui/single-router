import { useContext } from 'react'
import { OutletContext } from '../contexts'

const Outlet = () => {
  return useContext(OutletContext)
}

export default Outlet
