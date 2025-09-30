import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Mail, Calendar, MapPin, Save, Trash2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    cognome: user?.cognome || '',
    eta: user?.eta || '',
    luogoResidenza: user?.luogoResidenza || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await updateProfile(formData);
    
    if (result.success) {
      setSuccess('Profilo aggiornato con successo!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setError('');
    
    const result = await deleteAccount();
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Il Mio Profilo</h1>
          <p className="text-gray-600 mt-2">Gestisci le tue informazioni personali</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Informazioni Account */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Informazioni Account
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-500">Registrato il</p>
                  <p className="font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('it-IT') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Modifica Profilo */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Modifica Profilo
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cognome
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="cognome"
                      value={formData.cognome}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Età
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="eta"
                    value={formData.eta}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="120"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Luogo di Residenza
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="luogoResidenza"
                    value={formData.luogoResidenza}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Il meteo verrà mostrato per questa località
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                <span>{loading ? 'Salvataggio...' : 'Salva Modifiche'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Zona Pericolosa */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border-2 border-red-200">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Zona Pericolosa</h2>
          
          {!showDeleteConfirm ? (
            <div>
              <p className="text-gray-600 mb-4">
                L'eliminazione dell'account è permanente e non può essere annullata. 
                Tutti i tuoi dati verranno rimossi definitivamente.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="h-5 w-5" />
                <span>Elimina Account</span>
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-800 font-semibold mb-4">
                Sei sicuro di voler eliminare il tuo account?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>{deleteLoading ? 'Eliminazione...' : 'Sì, Elimina'}</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annulla
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
