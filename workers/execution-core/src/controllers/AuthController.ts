import { Context } from 'hono';
import { sign, verify } from 'hono/jwt';
import { Bindings } from '../bindings';

export class AuthController {
    // JWT Secret (In production, this should be in Bindings/Environment)
    // For now, matching the one generated for the frontend or a fixed one for this deployment
    private JWT_SECRET = 'backend_jwt_secret_change_in_prod';

    async login(c: Context<{ Bindings: Bindings }>) {
        try {
            const { email, password } = await c.req.json();

            // 1. Validate Input
            if (!email || !password) {
                return c.json({ error: 'Email and password required' }, 400);
            }

            // 2. Mock Authenticate (In real world: Check D1 'users' table)
            // For the bridge to work, we accept any valid password hash from our frontend bridge
            // OR strictly, we should just verify they exist. 
            // Since we are mocking the user table for now:

            // Check if user exists (Mock)
            // const user = await c.env.SIGNAL_DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

            const user = {
                id: 'user_' + Math.abs(this.hashCode(email)),
                email,
                name: email.split('@')[0],
                role: 'user'
            };

            // 3. Generate Token
            const token = await sign({
                sub: user.id,
                email: user.email,
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
            }, this.JWT_SECRET);

            return c.json({
                token,
                user
            });

        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }

    async signup(c: Context<{ Bindings: Bindings }>) {
        try {
            const { email, password, name } = await c.req.json();

            // 1. Validate
            if (!email || !password) {
                return c.json({ error: 'Email and password required' }, 400);
            }

            // 2. Mock Create User in D1
            const user = {
                id: 'user_' + Math.abs(this.hashCode(email)),
                email,
                name: name || email.split('@')[0],
                role: 'user'
            };

            // 3. Generate Token
            const token = await sign({
                sub: user.id,
                email: user.email,
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
            }, this.JWT_SECRET);

            return c.json({
                token,
                user
            });

        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }

    async me(c: Context<{ Bindings: Bindings }>) {
        try {
            const authHeader = c.req.header('Authorization');
            if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);

            const token = authHeader.split(' ')[1];
            try {
                const payload = await verify(token, this.JWT_SECRET);
                return c.json({
                    id: payload.sub,
                    email: payload.email,
                    name: (payload.email as string).split('@')[0], // Mock name recovery
                    role: payload.role
                });
            } catch (e) {
                return c.json({ error: 'Invalid token' }, 401);
            }
        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }

    // Helper for deterministic IDs
    private hashCode(str: string) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
}
