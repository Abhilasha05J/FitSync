import ensureAuthenticated from '../Middleware/Auth.js'; 
import express from 'express';

const router = express.Router();


router.get('/', ensureAuthenticated, (req, res) =>{
    console.log('---logged in user details---', req.user);
    res.status(200).json([
        {
            name: "a",
            price:10000

        },
        {
            name:"b",
             price:20000
        }
    ])
});

export default router;