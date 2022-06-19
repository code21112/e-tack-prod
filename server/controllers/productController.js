const Product = require("./../models/productModel");
const User = require("./../models/userModel");
const slugify = require("slugify");
const cloudinary = require("cloudinary");

exports.createProduct = async (req, res) => {
  try {
    console.log("req.body within try block in createProduct", req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log("err", err);
    console.log("err.errors.title", err.errors.title);
    if (err.code === 11000) {
      res.status(400).json({ err: "This product is already existing." });
    }
    if (err.errors.title) {
      res.status(400).json({
        err: "The title of the product is required.",
      });
    }
    if (err.errors.description) {
      res.status(400).json({
        err: "The description is required.",
      });
    }
    if (err.errors.price) {
      res.status(400).json({
        err: "The price is required.",
      });
    }
    if (err.errors.shipping) {
      res.status(400).json({
        err: "The shipping needs to be selected",
      });
    }
    if (err.errors.color) {
      res.status(400).json({
        err: "The color needs to be selected",
      });
    }
    if (err.errors.brand) {
      res.status(400).json({
        err: "You need to select a brand.",
      });
    }
    if (err.errors.category) {
      res.status(400).json({
        err: "You need to select a category.",
      });
    }
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.readProduct = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subcategories")
    .exec();
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log("Err in updateProduct", err);
    // return res.status(400).send("Product update failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const productToDelete = await Product.findOne({ slug: req.params.slug });
    const imagesToDelete = productToDelete.images;
    console.log("productToDelete", productToDelete);
    console.log("imagesToDelete", imagesToDelete);
    const deletedProduct = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    for (let i = 0; i < imagesToDelete.length; i++) {
      cloudinary.uploader.destroy(
        imagesToDelete[i].public_id,
        (err, result) => {
          // if (err) return res.json({ success: false, err });
          if (err) console.log(err);
        }
      );
      // res.send("ok");
    }
    return res.status(200).json(productToDelete);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Product deletion failed");
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subcategories")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};

// WITHOUT PAGINATION
// exports.list = async (req, res) => {
//   try {
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subcategories")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

// WITH PAGINATION
exports.list = async (req, res) => {
  try {
    console.table(req.body);
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subcategories")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  // const product = await Product.find({ id: req.params.productId }).exec()
  // const user = await User.findById(product.postedBy).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;
  // Who is updating the rating?
  // Checking if the user has alredy sent a rating
  let existingRatingObject = product.ratings.find(
    (element) => element.postedBy.toString() === user._id.toString()
  );
  // If existingRatingObject is undefined, the user has not left a rating left ==> push it
  if (existingRatingObject === undefined) {
    // product.ratings.push(star);
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star: star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    console.log("ratingAdded", ratingAdded);
    res.json(ratingAdded);
  } else {
    // If existingRatingObject exists, the user has already sent a rating ==> update it
    const updatedRating = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject },
      },
      { $set: { "ratings.$.star": star } },
      { new: true }
    ).exec();
    console.log("updatedRating", updatedRating);
    res.json(updatedRating);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subcategories")
    .populate("ratings")
    .exec();

  res.json(related);
};

const handleQuery = async (req, res, query) => {
  const products = await Product.find({
    title: { $regex: query, $options: "i" },
  })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    // .populate("postedBy", "_id name")
    .exec();
  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subcategories", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subcategories", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleQueryAndPrice = async (req, res, query, price) => {
  try {
    let products = await Product.find({
      title: { $regex: query, $options: "i" },
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subcategories", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleStars = async (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({ _id: aggregates })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handleSub = async (req, res, sub) => {
  const products = await Product.find({ subcategories: { $all: sub } })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("handleSub error", err);
      res.json(products);
    });
};

const handleQueryAndSub = async (req, res, query, sub) => {
  const products = await Product.find({
    title: { $regex: query, $options: "i" },
    subcategories: { $all: sub },
  })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("handleSub error", err);
      res.json(products);
    });
};

const handleQueryAndCategoryAndSub = async (req, res, query, category, sub) => {
  const products = await Product.find({
    title: { $regex: query, $options: "i" },
    category: { $eq: category[0] },
    subcategories: { $all: sub },
  })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("handleSub error", err);
      res.json(products);
    });
};

