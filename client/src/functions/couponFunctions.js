import axios from "axios";

export const getCoupons = async () =>
  await axios.get(`${process.env.REACT_APP_API}/coupons`);

export const getCouponsSortedAlpha = async () =>
  await axios.get(`${process.env.REACT_APP_API}/coupons/a-z`);

// export const removeCoupon = async (couponId, authtoken) =>
//   await axios.delete(`${process.env.REACT_APP_API}/coupon/${couponId}`, {
//     headers: {
//       authtoken,
//     },
//   });

export const removeCoupon = async (id, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/coupon/${id}`, {
    headers: {
      authtoken,
    },
  });

export const createCoupon = async (coupon, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/coupon`,
    { coupon },
    {
      headers: { authtoken },
    }
  );
