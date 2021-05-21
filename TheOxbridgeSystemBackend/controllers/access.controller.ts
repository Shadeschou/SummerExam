import jsonwebtoken from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

const expiresIn:string = '2h';

class AccessToken{

    // (2) Create an ACCESS TOKEN (with JWT) containing the user ROLE
    static generateToken(role:string):any{
        const token = jsonwebtoken.sign({'role':role}, process.env.TOKEN_SECRET, { expiresIn });
        return token;
    }

    static userRole(token:any):string{
        const decodedToken:any = jwtDecode(token);
        // console.log(decodedToken.role);
        return decodedToken.role;
    }
}
export {AccessToken}