export default {
    insert: `INSERT INTO product(code, title, vendor, body_html)
            VALUES($1, $2, $3, $4) RETURNING code;`,
    getAll: `SELECT * FROM product;`,
    getOne: `SELECT * FROM product WHERE code = $1;`
}