
import React, { useState, useEffect, useCallback } from 'react';
import api from './src/api/api';
import { User, Shift, Leave, SitePost, AdvanceRequest, Announcement } from './types';
import { MOCK_WORKERS, MOCK_ADMIN } from './constants';
import WorkerApp from './components/WorkerApp';
import AdminApp from './components/AdminApp';
import Login from './components/Login';
import { Language } from './translations';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [posts, setPosts] = useState<SitePost[]>([]);
  const [workers, setWorkers] = useState<User[]>(MOCK_WORKERS);
  const [advanceRequests, setAdvanceRequests] = useState<AdvanceRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [language, setLanguage] = useState<Language>('en');

  // --- Resource fetchers ---
  const fetchShifts = useCallback(async () => {
    try {
      const res = await api.get('/shifts');
      setShifts(res.data);
    } catch {}
  }, []);
  const fetchLeaves = useCallback(async () => {
    try {
      const res = await api.get('/leaves');
      setLeaves(res.data);
    } catch {}
  }, []);
  const fetchPosts = useCallback(async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch {}
  }, []);
  const fetchWorkers = useCallback(async () => {
    try {
      const res = await api.get('/users');
      setWorkers(res.data);
    } catch {}
  }, []);
  const fetchAdvanceRequests = useCallback(async () => {
    try {
      const res = await api.get('/advances');
      setAdvanceRequests(res.data);
    } catch {}
  }, []);
  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data);
    } catch {}
  }, []);
  // Auth: Restore session from localStorage
  // --- Auth/session restore ---
  useEffect(() => {
    setAuthLoading(true);
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        const parsedUser = JSON.parse(savedUser);
        // Only minimal info in localStorage
        setCurrentUser({ id: parsedUser.id, role: parsedUser.role, name: parsedUser.name, email: parsedUser.email });
      } catch {
        setCurrentUser(null);
      }
      api.get('/users/me').then(res => {
        setCurrentUser(res.data.user);
        setAuthLoading(false);
      }).catch(() => {
        handleLogout();
        setAuthLoading(false);
      });
    } else {
      setCurrentUser(null);
      setToken(null);
      setAuthLoading(false);
    }
  }, []);

  const handleLogin = (user: User, token: string) => {
    setCurrentUser({ id: user.id, role: user.role, name: user.name, email: user.email });
    setToken(token);
    // Only store minimal info
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ id: user.id, role: user.role, name: user.name, email: user.email }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-lg font-bold">Loading...</div>;
  }
  if (!token || !currentUser) {
    return <Login onLogin={handleLogin} workers={workers} />;
  }

  return (
    <div 
      className={`min-h-screen max-w-md mx-auto bg-white shadow-xl relative overflow-hidden flex flex-col`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {currentUser.role === 'admin' ? (
        <AdminApp 
          user={currentUser} 
          shifts={shifts} 
          setShifts={setShifts} 
          leaves={leaves} 
          setLeaves={setLeaves}
          workers={workers}
          setWorkers={setWorkers}
          posts={posts}
          setPosts={setPosts}
          advanceRequests={advanceRequests}
          setAdvanceRequests={setAdvanceRequests}
          announcements={announcements}
          setAnnouncements={setAnnouncements}
          onLogout={handleLogout}
          language={language}
          setLanguage={setLanguage}
          fetchShifts={fetchShifts}
          fetchLeaves={fetchLeaves}
          fetchPosts={fetchPosts}
          fetchWorkers={fetchWorkers}
          fetchAdvanceRequests={fetchAdvanceRequests}
          fetchAnnouncements={fetchAnnouncements}
        />
      ) : (
        <WorkerApp 
          user={currentUser} 
          shifts={shifts} 
          setShifts={setShifts} 
          leaves={leaves} 
          setLeaves={setLeaves}
          posts={posts}
          setPosts={setPosts}
          advanceRequests={advanceRequests}
          setAdvanceRequests={setAdvanceRequests}
          announcements={announcements}
          workers={workers}
          onLogout={handleLogout}
          language={language}
          setLanguage={setLanguage}
          fetchShifts={fetchShifts}
          fetchLeaves={fetchLeaves}
          fetchPosts={fetchPosts}
          fetchAdvanceRequests={fetchAdvanceRequests}
          fetchAnnouncements={fetchAnnouncements}
        />
      )}
    </div>
  );
};

export default App;
