const translations = {
  eng: {
    fontClass: 'font-jakarta',
    navTitle: 'KRISHI KRITARTH',
    navSubtitle: 'Harvest Bidding & Trading Portal',
    badgeText: 'Direct Farmer-to-Merchant Bidding Platform',
    heroHeading: 'Empowering Farmers with Fair Crop Bidding.',
    heroDesc: 'Sell your harvest directly to verified buyers across the country at the best market prices without intermediaries.',
    stat1: 'Direct Bidding',
    stat2: 'Middleman Fee',
    stat3: 'Auction Support',
    loginTab: 'Login',
    signupTab: 'Sign Up',
    labelName: 'Full Name',
    labelPhone: 'Mobile / Email',
    labelPass: 'Password',
    labelRole: 'Account Type',
    optFarmer: 'Farmer (Seller)',
    optBuyer: 'Buyer / Merchant (Bidder)',
    submitLogin: 'Login to Portal',
    submitSignup: 'Register Account'
  },
  hi: {
    fontClass: 'font-noto',
    navTitle: 'कृषि कृतार्थ पोर्टल',
    navSubtitle: 'फसल नीलामी एवं व्यापार मंच',
    badgeText: 'किसान और व्यापारी सीधा नीलामी मंच',
    heroHeading: 'उचित फसल बोली से किसानों का सशक्तिकरण।',
    heroDesc: 'अपनी फसल को बिना किसी बिचौलिए के देश भर के सत्यापित खरीदारों को सर्वोत्तम बाजार दरों पर सीधे बेचें।',
    stat1: 'प्रत्यक्ष बोली',
    stat2: 'दलाली शुल्क',
    stat3: 'नीलामी सहायता',
    loginTab: 'लॉग इन',
    signupTab: 'साइन अप',
    labelName: 'पूरा नाम',
    labelPhone: 'मोबाइल नंबर / ईमेल',
    labelPass: 'पासवर्ड',
    labelRole: 'खाते का प्रकार',
    optFarmer: 'किसान (विक्रेता)',
    optBuyer: 'व्यापारी (बोलीदाता)',
    submitLogin: 'पोर्टल में प्रवेश करें',
    submitSignup: 'खाता बनाएं'
  }
};

let currentLang = 'eng';
let isSignupMode = false;
let currentCaptcha = '';

// DOM Nodes
const appBody = document.getElementById('app-body');
const btnEng = document.getElementById('btn-eng');
const btnHi = document.getElementById('btn-hi');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const fieldName = document.getElementById('field-name');
const fieldPassword = document.getElementById('field-password');
const fieldOtp = document.getElementById('field-otp');
const authMethodToggle = document.getElementById('auth-method-toggle');
const btnSubmit = document.getElementById('btn-submit');
const captchaCodeBox = document.getElementById('captcha-code');
const btnRefreshCaptcha = document.getElementById('btn-refresh-captcha');
const btnSendOtp = document.getElementById('btn-send-otp');

// Dynamic CAPTCHA Generator
function generateCaptcha() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  currentCaptcha = result;
  captchaCodeBox.innerText = result;
}
generateCaptcha();
btnRefreshCaptcha.addEventListener('click', generateCaptcha);

// Segmented Switch Listener (Password vs OTP)
document.querySelectorAll('input[name="authMethod"]').forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'otp') {
      fieldPassword.classList.add('hidden');
      fieldOtp.classList.remove('hidden');
    } else {
      fieldPassword.classList.remove('hidden');
      fieldOtp.classList.add('hidden');
    }
  });
});

// Mock Request OTP
btnSendOtp.addEventListener('click', () => {
  const phone = document.getElementById('input-phone-email').value;
  if (!phone) {
    alert('Please enter your Mobile / Email first.');
    return;
  }
  alert(`OTP sent to ${phone}! (Use demo OTP: 123456)`);
});

