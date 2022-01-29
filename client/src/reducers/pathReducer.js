export const pathReducer = (state = false, action) => {
  switch (action.type) {
    case "PLACE_ORDER_CLICKED":
      return action.payload;
    default:
      return state;
  }
};
