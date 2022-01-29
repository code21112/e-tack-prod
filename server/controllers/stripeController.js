const User = require("./../models/userModel");
const Cart = require("./../models/cartModel");
const Product = require("./../models/productModel");
const Coupon = require("./../models/couponModel");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  // Apply coupon
  // console.log("req.body within createPaymentIntent", req.body);
  // return;
  const { couponApplied } = req.body;
  // console.log(
  //   "coupon within createPaymentIntent in stripeController",
  //   couponApplied
  // );

  // Calculate the price

  // 1) Find the user
  const user = await User.findOne({ email: req.user.email }).exec();

  // 2) Get the user's cart total
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderedBy: user._id,
  }).exec();
  console.log("cartTotal within createPaymentIntent method", cartTotal);
  console.log(
    "totalAfterDiscount within createPaymentIntent method",
    totalAfterDiscount
  );

  // 3) Create payment intent with the order amount and currency

  let finalAmount = 0;

  // if (couponApplied && totalAfterDiscount) {
  //   finalAmount = Math.round(totalAfterDiscount * 100);
  // } else {
  //   finalAmount = Math.round(cartTotal * 100);
  // }

  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }

  console.log(
    "finalAmount within createPaymentIntent stripeController",
    finalAmount
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "eur",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  });
};
