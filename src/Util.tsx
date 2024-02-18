import {Link} from 'react-router-dom'
import {
  boTrack,
  getAddressInfo,
  getBankInfo,
  getBasicInfo,
  getNomineeInfo,
} from './app/modules/auth/core/_requests'
export const SearchAnItem = async (arr: any, x: any, field: string) => {
  let iterativeFunction = function (arr: any, x: any) {
    let start = 0,
      end = arr.length - 1
    while (start <= end) {
      let mid = Math.floor((start + end) / 2)
      if (arr[mid][field] === x) return arr[mid]
      else if (arr[mid][field] < x) start = mid + 1
      else end = mid - 1
    }

    return false
  }

  // Driver code

  if (iterativeFunction(arr, x)) {
    return iterativeFunction(arr, x)
  } else {
  }
}

export const customTab = async (
  key: any,
  activeOrInactive: any,
  route: string,
  routeName: string
) => {
  return (
    <Link key={key} to={activeOrInactive ? '/bo-account/input/' + route : '#'}>
      <div
        className={
          window.location.pathname.replace('/bo-account/input/', '') === route
            ? 'bd-highlight bo-step currentTab'
            : 'bd-highlight bo-step'
        }
      >
        <div className='step-line'></div>
        <h5 className='step-number'>{key + 1}</h5>
        <p className={activeOrInactive ? 'step-label' : ''}>{routeName}</p>
      </div>
    </Link>
  )
}

export const BoEditModeByRedux = async (track_id: any) => {
  if (track_id) {
    let getData: any = {}
    let bo_all_data: any = {}

    bo_all_data.haveTractId = true
    getData = await boTrack(track_id)
    if (getData?.data?.status === 200) {
      bo_all_data.boTrack = true
      bo_all_data.BasicInfo = true
    }

    getData = await getBasicInfo(track_id)
    if (getData?.data?.status === 200) {
      bo_all_data.BasicInfo = true
      bo_all_data.AddressInfo = true
    }

    getData = await getAddressInfo(track_id)
    if (getData?.data?.status === 200) {
      bo_all_data.AddressInfo = true
      bo_all_data.BankInfo = true
    }

    getData = await getBankInfo(track_id)
    if (getData?.data?.status === 200) {
      bo_all_data.BankInfo = true
      bo_all_data.NomineeInfo = true
      bo_all_data.Upload = true
      bo_all_data.finish = getData?.data?.data.is_nominee
    }

    getData = await getNomineeInfo(track_id)
    if (getData?.data?.status === 200) {
      bo_all_data.NomineeInfo = true
    }
    return bo_all_data
  }
}

export const marketMapDataFormate = (mapData: any, type_: any, colorValue: any) => {
  const businessSegmentSet = new Set()
  mapData.data.forEach((i) => businessSegmentSet.add(i.business_segment))

  let business_segment = Array.from(businessSegmentSet)

  let result = business_segment.map((item, key) => {
    return mapData.data.filter((d, k) => d.business_segment === item)
  })

  let custom_css: any = ``
  var style = document.createElement('style')

  let api: any = {}
  api.name = 'Root'
  let res = result.map((d, k) => {
    let data: any = {}
    data.name = d[0].business_segment
    let children_details = d.map((item, k) => {
      let chang = codorCode(item.change, colorValue)
      let x: any = {}
      x.name = item.scrip
      x.loc = item[type_]
      x.allData = item
      x.change = item.change
      x.color = chang
      let word = d[0].business_segment

      custom_css +=
        ` #Root-${word.replace(/[&/\\#,+()$~%.'"&:*?<>{}]/g, '-').replaceAll(' ', '-')}-${item.scrip
          .replace(/[&/\\#,+()$~%.'"&:*?<>{}]/g, '-')
          .replaceAll(' ', '-')} { background : ` +
        chang +
        `!important} `

      custom_css +=
        ` #Root-${word.replace(/[&/\\#,+()$~%.'"&:*?<>{}]/g, '-').replaceAll(' ', '-')}-${item.scrip
          .replace(/[&/\\#,+()$~%.'"&:*?<>{}]/g, '-')
          .replaceAll(' ', '-')} div { background : ` +
        chang +
        `!important} `
      return x
    })

    let sortedData = sorting(children_details)

    data.children = sortedData
    return data
  })

  style.textContent = custom_css
  document.head.appendChild(style)
  api.children = res

  return api
}

const codorCode = (value, colorValue) => {
  let color: any = ''

  if (value === 0) {
    color = colorValue.z_0
  }

  if (value < 0) {
    if (value <= -3) {
      color = colorValue.m_30
    } else if (value <= -2 && value > -3) {
      color = colorValue.m_20
    } else {
      color = colorValue.m_10
    }
  }

  if (value > 0) {
    if (value >= 3) {
      color = colorValue.p_30
    } else if (value >= 2 && value < 3) {
      color = colorValue.p_20
    } else {
      color = colorValue.p_10
    }
  }
  return color
}

const sorting = (arr) => {
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr.length - i - 1; j++) {
      let time_one = arr[j].loc
      let time_two = arr[j + 1].loc

      if (time_one < time_two) {
        var temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}

// Crop Image

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

export async function getCroppedACImg(imageSrc, pixelCrop, rotation = 0) {
  const image: any = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx: any = canvas.getContext('2d')
  canvas.width = 590
  canvas.height = 708
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, 590, 709)
  return canvas.toDataURL()
}

export async function getCroppedSingImg(imageSrc, pixelCrop, rotation = 0) {
  const image: any = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx: any = canvas.getContext('2d')
  canvas.width = 590
  canvas.height = 708
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, 400, 100)
  return canvas.toDataURL()
}
