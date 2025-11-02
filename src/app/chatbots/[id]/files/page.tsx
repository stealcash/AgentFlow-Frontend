'use client';

import React, { useState, useEffect } from 'react';
import { callApi } from '@/utils/api';
import { UploadFileInput } from '@/types/interface';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type ChatbotFile = {
  id: number;
  title: string;
  file_type: string;
  created_at: string;
};

type FileResponse = {
  data: {
    files: ChatbotFile[];
  };
  message: string;
  status: number;
};

type FileDownloadResponse = {
  data: {
    file: {
      file_data: string;
      file_type: string;
    };
  };
};

const ChatbotFiles: React.FC = () => {
  // Auth hooks
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const chatbotId = params.id as string;
  
  // State hooks
  const [files, setFiles] = useState<ChatbotFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (token && chatbotId) {
      const load = async () => {
        setDataLoading(true);
        await loadFiles();
        setDataLoading(false);
      };
      load();
    }
  }, [token, chatbotId]);

  const loadFiles = async () => {
    try {
      const res = await callApi('get', `/api/v1/chatbots/${chatbotId}/files`) as FileResponse;
      if (res?.data?.files) {
        setFiles(res.data.files);
      } else {
        setFiles([]);
        toast.error('No files found');
      }
    } catch (err) {
      console.error('Failed to load files:', err);
      toast.error('Failed to load files');
      setFiles([]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTitle(file.name); // Set default title as file name
    }
  };

  const uploadFile = async () => {
    if (!selectedFile || !title) {
      toast.error('Please select a file and provide a title');
      return;
    }

    setIsUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];
        
        const fileData: UploadFileInput = {
          title,
          file_data: base64String,
          file_type: selectedFile.type,
        };

        await callApi('post', `/api/v1/chatbots/${chatbotId}/files`, fileData);
        toast.success('File uploaded successfully');
        setSelectedFile(null);
        setTitle('');
        loadFiles();
      };
    } catch {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadFile = async (fileId: number, fileName: string) => {
    try {
      const response = await callApi('get', `/api/v1/chatbots/${chatbotId}/files/${fileId}`) as FileDownloadResponse;
      const fileData = response?.data?.file;
      
      if (!fileData?.file_data || !fileData?.file_type) {
        throw new Error('Invalid file data received');
      }
      
      // Convert base64 to blob
      const byteCharacters = atob(fileData.file_data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileData.file_type });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('File downloaded successfully');
    } catch (err) {
      console.error('Failed to download file:', err);
      toast.error('Failed to download file');
    }
  };

  const deleteFile = async (fileId: number) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await callApi('delete', `/api/v1/chatbots/${chatbotId}/files/${fileId}`);
      toast.success('File deleted successfully');
      loadFiles();
    } catch {
      toast.error('Failed to delete file');
    }
  };

  // Check authentication
  if (authLoading) return <p className="p-4">Loading authentication...</p>;
  if (!token) {
    router.push('/login');
    return null;
  }

  // Show loading while fetching data
  if (dataLoading) {
    return <p className="p-4">Loading files data...</p>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Upload File</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter file title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>
          <button
            onClick={uploadFile}
            disabled={isUploading || !selectedFile}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Files</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file) => (
                <tr key={file.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{file.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{file.file_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(file.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => downloadFile(file.id, file.title)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChatbotFiles;