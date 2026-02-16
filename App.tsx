
import React, { useState, useEffect } from 'react';
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

  // Auth: Restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
      // Optionally validate token with backend
      api.get('/users/me').then(res => {
        setCurrentUser(res.data.user);
        setAuthLoading(false);
      }).catch(() => {
        handleLogout();
        setAuthLoading(false);
      });
    } else {
      setAuthLoading(false);
    }
  }, []);

  const handleLogin = (user: User, token: string) => {
    setCurrentUser(user);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
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
        />
      )}
    </div>
  );
};

export default App;
