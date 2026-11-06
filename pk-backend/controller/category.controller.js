





import categoryModel from "../models/category.model.js";

// GET ALL CATEGORIES WITH SUBCATEGORIES
const getAllCategories = async (req, res) => {
  try {
    // 1. Fetch all active categories
    const categories = await categoryModel
  .find({ isActive: true })
  .sort({ sortOrder: 1 })
  .lean();


    // 2. Create a map with empty children arrays
    const categoryMap = new Map();

    categories.forEach((category) => {
      categoryMap.set(category._id.toString(), {
        ...category,
        children: [],
      });
    });

    // 3. Separate main categories and attach children
    const mainCategories = [];

    categories.forEach((category) => {
      const current = categoryMap.get(
        category._id.toString()
      );

      if (category.parentId) {
        const parent = categoryMap.get(
          category.parentId.toString()
        );

        if (parent) {
          parent.children.push(current);
        }
      } else {
        mainCategories.push(current);
      }
    });

    // 4. Send response
    return res.status(200).json({
      success: true,
      count: mainCategories.length,
      categories: mainCategories,
    });
  } catch (error) {
    console.error("Get all categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};



export { getAllCategories };
