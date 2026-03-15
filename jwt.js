 const jwt =require('jsonwebtoken');

 const jwtAuthMiddleware=(req,res,next)=>{

    //firrst check request has authorization header or not
    const authorization=req.headers.authorization
    if(!authorization)return res.status(401).json({error:'Token Not Found'});

    const token=req.headers.authorization.split(' ')[1];//Extract the token from the Authorization header
    
    if(!token){
        return res.status(401).json({error:'Unauthorized'});
    }
        try{
          const decoded=jwt.verify(token,process.env.JWT_SECRET);

          req.user=decoded
          next();
        }catch(err){
            console.log(err);
            return res.status(401).json({error:'Invalid token'});
        }
    }
 

 const generateToken=(userData)=>{
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:'8h'});
 }
 module.exports={jwtAuthMiddleware,generateToken};