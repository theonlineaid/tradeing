import React from 'react'

export const Word = ({ value, hidden = false }) => {
  const getStyle = ()=> {
    return {
      visibility:  hidden ? 'hidden' : 'visible'
    }
  }
  return (
    <div className='digital'>
      <p style={{...getStyle}}>{value}</p>
    </div>
  )
}