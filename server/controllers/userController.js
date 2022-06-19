const User = require("./../models/userModel");
const Product = require("./../models/productModel");
const Cart = require("./../models/cartModel");
const Coupon = require("./../models/couponModel");
const Order = require("./../models/orderModel");
const { isExpiryReached } = require("./../utils/checkFunctions");
// const uniqueid = require("uniqueid");
const uniqid = require("uniqid");

exports.userCart = async (req, res) => {
  //   console.log("req.body within userCart", req.body);
  const { cart } = req.body;

  let products = [];
  const user = await User.findOne({ email: req.user.email }).exec();
  //   console.log("user within userCart", user);

  //   CHECKING IF THE CURRENT USER HAS ALREADY A CART
  let cartExistingWithCurrentUser = await Cart.findOne({
    orderedBy: user._id,
  }).exec();

  if (cartExistingWithCurrentUser) {
    cartExistingWithCurrentUser.remove();
    console.log("Old cart has been removed");
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;

    // Getting the product price to create the total
    let { price } = await Product.findById(cart[i]._id).select("price").exec();
    // console.log("price", price);
    object.price = price;
    products.push(object);
  }
  //   console.log("products", products);

  //   Calculating the total price
  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }
  //   console.log("cartTotal", cartTotal);

  let newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();

  //   console.log("newCart", newCart);
  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title totalAFterDiscount price")
    .exec();

  const { products, cartTotal, totalAfterDiscount } = cart;

  res.json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();

  res.json(cart);
};

// exports.saveAddress = async (req, res) => {
//   const { address } = req.body;

//   const user = await User.findOneAndUpdate(
//     { email: req.user.email },
//     { address },
//     { new: true }
//   ).exec();

//   res.json({ ok: true });
// };

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec();

  res.json({ ok: true });
};

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;
  console.log("coupon within applyCouponToUserCart", coupon);

  let validCouponByName = await Coupon.findOne({ name: coupon }).exec();

  if (validCouponByName === null) {
    return res.json({ err: "Invalid coupon." });
  }

  console.log("validCouponByName", validCouponByName);

  if (isExpiryReached(validCouponByName.expiry)) {
    return res.json({ err: "This coupon has expired." });
  } else {
    const user = await User.findOne({ email: req.user.email }).exec();

    let { products, cartTotal } = await Cart.findOne({
      orderedBy: user._id,
    })
      .populate("products.product", "_id title price")
      .exec();

    console.log(
      "cartTotal",
      cartTotal,
      "validCoupon.discount",
      validCouponByName.discount
    );

    // Calculate total after discount
    let totalAfterDiscount = (
      (cartTotal * (100 - validCouponByName.discount)) /
      100
    ).toFixed(2);
    // let totalAfterDiscount = (
    //   (cartTotal - cartTotal * validCoupon.discount) /
    //   100
    // ).toFixed(2);

    console.log("totalAfterDiscount", totalAfterDiscount);
    // Updating the user's cart
    Cart.findOneAndUpdate(
      { orderedBy: user._id },
      { totalAfterDiscount },
      { new: true }
    ).exec();

    res.json({
      totalAfterDiscount,
      currentDiscount: validCouponByName.discount,
    });
  }
};

exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email }).exec();
  let { products } = await Cart.findOne({ orderedBy: user._id }).exec();

  let newOrder = await new Order({
    products,
    paymentIntent,
    orderedBy: user._id,
  }).save();
  console.log("newOrder saved", newOrder);

  // Decrement the product's quantoty and increment its sold property
  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, { new: true });
  console.log("Product quantity-- and sold++", updated);

  res.json({ ok: true });
};

exports.getUserOrders = async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).exec();
  let userOrders = await Order.find({ orderedBy: user._id })
    .populate("products.product")
    .exec();

  // console.log("userOrders within getUserOrders", userOrders);
  res.json(userOrders);
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
    // { new: true }
  ).exec();
  res.json({ ok: true });
};

exports.getWishlist = async (req, res) => {
  const wishlist = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();

  res.json(wishlist);
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
    // { new: true }
  ).exec();

  res.json({ ok: true });
};

exports.createCashOrder = async (req, res) => {
  const { cashOnDelivery, couponApplied } = req.body;

  if (!cashOnDelivery) {
    return res.status(400).send("Create cash order failed");
  }

  const user = await User.findOne({ email: req.user.email }).exec();
  let userCart = await Cart.findOne({ orderedBy: user._id }).exec();

  let dateToStore = Date.now() / 1000;

  let finalAmount = 0;

  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount * 100;
  } else {
    finalAmount = userCart.cartTotal * 100;
  }

  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqid(),
      amount: finalAmount,
      currency: "eur",
      status: "Cash on delivery",
      created: dateToStore,
      payment_method_types: ["cash"],
    },
    orderedBy: user._id,
    orderStatus: "Cash on delivery",
  }).save();
  console.log("newOrder saved", newOrder);

  // Decrement the product's quantoty and increment its sold property
  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, { new: true });
  console.log("Product quantity-- and sold++", updated);

  res.json({ ok: true });
};
