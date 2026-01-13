import React, { useEffect } from 'react';
import { useLocation, useNavigate, matchPath } from 'react-router-dom';
import { useProject } from '../hooks/useProject';

export default function RequireProjectGuard({ children }) {
  const { projectId } = useProject();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname || '';

    // Allow auth routes to bypass guard entirely
    if (path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/api/signin') || path.startsWith('/api/signup')) {
      return; // Don't apply any protection or redirect
    }

    // If no active project, redirect to start page (except auth/start)
    if (!projectId) {
      if (!path.startsWith('/start') && !path.startsWith('/startpage')) {
        navigate('/start', { replace: true });
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
