import React, { useEffect } from 'react'
import { useLocation, useNavigate } from '../..'
import ReactDOM from 'react-dom'
import { get_string_width } from 'hsu-utils'
import Icon from './Icon'

const PathBar: React.FC = () => {
  useEffect(() => {
    return () => {
      const input = document.getElementById('path-bar')
      input && document.body.removeChild(input)
    }
  }, [])

  const Bar: React.FC = () => {
    const navigate = useNavigate()
    const { pathname, search, index, history } = useLocation()

    const _search = search[index] as Record<string, unknown>

    const fullSearch = Object.keys(_search)
      .map((key) => `${key}=${JSON.stringify(_search[key])}`)
      .join('&')

    const fullPath = `${pathname}${fullSearch ? '?' + fullSearch : ''}`

    return (
      <div
        id='path-bar'
        style={{
          boxSizing: 'border-box',
          padding: '2px 10px',
          position: 'fixed',
          left: '5px',
          top: '5px',
          zIndex: '9999',
          display: 'flex',
          alignItems: 'center',
          columnGap: '10px',
          height: '32px',
          width: 'max-content',
          fontFamily: '微软雅黑',
          backgroundColor: '#fff',
          border: '1px solid #aaa',
          borderRadius: '5px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            columnGap: '5px'
          }}
        >
          <Icon.Left onClick={() => navigate(-1)} disabled={index === 0} />
          <Icon.Right onClick={() => navigate(1)} disabled={index === history.length - 1} />
        </div>
        <input
          type='text'
          style={{
            outline: 'none',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            width: `${get_string_width(fullPath) * 14 + 40}px`,
            height: '100%',
            padding: '0 10px',
            fontSize: '14px',
            color: '#333333',
            background: '#E0E0E0',
            borderRadius: '5px',
            border: '1px solid #E0E0E0'
          }}
          disabled
          value={fullPath}
        />
      </div>
    )
  }

  return ReactDOM.createPortal(<Bar />, document.body)
}

export default PathBar
