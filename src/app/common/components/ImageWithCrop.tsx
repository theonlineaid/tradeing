import cogoToast from 'cogo-toast'
import React, {useRef, useState} from 'react'
import {Tooltip} from 'react-hover-tooltip'
import {FiEdit3, FiTrash2} from 'react-icons/fi'
import CropImage from './CropImage'
import CustomModal from './CustomModal'
import MyTooltip from './ui/MyTooltip'

interface Props {
  label: string
  name: string
  initValue: any
  handleImageState: (name: string, value: string) => void
  imageSize?: {
    width: string
    height: string
  }
  aspect?: number
  removeInitValue: (name: string) => void
}

const ImageWithCrop: React.FC<React.PropsWithChildren<Props>> = ({
  label,
  name,
  initValue,
  handleImageState,
  imageSize = {width: '180px', height: '220px'},
  aspect,
  removeInitValue,
}) => {
  const [isModalShow, setIsModalShow] = useState<boolean>(false)
  const [srcImg, setSrcImg] = useState<string>('')
  const [image, setImage] = useState<any>(null)
  const [crop, setCrop] = useState<any>()
  const [result, setResult] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const imageInput = useRef(null)

  const handleImage = async (event) => {
    const imgSize = Math.round(event.target.files[0].size / 1024)

    if (imgSize > 3072) {
      setErrorMsg('Image size must be less then 3 MB!')
    } else {
      setErrorMsg('')
      setSrcImg(URL.createObjectURL(event.target.files[0]))
      setIsModalShow(true)
    }
  }

  const onImageLoad = (e) => {
    setImage(e.currentTarget)
  }

  const getCroppedImg = async () => {
    try {
      const canvas = document.createElement('canvas')
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx: any = canvas.getContext('2d')

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      )

      const base64Image = canvas.toDataURL('image/jpeg', 1)
      setResult(base64Image)
      handleImageState(name, base64Image)
      setIsModalShow(false)
    } catch (e) {
      console.error('error in cropping image')
      cogoToast.error('Error in cropping!')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
  }

  const handleClose = () => {
    setIsModalShow(false)
    if ((imageInput?.current as any)?.value) {
      ;(imageInput.current as any).value = ''
    }
  }
  const handleOpen = () => {
    setIsModalShow(true)
  }
  const handleDelete = () => {
    setImage(null)
    setCrop(null)
    removeInitValue(name)
    setResult('')
  }
  return (
    <form onSubmit={handleSubmit}>
      <label className='col-form-label fs-6'>{label}</label>
      {!result && !initValue?.[name] && (
        <>
          <input
            accept='image/*'
            type='file'
            className='form-control'
            name={name}
            id={name}
            ref={imageInput}
            required
            onChange={handleImage}
          />
          {errorMsg && <p className='alert alert-danger'>{errorMsg}</p>}
        </>
      )}
      {result || initValue?.[name] ? (
        <div className='card image-crop' style={imageSize}>
          <img
            src={initValue?.[name] ? initValue[name] : result}
            alt={name}
            className='img-crop-action'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <ul className='image-crop-overlay'>
            <MyTooltip id='edit' content='Edit'>
              {initValue?.[name] ? null : (
                <li onClick={handleOpen}>
                  <FiEdit3 />
                </li>
              )}
            </MyTooltip>
            <MyTooltip id='delte' content='Delete'>
              <li onClick={handleDelete}>
                <FiTrash2 />
              </li>
            </MyTooltip>
          </ul>
        </div>
      ) : null}
      <CustomModal
        handleClose={handleClose}
        show={isModalShow}
        title={`Crop ${label}`}
        bgColor='bg-light'
        size='lg'
        footer={
          <div className='d-flex align-items-center gap-2'>
            <button className='btn btn-danger' onClick={handleClose}>
              Close
            </button>
            <button className='btn btn-outline-primary' onClick={getCroppedImg}>
              Crop
            </button>
          </div>
        }
      >
        <div className='d-flex justify-content-center align-items-center'>
          {srcImg && (
            <CropImage
              src={srcImg}
              onImageLoad={onImageLoad}
              crop={crop}
              setCrop={setCrop}
              aspect={aspect}
            />
          )}
        </div>
      </CustomModal>
    </form>
  )
}

export default ImageWithCrop
