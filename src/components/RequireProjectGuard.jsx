import React, { useEffect } from 'react';
import { useLocation, useNavigate, matchPath } from 'react-router-dom';
import { useProject } from '../hooks/useProject';

export default function RequireProjectGuard({ children }) {
  const { projectId } = useProject();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname || '';
    const token = localStorage.getItem('token');

    // If no active project, redirect depending on authentication state:
    // - authenticated users => go to /start (select a project)
    // - unauthenticated users => go to /login
    if (!projectId) {
      if (!path.startsWith('/login') && !path.startsWith('/signup') && !path.startsWith('/start')) {
        if (token) navigate('/start', { replace: true });
        else navigate('/login', { replace: true });
      }
      return;
    }

    // If route contains /projects/:projectId, ensure it matches
    const match = matchPath('/projects/:pid/*', path) || matchPath('/projects/:pid', path);
    if (match && match.params && match.params.pid && match.params.pid !== projectId) {
      // project mismatch — block and redirect to correct project summary
      navigate(`/projects/${projectId}/summary`, { replace: true });
    }
  }, [projectId, location.pathname, navigate]);

  return <>{children}</>;
}