const handleQueryAndPriceAndCategoryAndSub = async (
  req,
  res,
  query,
  price,
  category,
  sub
) => {
  const products = await Product.find({
    title: { $regex: query, $options: "i" },
    price: {
      $gte: price[0],
      $lte: price[1],
    },
    category: { $eq: category[0] },
    subcategories: { $all: sub },
  })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("handleSub error", err);
      res.json(products);
    });
};


const arrayEquals = (a, b) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
};

exports.searchFilters = async (req, res) => {
  const { query, price, category, stars, sub, shipping, color, brand } =
    req.body;

  if (query) {
    console.log("query", query);
  }

  let priceSent = false;
  if (price) {
    console.log("price", price);
    if (arrayEquals(price, [0, 4999])) {
      priceSent = false;
    } else {
      priceSent = true;
    }
    console.log("priceSent", priceSent);
  }

  if (category) {
    console.log("category", category);
    console.log("typeof category", typeof category);
  }

  if (stars) {
    console.log("stars", stars);
  }

  let subSent = false;
  if (sub) {
    if (sub.length > 0) {
      subSent = true;
    } else {
      subSent = false;
    }
    console.log("sub", sub);
    console.log("subSent", subSent);
  }

  if (query !== "" && priceSent && category !== "" && stars && subSent) {
    await handleQueryAndPriceAndCategoryAndStarsAndSubs(
      req,
      res,
      query,
      price,
      category,
      stars,
      sub
    );
  } else if (
    query !== "" &&
    priceSent &&
    category !== "" &&
    !stars &&
    subSent
  ) {
    await handleQueryAndPriceAndCategoryAndSubs(
      req,
      res,
      query,
      price,
      category,
      sub
    );
  } else if (
    query !== "" &&
    !priceSent &&
    category !== "" &&
    stars &&
    subSent
  ) {
    await handleQueryAndCategoryAndStarsAndSubs(
      req,
      res,
      query,
      category,
      stars,
      sub
    );
  } else if (query !== "" && priceSent && category === "" && stars && subSent) {
    await handleQueryAndPriceAndStarsAndSubs(
      req,
      res,
      query,
      price,
      stars,
      sub
    );
  } else if (
    query !== "" &&
    !priceSent &&
    category !== "" &&
    !stars &&
    subSent
  ) {
    await handleQueryAndCategoryAndSubs(req, res, query, category, sub);
  } else if (
    query !== "" &&
    !priceSent &&
    category === "" &&
    stars &&
    subSent
  ) {
    await handleQueryAndStarsAndSubs(req, res, query, stars, sub);
  } else if (
    query !== "" &&
    !priceSent &&
    category === "" &&
    !stars &&
    subSent
  ) {
    await handleQueryAndSubs(req, res, query, sub);
  } else if (
    query !== "" &&
    priceSent &&
    category !== "" &&
    stars &&
    !subSent
  ) {
    await handleQueryAndPriceAndCategoryAndStars(
      req,
      res,
      query,
      price,
      category,
      stars
    );
  } else if (
    query !== "" &&
    priceSent &&
    category !== "" &&
    !stars &&
    !subSent
  ) {
    await handleQueryAndPriceAndCategory(req, res, query, price, category);
  } else if (
    query !== "" &&
    !priceSent &&
    category !== "" &&
    stars &&
    !subSent
  ) {
    await handleQueryAndCategoryAndStars(req, res, query, category);
  } else if (
    query !== "" &&
    priceSent &&
    category === "" &&
    !stars &&
    subSent
  ) {
    await handleQueryAndPriceAndSubs(req, res, query, price, sub);
  } else if (
    query !== "" &&
    priceSent &&
    category === "" &&
    stars &&
    !subSent
  ) {
    await handleQueryAndPriceAndStars(req, res, query, price, stars);
  } else if (query === "" && priceSent && category !== "" && stars && subSent) {
    await handlePriceAndCategoryAndStarsAndSubs(
      req,
      res,
      price,
      category,
      stars,
      sub
    );
  } else if (
    query === "" &&
    priceSent &&
    category !== "" &&
    !stars &&
    subSent
  ) {
    await handlePriceAndCategoryAndSubs(req, res, price, category, sub);
  } else if (query === "" && priceSent && category === "" && stars && subSent) {
    await handlePriceAndStarsAndSubs(req, res, price, stars, sub);
  } else if (
    query === "" &&
    priceSent &&
    category === "" &&
    !stars &&
    subSent
  ) {
    await handlePriceAndSubs(req, res, price, sub);
  } else if (
    query === "" &&
    priceSent &&
    category !== "" &&
    stars &&
    !subSent
  ) {
    await handlePriceAndCategoryAndStars(req, res, price, category, stars);
  } else if (
    query === "" &&
    priceSent &&
    category === "" &&
    stars &&
    !subSent
  ) {
    await handlePriceAndStars(req, res, price, stars);
  } else if (
    query === "" &&
    priceSent &&
    category !== "" &&
    !stars &&
    !subSent
  ) {
    await handlePriceAndCategory(req, res, price, category);
  } else if (
    query !== "" &&
    !priceSent &&
    category !== "" &&
    !stars &&
    !subSent
  ) {
    await handleQueryAndCategory(req, res, query, category);
  } else if (
    query !== "" &&
    priceSent &&
    category === "" &&
    !stars &&
    !subSent
  ) {
    await handleQueryAndPrice(req, res, query, price);
  } else if (
    query !== "" &&
    !priceSent &&
    category === "" &&
    stars &&
    !subSent
  ) {
    await handleQueryAndStars(req, res, query, stars);
  } else if (
    query === "" &&
    !priceSent &&
    category !== "" &&
    stars &&
    subSent
  ) {
    await handleCategoryAndStarsAndSubs(req, res, category, stars, sub);
  } else if (
    query === "" &&
    !priceSent &&
    category !== "" &&
    !stars &&
    subSent
  ) {
    await handleCategoryAndSubs(req, res, category, sub);
  } else if (
    query === "" &&
    !priceSent &&
    category !== "" &&
    stars &&
    !subSent
  ) {
    await handleCategoryAndStars(req, res, category, stars);
  } else if (
    query === "" &&
    !priceSent &&
    category === "" &&
    stars &&
    subSent
  ) {
    await handleStarsAndSubs(req, res, stars, sub);
  } else if (
    query === "" &&
    !priceSent &&
    category !== "" &&
    !stars &&
    !subSent
  ) {
    await handleCategory(req, res, category);
  } else if (
    query !== "" &&
    !priceSent &&
    category === "" &&
    !stars &&
    !subSent
  ) {
    await handleQuery(req, res, query);
  } else if (
    query === "" &&
    !priceSent &&
    category === "" &&
    !stars &&
    !subSent
  ) {
    await handlePrice(req, res, price);
  } else if (
    query === "" &&
    !priceSent &&
    category === "" &&
    stars &&
    !subSent
  ) {
    await handleStars(req, res, stars);
  } else if (
    query === "" &&
    !priceSent &&
    category === "" &&
    !stars &&
    subSent
  ) {
    await handleSubs(req, res, sub);
  } else if (
    query === "" &&
    !priceSent &&
    category === "" &&
    !stars &&
    !subSent
  ) {
    let products = await Product.find({})
      .populate("category")
      .populate("subcategories")
      // .sort([["createdAt", "desc"]])
      .exec();
    res.json(products);
  }

  // if (stars) {
  //   console.log("stars ---->", stars);
  //   console.log("within handleStars");
  //   await handleStars(req, res, stars);
  // }

  if (shipping) {
    console.log("shipping --->", shipping);
    await handleShipping(req, res, shipping);
  }

  if (color) {
    console.log("color --->", color);
    await handleColor(req, res, color);
  }

  if (brand) {
    console.log("brand --->", brand);
    await handleBrand(req, res, brand);
  }
};

