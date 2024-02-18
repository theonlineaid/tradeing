import React from 'react'
import {Modal, ModalDialog} from 'react-bootstrap'
import Draggable from 'react-draggable'
import './custom.css'
interface Props {
  show: boolean
  handleClose: () => void
  title: string
  footer?: any
  style?: any
  fullscreen?: any
  bgColor?: string
  size?: 'lg' | 'sm' | 'xl'
}

class DraggableModalDialog extends React.Component {
  render() {
    return (
      <Draggable handle='.modal-title'>
        <ModalDialog {...this.props} />
      </Draggable>
    )
  }
}

const CustomModal: React.FC<React.PropsWithChildren<Props>> = ({
  show,
  handleClose,
  title,
  footer,
  style = '',
  children,
  fullscreen = false,
  bgColor = '',
  size = 'lg',
}) => {
  return (
    <Modal
      dialogAs={DraggableModalDialog}
      show={show}
      onHide={handleClose}
      size={size}
      backdrop='static'
      fullscreen={fullscreen}
      contentClassName={style}
    >
      <Modal.Header
        closeButton
        className='dark:tw-text-dark-200 dark:tw-bg-dark-300 dark:tw-border-b-dark-border tw-cursor-not-allowed'
      >
        <Modal.Title className='dark:tw-text-slate-100'>{title} lol</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${bgColor} p-3 dark:tw-bg-dark-300`}>{children}</Modal.Body>
    </Modal>
  )
}

export default CustomModal
