import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirige automáticamente de http://localhost:3000/ a http://localhost:3000/login
  redirect('/login');
}