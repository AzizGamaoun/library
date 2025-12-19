import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';


const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    Firstname: '',
    Lastname: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.Firstname || !formData.Lastname || !formData.email || !formData.password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await userService.register({
        email: formData.email,
        password: formData.password,
        Firstname: formData.Firstname,
        Lastname: formData.Lastname
      });
      
      setSuccess('Account created successfully! Redirecting...');
      console.log('User registered:', response);
      
      // Rediriger après succès
      setTimeout(() => {
        navigate('/login'); // ou window.location.href = '/dashboard';
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-3xl font-bold">Inscription</h2>
              </div>
              <p className="text-indigo-100 text-sm">
                Créer votre copmpte en entrant vos cordonnées
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div className="p-8">
            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Names Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition"></div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="Firstname"
                        value={formData.Firstname}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition text-sm"
                        placeholder="John"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition"></div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="Lastname"
                        value={formData.Lastname}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition text-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email 
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition"></div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mots de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition"></div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="w-full pl-10 pr-12 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 relative group overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Inscription ...</span>
                    </>
                  ) : (
                    <>
                      <span>Créer un compte</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </div>

   
            {/* Toggle to Login */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Vous avez déja un compte ?{' '}
                <button
                
                  onClick={() => navigate('/login', { replace: true })}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                >
                  Connecter
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-4 px-4">
          By continuing, you agree to our{' '}
          <span className="text-indigo-600 hover:underline cursor-pointer">Terms</span>
          {' '}and{' '}
          <span className="text-indigo-600 hover:underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Register;