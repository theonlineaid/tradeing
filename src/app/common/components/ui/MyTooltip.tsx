import React from 'react'
import 'react-tooltip/dist/react-tooltip.css'
import {Tooltip} from 'react-tooltip'

interface Props {
  id: string
  content: string | React.ReactNode
}

const MyTooltip: React.FC<React.PropsWithChildren<Props>> = ({id, content, children}) => {
  return (
    <div id={id}>
      <Tooltip anchorSelect={`#${id}`}>{content}</Tooltip>
      {children}
    </div>
  )
}

export default MyTooltip
