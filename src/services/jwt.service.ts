import {promisify} from 'util'
import jwt from "jsonwebtoken";
import { HttpErrors } from '@loopback/rest';



const name='Spring@123'
export class JWTservice{
    verifyToken(token: string) {
        throw new Error('Method not implemented.');
    }
    async generateToken(springName:string) {
        if(!springName){
            throw new HttpErrors.Unauthorized("error while generating token : springName is NULL")
        };
        const secret='abcq3435';
        const expiresIn='1d';
        const payload = { name: springName };

        return jwt.sign(payload, secret, { expiresIn });

    }
    
}