export default {
    insert: `INSERT INTO variant(id, product_id, title, sku, available, inventory_quantity, weight_value, weight_unit)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`,
    select: ``,

}