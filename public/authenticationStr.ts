//     import {injectable, inject, BindingScope} from '@loopback/core';
//     import {AuthenticationStrategy, TokenService} from '@loopback/authentication';
//     import {HttpErrors, Request} from '@loopback/rest';
// import { JWTservice } from './services/jwt.service';
    

//     @injectable({scope: BindingScope.TRANSIENT})
//     export class SimpleJWTStrategy implements AuthenticationStrategy {
//     name = 'jwt';

//     constructor(
//         @inject('services.jwtservice') private jwtService: JWTservice,
//     ) {}

//     async authenticate(request: Request): Promise<void> {
//         const token: string = this.extractCredentials(request);
//         try {
//         await this.jwtService.verifyToken(token);
//         } catch (err) {
//         throw new HttpErrors.Unauthorized(`Invalid token: ${err.message}`);
//         }
//     }

//     extractCredentials(request: Request): string {
//         const authHeader = request.headers.authorization;
//         if (!authHeader) {
//         throw new HttpErrors.Unauthorized('Authorization header not found.');
//         }

//         const [scheme, token] = authHeader.split(' ');
//         if (scheme !== 'Bearer' || !token) {
//         throw new HttpErrors.Unauthorized(
//             'Authorization header is not in the correct format.',
//         );
//         }

//         return token;
//     }
//     }