////////////////////////////////////////
// MY NEW FUNCTIONS
const handleQueryAndPriceAndCategory = async (
  req,
  res,
  query,
  price,
  category
) => {
  try {
    let products = await Product.find({
      $and: [
        { title: { $regex: query, $options: "i" } },
        {
          price: {
            $gte: price[0],
            $lte: price[1],
          },
        },
        { category: { $eq: category } },
      ],
    })
      .populate("category", "_id name")
      .populate("subcategories", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handlePriceAndCategory = async (req, res, price, category) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
      category: { $eq: category },
    })
      .populate("category", "_id name")
      .populate("subcategories", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleQueryAndCategory = async (req, res, query, category) => {
  try {
    let products = await Product.find({
      $and: [
        { category: { $eq: category } },
        { title: { $regex: query, $options: "i" } },
      ],
    })
      .populate("category", "_id name")
      .populate("subcategories", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleQueryAndPriceAndCategoryAndStars = async (
  req,
  res,
  query,
  price,
  category,
  stars
) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          { title: { $regex: query, $options: "i" } },
          {
            price: {
              $gte: price[0],
              $lte: price[1],
            },
          },
          { category: { $eq: category } },
          { _id: aggregates },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
  // try {
  //   let products = await Product.find({
  //     $and: [
  //       { title: { $regex: query, $options: "i" } },
  //       {
  //         price: {
  //           $gte: price[0],
  //           $lte: price[1],
  //         },
  //       },
  //       { category: { category } },
  //       {stars}
  //     ],
  //   })
  //     .populate("category", "_id name")
  //     .populate("subcategories", "_id name")
  //     .exec();
  //   res.json(products);
  // } catch (err) {
  //   console.log(err);
  // }
};

const handleQueryAndCategoryAndStars = async (
  req,
  res,
  query,
  category,
  stars
) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          { title: { $regex: query, $options: "i" } },
          { category: { $eq: category } },
          { _id: aggregates },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handleQueryAndPriceAndStars = async (req, res, query, price, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          { title: { $regex: query, $options: "i" } },
          {
            price: {
              $gte: price[0],
              $lte: price[1],
            },
          },
          { _id: aggregates },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handleQueryAndPriceAndSubs = async (req, res, query, price, sub) => {
  const products = await Product.find({
    title: { $regex: query, $options: "i" },
    price: {
      $gte: price[0],
      $lte: price[1],
    },
    subcategories: { $all: sub },
  })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("handleSub error", err);
      res.json(products);
    });
};

const handleQueryAndStars = async (req, res, query, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          { title: { $regex: query, $options: "i" } },
          { _id: aggregates },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handlePriceAndCategoryAndStars = async (
  req,
  res,
  price,
  category,
  stars
) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          {
            price: {
              $gte: price[0],
              $lte: price[1],
            },
          },
          { category: { $eq: category } },
          { _id: aggregates },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handlePriceAndStars = async (req, res, price, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          {
            price: {
              $gte: price[0],
              $lte: price[1],
            },
          },
          { _id: aggregates },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handleCategoryAndStars = async (req, res, category, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [{ category: { $eq: category } }, { _id: aggregates }],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handleQueryAndPriceAndCategoryAndStarsAndSubs = async (
  req,
  res,
  query,
  price,
  category,
  stars,
  sub
) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          { title: { $regex: query, $options: "i" } },
          {
            price: {
              $gte: price[0],
              $lte: price[1],
            },
          },
          { category: { $eq: category } },
          { _id: aggregates },
          { subcategories: { $all: sub } },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handleQueryAndPriceAndCategoryAndSubs = async (
  req,
  res,
  query,
  price,
  category,
  sub
) => {
  Product.find({
    $and: [
      { title: { $regex: query, $options: "i" } },
      {
        price: {
          $gte: price[0],
          $lte: price[1],
        },
      },
      { category: { $eq: category } },
      { subcategories: { $all: sub } },
    ],
  })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("Products find error", err);
      res.json(products);
    });
};

const handleQueryAndCategoryAndStarsAndSubs = async (
  req,
  res,
  query,
  category,
  stars,
  sub
) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          { title: { $regex: query, $options: "i" } },
          { category: { $eq: category } },
          { _id: aggregates },
          { subcategories: { $all: sub } },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handleQueryAndPriceAndStarsAndSubs = async (
  req,
  res,
  query,
  price,
  stars,
  sub
) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          { title: { $regex: query, $options: "i" } },
          {
            price: {
              $gte: price[0],
              $lte: price[1],
            },
          },
          { _id: aggregates },
          { subcategories: { $all: sub } },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handleQueryAndCategoryAndSubs = async (
  req,
  res,
  query,
  category,
  sub
) => {
  Product.find({
    $and: [
      { title: { $regex: query, $options: "i" } },
      { category: { $eq: category } },
      { subcategories: { $all: sub } },
    ],
  })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("Products find error", err);
      res.json(products);
    });
};

const handleQueryAndStarsAndSubs = async (req, res, query, stars, sub) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          { title: { $regex: query, $options: "i" } },
          { _id: aggregates },
          { subcategories: { $all: sub } },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handleQueryAndSubs = async (req, res, query, sub) => {
  Product.find({
    $and: [
      { title: { $regex: query, $options: "i" } },
      { subcategories: { $all: sub } },
    ],
  })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("Products find error", err);
      res.json(products);
    });
};

