import productModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js";

const PAGE_SIZE = 12;

// Card ko jo fields chahiye wahi bhejo
const PRODUCT_FIELDS =
  "name title slug sku images image imageUrl price sellingPrice currency stock stockStatus isActive categoryId";

// SKU ka aakhri number nikalta hai: "PK-59" -> 59, "R-007" -> 7, "ABC" -> 0
// (MongoDB 4.2+ chahiye, $regexFind ke liye)
const SKU_NUMBER = {
  $let: {
    vars: {
      m: {
        $regexFind: {
          input: { $toString: { $ifNull: ["$sku", ""] } },
          regex: "(\\d+)\\s*$",
        },
      },
    },
    in: {
      $convert: {
        input: {
          $arrayElemAt: [{ $ifNull: ["$$m.captures", []] }, 0],
        },
        to: "long",
        onError: 0,
        onNull: 0,
      },
    },
  },
};

// Parent + saari nested child categories ki IDs (ObjectId hi rakhi hain,
// kyunki aggregate me string se auto-cast nahi hota)
const getCategoryTreeIds = async (rootId) => {
  const seen = new Map([[rootId.toString(), rootId]]);
  let parentIds = [rootId];

  while (parentIds.length > 0) {
    const children = await categoryModel
      .find({ parentId: { $in: parentIds } })
      .select("_id")
      .lean();

    const fresh = children.filter((child) => !seen.has(child._id.toString()));

    if (fresh.length === 0) break;

    fresh.forEach((child) => seen.set(child._id.toString(), child._id));
    parentIds = fresh.map((child) => child._id);
  }

  return [...seen.values()];
};

const getproducts = async (req, res) => {
  try {
    const { slug } = req.params;

    // Pagination
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      PAGE_SIZE,
      Math.max(1, parseInt(req.query.limit, 10) || PAGE_SIZE)
    );
    const skip = (page - 1) * limit;

    // Category
    const category = await categoryModel.findOne({ slug }).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Sirf active products (count bhi inhi ka)
    const filter = { isActive: { $ne: false } };

    if (slug !== "all-jewellery") {
      filter.categoryId = { $in: await getCategoryTreeIds(category._id) };
    }

    const [totalProducts, pageRows] = await Promise.all([
      productModel.countDocuments(filter),

      // Step 1: halka aggregation, sirf sorted page ki IDs
      productModel.aggregate([
        { $match: filter },
        { $project: { sku: 1, skuNum: SKU_NUMBER } },
        { $sort: { skuNum: 1, sku: 1, _id: 1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
    ]);

    // Step 2: unhi IDs ke poore products, wahi order me
    const ids = pageRows.map((row) => row._id);

    const found = await productModel
      .find({ _id: { $in: ids } })
      .select(PRODUCT_FIELDS)
      .lean();

    const byId = new Map(found.map((p) => [p._id.toString(), p]));

    const products = ids
      .map((id) => byId.get(id.toString()))
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      category,
      products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + products.length < totalProducts,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProductBySKU = async (req, res) => {
    try {
        const { sku , id } = req.params;
        const product = await productModel.findOne({ sku: sku, _id: id });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Get product by SKU error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export { getproducts, getProductBySKU };