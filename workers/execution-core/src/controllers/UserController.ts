import { Context } from 'hono';
import { Bindings } from '../bindings';

export class UserController {
    /**
     * GET /api/v1/user/preferences
     * Returns user settings including UI mode (beginner/pro) and saved layouts.
     */
    async getPreferences(c: Context<{ Bindings: Bindings }>) {
        try {
            // Mock implementation until Auth/User tables are fully defined
            // In a real app, this would query D1 based on authenticated user ID.
            const userId = "DEFAULT_USER";

            // Try to fetch from D1 if table exists, else return defaults
            try {
                const prefs = await c.env.SIGNAL_DB.prepare(
                    "SELECT preferences_json FROM user_preferences WHERE user_id = ?"
                ).bind(userId).first();

                if (prefs && prefs.preferences_json) {
                    return c.json(JSON.parse(prefs.preferences_json as string));
                }
            } catch (e) {
                // Table might not exist yet, return defaults
            }

            return c.json({
                user_id: userId,
                ui_mode: "BEGINNER", // Default to beginner as per README
                layouts: {
                    default: ["watchlist", "portfolio"],
                    active_workspace: "default"
                },
                theme: "system"
            });
        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }

    /**
     * POST /api/v1/user/preferences
     * Updates user settings.
     */
    async updatePreferences(c: Context<{ Bindings: Bindings }>) {
        try {
            const body = await c.req.json();
            const userId = "DEFAULT_USER";

            // Basic validation
            if (!body || typeof body !== 'object') {
                return c.json({ error: "Invalid body" }, 400);
            }

            const jsonStr = JSON.stringify(body);

            // Upsert into D1
            // Note: Schema creation is assumed to be handled in migrations. 
            // We use INSERT OR REPLACE logic.
            await c.env.SIGNAL_DB.prepare(`
                INSERT INTO user_preferences (user_id, preferences_json, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                preferences_json = excluded.preferences_json,
                updated_at = excluded.updated_at
            `).bind(
                userId,
                jsonStr,
                new Date().toISOString()
            ).run();

            return c.json({ status: "UPDATED", preferences: body });

        } catch (e: any) {
            // Fallback for demo if table doesn't exist
            if (e.message.includes("no such table")) {
                return c.json({
                    status: "MOCK_UPDATED",
                    warning: "Persistence skipped (table missing), but API compliant.",
                    received: await c.req.json()
                });
            }
            return c.json({ error: e.message }, 500);
        }
    }
}
