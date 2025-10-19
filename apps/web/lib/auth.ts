
import { env } from '@/env';
import { betterAuth } from 'better-auth';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { withCloudflare } from 'better-auth-cloudflare';
import {getDB} from '@intellibus/db';
const getTrustedOrigins = () => {
    if (env.ENVIRONMENT === 'development') {
        return [
            'http://localhost:3000',
            'http://localhost:8787'
        ];
    }
    if (env.ENVIRONMENT === 'staging') {
        return [
            // Add your staging URL here when available
            'https://intellibus-web-staging.workers.dev'
        ];
    }
    // Production environment
    return [
        'https://intellibus-web-prod-production.glues-gliders0w.workers.dev'
    ];
};

const getBaseURL = () => {
    if (env.ENVIRONMENT === 'development') {
        return 'http://localhost:8787';
    }
    if (env.ENVIRONMENT === 'staging') {
        return 'https://intellibus-web-staging.workers.dev';
    }
    // Production environment
    return 'https://intellibus-web-prod-production.glues-gliders0w.workers.dev';
};

export const authBuilder = async () => {
    const db = await getDB();

    return betterAuth({
        ...withCloudflare(
            {
                autoDetectIpAddress: true,
                geolocationTracking: true,
                cf: getCloudflareContext().cf,
                d1: {
                    // @ts-expect-error - Drizzle type compatibility with better-auth-cloudflare
                    db: db,
                    options: {
                        usePlural: true, // Optional: Use plural table names (e.g., "users" instead of "user")
                        // Optional
                    },
                },
                // Make sure "KV" is the binding in your wrangler.toml
                // R2 configuration for file storage (R2_BUCKET binding from wrangler.toml)

            },

            // Your core Better Auth configuration (see Better Auth docs for all options)
            {
                trustedOrigins: getTrustedOrigins(),
                emailAndPassword: {
                    enabled: true,

                    sendResetPassword: async ({ user, url, token }, request) => {
                     
                    },
                },
                rateLimit: {
                    enabled: true,
                    // ... other rate limiting options
                },
                user: {
                    additionalFields: {
                        customerId: {
                            type: 'string',
                            required: false,
                            input: false // System-generated, not user input
                        },
                        organization: {
                            type: 'string',
                            required: true,
                            input: true // User provides this during signup
                        },
                        receiveUpdates: {
                            type: 'boolean',
                            required: false,
                            defaultValue: false,
                            input: true // User provides this during signup
                        },
                        acceptedTermsAt: {
                            type: 'date',
                            required: false, // Set by system in database hook
                            input: false // System-generated, not user input
                        }
                    }
                },
                baseURL: getBaseURL(),
                emailVerification: {
                    autoSignInAfterVerification: true,
                    sendVerificationEmail: async ({ user, url }) => {
                        // Extract user name from email (before @) as fallback
                        const userName = user.name || user.email.split('@')[0];

                        // Render the React email template to HTML
                        

                    }
                },
                databaseHooks: {
                    user: {
                        create: {
                            before: async (user) => {
                                // Set acceptedTermsAt when user signs up
                                return {
                                    data: {
                                        ...user,
                                        acceptedTermsAt: new Date()
                                    }
                                }
                            },
                            after: async (user) => {
                            }
                        },


                    }

                }
                // TODO: Add Better Auth hooks for subscription creation on user registration

                // ... other Better Auth options
            }
        )
    },

    );

}

// Singleton pattern to ensure a single auth instance
let authInstance: Awaited<ReturnType<typeof authBuilder>> | null = null;
export type Session = Awaited<ReturnType<Awaited<ReturnType<typeof getAuth>>['api']['getSession']>>;                                                                                                                                 
// Asynchronously initializes and retrieves the shared auth instance
export async function getAuth() {
    if (!authInstance) {
        authInstance = await authBuilder();
    }
    return authInstance;
}
// Static auth configuration for schema generation only
// export const auth = betterAuth({
//     emailAndPassword: {
//         enabled: true,
//     },
