-- name: ListWardrobeItems :many
SELECT * FROM wardrobe_items
WHERE user_id = $1
  AND (sqlc.narg('category')::text IS NULL OR category = sqlc.narg('category')::text)
ORDER BY created_at DESC;

-- name: GetWardrobeItem :one
SELECT * FROM wardrobe_items WHERE id = $1;

-- name: AddWardrobeItem :one
INSERT INTO wardrobe_items (user_id, name, brand, category, color, image_url, source_type, source_url, popular_item_id, price)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, sqlc.narg('popular_item_id')::uuid, $9)
RETURNING *;

-- name: UpdateWardrobeItem :one
UPDATE wardrobe_items SET
    name = $2, brand = $3, category = $4, color = $5, image_url = $6,
    updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteWardrobeItem :exec
DELETE FROM wardrobe_items WHERE id = $1;

-- name: GetWardrobeCategories :many
SELECT category, COUNT(*)::int AS count
FROM wardrobe_items
WHERE user_id = $1
GROUP BY category;

-- name: GetWardrobeStats :one
SELECT
  COUNT(*)::int AS total_items,
  MAX(created_at) AS latest_item_created_at,
  json_object_agg(category, category_count) AS items_per_category
FROM (
  SELECT
    category,
    COUNT(*)::int AS category_count,
    MAX(created_at) AS created_at
  FROM wardrobe_items
  WHERE user_id = $1
  GROUP BY category
) sub;