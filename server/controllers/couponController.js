const Coupon = require("./../models/couponModel");

// exports.createCoupon = async (req, res) => {
//   try {
//     // console.log("req.body.coupon within createCoupon", req.body.coupon);
//     // return;
//     const { name, expiry, discount } = req.body.coupon;
//     res.json(
//       await new Coupon({
//         name,
//         expiry,
//         discount,
//       }).save()
//     );
//   } catch (err) {
//     console.log("err", err);
//     console.log("err.code", err.code);
//     console.log("err.errors", err.errors);
//     // console.log(
//     //   "err.errors.discount,properties",
//     //   err.errors.discount.properties
//     // );
//     // console.log(
//     //   "err.errors.discount.properties.type",
//     //   err.errors.discount.properties.type
//     // );
//     if (err.code === 11000) {
//       res.status(400).send("This coupon is already existing.");
//     } else {
//       if (err.errors.discount.properties.type === "max") {
//         res
//           .status(400)
//           .send(
//             `Please, check the discount value: ${err.errors.discount.properties.value}% is more than the possible maximum (99%).`
//           );
//            };
//       if (err.errors.discount.properties.type === "min") {
//         res
//           .status(400)
//           .send(
//             `Please, check the discount value: ${err.errors.discount.properties.value} is more than the possible maximum (99%).`
//           )
//     };

//     res.status(400).send("Coupon creation failed.");

//     // if (err.errors.discount.properties.type === "max") {
//     //   res.status(400).json({
//     //     err: `Please, check the discount value: ${err.errors.discount.properties.value}% is more than the possible maximum (99%).`,
//     //   });
//     // } else if (err.errors.discount.properties.type === "min") {
//     //   res.status(400).json({
//     //     err: `Please, check the discount value: ${err.errors.discount.properties.value} is more than the possible maximum (99%).`,
//     //   });
//     // } else {
//     //   res.status(400).json({ err: "Coupon creation failed." });
//     // }

//     // if (err.code === 11000) {
//     //   res.status(400).send("This coupon is already existing.");
//     // } else if (err.errors.discount.properties.type === "max") {
//     //   res
//     //     .status(400)
//     //     .send(
//     //       `Please, check the discount value: ${discount} is more than the maximum (99).`
//     //     );
//     // } else if (err.errors.discount.properties.type === "min") {
//     //   res.status(400).send("This coupon is already existing.");
//     // } else {
//     //   res.status(400).send("Coupon creation failed.");
//     // }
//   };
// };

exports.createCoupon = async (req, res) => {
  try {
    // console.log("req.body.coupon within createCoupon", req.body.coupon);
    // return;
    const { name, expiry, discount } = req.body.coupon;
    res.json(
      await new Coupon({
        name,
        expiry,
        discount,
      }).save()
    );
  } catch (err) {
    console.log("err", err);
    // console.log("err.code", err.code);
    // console.log("err.errors", err.errors);
    // console.log("err.errors.name", err.errors.name);
    // console.log("err.errors.name.kind", err.errors.name.kind);

    if (err.code === 11000) {
      res.status(400).send("This coupon is already existing.");
    }
    if (err.errors.name) {
      if (err.errors.name.kind === "minlength") {
        res.status(400).send(err.errors.name.properties.message);
      }
      if (err.errors.name.kind === "maxlength") {
        res.status(400).send(err.errors.name.properties.message);
      }
    }
    if (err.errors.discount) {
      if (err.errors.discount.properties.type === "max") {
        res
          .status(400)
          .send(
            `Please, check the discount value: "${err.errors.discount.properties.value}%" is more than the possible maximum (99%).`
          );
      }
      if (err.errors.discount.properties.type === "min") {
        res
          .status(400)
          .send(
            `Please, check the discount value: "${err.errors.discount.properties.value}%" must be a typo.`
          );
      }
    }
    res.status(400).send("Coupon creation failed.");
  }
};

// exports.removeCoupon = async (req, res) => {
//   try {
//     const deleted = await Coupon.findByIdAndDelete(req.params.couponId);
//     res.json(deleted);
//   } catch (err) {
//     console.log(err);
//     res.status(400).send("Coupon deletion failed.");
//   }
// };

exports.removeCoupon = async (req, res) => {
  try {
    res.json(await Coupon.findByIdAndDelete(req.params.couponId));
  } catch (err) {
    console.log(err);
    res.status(400).send("Coupon deletion failed.");
  }
};

// exports.listCoupons = async (req, res) => {
//   res.json(await Coupon.find().sort({ createdAt: -1 }).exec());
// };

// exports.listCouponsSortedAlpha = async (req, res) => {
//   res.json(await Coupon.find().sort({ name: 1 }).exec());
// };

exports.listCoupons = async (req, res) => {
  try {
    res.json(await Coupon.find().sort({ createdAt: -1 }).exec());
  } catch (err) {
    console.log(err);
  }
};

exports.listCouponsSortedAlpha = async (req, res) => {
  try {
    res.json(await Coupon.find().sort({ name: 1 }).exec());
  } catch (err) {
    console.log(err);
  }
};
