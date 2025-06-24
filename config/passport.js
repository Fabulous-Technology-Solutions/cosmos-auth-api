const { OIDCStrategy } = require("passport-azure-ad");
const User = require("../models/User");

const strategy = new OIDCStrategy(
  {
    identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0/.well-known/openid-configuration`,
    clientID: process.env.AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    redirectUrl: process.env.AZURE_AD_CALLBACK_URL,
    responseType: "code",
    responseMode: "form_post",
    scope: ["profile", "email", "openid"],
    passReqToCallback: false,
  },
  async function (iss, sub, profile, done) {
    try {
      let user = await User.findOne({ azureId: profile.oid });
      if (!user) {
        user = await User.create({
          azureId: profile.oid,
          displayName: profile.displayName,
          email: profile._json.preferred_username,
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
);

module.exports = strategy;
