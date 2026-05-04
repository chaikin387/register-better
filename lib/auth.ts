import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { emailOTP } from 'better-auth/plugins'
import prisma from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  advanced: {
    cookiePrefix: 'register-better', // Позже уберем и из proxy.ts тоже
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      '/sign-up/email': { window: 60, max: 3 },
      '/email-otp/send-verification-otp': { window: 60, max: 1 },
    },
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
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[OTP] email: ${email} | type: ${type} | otp: ${otp}`)
      },
    }),
  ],
})

export type Session = typeof auth.$Infer.Session
