import { redirect } from 'next/navigation';

export default function LoginPage() {
  redirect('/api/auth/login');
  return null;
} 