const handlePriceAndCategoryAndStarsAndSubs = async (
  req,
  res,
  price,
  category,
  stars,
  sub
) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          {
            price: {
              $gte: price[0],
              $lte: price[1],
            },
          },
          { category: { $eq: category } },
          { _id: aggregates },
          { subcategories: { $all: sub } },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handlePriceAndCategoryAndSubs = async (
  req,
  res,
  price,
  category,
  sub
) => {
  Product.find({
    $and: [
      {
        price: {
          $gte: price[0],
          $lte: price[1],
        },
      },
      { category: { $eq: category } },
      { subcategories: { $all: sub } },
    ],
  })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("Products find error", err);
      res.json(products);
    });
};

const handlePriceAndStarsAndSubs = async (req, res, price, stars, sub) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          {
            price: {
              $gte: price[0],
              $lte: price[1],
            },
          },
          { _id: aggregates },
          { subcategories: { $all: sub } },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handlePriceAndSubs = async (req, res, price, sub) => {
  Product.find({
    $and: [
      {
        price: {
          $gte: price[0],
          $lte: price[1],
        },
      },
      { subcategories: { $all: sub } },
    ],
  })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("Products find error", err);
      res.json(products);
    });
};

const handleCategoryAndStarsAndSubs = async (
  req,
  res,
  category,
  stars,
  sub
) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [
          { category: { $eq: category } },
          { _id: aggregates },
          { subcategories: { $all: sub } },
        ],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