// Auth Form Submit Handler
document.getElementById('auth-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // CAPTCHA Verification
  const userCaptcha = document.getElementById('input-captcha').value.trim().toUpperCase();
  if (userCaptcha !== currentCaptcha) {
    alert('Invalid CAPTCHA code. Please try again.');
    generateCaptcha();
    document.getElementById('input-captcha').value = '';
    return;
  }

  const phoneOrEmail = document.getElementById('input-phone-email').value;
  const role = document.querySelector('select').value;
  const authMethod = document.querySelector('input[name="authMethod"]:checked').value;
  const password = fieldPassword.querySelector('input').value;
  const otp = fieldOtp.querySelector('input').value;
  const nameInput = document.querySelector('#field-name input');

  const endpoint = isSignupMode ? '/api/auth/signup' : '/api/auth/login';
  const payload = {
    phoneOrEmail,
    role,
    authMethod,
    password: authMethod === 'password' ? password : null,
    otp: authMethod === 'otp' ? otp : null,
    ...(isSignupMode && { name: nameInput.value })
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.success) {
      // 1. Save user session details
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', isSignupMode ? nameInput.value : (data.user.name || 'Verified User'));
      
      // 2. Redirect to the new Dashboard screen!
      window.location.href = 'dashboard.html';
    } else {
      alert(`Error: ${data.message}`);
      generateCaptcha();
    }
  } catch (err) {
    console.error('Server error:', err);
    alert('Failed to connect to backend server. Make sure server.js is running!');
  }
});

// Switch Language Listener
btnEng.addEventListener('click', () => setLanguage('eng'));
btnHi.addEventListener('click', () => setLanguage('hi'));

function setLanguage(lang) {
  currentLang = lang;
  const data = translations[lang];

  if (lang === 'hi') {
    appBody.classList.remove('font-jakarta');
    appBody.classList.add('font-noto');
    btnHi.className = "px-4 py-1.5 rounded-full text-xs font-semibold transition-all bg-emerald-500 text-emerald-950 shadow-md";
    btnEng.className = "px-4 py-1.5 rounded-full text-xs font-semibold transition-all text-emerald-200 hover:text-white";
  } else {
    appBody.classList.remove('font-noto');
    appBody.classList.add('font-jakarta');
    btnEng.className = "px-4 py-1.5 rounded-full text-xs font-semibold transition-all bg-emerald-500 text-emerald-950 shadow-md";
    btnHi.className = "px-4 py-1.5 rounded-full text-xs font-semibold transition-all text-emerald-200 hover:text-white";
  }

  document.getElementById('nav-title').innerText = data.navTitle;
  document.getElementById('nav-subtitle').innerText = data.navSubtitle;
  document.getElementById('badge-text').innerText = data.badgeText;
  document.getElementById('hero-heading').innerText = data.heroHeading;
  document.getElementById('hero-desc').innerText = data.heroDesc;
  document.getElementById('stat-1').innerText = data.stat1;
  document.getElementById('stat-2').innerText = data.stat2;
  document.getElementById('stat-3').innerText = data.stat3;

  document.querySelector('.lang-text-login').innerText = data.loginTab;
  document.querySelector('.lang-text-signup').innerText = data.signupTab;
  document.querySelector('.lang-label-name').innerText = data.labelName;
  document.querySelector('.lang-label-phone').innerText = data.labelPhone;
  document.querySelector('.lang-label-pass').innerText = data.labelPass;
  document.querySelector('.lang-label-role').innerText = data.labelRole;
  document.querySelector('.lang-opt-farmer').innerText = data.optFarmer;
  document.querySelector('.lang-opt-buyer').innerText = data.optBuyer;

  btnSubmit.innerText = isSignupMode ? data.submitSignup : data.submitLogin;
}

// Tab Switching (Login / Signup)
tabLogin.addEventListener('click', () => {
  isSignupMode = false;
  fieldName.classList.add('hidden');
  authMethodToggle.classList.remove('hidden');
  tabLogin.className = 'flex-1 pb-3 text-center font-bold text-emerald-300 border-b-2 border-emerald-400 text-base transition-all';
  tabSignup.className = 'flex-1 pb-3 text-center font-medium text-slate-300/60 border-b-2 border-transparent hover:text-white text-base transition-all';
  btnSubmit.innerText = translations[currentLang].submitLogin;
});

tabSignup.addEventListener('click', () => {
  isSignupMode = true;
  fieldName.classList.remove('hidden');
  authMethodToggle.classList.add('hidden');
  fieldPassword.classList.remove('hidden');
  fieldOtp.classList.add('hidden');
  tabSignup.className = 'flex-1 pb-3 text-center font-bold text-emerald-300 border-b-2 border-emerald-400 text-base transition-all';
  tabLogin.className = 'flex-1 pb-3 text-center font-medium text-slate-300/60 border-b-2 border-transparent hover:text-white text-base transition-all';
  btnSubmit.innerText = translations[currentLang].submitSignup;
});