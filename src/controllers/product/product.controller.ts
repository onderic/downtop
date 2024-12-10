import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { productService } from '../../services';
import shopService from '../../services/shop/shop.service';
import categoryService from '../../services/product/category.service';

const createProduct = catchAsync(async (req, res) => {
  const {
    name,
    quantity,
    minPurchase,
    description,
    brand,
    mktPrice,
    sellingPrice,
    size,
    colors,
    img,
    shopId,
    categoryId
  } = req.body;

  await Promise.all([shopService.getShop(shopId), categoryService.getCategoryById(categoryId)]);

  const product = await productService.createProduct({
    name,
    quantity,
    minPurchase,
    description,
    brand,
    mktPrice,
    sellingPrice,
    size,
    colors,
    img,
    shopId,
    categoryId
  });
  res.status(httpStatus.CREATED).send(product);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProduct(req.params.productId);
  res.status(httpStatus.OK).send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.productId, req.body);
  res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getAllProducts = catchAsync(async (req, res) => {
  interface QueryParams {
    limit?: string;
    page?: string;
    name?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
  }

  const {
    limit = '10',
    page = '1',
    name,
    categoryId,
    minPrice,
    maxPrice
  } = req.query as QueryParams;

  const result = await productService.getAllProducts({
    limit: parseInt(limit, 10),
    page: parseInt(page, 10),
    name,
    categoryId,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
  });

  res.status(httpStatus.OK).send(result);
});

export default { createProduct, getProduct, updateProduct, deleteProduct, getAllProducts };
