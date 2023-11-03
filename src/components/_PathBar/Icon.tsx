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

const Refresh: React.FC<IProps> = (props) => {
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
          d='M712.9 295.1c-120.7-110.7-308.3-102.6-419 18.1-87.4 95.3-103 236.3-38.5 348.4 82 141.7 263.2 190.3 405 108.4 66.8-38.6 116-101.7 137-176 8.9-31.5 41.7-49.8 73.2-40.9 31.5 8.9 49.8 41.7 40.9 73.2C849.1 846.8 619.8 975 399.2 912.6 178.7 850.2 50.5 620.9 112.9 400.3S404.6 51.6 625.2 114c64.2 18.2 123.1 51.5 171.6 97.3l79.7-79.7c11.6-11.6 30.3-11.6 41.9-0.1 5.6 5.6 8.7 13.1 8.7 21V407c0 16.4-13.3 29.6-29.6 29.6H642.9c-16.4 0-29.6-13.3-29.6-29.7 0-7.8 3.1-15.3 8.6-20.9l91-90.9z'
          fill='currentColor'
        ></path>
      </svg>
    </span>
  )
}

const Icon = {
  Left,
  Right,
  Refresh
}

export default Icon
