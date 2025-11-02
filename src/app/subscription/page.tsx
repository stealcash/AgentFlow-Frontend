'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { callApi } from '@/utils/api';

type Plan = {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
};

type Subscription = {
  plan: Plan;
  start_date: string;
  end_date: string;
  status: string;
};

function SubscriptionPage() {
  // Auth hooks
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();

  // State hooks
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [userType, setUserType] = useState<string>('');
  const [newPlan, setNewPlan] = useState(() => ({
    name: '',
    description: '',
    price: '',
    features: '',
  }));
  
  // Effects
  useEffect(() => {
    if (token) {
      const load = async () => {
        await fetchUserType();
        await fetchPlans();
        await fetchSubscription();
      };
      load();
    }
  }, [token]);

  // Check authentication
  if (authLoading) return <p className="p-4">Loading...</p>;
  if (!token) {
    router.push('/login');
    return null;
  }

  // API Functions

  const fetchUserType = async () => {
    try {
      const res = await callApi('get', '/api/v1/profile/me');
      const response = res?.data as { user: { user_type: string } };
      setUserType(response.user.user_type || '');
    } catch (err) {
      console.error('Failed to fetch user type:', err);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await callApi('get', '/api/v1/plans');
      const response = res?.data as { plans: Plan[] };
      const parsed = (response.plans || []).map((p: Plan) => ({
        ...p,
        features: p.features ? (typeof p.features === 'string' ? JSON.parse(p.features) : p.features) : [],
      }));
      setPlans(parsed);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await callApi('get', '/api/v1/subscription');
      const response = res?.data as { subscription: Subscription };
      if (response.subscription) {
        setSubscription({
          plan: {
            ...response.subscription.plan,
            features: Array.isArray(response.subscription.plan.features)
              ? response.subscription.plan.features
              : JSON.parse(response.subscription.plan.features || '[]'),
          },
          start_date: response.subscription.start_date,
          end_date: response.subscription.end_date,
          status: response.subscription.status,
        });
      }
    } catch (err) {
      
      console.log('No active subscription found',err);
    }
  };

  const handleSubscribe = async (planId: number) => {
    try {
      await callApi('post', '/api/v1/subscription', { plan_id: planId });
      alert('Subscribed successfully!');
      fetchSubscription();
    } catch (err) {
      console.error('Subscription failed:', err);
    }
  };

  const handleCreatePlan = async () => {
    if (!newPlan.name || !newPlan.price) {
      alert('Name and price are required');
      return;
    }

    try {
      await callApi('post', '/api/v1/plans', {
        name: newPlan.name,
        description: newPlan.description,
        price: parseFloat(newPlan.price),
        features: JSON.stringify(
          newPlan.features
            .split(',')
            .map((f) => f.trim())
            .filter((f) => f)
        ),
      });
      alert('Plan created successfully!');
      setNewPlan({ name: '', description: '', price: '', features: '' });
      fetchPlans();
    } catch (err) {
      console.error('Failed to create plan:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4">
      <h1 className="text-3xl font-bold">Subscription Plans</h1>

      {subscription && (
        <div className="border rounded p-4 bg-green-50">
          <h2 className="font-semibold">Current Plan: {subscription.plan.name}</h2>
          <p>Status: {subscription.status}</p>
          <p>
            Valid from <strong>{subscription.start_date}</strong> to{' '}
            <strong>{subscription.end_date}</strong>
          </p>
          <ul className="list-disc list-inside mt-2">
            {subscription.plan.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {userType === 'superadmin' && (
        <div className="border rounded p-4 bg-yellow-50 space-y-4">
          <h2 className="text-xl font-bold">Create New Plan</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              className="border p-2 w-full rounded"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="border p-2 w-full rounded"
              value={newPlan.description}
              onChange={(e) =>
                setNewPlan({ ...newPlan, description: e.target.value })
              }
            ></textarea>
            <input
              type="number"
              placeholder="Price"
              className="border p-2 w-full rounded"
              value={newPlan.price}
              onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Features (comma separated)"
              className="border p-2 w-full rounded"
              value={newPlan.features}
              onChange={(e) =>
                setNewPlan({ ...newPlan, features: e.target.value })
              }
            />
            <button
              onClick={handleCreatePlan}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Create Plan
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {plans.length === 0 && (
          <p className="text-gray-500">No plans available.</p>
        )}
        {plans.map((plan) => (
          <div key={plan.id} className="border rounded p-4 shadow">
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <p className="text-sm">{plan.description}</p>
            <p className="text-xl font-bold mt-2">₹{plan.price}</p>
            <ul className="list-disc list-inside my-2 text-sm">
              {plan.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.id)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionPage;
