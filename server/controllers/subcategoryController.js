const Subcategory = require("./../models/subcategoryModel");
const Product = require("./../models/productModel");
const slugify = require("slugify");
const { capitalize, capitalizeAndTrim } = require("../utils/createFunctions");

// exports.createSubcategory = async (req, res) => {
//   try {
//     const { name, parent } = req.body;
//     res.json(
//       await new Subcategory({
//         name,
//         parent,
//         slug: slugify(name).toLowerCase(),
//       }).save()
//     );
//   } catch (err) {
//     console.log("createSubcategory error", err);
//     // console.log("err.errors.name.kind", err.errors.name.kind);
//     // if (err.code === 11000) {
//     //   res.status(400).send("This subcategory is already existing.");
//     // }
//     // if (err.errors.name.kind === "minlength") {
//     //   res
//     //     .status(400)
//     //     .send(
//     //       "This subcategory name is too short: it must be 2 characters at minimum."
//     //     );
//     // }
//     // if (err.errors.name.kind === "maxlength") {
//     //   res
//     //     .status(400)
//     //     .send(
//     //       "This subcategory name is too long: it must be 32 characters at the most."
//     //     );
//     // }
//     res.status(400).send("Subcategory creation failed.");
//   }
// };

// exports.createSubcategory = async (req, res) => {
//   try {
//     const { name, parent } = req.body;
//     res.json(
//       await new Subcategory({ name, parent, slug: slugify(name) }).save()
//     );
//   } catch (err) {
//     console.log("SUB CREATE ERR ----->", err);
//     res.status(400).send("Create sub failed");
//   }
// };

// exports.createSubcategory = async (req, res) => {
//   const { name, parent } = req.body;
//   const newSub = await new Subcategory({ name, parent, slug: slugify(name) })
//     .save()
//     .then(() => {
//       res.status(201).send(`Subcategory ${name} created successfully!`);
//       // res.json(newSub);
//     })
//     .catch((err) => {
//       console.log(err);
//       console.log("err.code", err.code);

//       if (err.code === 11000) {
//         res.status(400).send("This subcategory is already existing.");
//       }
//       res.status(400).send("Subcategory creation failed.");
//     });
// };

// exports.create = async (req, res) => {
//   try {
//     const { name, parent } = req.body;
//     res.json(await new Sub({ name, parent, slug: slugify(name) }).save());
//   } catch (err) {
//     console.log("SUB CREATE ERR ----->", err);
//     res.status(400).send("Create sub failed");
//   }
// };

// exports.createSubcategory = async (req, res) => {
//   try {
//     const { name, parent } = req.body;

//     // if (parent === "") {
//     //   return res.status(400).send("You need to select a parent category");
//     // } else {
//     res.status(200).json(
//       await new Subcategory({
//         name: capitalizeAndTrim(name),
//         parent,
//         slug: slugify(name).toLowerCase(),
//       }).save()
//     );
//     // }
//   } catch (err) {
//     // console.log("err", err);
//     // console.log("err.errors.name.kind", err.errors.name.kind);
//     console.log("err.path", err.path);
//     console.log("err.code", err.code);
//     // if (err.path === "parent") {
//     //   console.log("No parent has been selected");
//     //   res.status(400).send("No parent has been selected");
//     // }
//     if (err.code === 11000) {
//       res.send("This subcategory is already existing.");
//     }
//     res.status(400).send("Subcategory creation failed.");
//   }
// };

exports.createSubcategory = async (req, res) => {
  try {
    const { name, parent } = req.body;
    res.json(
      await new Subcategory({
        name: capitalizeAndTrim(name),
        parent,
        slug: slugify(name).toLowerCase(),
      }).save()
    );
  } catch (err) {
    // console.log("err.code", err.code);
    if (err.code === 11000) {
      res.status(400).send("This subcategory is already existing.");
    } else {
      res.status(400).send("Subcategory creation failed.");
    }
  }
};

// exports.readSubcategory = async (req, res) => {
//   const subcategory = await Subcategory.findOne({ slug: req.params.slug })
//     .then((response) => {
//       console.log(response);
//       if (!response) {
//         res.status(401).json({ message: "This subcategory doesn't exist." });
//       } else {
//         res.status(200).json(response);
//       }
//     })
//     .catch((err) => console.log(err));
// };

exports.readSubcategory = async (req, res) => {
  const subcategory = await Subcategory.findOne({
    slug: req.params.slug,
  }).exec();
  const products = await Product.find({ subcategories: subcategory })
    // .populate("subcategory")
    .exec();
  res.status(200).json({ subcategory, products });
};

exports.updateSubcategory = async (req, res) => {
  const { name, category } = req.body;
  try {
    const updated = await Subcategory.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name), parent: category },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(400).send("Subcategory update failed.");
  }
};

exports.removeSubcategory = async (req, res) => {
  try {
    const deleted = await Subcategory.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deleted);
  } catch (err) {
    console.log(err);
    res.status(400).send("Subcategory deletion failed.");
  }
};

exports.listSubcategories = async (req, res) => {
  res.json(await Subcategory.find().sort({ createdAt: -1 }).exec());
};

exports.listSubcategoriesSortedAlpha = async (req, res) => {
  res.json(await Subcategory.find().sort({ name: 1 }).exec());
};

exports.listSubcategoriesByCategorySortedAlpha = async (req, res) => {
  res.status(200).json(
    await Subcategory.find({ parent: req.params.categoryId })
      .sort({ name: 1 })
      .then((response) => {
        console.log("response within listSub...ByCateg...", response);
        if (!response) {
          res.status(401).json({ message: "No subcategories found." });
        } else {
          res.status(200).json(response);
        }
      })
      .catch((err) => console.log(err))
  );
};

// exports.readCategory = async (req, res) => {
//   const category = await Category.findOne({ slug: req.params.slug })
//     .then((response) => {
//       console.log(response);
//       if (!response) {
//         res.status(401).json({ message: "This category doesn't exist." });
//       } else {
//         res.status(200).json(response);
//       }
//     })
//     .catch((err) => console.log(err));
// };
