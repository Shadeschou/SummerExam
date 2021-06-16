import jsonwebtoken from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

const expiresIn: string = '2h';

/**
 * Helper class to decode and sign the token.
 * @param
 */
class AccessToken {
    static generateToken(role: string): any {
        const t = jsonwebtoken.sign({'role': role}, process.env.TOKEN_SECRET, {expiresIn});
        return t;
    }

    static userRole(token: any): string {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.role;
    }

    static getUser(token: any): string {
        const decodedToken: any = jwtDecode(token);
        return decodedToken;
    }
}

export {AccessToken}
