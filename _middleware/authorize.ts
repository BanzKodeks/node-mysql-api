import { expressjwt as jwt } from 'express-jwt';
import db from '../_helpers/db';

const secret = process.env.JWT_SECRET as string;

export default function authorize(roles: any = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        jwt({ secret, algorithms: ['HS256'] }),

        async (req: any, res: any, next: any) => {
            const account = await db.Account.findByPk(req.auth.sub);

            if (!account || (roles.length && !roles.includes(account.role))) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            req.user = {
                id: account.id,
                role: account.role,
                ownsToken: async (token: any) => {
                    const refreshTokens = await account.getRefreshTokens();
                    return !!refreshTokens.find((x: any) => x.token === token);
                }
            };

            next();
        }
    ];
}