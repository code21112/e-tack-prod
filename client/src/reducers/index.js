import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { searchReducer } from "./searchReducer";
import { cartReducer } from "./cartReducer";
import { drawerReducer } from "./drawerReducer";
import { couponReducer } from "./couponReducer";
import { pathReducer } from "./pathReducer";
import { cashOnDeliveryReducer } from "./cashOnDeliveryReducer";

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  drawer: drawerReducer,
  coupon: couponReducer,
  path: pathReducer,
  cashOnDelivery: cashOnDeliveryReducer,
});

export default rootReducer;
