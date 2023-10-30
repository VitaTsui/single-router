import React, { useState } from 'react'

interface IProps {
  onClick?: () => void
  disabled?: boolean
}

const Left: React.FC<IProps> = (props) => {
  const { onClick, disabled } = props
  const [hover, setHover] = useState(false)

  return (
    <span
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '24px',
        width: '24px',
        borderRadius: '50%',
        color: disabled ? 'rgba(204, 204, 204, 0.9)' : '#333333',
        transition: 'all 0.3s',
        background: hover ? 'rgba(204, 204, 204, 0.4)' : 'transparent'
      }}
      onMouseMove={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <svg viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' width='20' height='20'>
        <path
          d='M852.821333 468.010667H279.04c-0.085333 0-0.170667-0.213333-0.085333-0.213334l216.405333-208a43.946667 43.946667 0 1 0-61.013333-63.402666l-294.570667 283.093333a44.032 44.032 0 0 0 0 63.402667l296.192 284.714666a43.818667 43.818667 0 0 0 62.208-1.194666 44.032 44.032 0 0 0-1.237333-62.208l-216.362667-208c-0.128-0.085333 0-0.213333 0.085333-0.213334H853.76c23.381333 0 42.496-18.304 43.904-41.301333 1.493333-25.472-19.413333-46.677333-44.885333-46.677333z'
          fill='currentColor'
        ></path>
      </svg>
    </span>
  )
}

const Right: React.FC<IProps> = (props) => {
  const { onClick, disabled } = props
  const [hover, setHover] = useState(false)

  return (
    <span
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '24px',
        width: '24px',
        borderRadius: '50%',
        color: disabled ? 'rgba(204, 204, 204, 0.9)' : '#333333',
        transition: 'all 0.3s',
        background: hover ? 'rgba(204, 204, 204, 0.4)' : 'transparent'
      }}
      onMouseMove={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <svg viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' width='20' height='20'>
        <path
          d='M171.221333 468.010667h573.696c0.085333 0 0.170667-0.213333 0.085334-0.213334L528.597333 259.84a43.946667 43.946667 0 1 1 61.013334-63.402667l294.698666 283.221334a44.032 44.032 0 0 1 0 63.402666l-296.32 284.672a43.818667 43.818667 0 0 1-62.208-1.194666 44.032 44.032 0 0 1 1.237334-62.208l216.362666-208c0.128-0.085333 0-0.170667-0.085333-0.170667H170.24c-23.381333 0-42.496-18.346667-43.904-41.301333a44.672 44.672 0 0 1 44.885333-46.805334z'
          fill='currentColor'
        ></path>
      </svg>
    </span>
  )
}

const Icon = {
  Left,
  Right
}

export default Icon
