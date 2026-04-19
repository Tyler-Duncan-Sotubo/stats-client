import ResetPasswordForm from "@/features/auth/reset-password/ui/reset-password-form";

type PageProps = {
  params: Promise<{ token: string }>;
};

export const metadata = {
  title: "Reset Password | NeedIt",
  description: "Set a new password for your NeedIt account",
};

export default async function ResetPasswordPage({ params }: PageProps) {
  const { token } = await params;
  return <ResetPasswordForm token={token} />;
}
