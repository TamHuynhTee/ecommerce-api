import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource, In } from 'typeorm';
import { AppModule } from '../src/app.module';
import {
  Product,
  ProductStatus,
} from '../src/modules/products/entities/product.entity';
import { ProductVariant } from '../src/modules/products/entities/product-variant.entity';

const API_URL = 'https://dummyjson.com/products?limit=100';

interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  thumbnail: string;
  images: string[];
}

interface DummyJsonResponse {
  products: DummyJsonProduct[];
}

function createSlug(value: string, id: number): string {
  const slug = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${slug}-${id}`;
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

async function seedProducts(): Promise<void> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Cannot fetch products: ${response.status} ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as DummyJsonResponse;

  if (!Array.isArray(payload.products) || payload.products.length === 0) {
    throw new Error('DummyJSON returned no products');
  }

  const products = payload.products.map((product) => {
    const discountRate = Math.max(0, product.discountPercentage) / 100;
    const compareAtPrice = roundCurrency(product.price);
    const discountedPrice = roundCurrency(product.price * (1 - discountRate));
    const hasDiscount = discountRate > 0 && discountedPrice < compareAtPrice;

    return {
      name: product.title,
      slug: createSlug(product.title, product.id),
      description: product.description,
      brand: product.brand ?? null,
      status: ProductStatus.ACTIVE,
      thumbnailUrl: product.thumbnail,
      isFeatured: product.rating >= 4.5,
      variants: [
        {
          sku: product.sku || `DUMMY-${product.id}`,
          name: 'Default',
          price: hasDiscount ? discountedPrice : compareAtPrice,
          compareAtPrice: hasDiscount ? compareAtPrice : null,
          stock: Math.max(0, product.stock),
          imageUrl: product.images?.[0] ?? product.thumbnail,
          attributes: {
            sourceId: String(product.id),
            category: product.category,
            rating: String(product.rating),
            weight: product.weight ? String(product.weight) : '',
            dimensions: product.dimensions
              ? `${product.dimensions.width}x${product.dimensions.height}x${product.dimensions.depth}`
              : '',
            warranty: product.warrantyInformation ?? '',
            shipping: product.shippingInformation ?? '',
            availability: product.availabilityStatus ?? '',
          },
          isActive: product.stock > 0,
        },
      ],
    };
  });

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  try {
    const dataSource = app.get(DataSource);

    const result = await dataSource.transaction(async (manager) => {
      const productRepository = manager.getRepository(Product);
      const variantRepository = manager.getRepository(ProductVariant);
      const slugs = products.map((product) => product.slug);
      const skus = products.map((product) => product.variants[0].sku);

      const existingProducts = await productRepository.find({
        where: { slug: In(slugs) },
        withDeleted: true,
      });
      const productBySlug = new Map(
        existingProducts.map((product) => [product.slug, product]),
      );

      const productsToSave = products.map(({ variants, ...productData }) => {
        const entity = productBySlug.get(productData.slug);

        return productRepository.create({
          ...entity,
          ...productData,
          deletedAt: null,
        });
      });

      const savedProducts = await productRepository.save(productsToSave, {
        chunk: 50,
      });
      const savedProductBySlug = new Map(
        savedProducts.map((product) => [product.slug, product]),
      );

      const existingVariants = await variantRepository.find({
        where: { sku: In(skus) },
        withDeleted: true,
      });
      const variantBySku = new Map(
        existingVariants.map((variant) => [variant.sku, variant]),
      );

      const variantsToSave = products.map((product) => {
        const variantData = product.variants[0];
        const entity = variantBySku.get(variantData.sku);
        const savedProduct = savedProductBySlug.get(product.slug);

        if (!savedProduct) {
          throw new Error(`Cannot resolve seeded product: ${product.slug}`);
        }

        return variantRepository.create({
          ...entity,
          ...variantData,
          productId: savedProduct.id,
          deletedAt: null,
        });
      });

      await variantRepository.save(variantsToSave, { chunk: 50 });

      const [productCount, variantCount] = await Promise.all([
        productRepository.count({ where: { slug: In(slugs) } }),
        variantRepository.count({ where: { sku: In(skus) } }),
      ]);

      return { productCount, variantCount };
    });

    console.log(
      `Seed complete: ${result.productCount} products and ${result.variantCount} variants are present in the database`,
    );
  } finally {
    await app.close();
  }
}

seedProducts().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Product seeding failed: ${message}`);
  process.exitCode = 1;
});
