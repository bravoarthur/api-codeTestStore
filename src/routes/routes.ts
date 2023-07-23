import { Router, Request, Response } from "express";
import ShopifyController from "../controllers/ShopifyController";


const router = Router()

router.get('/', async (req: Request, res: Response) => {    
    res.json({ping: 'Ping'})
})

router.get('/api/products', ShopifyController.getProducts)

router.get('/api/categories', ShopifyController.getCategories)

router.get('/api/product/:id', ShopifyController.getItem)

router.get('/api/catalogue', ShopifyController.getCatalogue)


export default router

