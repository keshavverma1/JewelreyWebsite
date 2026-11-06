import {Router} from "express";
import { getproducts,getProductBySKU} from "../controller/product.controller.js";

const productRouter = Router();

productRouter.get("/p1/:slug", getproducts);
productRouter.get("/p1/:sku/:id", getProductBySKU);


export default productRouter;
