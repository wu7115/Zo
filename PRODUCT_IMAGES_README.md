# Adding Your Product Images

## Where to Store Images

Store your 8 product images in the `public/images/products/` directory:

```
public/
  images/
    products/
      product1.png
      product2.png
      product3.png
      product4.png
      product5.png
      product6.png
      product7.png
      product8.png
```

## Image Requirements

- **Format**: PNG (as specified)
- **Size**: Recommended 400x400px or larger (square aspect ratio)
- **File names**: Must match exactly: `product1.png`, `product2.png`, etc.

## Your Products

The following products are configured:

1. **Bone Broth** - $6.00 (was $7.00) - 4.4/5 ⭐ - 927 units sold
2. **Hydration Powder** - $6.00 (was $7.00) - 4.2/5 ⭐ - 124 units sold
3. **Probiotics** - $6.00 (was $7.00) - 4.1/5 ⭐ - 829 units sold
4. **Recovery Coffee** - $3.00 (was $4.00) - 4.5/5 ⭐ - 1,179 units sold
5. **ZoCam-O1** - $399.00 (was $400.00) - 4.8/5 ⭐ - 2,203 units sold
6. **ZoCam-O2** - $399.00 (was $400.00) - 4.6/5 ⭐ - 1,022 units sold
7. **ZoCam-A1** - $799.00 (was $800.00) - 4.4/5 ⭐ - 799 units sold
8. **Microbiome Testing Kit** - $29.00 (was $30.00) - 4.6/5 ⭐ - 322 units sold

## How It Works

1. **Cycling**: The app cycles through your 8 products as users scroll
2. **Loop**: After showing all 8 products, it starts over from product 1
3. **Infinite**: This creates an infinite loop of your products
4. **Enhanced Display**: Shows ratings, sales numbers, and original prices

## Product Card Features

Each product card displays:
- Product image
- Product name as title
- Star rating with rating score
- Sales count
- Current price (highlighted)
- Original price (crossed out)
- Product description
- "View Product" link

## Next Steps

1. Add your 8 product images to `public/images/products/` as PNG files
2. Update the product links in `src/data/products.ts` with your actual store URLs
3. Test the infinite scroll to see your products cycle through 