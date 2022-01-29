const Category = require("./../models/categoryModel");
const Subcategory = require("./../models/subcategoryModel");
const Product = require("./../models/productModel");
const slugify = require("slugify");
const { capitalize, capitalizeAndTrim } = require("../utils/createFunctions");

// exports.createCategory = async (req, res) => {
//   const slug = slugify(req.body.name);
//   const { name, slug } = req.body;
//   const newCategory = await new Category({
//     name,
//     slug,
//   }).save();
// };

// exports.createCategory = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const slug = slugify(name);
//     const category = await new Category({
//       name,
//       slug: slugify(name).tolowercase(),
//     }).save();
//     res.json(category);
//   } catch (err) {
//     console.log(err);
//     res.status(400).send("Category creation failed.");
//   }
// };

// exports.createCategory = async (req, res) => {
//   try {
//     const { name } = req.body;
//     // const category = await new Category({ name, slug: slugify(name) }).save();
//     // res.json(category);
//     res.json(await new Category({ name, slug: slugify(name) }).save());
//   } catch (err) {
//     if (err.code === 11000) {
//       res.status(400).send("This category is already existing.");
//     }
//     if (err.errors.name.kind === "minlength") {
//       res
//         .status(400)
//         .send(
//           "This category name is too short: it must be 2 characters at minimum."
//         );
//     }
//     if (err.errors.name.kind === "maxlength") {
//       res
//         .status(400)
//         .send(
//           "This category name is too long: it must be 32 characters at the most."
//         );
//     }
//     res.status(400).send("Category creation has failed. Please, try again.");
//   }
// };

exports.createCategory = async (req, res) => {
  // const capitalize = (string) => {
  //   string.charAt(0).toUpperCase() + string.substring(1);
  // };

  // const capitalizeAndTrim = (string) => {
  //   let stringMod = string.trim();
  //   return stringMod.charAt(0).toUpperCase() + stringMod.substring(1);
  // };

  try {
    const { name } = req.body;
    res.json(
      await new Category({
        name: capitalizeAndTrim(name),
        slug: slugify(name).toLowerCase(),
      }).save()
    );
  } catch (err) {
    console.log("err", err);
    // console.log("err.errors.name.kind", err.errors.name.kind);
    if (err.code === 11000) {
      res.status(400).send("This category is already existing.");
    }
    if (err.errors.name.kind === "minlength") {
      res
        .status(400)
        .send(
          "This category name is too short: it must be 2 characters at minimum."
        );
    }
    if (err.errors.name.kind === "maxlength") {
      res
        .status(400)
        .send(
          "This category name is too long: it must be 32 characters at the most."
        );
    }
    res.status(400).send("Category creation failed.");
  }
};

// exports.readCategory = async (req, res) => {
//   const category = await Category.findOne({ slug: req.params.slug })
//     .then((response) => {
//       console.log(response);
//       if (!response) {
//         res.status(401).json({ message: "This category doesn't exist." });
//       } else {
//         const products = await Product.find({ category: category })
//           .populate("category")
//           .populate("postedBy", "_id name")
//           .exec();
//         // res.status(200).json(response);
//         res.status(200).json({
//           category,
//           products,
//         });
//       }
//     })
//     .catch((err) => console.log(err));
// };

exports.readCategory = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec();
  let products = await Product.find({ category: category })
    .populate("category")
    // .populate("postedBy", "_id name")
    .exec();
  res.status(200).json({ category, products });
};

// exports.updateCategory = async (req, res) => {
//   const updatedCategory = await Category.findOneAndUpdate(
//     { slug: req.params.slug },
//     { name: req.body.newName, slug: slugify(req.body.newName) },
//     { new: true }
//   );
//   res.send(updatedCategory);
// };

exports.updateCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(400).send("Category update failed.");
  }
};

exports.removeCategory = async (req, res) => {
  try {
    const categoryToDelete = await Category.findOne({ slug: req.params.slug });
    console.log("categoryToDelete", categoryToDelete);
    const categoryDeleted = await Category.findOneAndDelete({
      slug: req.params.slug,
    });
    const subcategoriesToDelete = await Subcategory.deleteMany({
      parent: categoryToDelete._id,
    });
    console.log("subcategoriesToDelete", subcategoriesToDelete);

    res.json(categoryDeleted);
  } catch (err) {
    console.log(err);
    res.status(400).send("Category deletion failed.");
  }
};

exports.listCategories = async (req, res) => {
  res.json(await Category.find().sort({ createdAt: -1 }).exec());
};

exports.listCategoriesSortedAlpha = async (req, res) => {
  res.json(await Category.find().sort({ name: 1 }).exec());
};

// exports.getSubcategories = async (req, res) => {
//   let parentCategoryId = req.params._id
//   let subCategories = await Subcategory.find({parent: })
// };

exports.getSubcategories = (req, res) => {
  Subcategory.find({ parent: req.params._id })
    .sort({ name: 1 })
    .exec((err, subCategories) => {
      if (err) console.log(err);
      res.json(subCategories);
    });
};
