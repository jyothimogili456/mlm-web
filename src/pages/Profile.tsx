import React, { useState, useEffect } from 'react';
import { apiUtils } from '../api';
import { LogOut, User, Mail, Phone, MapPin } from 'lucide-react';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = apiUtils.isLoggedIn();
      const user = apiUtils.getUserData();
      setIsLoggedIn(loggedIn);
      setUserData(user);
    };

    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    apiUtils.logoutAndRedirect('/');
  };

  if (!isLoggedIn) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2>Please Login</h2>
        <p>You need to be logged in to view your profile.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{
            background: '#7c3aed',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '1rem'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      minHeight: '80vh'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: '#1f2937',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            Profile
          </h1>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {userData ? (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '0.5rem'
            }}>
              <User size={20} color="#7c3aed" />
              <div>
                <div style={{ fontWeight: '600', color: '#374151' }}>Name</div>
                <div style={{ color: '#6b7280' }}>{userData.name || 'Not provided'}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '0.5rem'
            }}>
              <Mail size={20} color="#7c3aed" />
              <div>
                <div style={{ fontWeight: '600', color: '#374151' }}>Email</div>
                <div style={{ color: '#6b7280' }}>{userData.email || 'Not provided'}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '0.5rem'
            }}>
              <Phone size={20} color="#7c3aed" />
              <div>
                <div style={{ fontWeight: '600', color: '#374151' }}>Mobile Number</div>
                <div style={{ color: '#6b7280' }}>{userData.mobileNumber || 'Not provided'}</div>
              </div>
            </div>

            {userData.address && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.5rem'
              }}>
                <MapPin size={20} color="#7c3aed" />
                <div>
                  <div style={{ fontWeight: '600', color: '#374151' }}>Address</div>
                  <div style={{ color: '#6b7280' }}>{userData.address}</div>
                </div>
              </div>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '0.5rem'
            }}>
              <div style={{ width: '20px', height: '20px', background: '#7c3aed', borderRadius: '50%' }}></div>
              <div>
                <div style={{ fontWeight: '600', color: '#374151' }}>Referral Code</div>
                <div style={{ color: '#6b7280' }}>{userData.referral_code || 'Not generated'}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '0.5rem'
            }}>
              <div style={{ width: '20px', height: '20px', background: '#7c3aed', borderRadius: '50%' }}></div>
              <div>
                <div style={{ fontWeight: '600', color: '#374151' }}>Referral Count</div>
                <div style={{ color: '#6b7280' }}>{userData.referralCount || 0} referrals</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '0.5rem'
            }}>
              <div style={{ width: '20px', height: '20px', background: '#7c3aed', borderRadius: '50%' }}></div>
              <div>
                <div style={{ fontWeight: '600', color: '#374151' }}>Payment Status</div>
                <div style={{ 
                  color: userData.payment_status === 'PAID' ? '#059669' : '#d97706',
                  fontWeight: '500'
                }}>
                  {userData.payment_status || 'PENDING'}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '0.5rem'
            }}>
              <div style={{ width: '20px', height: '20px', background: '#7c3aed', borderRadius: '50%' }}></div>
              <div>
                <div style={{ fontWeight: '600', color: '#374151' }}>Account Status</div>
                <div style={{ 
                  color: userData.status === 'Active' ? '#059669' : '#dc2626',
                  fontWeight: '500'
                }}>
                  {userData.status || 'Active'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading user data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 