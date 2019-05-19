
const initialState = {
  destinations: [],
  fares: {},

};
export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_DESTINATIONS':
      return {
        ...state,
        destinations: action.payload
      };
      case 'GET_FARES':
      return {
        ...state,
        fares: action.payload
      };
    default:
      return state;
  }
};
