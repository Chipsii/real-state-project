import { api } from "@/lib/axios/client";

export async function adminLogin(input){
  const res = await api.post("/auth/login", input);
  const accessToken = res.data?.data?.accessToken ?? res.data?.accessToken;

  return { accessToken };
}

export async function adminLogout(){
  await api.post("/auth/logout");
}


export async function getAdminMe(){
  try {
    const res = await api.get("/auth/me");
    const admin = res.data?.data ?? res.data;
    if (!admin) return null;
    return {
      id: admin.id ?? admin._id ?? admin.sub,
      email: admin.email,
      role: admin.role ?? "admin",
    };
  } catch {
    return null;
  }
}


export async function requestPasswordReset(input) {
  const res = await api.post("/auth/password-reset/request", input);
  const data = res.data?.data ?? res.data;

  return data;
}

export async function verifyPasswordResetOtp(input) {
  const res = await api.post("/auth/password-reset/verify-otp", input);
  const data = res.data?.data ?? res.data;

  const resetToken = data?.resetToken ?? data?.token ?? data?.jwt;
  return { resetToken, data };
}


export async function confirmPasswordReset(input) {
  const { resetToken, newPassword } = input;

  const res = await api.post(
    "/auth/password-reset/confirm",
    { newPassword,resetToken },
    // { headers: { Authorization: `Bearer ${resetToken}` } }
  );

  const data = res.data?.data ?? res.data;
  return data;
}