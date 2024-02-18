import {useLayout} from '../../core/LayoutProvider'

const Toolbar = () => {
  const {config} = useLayout()

  switch (config.toolbar.layout) {
    case 'toolbar1':
      return null

    default:
      return null
  }
}

export {Toolbar}
