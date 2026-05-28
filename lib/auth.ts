import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin, emailOTP } from 'better-auth/plugins'
import prisma from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  advanced: {
    cookiePrefix: 'register-better', // Позже уберем и из proxy.ts тоже
  },

  rateLimit: {
    enabled: true,
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    autoSignInAfterVerification: true,
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      allowedAttempts: 3,
      expiresIn: 300,
      resendStrategy: 'reuse',
      disableSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[OTP] email: ${email} | type: ${type} | otp: ${otp}`)
      },
    }),
    admin(),
  ],
})

export type Session = typeof auth.$Infer.Session