// const handleCategoryAndSubs = async (req, res, category, sub) => {
//   Product.find({
//     $and: [{ category: { $eq: category } }, { subcategories: { $all: sub } }],
//   })
//     .populate("category", "_id name")
//     .populate("subcategories", "_id name")
//     .exec((err, products) => {
//       if (err) console.log("Products find error", err);
//       res.json(products);
//     });
// };

const handleCategoryAndSubs = async (req, res, category, sub) => {
  Product.find({
    $and: [{ category: { $eq: category } }, { subcategories: { $all: sub } }],
  })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("Products find error", err);
      res.json(products);
    });
};
const handleStarsAndSubs = async (req, res, stars, sub) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({
        $and: [{ _id: aggregates }, { subcategories: { $all: sub } }],
      })
        .populate("category", "_id name")
        .populate("subcategories", "_id name")
        .exec((err, products) => {
          if (err) console.log("Products find error", err);
          res.json(products);
        });
    });
};

const handleSubs = async (req, res, sub) => {
  const products = await Product.find({ subcategories: { $all: sub } })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("handleSub error", err);
      res.json(products);
    });
};

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("handleSub error", err);
      res.json(products);
    });
};

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("handleSub error", err);
      res.json(products);
    });
};

const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("subcategories", "_id name")
    .exec((err, products) => {
      if (err) console.log("handleBrand error", err);
      res.json(products);
    });
};
