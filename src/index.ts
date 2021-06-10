import express, { Response, Request } from 'express';
import axios from 'axios';

// import DB from './util/db';

import Product from './models/product'
// import variant from './models/variant';
// import image from './models/image';
// import product from './models/product';

interface Inventory {
    productId?: string;
    variantId?: string;
    stock?: number; //int64
}

export interface Product {
    code: string;
    title?: string;
    vendor?: string;
    bodyHtml?: string;
    variants?: Variant[];
    images?: Image[];
}

interface Variant {
    id?: string;
    title?: string;
    sku?: string;
    available?: boolean;
    inventory_quantity?: number; //int64
    weight?: Weight;
}

interface Weight {
    value?: number; //int64
    unit?: string;
}

interface Image {
    source: string;
    variantId: string;
}

// interface Error {
//     message: string;
// }

let products: Product[] = [];

// I saved one instance here to save hitting the api over and over
// let products: Product[] =  [{"code":"1000000001","title":"Product title","vendor":"Product Vendor","bodyHtml":"<strong>Product Body HTML</strong>","variants":[{"id":"1000000002","title":"Variant Title","sku":"Variant-SKU-1","available":true,"inventory_quantity":0,"weight":{"value":0,"unit":"lb"}}],"images":[]},{"code":"2000000001","title":"Product title","vendor":"Product Vendor","bodyHtml":"<strong>Product Body HTML</strong>","variants":[{"id":"2000000002","title":"Variant Title","sku":"Variant-SKU-1","available":true,"inventory_quantity":0,"weight":{"value":0,"unit":"lb"}},{"id":"2000000003","title":"Variant Title","sku":"Variant-SKU-1","available":true,"inventory_quantity":0,"weight":{"value":0,"unit":"lb"}}],"images":[{"source":"https://via.placeholder.com/250","variantId":"2000000002"},{"source":"https://via.placeholder.com/150","variantId":"2000000003"},{"source":"https://via.placeholder.com/150","variantId":"2000000003"}]}];

const main = async () => {
    const res = await axios.get('https://my-json-server.typicode.com/convictional/engineering-interview/products');

    // for dev only
    // await DB.query('DELETE FROM product;')
    // await DB.query('DELETE FROM variant;')
    // await DB.query('DELETE FROM image;')

    // I started simple storing the data locally


    if (!res.data) return console.log('Error fetching data', res.statusText)
    res.data.forEach((d: any) => {
        if (!d.id) return;// throw some sort of error

        let variants: Variant[] = [];
        let images: Image[] = [];

        d.variants.forEach((v: any) => {
            variants.push({
                id: v.id.toString() || null,
                title: v.title || null,
                sku: v.sku || null,
                available: true,
                inventory_quantity: 0,
                weight: {
                    value: v.weight,
                    unit: v.weight_unit
                }
            });
            v.images.forEach((i: any) => {
                images.push({
                    source: i.src,
                    variantId: v.id.toString()
                })
            });
        })
        products.push({
            code: d.id.toString(),
            title: d.title || null,
            vendor: d.vendor || null,
            bodyHtml: d.body_html || null,
            variants,
            images,
        })
    });

    // here I began migrating to a postgres DB 
    // res.data.forEach(async (d: any) => {

    //     if (!d.id) return;// throw some sort of error

    //     //insert into product
    //     const { rows: prodRows } = await DB.query(Product.insert,[
    //         d.id.toString(),
    //         d.title || null,
    //         d.vendor || null,
    //         d.body_html || null,
    //     ]).catch(e => {
    //         console.log('err1', e);
    //         return { rows: []}
    //     });

    //     const productId = prodRows[0]

    //     //insert into variant
    //     d.variants.forEach(async (v: any) => {
    //         try {
              
    //             const { rows } = await DB.query(variant.insert,[
    //                 v.id.toString() || null,
    //                 productId,
    //                 v.title || null,
    //                 v.sku || null,
    //                 1,
    //                 0,
    //                 v.weight || null,
    //                 v.weight_unit || null
    //             ]).catch(e => {
    //                 console.log('err2', e);
    //                 return { rows: []}
    //             });

    //             const variantId = rows[0];

    //             //insert into image
    //             v.images.forEach(async (i: any) => {
    //                 await DB.query(image.insert, [
    //                     i.src,
    //                     variantId
    //                 ]).catch(e => {
    //                     console.log('err3', e);
    //                     return { rows: []}
    //                 });
    //             });
              
    //         } catch (error) {
    //             console.log('errr', error)
    //         }
    //     })
    // });

    const app = express();

    app.get('/products', async (_, res: Response) => {
        // const { rows: dbProducts } = await DB.query(Product.getAll);
        // // return res.json({data: products.rows})
        // if (!dbProducts.length) return res.status(404).json({
        //     msg: 'No Products Found'
        // })
        // res.json(dbProducts);
        if (!products.length) return res.status(404).json({
            msg: 'No Products Found'
        })
        res.json(products);
        return;
    });

    app.get('/products/:id', (req: Request, res: Response) => {
        const productId = req.params.id;
        if (isNaN(parseInt(productId)) || parseInt(productId) !== Number(req.params.id)) return res.status(400).json({
            message: 'Invalid ID'
        })
        
        let product: Product | null = null;
        for (let i = 0; i < products.length; i++) {
            if (products[i].code === productId) {
                product = products[i];
                break;
            }
        }
        if (!product) return res.status(404).json({
            message: 'Product not Found',
        });
        return res.json(product);
    });

    app.get('/store/inventory', (_, res: Response) => {
        let inventoryRes: Inventory[] = [];

        products.forEach(p => {
            p.variants?.forEach(v => {
                inventoryRes.push({
                    productId: p.code,
                    variantId: v.id,
                    stock: 0
                })
            })
        })

        res.json(inventoryRes);
    })

    app.listen(4000, () => console.log('API listening on port 4000'))
}

main();