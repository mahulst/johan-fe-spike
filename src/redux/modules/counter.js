/* @flow */
// ------------------------------------
// Constants
// ------------------------------------
export const SET_MARKERS = 'SET_MARKERS'

// ------------------------------------
// Actions
// ------------------------------------
// NOTE: "Action" is a Flow interface defined in https://github.com/TechnologyAdvice/flow-interfaces
// If you're unfamiliar with Flow, you are completely welcome to avoid annotating your code, but
// if you'd like to learn more you can check out: flowtype.org.
// DOUBLE NOTE: there is currently a bug with babel-eslint where a `space-infix-ops` error is
// incorrectly thrown when using arrow functions, hence the oddity.
export function setMarkers (arr:Array):Action {
  return {
    type: SET_MARKERS,
    payload: arr
  }
}

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
// NOTE: This is solely for demonstration purposes. In a real application,
// you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
// reducer take care of this logic.
export const doubleAsync = (latLng: Object = {}): Function => {
  console.log(latLng);
  return (dispatch: Function, getState: Function): Promise => {

    return new Promise((resolve: Function): void => {
      const baseUrl = 'http://localhost:8000/entries/';
      const paramUrl = latLng.lat ? `${latLng.lat}/${latLng.lng}/` : ''

      fetch(baseUrl + paramUrl).then((response) => {
        response.json().then((data:Array) => {
          dispatch(setMarkers(data))
          resolve();
        })
      })
    })
  }
}

export const actions = {
  doubleAsync
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_MARKERS]: (state: Object, action: { payload: Array }): Object => {
    const arr = action.payload.map(entry => {
      return {
        name: entry.name,
        position: {
          lat: parseFloat(entry.point.latitude),
          lng: parseFloat(entry.point.longitude)
        }
      }
    });
    return {
      ...initialState,
      markers: arr
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { markers: [] }
export default function markerReducer (state: Object = initialState, action: Action): number {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
