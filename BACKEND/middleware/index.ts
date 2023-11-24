import {  NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { Response } from 'express';




//the key to site
 export const KEY = "this_is_the_key";

 
 

//authorization 
 export const handleToken = (req: Request, res: Response, next: NextFunction )=>{
  const authHead = req.headers.authorization;
  //if authHead then this code
  if(authHead){
    //split the token from bearer
    const token = authHead.split(" ")[1];
    jwt.verify(token, KEY, (err, payload)=>{
      if(err){
        return res.sendStatus(403); //understand the request but won't give a shit
      }
      if(!payload){
        return res.sendStatus(403);
      }
      if(typeof payload === 'string'){
        return res.sendStatus(403);
      }
      req.headers["userID"] = payload._id
      next();
    })
  }
  //if not authHead this send 401:unathorized
  else{
    return res.sendStatus(401);
  }
}

