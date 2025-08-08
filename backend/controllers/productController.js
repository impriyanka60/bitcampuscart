const Product = require('../models/Product');

// POST /api/products
const addProduct = async (req, res) => {
  try {
    const { title, description, price, category, condition, image } = req.body;

    const product = new Product({
      title,
      description,
      price,
      category,
      condition,
      image,
      seller: req.user._id  // ✅ seller from auth token
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).populate("seller", "name email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// GET /api/products/my-products
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your products", error });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.seller.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  Object.assign(product, req.body);
  const updated = await product.save();

  res.json(updated);
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the logged-in user is the seller
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


module.exports = {
  addProduct,
  getProducts,
  getMyProducts,
  updateProduct,
  deleteProduct
};
