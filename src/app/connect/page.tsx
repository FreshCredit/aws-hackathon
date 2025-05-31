'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

export default function ConnectPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  const onSuccess = useCallback(async (public_token: string) => {
    try {
      const response = await fetch('/api/fetchTransactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token }),
      });

      if (response.ok) {
        router.push('/report');
      } else {
        console.error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [router]);

  const config = {
    token: null,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connect Your Bank Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We use Plaid to securely connect to your bank
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <button
            onClick={() => open()}
            disabled={!ready}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Connect with Plaid
          </button>
        </div>
      </div>
    </div>
  );
} 