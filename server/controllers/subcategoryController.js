const Subcategory = require("./../models/subcategoryModel");
const Product = require("./../models/productModel");
const slugify = require("slugify");
const { capitalize, capitalizeAndTrim } = require("../utils/createFunctions");

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
