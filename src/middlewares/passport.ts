import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import prisma from '../client'; // Your Prisma client
import config from '../config/config';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret
};

const strategy = new JwtStrategy(opts, async (jwtPayload, done) => {
  try {
    if (!jwtPayload.id) {
      console.log('No id in JWT>>>>>>>>>');
      return done(null, false); // Return false if id is not present
    }
    const user = await prisma.user.findUnique({ where: { id: jwtPayload.id } });
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});

export default strategy;
