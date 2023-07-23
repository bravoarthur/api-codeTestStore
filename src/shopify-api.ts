import cors from 'cors'
import express, { Request, Response, urlencoded } from 'express';
import http from 'http'
import router from './routes/routes';
import {LATEST_API_VERSION, shopifyApi, Session, ApiVersion} from '@shopify/shopify-api'
import {restResources} from '@shopify/shopify-api/rest/admin/2023-07'

require('dotenv').config()

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST, HOST_SCHEME, ADMIN_API_ACCESS_TOKEN } = process.env

const app = express();
app.use(cors())
app.use(router)
app.use(express.json());
app.use(urlencoded({ extended: true }));

export const shopify = shopifyApi({ 
    apiKey: API_KEY,
    apiSecretKey: API_SECRET_KEY!,
    scopes: [SCOPES!],
    hostName: HOST!,
    hostScheme: 'https',
    isEmbeddedApp: false,
    apiVersion: LATEST_API_VERSION,
    restResources: restResources,
    isCustomStoreApp: true,
    adminApiAccessToken: ADMIN_API_ACCESS_TOKEN
        
})


app.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ error: "PAGE NOT FOUND" });
});

const httpServer = http.createServer(app);

httpServer.listen(3434, () => console.log('Your app is listening on port 3434.'));

















/*


import {LATEST_API_VERSION, shopifyApi, Session, ApiVersion} from '@shopify/shopify-api'
import '@shopify/shopify-api/adapters/node';
import { Request, Response } from 'express';
import express from 'express';
const app = express();
import http from 'http';
import {restResources} from '@shopify/shopify-api/rest/admin/2023-07'
import {MemorySessionStorage} from '@shopify/shopify-app-session-storage-memory'
import Auth from './middlewares/Auth';

export const sessionStorage = new MemorySessionStorage()

const history = [] as string[]

require('dotenv').config()

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST, HOST_SCHEME } = process.env

const shopify = shopifyApi({ 
    apiKey: API_KEY,
    apiSecretKey: API_SECRET_KEY!,
    scopes: [SCOPES!],
    hostName: HOST!,
    hostScheme: 'https',
    isEmbeddedApp: false,
    apiVersion: LATEST_API_VERSION,
    restResources: restResources,
        
})



const ACTIVE_SHOPIFY_SHOPS = [] as string[];

app.get('/', async (http_request: Request, http_response: Response) => {  
    
    if(ACTIVE_SHOPIFY_SHOPS.length === 0) {
        console.log('vai autenticar de novo')
        history.push(http_request.query.prev as string)
        http_response.redirect(`/auth/shopify`);
    } else {
        http_response.send('<html><body><p>Your Node instance is running.</p></body></html>');
    }
});

app.get('/auth/shopify', async (http_request, http_response) => {
    
    await shopify.auth.begin({
        rawRequest: http_request,
        rawResponse: http_response,
        shop: SHOP!,
        callbackPath:'/auth/shopify/callback',
        isOnline: true
    });
    console.log('chegou aqui')
});

/*let sessionId = ''
let state = ''
let accessToken = '' *//*

app.get('/auth/shopify/callback', async (http_request: Request , http_response:Response) => {
    
       const callbackResponse = await shopify.auth.callback({
            rawRequest: http_request,
            rawResponse: http_response,
            });
        ACTIVE_SHOPIFY_SHOPS.push( callbackResponse.session.scope as string);  

        console.log('AQUIOOOO')

        await sessionStorage.storeSession(callbackResponse.session)

        console.log(callbackResponse.session)

        /*const retriev  = await sessionStorage.findSessionsByShop(SHOP!)

        console.log(retriev)*/
        /*sessionId=callbackResponse.session.id
        state=callbackResponse.session.state
        accessToken=callbackResponse.session.accessToken!*/
        /*
        if(history.length === 0) {            
            return http_response.redirect('/auth/shopify/success');
        } else {
            console.log('vai Redirecionar para Products')
            return http_response.redirect(history[0]);
        }*//*

        if(history.length === 0) {            
            return http_response.redirect('/auth/shopify/success');
        } else {
            console.log('vai Redirecionar para Products')
            return http_response.redirect(history[0]);
        }
    
});

app.get('/auth/shopify/success', async  (http_request: Request, http_response: Response) => {
    http_response.send('<html><body><p>You have successfully authenticated and are back at your app.</p></body></html>');
});


app.get('/api/products', Auth.logged, async (req, res) => {

    console.log('AQUI A LOJA:'+SHOP!)
    const sessionRet = req.body.session
    console.log(sessionRet)   
    history.length = 0
               
    const countData = await shopify.rest.Product.all({session:sessionRet});
    
    res.status(200).send(countData);
})


const httpServer = http.createServer(app);

httpServer.listen(3434, () => console.log('Your Slack-OAuth app is listening on port 3434.'));


/*
const session = new Session({
    id: sessionId,
    shop: SHOP!,
    state: state,
    isOnline: true,
    accessToken: accessToken,
  });
const clone = new Session({...session, id: 'newId'});

const restClient = new shopify.clients.Rest({session: session});


app.get('/products', async (http_request, http_response) => {
    const client_session = await Shopify.Utils.loadCurrentSession(http_request, http_response);
    console.log('client_session: ' + JSON.stringify(client_session));

    const client = new Shopify.Clients.Rest(client_session.shop, client_session.accessToken);

    const products = await client.get({
        path: 'products'
    });
    console.log('Products: ' + JSON.stringify(products));

    let product_names_formatted = '';
    for(let i =0; i < products.body.products.length; i++) {
       product_names_formatted += '<p>' + products.body.products[i].title + '</p>';
    }

    http_response.send(`<html><body><p>Products List</p>
          ${product_names_formatted}
          </body></html>`);

});
*/


/*
app.get('/api/products', async (req, res) => {

    console.log('AQUI A LOJA:'+SHOP!)
    const sessionRet = await sessionStorage.findSessionsByShop(SHOP!)
    console.log(sessionRet)

    if(sessionRet.length === 0) {
        console.log('vai Reenviar')
        history.push('/api/products')
        return res.redirect('/')
    }

    history.length = 0*/

    /*const client = new shopify.clients.Rest({
        session: sessionRet[0],
        apiVersion: LATEST_API_VERSION
    })
    
    const countData = await client.get({
        path: 'products'
    })   */   /* 
           
    const countData = await shopify.rest.Product.all({session:sessionRet[0]});
    
    res.status(200).send(countData);


  });*/
