import cors from 'cors'
import express, { Request, Response, urlencoded } from 'express';
import http from 'http'
import router from './routes/routes';
import {LATEST_API_VERSION, shopifyApi, Session, ApiVersion} from '@shopify/shopify-api'
import {restResources} from '@shopify/shopify-api/rest/admin/2023-07'

require('dotenv').config()

const { API_KEY, API_SECRET_KEY, SCOPES, HOST, ADMIN_API_ACCESS_TOKEN } = process.env

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

