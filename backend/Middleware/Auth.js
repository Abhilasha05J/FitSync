// import jwt from 'jsonwebtoken'; 
// const ensureAuthenticated = (req, res, next)=>{
//     const auth = req.headers['authorization'];
//     console.log('Authorization Header' , auth)
//     if(!auth){
//         return res.status(403)
//         .json({message:'Unauthorized!, JWT Token is required'});
//     }
//     try{
//   const decoded = jwt.verify(auth, process.env.JWT_SECRET);
//   req.user = decoded;
//   console.log('abc')
//   next();
//     }
//     catch(err)
//     {
//         return res.status(401)
//         .json({message:'Unauthorized!, Invalid Token or Token Expired'});
//     }
// }

// export default ensureAuthenticated;
// import jwt from 'jsonwebtoken';
// import axios from 'axios'; // You'll need to install axios for Google token verification

// const ensureAuthenticated = async (req, res, next) => {
//     const auth = req.headers['authorization'];
  
//     if (!auth) {
//         return res.status(403)
//         .json({message:'Unauthorized! Authentication token is required'});
//     }

//     try {
//         // Check if it's a Google OAuth token
//         if (auth.startsWith('Google ')) {
//             const googleToken = auth.split(' ')[1];
            
//             // Verify Google token
//             const response = await axios.get(
//                 `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleToken}`
//             );

//             // Additional checks for Google token
//             if (response.data.aud !== process.env.GOOGLE_CLIENT_ID) {
//                 return res.status(401)
//                 .json({message:'Unauthorized! Invalid Google token'});
//             }

//             // Set user information from Google token
//             req.user = {
//                 id: response.data.sub,
//                 email: response.data.email,
//                 name: response.data.name,
//                 loginType: 'google'
//             };

//             return next();
//         }

//         // Traditional JWT token verification
//         const decoded = jwt.verify(auth, process.env.JWT_SECRET);
//         req.user = {
//             ...decoded,
//             loginType: 'jwt'
//         };

//         next();
//     }
//     catch(err) {
//         // Differentiate between different types of authentication errors
//         if (err.name === 'JsonWebTokenError') {
//             return res.status(401)
//             .json({message:'Unauthorized! Invalid JWT Token'});
//         }
        
//         if (err.name === 'TokenExpiredError') {
//             return res.status(401)
//             .json({message:'Unauthorized! Token Expired'});
//         }

//         // For Google token verification errors
//         return res.status(401)
//         .json({message:'Unauthorized! Authentication failed'});
//     }
// }

// export default ensureAuthenticated;


import jwt from 'jsonwebtoken';
import axios from 'axios';

const ensureAuthenticated = async (req, res, next) => {
    const auth = req.headers['authorization'];
    
    // Log for debugging
    console.log('Authorization Header:', auth);

    if (!auth) {
        return res.status(403).json({
            message: 'Unauthorized! Authentication token is required'
        });
    }

    try {
        // Remove 'Bearer ' or 'Google ' prefix and trim
        const token = auth.replace(/^(Bearer\s+|Google\s+)/i, '').trim();

        // First, attempt Google token verification
        if (auth.toLowerCase().startsWith('google ')) {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
                );

                // Validate Google token
                if (response.data.aud !== process.env.GOOGLE_CLIENT_ID) {
                    return res.status(401).json({
                        message: 'Unauthorized! Invalid Google token'
                    });
                }

                // Set user information from Google token
                req.user = {
                    id: response.data.sub,
                    email: response.data.email,
                    name: response.data.name,
                    loginType: 'google'
                };

                return next();
            } catch (googleError) {
                console.error('Google Token Verification Error:', googleError);
                return res.status(401).json({
                    message: 'Unauthorized! Google token verification failed'
                });
            }
        }

        // If not a Google token, verify as JWT
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Set user information from JWT
            req.user = {
                ...decoded,
                loginType: 'jwt'
            };

            return next();
        } catch (jwtError) {
            console.error('JWT Token Verification Error:', jwtError);

            // Specific error handling for JWT
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: 'Unauthorized! JWT Token has expired'
                });
            }

            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    message: 'Unauthorized! Invalid JWT Token'
                });
            }

            // Catch-all for other JWT verification errors
            return res.status(401).json({
                message: 'Unauthorized! Authentication failed'
            });
        }
    } catch (error) {
        console.error('Unexpected Authentication Error:', error);
        return res.status(401).json({
            message: 'Unauthorized! Authentication process failed'
        });
    }
};

export default ensureAuthenticated;