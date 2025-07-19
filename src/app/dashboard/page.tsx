'use client';

import { withAuth } from '@/lib/withAuth';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { callApi } from '@/utils/api';
import Link from 'next/link';
import { Chatbot, ChatBotResponse, Profile, ProfileResponse } from '@/types/responseInterface';


function DashboardPage() {
  const { token } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return; // withAuth already handles redirect, so just return

    const load = async () => {
      await fetchProfile();
      await fetchChatbots();
      setLoading(false);
    };

    load();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await callApi('get', '/api/v1/profile');

      const responseData = res?.data as ProfileResponse;
      const user = responseData?.user as Profile
      setProfile(user);
      setCompanyName(user?.company || '');
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchChatbots = async () => {
    try {
      const res = await callApi('get', '/api/v1/chatbots');
      const responseData = res?.data as ChatBotResponse;    
      setChatbots(responseData.chatbots || []);
    } catch (err) {
      console.error('Failed to fetch chatbots:', err);
    }
  };

  const handleCreateChatbot = async () => {
    if (!newName) return;

    const formData = new FormData();
    formData.append('chatbot_name', newName);
    formData.append('default_message', newMessage);

    await callApi('post', '/api/v1/chatbots', formData, {
      'Content-Type': 'multipart/form-data',
    });

    setNewName('');
    setNewMessage('');
    fetchChatbots();
  };

  const handleUpdateProfile = async () => {
    await callApi('put', '/api/v1/profile', { company_name: companyName });
    fetchProfile();
    alert('Profile updated!');
  };

  const handleDeleteChatbot = async (id: number) => {
    if (!confirm('Are you sure you want to delete this chatbot?')) return;
    await callApi('delete', `/api/v1/chatbots/${id}`);
    fetchChatbots();
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="mb-6">
        <p>
          <strong>Email:</strong> {profile?.email}
        </p>
        <p>
          <strong>User Type:</strong> {profile?.user_type}
        </p>

        <div className="mt-4">
          <label className="block mb-1 font-semibold">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleUpdateProfile}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Update Profile
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">My Chatbots</h2>
      <ul className="space-y-2 mb-4">
        {chatbots.map((cb) => (
          <li
            key={cb.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div className="flex items-center gap-4">
              <span>{cb?.name}</span>
              <Link
                href={`/chatbots/${cb.id}/settings`}
                className="text-blue-600 hover:underline"
              >
                Manage
              </Link>
            </div>
            <button
              onClick={() => handleDeleteChatbot(cb.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="New chatbot name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Default message (optional)"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleCreateChatbot}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Chatbot
        </button>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);
