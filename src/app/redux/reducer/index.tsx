const defaultState: any = {
  text: 'initial',
  foo: {
    bar: 'zoo',
    nested: {
      veryDeep: true,
    },
  },
}

export default function defaultReducer(state = defaultState, action: any = {}) {
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        text: action.text,
        foo: {
          ...state.foo,
          bar: action.text,
        },
      }

    case 'TEST':
      return {
        ...state,
        text: state.payload,
      }

    case 'UPLOAD':
      return {
        ...state,
        upload_data: action,
      }

    case 'all_bo_tract_data':
      return {
        ...state,
        all_bo_tract_data: action,
      }

    case 'bo_all_data':
      return {
        ...state,
        bo_all_data: action,
      }

    case 'tws_settings':
      return {
        ...state,
        tws_settings: action,
      }
    case 'tradeListColumnShow':
      return {
        ...state,
        tradeListColumnShow: action,
      }
    case 'userData':
      return {
        ...state,
        userData: action,
      }
    case 'order_list':
      return {
        ...state,
        order_list: action,
      }

    case 'tradeListData':
      return {
        ...state,
        tradeListData: action,
      }
    case 'login':
      return {
        ...state,
        login: action,
      }

    case 'Bo_DPS':
      return {
        ...state,
        Bo_DPS: action,
      }
    case 'bo_track_id':
      return {
        ...state,
        bo_track_id: action,
      }

    case 'temporaryCredintial':
      return {
        ...state,
        temporaryCredintial: action,
      }

    case 'DELETE_ITEM':
      return {}

    default:
      return state
  }
}
