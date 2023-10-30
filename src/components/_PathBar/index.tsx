import React, { useEffect } from 'react'
import { useLocation } from '../..'
import ReactDOM from 'react-dom'
import { get_string_width } from 'hsu-utils'

const PathBar: React.FC = () => {
  useEffect(() => {
    return () => {
      const input = document.getElementById('path-bar')
      input && document.body.removeChild(input)
    }
  }, [])

  const Input: React.FC = () => {
    const { pathname, search, index } = useLocation()

    const _search = search[index] as Record<string, unknown>

    const fullSearch = Object.keys(_search)
      .map((key) => `${key}=${JSON.stringify(_search[key])}`)
      .join('&')

    const fullPath = `${pathname}${fullSearch ? '?' + fullSearch : ''}`

    return (
      <input
        type='text'
        id='path-bar'
        style={{
          outline: 'none',
          fontSize: '14px',
          color: '#31455c',
          backgroundColor: 'rgba(#f1f3f7, .5)',
          border: '1px solid #489dff',
          borderRadius: '5px',
          height: '32px',
          padding: '0 10px',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          position: 'fixed',
          left: '5px',
          top: '5px',
          zIndex: '9999',
          width: `${get_string_width(fullPath) * 14 + 20}px`
        }}
        disabled
        value={fullPath}
      />
    )
  }

  return ReactDOM.createPortal(<Input />, document.body)
}

export default PathBar
