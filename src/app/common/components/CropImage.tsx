import ReactCrop from 'react-image-crop'

const CropImage = ({src, setCrop, onImageLoad, crop, aspect, circularCrop = false}) => {
  return (
    <ReactCrop onChange={setCrop} crop={crop} aspect={aspect}>
      <img src={src} onLoad={onImageLoad} alt='' />
    </ReactCrop>
  )
}

export default CropImage
