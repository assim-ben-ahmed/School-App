import passport from 'passport';
import { Strategy as SamlStrategy } from 'passport-saml';
import { config } from '../config/app.config';
import { logger } from '../utils/logger';

/**
 * Configure Passport.js for SSO authentication
 * Supports SAML 2.0 (most common in universities)
 */

// SAML Strategy Configuration
if (config.sso.strategy === 'saml') {
    passport.use(
        new SamlStrategy(
            {
                callbackUrl: config.sso.callbackUrl,
                entryPoint: config.sso.entryPoint,
                issuer: config.sso.issuer,
                cert: config.sso.cert,
                // Additional SAML options
                identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
                acceptedClockSkewMs: -1,
                disableRequestedAuthnContext: true,
            },
            (profile: any, done: any) => {
                try {
                    // Extract user info from SAML profile
                    const user = {
                        studentId: profile.nameID || profile.uid || profile.studentId,
                        email: profile.email || profile.mail,
                        firstName: profile.firstName || profile.givenName || '',
                        lastName: profile.lastName || profile.surname || '',
                    };

                    logger.info('SAML authentication successful:', user.studentId);
                    return done(null, user);
                } catch (error) {
                    logger.error('SAML profile parsing error:', error);
                    return done(error);
                }
            }
        )
    );
}

// Serialize user for session (not used with JWT, but required by Passport)
passport.serializeUser((user: any, done) => {
    done(null, user);
});

passport.deserializeUser((user: any, done) => {
    done(null, user);
});

export default passport;
