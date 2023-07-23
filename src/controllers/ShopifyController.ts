import { Request, Response } from 'express';
import {LATEST_API_VERSION, shopifyApi, Session, ApiVersion} from '@shopify/shopify-api'
import '@shopify/shopify-api/adapters/node';
import { shopify } from '../shopify-api';
import { RequestReturn } from '@shopify/shopify-api/lib/clients/types'

require('dotenv').config()
const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST, HOST_SCHEME, ADMIN_API_ACCESS_TOKEN } = process.env


type FilterType = {   
    path: string,
    query?: {
        collection_id?: string,
        title?: string,
        limit?: string,
        page_info?: string

    } 
};

interface Pagination extends RequestReturn {
    pageInfo?: {limit: string,
               nextPage: {query: {page_info: string }},
               prevPage: {query: {page_info: string }}
               }
    body: {products: []}
}


const ShopifyController = {

    getProducts: async (req: Request, res: Response) => {

        const session = shopify.session.customAppSession(SHOP!)               
        const data = await shopify.rest.Product.all({session});        
        res.status(200).json(data)        
    },

    getCategories: async (req: Request, res: Response) => {

        const session = shopify.session.customAppSession(SHOP!)                  
        const data = await shopify.rest.SmartCollection.all({session, ids: '453421007147,453421039915,453421072683,453421105451,453421302059,453421138219' });            
        res.status(200).json(data)       
    },

    getItem: async (req: Request, res: Response) => {

        const id = req.params.id
        console.log(req.params)

        if(id) {        
            const session = shopify.session.customAppSession(SHOP!)                        
            const data = await shopify.rest.Product.find({session, id: id.toString()}); 
            res.status(200).json({data})   
        } else {
            res.status(400).json({error: 'Product Not Found'})
        }
        
    },

    getCatalogue: async (req: Request, res: Response) => {

        let { nextPage, limit = 20, q, cat} = req.query;
        let filters: FilterType = { path: 'products', query: {limit: limit.toString()}};
        
        if (q) {
            q = q as string;
            filters.query!.title = q;
        }
    
        if (cat) {
            const catFilter = cat
            filters.query!.collection_id = catFilter.toString()        
        }    
    
        if(nextPage) {
            filters.query!.page_info = nextPage as string
        }
    
       console.log(filters)
    
    
        const session = shopify.session.customAppSession(SHOP!)
        const client = new shopify.clients.Rest({session})
        const counter = await shopify.rest.Product.count({
            session: session, collection_id: filters.query!.collection_id ? filters.query!.collection_id : null, title: filters.query!.title ? filters.query!.title : null
          }) as {count:number}
    
        const info = await client.get(filters) as Pagination
        let nextPageUrl = ''
        let previousPageUrl = ''
    
        if(info.pageInfo) {
           
            if(info.pageInfo.nextPage) {            
                nextPageUrl = info.pageInfo.nextPage.query.page_info 
            }
            if(info.pageInfo.prevPage) { 
                console.log(info.pageInfo.prevPage.query.page_info)           
                previousPageUrl = info.pageInfo.prevPage.query.page_info 
            }
        }
    
        let total: number = 0
        
        if(counter.count) {
            total = counter.count
        }
    
        
        const data = {data: {
                        productsList: info.body.products,
                        nextPageUrl: nextPageUrl,
                        previousPage: previousPageUrl,
                        total: total
                        }    
                    } 
    
        
            
        res.status(200).json(data);
        
    },



    
}

export default ShopifyController




