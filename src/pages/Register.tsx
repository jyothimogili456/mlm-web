import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css';
import camelqLogo from '../assets/camelq logo without background (1).png';
import { userApi, apiUtils } from '../api';
import { useUser } from '../context/UserContext';

const AuthCard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  
  // Register form state
  const [register, setRegister] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    mobileNumber: '',
    gender: '',
    address: '',
    referral: '' 
  });
  const [registerErrors, setRegisterErrors] = useState<any>({});
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerServerError, setRegisterServerError] = useState<string | null>(null);
  
  // Login form state
  const [login, setLogin] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState<any>({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginServerError, setLoginServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0); // 0 = registration, 1 = products, 2 = refer, 3 = milestones



  // Validation
  const validateRegister = () => {
    const errs: any = {};
    
    // Name validation
    if (!register.name.trim()) {
      errs.name = 'Name is required';
    } else if (register.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters long';
    } else if (register.name.trim().length > 50) {
      errs.name = 'Name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(register.name.trim())) {
      errs.name = 'Name can only contain letters and spaces';
    }
    
    // Email validation
    if (!register.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(register.email.trim())) {
      errs.email = 'Please enter a valid email address';
    } else if (register.email.trim().length > 100) {
      errs.email = 'Email must be less than 100 characters';
    }
    
    // Password validation
    if (!register.password) {
      errs.password = 'Password is required';
    } else if (register.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long';
    } else if (register.password.length > 50) {
      errs.password = 'Password must be less than 50 characters';
    } else if (!/(?=.*[a-z])/.test(register.password)) {
      errs.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(register.password)) {
      errs.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(register.password)) {
      errs.password = 'Password must contain at least one number';
    } else if (!/(?=.*[@$!%*?&])/.test(register.password)) {
      errs.password = 'Password must contain at least one special character (@$!%*?&)';
    }
    
    // Mobile number validation
    if (!register.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(register.mobileNumber.trim())) {
      errs.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    
    // Gender validation (optional but if provided, must be valid)
    if (register.gender && !['male', 'female', 'other'].includes(register.gender.toLowerCase())) {
      errs.gender = 'Please select a valid gender';
    }
    
    // Address validation (optional but if provided, must be valid)
    if (register.address && register.address.trim().length < 10) {
      errs.address = 'Address must be at least 10 characters long';
    } else if (register.address && register.address.trim().length > 200) {
      errs.address = 'Address must be less than 200 characters';
    }
    
    // Referral code validation (optional but if provided, must be valid)
    if (register.referral && register.referral.trim().length < 3) {
      errs.referral = 'Referral code must be at least 3 characters long';
    } else if (register.referral && register.referral.trim().length > 20) {
      errs.referral = 'Referral code must be less than 20 characters';
    } else if (register.referral && !/^[a-zA-Z0-9]+$/.test(register.referral.trim())) {
      errs.referral = 'Referral code can only contain letters and numbers';
    }
    
    setRegisterErrors(errs);
    return Object.keys(errs).length === 0;
  };
  
  const validateLogin = () => {
    const errs: any = {};
    
    // Email validation
    if (!login.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login.email.trim())) {
      errs.email = 'Please enter a valid email address';
    } else if (login.email.trim().length > 100) {
      errs.email = 'Email must be less than 100 characters';
    }
    
    // Password validation
    if (!login.password) {
      errs.password = 'Password is required';
    } else if (login.password.length < 1) {
      errs.password = 'Password cannot be empty';
    } else if (login.password.length > 100) {
      errs.password = 'Password must be less than 100 characters';
    }
    
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handlers
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegister({ ...register, [name]: value });
    setRegisterErrors({ ...registerErrors, [name]: undefined });
    setRegisterServerError(null);
    
    // Real-time validation for specific fields
    if (name === 'email' && value.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        setRegisterErrors((prev: any) => ({ ...prev, email: 'Please enter a valid email address' }));
      }
    }
    
    if (name === 'mobileNumber' && value.trim()) {
      if (!/^[6-9]\d{9}$/.test(value.trim())) {
        setRegisterErrors((prev: any) => ({ ...prev, mobileNumber: 'Please enter a valid 10-digit mobile number' }));
      }
    }
    
    if (name === 'password' && value) {
      if (value.length < 8) {
        setRegisterErrors((prev: any) => ({ ...prev, password: 'Password must be at least 8 characters long' }));
      } else if (!/(?=.*[a-z])/.test(value)) {
        setRegisterErrors((prev: any) => ({ ...prev, password: 'Password must contain at least one lowercase letter' }));
      } else if (!/(?=.*[A-Z])/.test(value)) {
        setRegisterErrors((prev: any) => ({ ...prev, password: 'Password must contain at least one uppercase letter' }));
      } else if (!/(?=.*\d)/.test(value)) {
        setRegisterErrors((prev: any) => ({ ...prev, password: 'Password must contain at least one number' }));
      } else if (!/(?=.*[@$!%*?&])/.test(value)) {
        setRegisterErrors((prev: any) => ({ ...prev, password: 'Password must contain at least one special character (@$!%*?&)' }));
      }
    }
  };
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
    setLoginErrors({ ...loginErrors, [name]: undefined });
    setLoginServerError(null);
    
    // Real-time validation for email
    if (name === 'email' && value.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        setLoginErrors((prev: any) => ({ ...prev, email: 'Please enter a valid email address' }));
      }
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRegister()) {
      setRegisterLoading(true);
      setRegisterServerError(null);
      
      try {
        const userData = {
          name: register.name,
          email: register.email,
          password: register.password,
          mobileNumber: register.mobileNumber,
          gender: register.gender || undefined,
          address: register.address || undefined,
          referralCode: register.referral || undefined,
          paymentStatus: 'PENDING' as const
        };

        const response = await userApi.register(userData);
        
        // Store user data (registration doesn't return token, user needs to login)
        apiUtils.setUserData(response.data);
        
        // Show success message and proceed to onboarding
      setOnboardingStep(1);
      } catch (error: any) {
        setRegisterServerError(error.message || 'Registration failed. Please try again.');
      } finally {
        setRegisterLoading(false);
      }
    }
  };
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLogin()) {
      setLoginLoading(true);
      setLoginServerError(null);
      
      try {
        const response = await userApi.login({
          email: login.email,
          password: login.password
        });
        
        // Store user data and token
        apiUtils.setToken(response.data.token);
        apiUtils.setUserData(response.data);
        
        // Refresh user context
        refreshUser();

        // Small delay to ensure context is updated before navigation
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } catch (error: any) {
        setLoginServerError(error.message || 'Login failed. Please check your credentials.');
      } finally {
        setLoginLoading(false);
      }
    }
  };

  // Show two-part register page on /register
  if (location.pathname === '/register') {
    // Onboarding step 1: Products & Cashback
    if (onboardingStep === 1) {
      return (
        <div className="auth-flip-root">
          <div className="auth-flip-card">
            {/* Left Panel: Logo and Welcome */}
            <div className="auth-flip-panel auth-flip-panel-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img src={camelqLogo} alt="CamelQ Logo" style={{ width: '120px', marginBottom: '10px', marginTop: '-1rem', display: 'block', marginLeft: 'auto', marginRight: 'auto', cursor: 'pointer' }} onClick={() => navigate('/')} />
              <h2 className="auth-flip-welcome" style={{ textAlign: 'center', width: '100%' }}>Welcome!</h2>
              <p className="auth-flip-desc" style={{ textAlign: 'center', width: '100%' }}>Discover our products and earn cashback instantly.</p>
            </div>
            {/* Right Panel: Onboarding Content */}
            <div className="auth-flip-panel auth-flip-panel-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginBottom: 10, width: '100%' }}>
                <div style={{ background: '#ffffff', borderRadius: 16, padding: 8, marginBottom: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <img src={require('../assets/buy.jpg')} alt="Customised Product" style={{ width: 350, height: 350, objectFit: 'contain', borderRadius: 12, marginBottom: 8, backgroundColor: '#ffffff', padding: '10px' }} />
                </div>
                <div style={{ color: '#7c3aed', fontWeight: 800, fontSize: 22, marginTop: 4 }}>Buy customised products</div>
              </div>
              <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: 24, textAlign: 'center' }}>Explore our products and earn instant cashback on every purchase. Start shopping and enjoy exclusive rewards!</p>
              <button className="auth-flip-btn" style={{ width: '100%', marginTop: 12 }} onClick={() => setOnboardingStep(2)}>Next</button>
            </div>
          </div>
        </div>
      );
    }
    // Onboarding step 2: Refer a Friend
    if (onboardingStep === 2) {
      return (
        <div className="auth-flip-root">
          <div className="auth-flip-card">
            {/* Left Panel: Logo and Welcome */}
            <div className="auth-flip-panel auth-flip-panel-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img src={camelqLogo} alt="CamelQ Logo" style={{ width: '120px', marginBottom: '10px', marginTop: '-1rem', display: 'block', marginLeft: 'auto', marginRight: 'auto', cursor: 'pointer' }} onClick={() => navigate('/')} />
              <h2 className="auth-flip-welcome" style={{ textAlign: 'center', width: '100%' }}>Refer & Earn</h2>
              <p className="auth-flip-desc" style={{ textAlign: 'center', width: '100%' }}>Invite friends and unlock more rewards together!</p>
            </div>
            {/* Right Panel: Onboarding Content */}
            <div className="auth-flip-panel auth-flip-panel-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginBottom: 10, width: '100%' }}>
                <div style={{ background: '#ffffff', borderRadius: 16, padding: 8, marginBottom: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <img src={require('../assets/refer a friend 2.jpg')} alt="Refer a Friend" style={{ width: 350, height: 350, objectFit: 'contain', borderRadius: 12, marginBottom: 4, backgroundColor: '#ffffff', padding: '5px' }} />
                </div>
                <div style={{ color: '#7c3aed', fontWeight: 800, fontSize: 22, marginTop: 4 }}>Share & Earn Together</div>
              </div>
              <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: 24, textAlign: 'center' }}>Invite your friends to join and earn even more rewards for every successful referral. Share your referral link and grow your network!</p>
              <button className="auth-flip-btn" style={{ width: '100%', marginTop: 12 }} onClick={() => setOnboardingStep(3)}>Next</button>
            </div>
          </div>
        </div>
      );
    }
    // Onboarding step 3: Milestones
    if (onboardingStep === 3) {
      return (
        <div className="auth-flip-root">
          <div className="auth-flip-card">
            {/* Left Panel: Logo and Welcome */}
            <div className="auth-flip-panel auth-flip-panel-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img src={camelqLogo} alt="CamelQ Logo" style={{ width: '120px', marginBottom: '10px', marginTop: '-1rem', display: 'block', marginLeft: 'auto', marginRight: 'auto', cursor: 'pointer' }} onClick={() => navigate('/')} />
              <h2 className="auth-flip-welcome" style={{ textAlign: 'center', width: '100%' }}>Track Progress</h2>
              <p className="auth-flip-desc" style={{ textAlign: 'center', width: '100%' }}>Set goals and celebrate your achievements!</p>
            </div>
            {/* Right Panel: Onboarding Content */}
            <div className="auth-flip-panel auth-flip-panel-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginBottom: 10, width: '100%' }}>
                <div style={{ background: '#ffffff', borderRadius: 16, padding: 8, marginBottom: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <img src={require('../assets/19198056.jpg')} alt="Achieve Your Goals" style={{ width: 350, height: 350, objectFit: 'contain', borderRadius: 12, marginBottom: 4, backgroundColor: '#ffffff', padding: '5px' }} />
                </div>
                <div style={{ color: '#7c3aed', fontWeight: 800, fontSize: 22, marginTop: 4 }}>Achieve Your Goals</div>
              </div>
              <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: 24, textAlign: 'center' }}>Track your progress, unlock achievements, and reach new milestones. Every step brings you closer to bigger rewards!</p>
              <button className="auth-flip-btn" style={{ width: '100%', marginTop: 12 }} onClick={() => navigate('/login')}>Finish & Login</button>
            </div>
          </div>
        </div>
      );
    }
    // Registration form (default)
    return (
      <div className="auth-flip-root">
        <div className="auth-flip-card">
          {/* Left Panel: Logo and Welcome */}
          <div className="auth-flip-panel auth-flip-panel-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={camelqLogo} alt="CamelQ Logo" style={{ width: '120px', marginBottom: '10px', marginTop: '-1rem', display: 'block', marginLeft: 'auto', marginRight: 'auto', cursor: 'pointer' }} onClick={() => navigate('/')} />
            <h2 className="auth-flip-welcome" style={{ textAlign: 'center', width: '100%' }}>Welcome Back!</h2>
            <p className="auth-flip-desc" style={{ textAlign: 'center', width: '100%' }}>To keep connected with us please register with your personal info</p>
            <button className="auth-flip-btn-outline" style={{ display: 'block', margin: '1.5rem auto 0 auto' }} onClick={() => navigate('/login')}>SIGN IN</button>
          </div>
          {/* Right Panel: Register Form */}
          <div className="auth-flip-panel auth-flip-panel-right">
            <h2 className="auth-flip-title">Create Account</h2>
            <div className="auth-flip-or">or use your email for registration:</div>
            <form className="auth-flip-form" onSubmit={handleRegisterSubmit} autoComplete="off">
              {registerServerError && (
                <div className="form-error" style={{ color: 'red', marginBottom: 16, textAlign: 'center', fontSize: '0.9rem' }}>
                  {registerServerError}
                </div>
              )}
              <input 
                type="text" 
                name="name" 
                placeholder="Name" 
                value={register.name} 
                onChange={handleRegisterChange} 
                className={registerErrors.name ? 'error' : ''} 
              />
              {registerErrors.name && <div className="form-error">{registerErrors.name}</div>}
              
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={register.email} 
                onChange={handleRegisterChange} 
                className={registerErrors.email ? 'error' : ''} 
              />
              {registerErrors.email && <div className="form-error">{registerErrors.email}</div>}
              
              <input 
                type="text" 
                name="mobileNumber" 
                placeholder="Mobile Number" 
                value={register.mobileNumber} 
                onChange={handleRegisterChange} 
                className={registerErrors.mobileNumber ? 'error' : ''} 
              />
              {registerErrors.mobileNumber && <div className="form-error">{registerErrors.mobileNumber}</div>}
              
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={register.password} 
                onChange={handleRegisterChange} 
                className={registerErrors.password ? 'error' : ''} 
              />
              {registerErrors.password && <div className="form-error">{registerErrors.password}</div>}
              
              <input 
                type="text" 
                name="gender" 
                placeholder="Gender (optional)" 
                value={register.gender} 
                onChange={handleRegisterChange} 
              />
              
              <input 
                type="text" 
                name="address" 
                placeholder="Address (optional)" 
                value={register.address} 
                onChange={handleRegisterChange} 
              />
              
              <input 
                type="text" 
                name="referral" 
                placeholder="Referral Code (optional)" 
                value={register.referral} 
                onChange={handleRegisterChange} 
              />
              
              <button 
                className="auth-flip-btn" 
                type="submit" 
                disabled={registerLoading}
                style={{ opacity: registerLoading ? 0.7 : 1 }}
              >
                {registerLoading ? 'Creating Account...' : 'SIGN UP'}
              </button>
            </form>
            <button className="auth-flip-btn-link" onClick={() => navigate('/login')}>
              Already have an account?
              <span className="auth-flip-link-voilet"> Sign In</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  // Show two-part login page on /login
  if (location.pathname === '/login') {
    return (
      <div className="auth-flip-root">
        <div className="auth-flip-card">
          {/* Left Panel: Logo and Welcome */}
          <div className="auth-flip-panel auth-flip-panel-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={camelqLogo} alt="CamelQ Logo" style={{ width: '120px', marginBottom: '2rem', marginTop: '-1rem', display: 'block', marginLeft: 'auto', marginRight: 'auto', cursor: 'pointer' }} onClick={() => navigate('/')} />
            <h2 className="auth-flip-welcome" style={{ textAlign: 'center', width: '100%' }}>Welcome!</h2>
            <p className="auth-flip-desc" style={{ textAlign: 'center', width: '100%' }}>To create a new account, please sign up with your personal info</p>
            <button className="auth-flip-btn-outline" style={{ display: 'block', margin: '1.5rem auto 0 auto' }} onClick={() => navigate('/register')}>SIGN UP</button>
          </div>
          {/* Right Panel: Login Form */}
          <div className="auth-flip-panel auth-flip-panel-right">
            <h2 className="auth-flip-title">Sign In</h2>
            <div className="auth-flip-or">or use your email to sign in:</div>
            <form className="auth-flip-form" onSubmit={handleLoginSubmit} autoComplete="off">
              {loginServerError && (
                <div className="form-error" style={{ color: 'red', marginBottom: 16, textAlign: 'center', fontSize: '0.9rem' }}>
                  {loginServerError}
                </div>
              )}
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={login.email} 
                onChange={handleLoginChange} 
                className={loginErrors.email ? 'error' : ''} 
              />
              {loginErrors.email && <div className="form-error">{loginErrors.email}</div>}
              
              <div style={{ position: 'relative', width: '100%' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  placeholder="Password" 
                  value={login.password} 
                  onChange={handleLoginChange} 
                  className={loginErrors.password ? 'error' : ''} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {loginErrors.password && <div className="form-error">{loginErrors.password}</div>}
              
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem', marginBottom: '0.7rem' }}>
                <button type="button" className="forgot-link" style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.98rem' }} onClick={() => navigate('/reset-password')}>
                  Forgot password <span style={{ fontWeight: 'bold', fontSize: '1.1rem', marginLeft: '0.2rem' }}>?</span>
                </button>
              </div>
              <button 
                className="auth-flip-btn" 
                type="submit"
                disabled={loginLoading}
                style={{ opacity: loginLoading ? 0.7 : 1 }}
              >
                {loginLoading ? 'Signing In...' : 'SIGN IN'}
              </button>
            </form>
            <button className="auth-flip-btn-link" onClick={() => navigate('/register')}>
              Don't have an account?
              <span className="auth-flip-link-voilet"> Sign Up</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  // Default case - show register form
  return (
    <div className="auth-flip-root">
      <div className="auth-flip-card">
        {/* Left Panel: Logo and Welcome */}
        <div className="auth-flip-panel auth-flip-panel-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img src={camelqLogo} alt="CamelQ Logo" style={{ width: '120px', marginBottom: '10px', marginTop: '-1rem', display: 'block', marginLeft: 'auto', marginRight: 'auto', cursor: 'pointer' }} onClick={() => navigate('/')} />
          <h2 className="auth-flip-welcome" style={{ textAlign: 'center', width: '100%' }}>Welcome Back!</h2>
          <p className="auth-flip-desc" style={{ textAlign: 'center', width: '100%' }}>To keep connected with us please register with your personal info</p>
          <button className="auth-flip-btn-outline" style={{ display: 'block', margin: '1.5rem auto 0 auto' }} onClick={() => navigate('/login')}>SIGN IN</button>
        </div>
        {/* Right Panel: Register Form */}
        <div className="auth-flip-panel auth-flip-panel-right">
          <h2 className="auth-flip-title">Create Account</h2>
          <div className="auth-flip-or">or use your email for registration:</div>
          <form className="auth-flip-form" onSubmit={handleRegisterSubmit} autoComplete="off">
            {registerServerError && (
              <div className="form-error" style={{ color: 'red', marginBottom: 16, textAlign: 'center', fontSize: '0.9rem' }}>
                {registerServerError}
              </div>
            )}
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              value={register.name} 
              onChange={handleRegisterChange} 
              className={registerErrors.name ? 'error' : ''} 
            />
            {registerErrors.name && <div className="form-error">{registerErrors.name}</div>}
            
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={register.email} 
              onChange={handleRegisterChange} 
              className={registerErrors.email ? 'error' : ''} 
            />
            {registerErrors.email && <div className="form-error">{registerErrors.email}</div>}
            
            <input 
              type="text" 
              name="mobileNumber" 
              placeholder="Mobile Number" 
              value={register.mobileNumber} 
              onChange={handleRegisterChange} 
              className={registerErrors.mobileNumber ? 'error' : ''} 
            />
            {registerErrors.mobileNumber && <div className="form-error">{registerErrors.mobileNumber}</div>}
            
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={register.password} 
              onChange={handleRegisterChange} 
              className={registerErrors.password ? 'error' : ''} 
            />
            {registerErrors.password && <div className="form-error">{registerErrors.password}</div>}
            
            <input 
              type="text" 
              name="gender" 
              placeholder="Gender (optional)" 
              value={register.gender} 
              onChange={handleRegisterChange} 
            />
            
            <input 
              type="text" 
              name="address" 
              placeholder="Address (optional)" 
              value={register.address} 
              onChange={handleRegisterChange} 
            />
            
            <input 
              type="text" 
              name="referral" 
              placeholder="Referral Code (optional)" 
              value={register.referral} 
              onChange={handleRegisterChange} 
            />
            
            <button 
              className="auth-flip-btn" 
              type="submit" 
              disabled={registerLoading}
              style={{ opacity: registerLoading ? 0.7 : 1 }}
            >
              {registerLoading ? 'Creating Account...' : 'SIGN UP'}
            </button>
          </form>
          <button className="auth-flip-btn-link" onClick={() => navigate('/login')}>
            Already have an account?
            <span className="auth-flip-link-voilet"> Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;