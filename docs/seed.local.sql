-- Only for a NEW LOCAL database after yarok-be/database/001_schema.sql.
BEGIN;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM categories) OR EXISTS (SELECT 1 FROM colors)
     OR EXISTS (SELECT 1 FROM products) OR EXISTS (SELECT 1 FROM product_variants)
     OR EXISTS (SELECT 1 FROM product_images) THEN
    RAISE EXCEPTION 'Seed requires an empty catalog. Existing data was not changed.';
  END IF;
END $$;
INSERT INTO categories(name, slug) VALUES
  ('Вибропрессованная плитка', 'vibropressovannaya-plitka'),
  ('Вибролитая плитка', 'vibrolitaya-plitka'),
  ('Бордюры', 'bordyury'),
  ('Декоративные изделия', 'dekorativnye-izdeliya');
INSERT INTO colors(name, slug, hex) VALUES
  ('Серый', 'seryj', '#9ca3af'), ('Красный', 'red', '#b45345');
INSERT INTO products(category_id, name, slug, description, is_variable)
SELECT id, 'Старый город (демо)', 'demo-old-town', 'Тестовый товар с двумя цветами.', true
FROM categories WHERE slug = 'vibropressovannaya-plitka';
INSERT INTO products(category_id, name, slug, description, is_variable)
SELECT id, 'Бордюр (демо)', 'demo-curb', 'Тестовый простой товар.', false
FROM categories WHERE slug = 'bordyury';
INSERT INTO product_variants(product_id, color_id, price, sku)
SELECT p.id, c.id, CASE WHEN c.slug = 'seryj' THEN 25.00 ELSE 30.00 END, 'DEMO-TILE-' || c.slug
FROM products p CROSS JOIN colors c WHERE p.slug = 'demo-old-town';
INSERT INTO product_variants(product_id, color_id, price, sku)
SELECT p.id, c.id, 12.00, 'DEMO-CURB-seryj'
FROM products p CROSS JOIN colors c WHERE p.slug = 'demo-curb' AND c.slug = 'seryj';
COMMIT;
