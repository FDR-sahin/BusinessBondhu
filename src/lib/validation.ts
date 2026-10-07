import { z } from "zod";

/** All messages in Bangla. */
const email = z.string().trim().min(1, "ইমেইল ঠিকানা দিন").email("সঠিক ইমেইল ঠিকানা দিন");

const newPassword = z
  .string()
  .min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে")
  .max(72, "পাসওয়ার্ড সর্বোচ্চ ৭২ অক্ষরের হতে পারবে")
  .regex(/[A-Za-z]/, "পাসওয়ার্ডে অন্তত একটি ইংরেজি অক্ষর থাকতে হবে")
  .regex(/\d/, "পাসওয়ার্ডে অন্তত একটি সংখ্যা থাকতে হবে");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
  remember: z.boolean(),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "আপনার নাম লিখুন").max(60, "নাম সর্বোচ্চ ৬০ অক্ষরের হতে পারবে"),
    email,
    password: newPassword,
    confirmPassword: z.string().min(1, "পাসওয়ার্ড আবার লিখুন"),
    division: z.string().min(1, "বিভাগ নির্বাচন করুন"),
    district: z.string().min(1, "জেলা নির্বাচন করুন"),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "পাসওয়ার্ড দুটি মিলছে না" });
export type SignupValues = z.infer<typeof signupSchema>;

export const forgotSchema = z.object({ email });
export type ForgotValues = z.infer<typeof forgotSchema>;

export const resetSchema = z
  .object({ password: newPassword, confirmPassword: z.string().min(1, "পাসওয়ার্ড আবার লিখুন") })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "পাসওয়ার্ড দুটি মিলছে না" });
export type ResetValues = z.infer<typeof resetSchema>;

/* ---------- Dashboard: profile & settings ---------- */
export const profileSchema = z.object({
  name: z.string().trim().min(2, "আপনার নাম লিখুন").max(60, "নাম সর্বোচ্চ ৬০ অক্ষরের হতে পারবে"),
  bio: z.string().trim().max(300, "পরিচিতি সর্বোচ্চ ৩০০ অক্ষরের হতে পারবে"),
  division: z.string(),
  district: z.string(),
  area: z.string().trim().max(80, "এলাকার নাম সর্বোচ্চ ৮০ অক্ষরের হতে পারবে"),
  avatar: z.string().optional(),
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "বর্তমান পাসওয়ার্ড দিন"),
    password: newPassword,
    confirmPassword: z.string().min(1, "পাসওয়ার্ড আবার লিখুন"),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "পাসওয়ার্ড দুটি মিলছে না" })
  .refine((d) => d.password !== d.currentPassword, { path: ["password"], message: "নতুন পাসওয়ার্ড বর্তমানটির থেকে আলাদা হতে হবে" });
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const changeEmailSchema = z.object({ email, password: z.string().min(1, "পাসওয়ার্ড দিন") });
export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;
