/**
 * Multi-language translations for AgriAI Platform
 * Supports: English, Hindi, Marathi, Punjabi, Tamil
 */

export type Language = "en" | "hi" | "mr" | "pa" | "ta";

export interface Translations {
  // Navigation
  dashboard: string;
  alerts: string;
  profile: string;
  logout: string;

  // Agent Dashboard
  aiCropAdvisor: string;
  selectCrop: string;
  selectCity: string;
  forecastPeriod: string;
  quantity: string;
  quantityPlaceholder: string;
  analyzeNow: string;
  analyzing: string;

  // Crops
  wheat: string;
  rice: string;
  tomato: string;
  potato: string;
  onion: string;
  maize: string;
  cotton: string;
  sugarcane: string;

  // Cities
  delhi: string;
  mumbai: string;
  bangalore: string;
  kolkata: string;
  chennai: string;
  hyderabad: string;
  pune: string;

  // Time periods
  days7: string;
  days15: string;
  days30: string;

  // Quick presets
  quickPresets: string;
  wheat30d: string;
  rice30d: string;
  tomato7d: string;

  // Analysis results
  recommendation: string;
  currentPrice: string;
  predictedPrice: string;
  priceChange: string;
  confidence: string;
  bestAction: string;
  marketInsights: string;

  // Actions
  buy: string;
  sell: string;
  hold: string;
  wait: string;

  // Risk levels
  risk: string;
  low: string;
  medium: string;
  high: string;

  // Profit calculator
  profitCalculator: string;
  currentValue: string;
  predictedValue: string;
  expectedProfit: string;
  expectedLoss: string;

  // History
  analysisHistory: string;
  noHistory: string;
  runAnalysis: string;

  // Chart
  priceChart: string;
  historical: string;
  predicted: string;
  loading: string;
  noData: string;

  // Share/Export
  share: string;
  download: string;
  copiedToClipboard: string;

  // Alerts
  createAlert: string;
  alertType: string;
  priceAbove: string;
  priceBelow: string;
  priceChangeAlert: string;
  threshold: string;
  notificationMethod: string;
  email: string;
  sms: string;
  both: string;

  // Common
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  close: string;
  success: string;
  error: string;
  kg: string;
  rupees: string;
}

export const translations: Record<Language, Translations> = {
  // English
  en: {
    dashboard: "Dashboard",
    alerts: "Alerts",
    profile: "Profile",
    logout: "Logout",

    aiCropAdvisor: "AI Crop Advisor",
    selectCrop: "Select Crop",
    selectCity: "Select City",
    forecastPeriod: "Forecast Period",
    quantity: "Quantity (kg)",
    quantityPlaceholder: "Enter quantity in kg",
    analyzeNow: "Analyze Now",
    analyzing: "Analyzing...",

    wheat: "Wheat",
    rice: "Rice",
    tomato: "Tomato",
    potato: "Potato",
    onion: "Onion",
    maize: "Maize",
    cotton: "Cotton",
    sugarcane: "Sugarcane",

    delhi: "Delhi",
    mumbai: "Mumbai",
    bangalore: "Bangalore",
    kolkata: "Kolkata",
    chennai: "Chennai",
    hyderabad: "Hyderabad",
    pune: "Pune",

    days7: "7 Days",
    days15: "15 Days",
    days30: "30 Days",

    quickPresets: "Quick Presets",
    wheat30d: "Wheat (30d)",
    rice30d: "Rice (30d)",
    tomato7d: "Tomato (7d)",

    recommendation: "Recommendation",
    currentPrice: "Current Price",
    predictedPrice: "Predicted Price",
    priceChange: "Price Change",
    confidence: "Confidence",
    bestAction: "Best Action",
    marketInsights: "Market Insights",

    buy: "Buy",
    sell: "Sell",
    hold: "Hold",
    wait: "Wait",

    risk: "Risk",
    low: "Low",
    medium: "Medium",
    high: "High",

    profitCalculator: "Profit Calculator",
    currentValue: "Current Value",
    predictedValue: "Predicted Value",
    expectedProfit: "Expected Profit",
    expectedLoss: "Expected Loss",

    analysisHistory: "Analysis History",
    noHistory: "No analysis history yet",
    runAnalysis: "Run an analysis to get started",

    priceChart: "Price Chart",
    historical: "Historical",
    predicted: "Predicted",
    loading: "Loading chart data...",
    noData: "No chart data available",

    share: "Share",
    download: "Download",
    copiedToClipboard: "Copied to clipboard!",

    createAlert: "Create Alert",
    alertType: "Alert Type",
    priceAbove: "Price Above",
    priceBelow: "Price Below",
    priceChangeAlert: "Price Change",
    threshold: "Threshold",
    notificationMethod: "Notification Method",
    email: "Email",
    sms: "SMS",
    both: "Both",

    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    success: "Success",
    error: "Error",
    kg: "kg",
    rupees: "₹",
  },

  // Hindi (हिन्दी)
  hi: {
    dashboard: "डैशबोर्ड",
    alerts: "अलर्ट",
    profile: "प्रोफ़ाइल",
    logout: "लॉगआउट",

    aiCropAdvisor: "एआई फसल सलाहकार",
    selectCrop: "फसल चुनें",
    selectCity: "शहर चुनें",
    forecastPeriod: "पूर्वानुमान अवधि",
    quantity: "मात्रा (किलो)",
    quantityPlaceholder: "किलो में मात्रा दर्ज करें",
    analyzeNow: "अभी विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है...",

    wheat: "गेहूं",
    rice: "चावल",
    tomato: "टमाटर",
    potato: "आलू",
    onion: "प्याज",
    maize: "मक्का",
    cotton: "कपास",
    sugarcane: "गन्ना",

    delhi: "दिल्ली",
    mumbai: "मुंबई",
    bangalore: "बेंगलुरु",
    kolkata: "कोलकाता",
    chennai: "चेन्नई",
    hyderabad: "हैदराबाद",
    pune: "पुणे",

    days7: "7 दिन",
    days15: "15 दिन",
    days30: "30 दिन",

    quickPresets: "त्वरित विकल्प",
    wheat30d: "गेहूं (30 दिन)",
    rice30d: "चावल (30 दिन)",
    tomato7d: "टमाटर (7 दिन)",

    recommendation: "सिफारिश",
    currentPrice: "वर्तमान कीमत",
    predictedPrice: "अनुमानित कीमत",
    priceChange: "मूल्य परिवर्तन",
    confidence: "विश्वास",
    bestAction: "सर्वोत्तम कार्रवाई",
    marketInsights: "बाजार की जानकारी",

    buy: "खरीदें",
    sell: "बेचें",
    hold: "रुकें",
    wait: "प्रतीक्षा करें",

    risk: "जोखिम",
    low: "कम",
    medium: "मध्यम",
    high: "उच्च",

    profitCalculator: "लाभ कैलकुलेटर",
    currentValue: "वर्तमान मूल्य",
    predictedValue: "अनुमानित मूल्य",
    expectedProfit: "अपेक्षित लाभ",
    expectedLoss: "अपेक्षित हानि",

    analysisHistory: "विश्लेषण इतिहास",
    noHistory: "अभी तक कोई विश्लेषण इतिहास नहीं है",
    runAnalysis: "शुरू करने के लिए विश्लेषण चलाएं",

    priceChart: "मूल्य चार्ट",
    historical: "ऐतिहासिक",
    predicted: "अनुमानित",
    loading: "चार्ट डेटा लोड हो रहा है...",
    noData: "कोई चार्ट डेटा उपलब्ध नहीं है",

    share: "साझा करें",
    download: "डाउनलोड",
    copiedToClipboard: "क्लिपबोर्ड पर कॉपी किया गया!",

    createAlert: "अलर्ट बनाएं",
    alertType: "अलर्ट प्रकार",
    priceAbove: "कीमत से ऊपर",
    priceBelow: "कीमत से नीचे",
    priceChangeAlert: "मूल्य परिवर्तन",
    threshold: "सीमा",
    notificationMethod: "सूचना विधि",
    email: "ईमेल",
    sms: "एसएमएस",
    both: "दोनों",

    save: "सहेजें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    close: "बंद करें",
    success: "सफलता",
    error: "त्रुटि",
    kg: "किलो",
    rupees: "₹",
  },

  // Marathi (मराठी)
  mr: {
    dashboard: "डॅशबोर्ड",
    alerts: "सूचना",
    profile: "प्रोफाइल",
    logout: "बाहेर पडा",

    aiCropAdvisor: "एआय पीक सल्लागार",
    selectCrop: "पीक निवडा",
    selectCity: "शहर निवडा",
    forecastPeriod: "अंदाज कालावधी",
    quantity: "प्रमाण (किलो)",
    quantityPlaceholder: "किलोमध्ये प्रमाण टाका",
    analyzeNow: "आता विश्लेषण करा",
    analyzing: "विश्लेषण करत आहे...",

    wheat: "गहू",
    rice: "तांदूळ",
    tomato: "टोमॅटो",
    potato: "बटाटा",
    onion: "कांदा",
    maize: "मका",
    cotton: "कापूस",
    sugarcane: "ऊस",

    delhi: "दिल्ली",
    mumbai: "मुंबई",
    bangalore: "बेंगलुरु",
    kolkata: "कोलकाता",
    chennai: "चेन्नई",
    hyderabad: "हैदराबाद",
    pune: "पुणे",

    days7: "७ दिवस",
    days15: "१५ दिवस",
    days30: "३० दिवस",

    quickPresets: "द्रुत पर्याय",
    wheat30d: "गहू (३० दिवस)",
    rice30d: "तांदूळ (३० दिवस)",
    tomato7d: "टोमॅटो (७ दिवस)",

    recommendation: "शिफारस",
    currentPrice: "सध्याची किंमत",
    predictedPrice: "अंदाजित किंमत",
    priceChange: "किंमत बदल",
    confidence: "विश्वास",
    bestAction: "सर्वोत्तम कृती",
    marketInsights: "बाजार माहिती",

    buy: "खरेदी करा",
    sell: "विक्री करा",
    hold: "थांबा",
    wait: "प्रतीक्षा करा",

    risk: "जोखीम",
    low: "कमी",
    medium: "मध्यम",
    high: "जास्त",

    profitCalculator: "नफा कॅल्क्युलेटर",
    currentValue: "सध्याचे मूल्य",
    predictedValue: "अंदाजित मूल्य",
    expectedProfit: "अपेक्षित नफा",
    expectedLoss: "अपेक्षित तोटा",

    analysisHistory: "विश्लेषण इतिहास",
    noHistory: "अद्याप विश्लेषण इतिहास नाही",
    runAnalysis: "सुरू करण्यासाठी विश्लेषण चालवा",

    priceChart: "किंमत तक्ता",
    historical: "ऐतिहासिक",
    predicted: "अंदाजित",
    loading: "चार्ट डेटा लोड करत आहे...",
    noData: "चार्ट डेटा उपलब्ध नाही",

    share: "शेअर करा",
    download: "डाउनलोड",
    copiedToClipboard: "क्लिपबोर्डवर कॉपी केले!",

    createAlert: "सूचना तयार करा",
    alertType: "सूचना प्रकार",
    priceAbove: "किंमतीपेक्षा जास्त",
    priceBelow: "किंमतीपेक्षा कमी",
    priceChangeAlert: "किंमत बदल",
    threshold: "मर्यादा",
    notificationMethod: "सूचना पद्धत",
    email: "ईमेल",
    sms: "एसएमएस",
    both: "दोन्ही",

    save: "जतन करा",
    cancel: "रद्द करा",
    delete: "हटवा",
    edit: "संपादित करा",
    close: "बंद करा",
    success: "यश",
    error: "त्रुटी",
    kg: "किलो",
    rupees: "₹",
  },

  // Punjabi (ਪੰਜਾਬੀ)
  pa: {
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    alerts: "ਸੂਚਨਾਵਾਂ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    logout: "ਲੌਗ ਆਉਟ",

    aiCropAdvisor: "ਏਆਈ ਫਸਲ ਸਲਾਹਕਾਰ",
    selectCrop: "ਫਸਲ ਚੁਣੋ",
    selectCity: "ਸ਼ਹਿਰ ਚੁਣੋ",
    forecastPeriod: "ਪੂਰਵ-ਅਨੁਮਾਨ ਮਿਆਦ",
    quantity: "ਮਾਤਰਾ (ਕਿਲੋ)",
    quantityPlaceholder: "ਕਿਲੋ ਵਿੱਚ ਮਾਤਰਾ ਦਰਜ ਕਰੋ",
    analyzeNow: "ਹੁਣੇ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
    analyzing: "ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...",

    wheat: "ਕਣਕ",
    rice: "ਚਾਵਲ",
    tomato: "ਟਮਾਟਰ",
    potato: "ਆਲੂ",
    onion: "ਪਿਆਜ਼",
    maize: "ਮੱਕੀ",
    cotton: "ਕਪਾਹ",
    sugarcane: "ਗੰਨਾ",

    delhi: "ਦਿੱਲੀ",
    mumbai: "ਮੁੰਬਈ",
    bangalore: "ਬੰਗਲੌਰ",
    kolkata: "ਕੋਲਕਾਤਾ",
    chennai: "ਚੇਨਈ",
    hyderabad: "ਹੈਦਰਾਬਾਦ",
    pune: "ਪੁਣੇ",

    days7: "7 ਦਿਨ",
    days15: "15 ਦਿਨ",
    days30: "30 ਦਿਨ",

    quickPresets: "ਤੇਜ਼ ਵਿਕਲਪ",
    wheat30d: "ਕਣਕ (30 ਦਿਨ)",
    rice30d: "ਚਾਵਲ (30 ਦਿਨ)",
    tomato7d: "ਟਮਾਟਰ (7 ਦਿਨ)",

    recommendation: "ਸਿਫਾਰਸ਼",
    currentPrice: "ਮੌਜੂਦਾ ਕੀਮਤ",
    predictedPrice: "ਅਨੁਮਾਨਿਤ ਕੀਮਤ",
    priceChange: "ਕੀਮਤ ਬਦਲਾਅ",
    confidence: "ਵਿਸ਼ਵਾਸ",
    bestAction: "ਸਭ ਤੋਂ ਵਧੀਆ ਕਾਰਵਾਈ",
    marketInsights: "ਮਾਰਕੀਟ ਜਾਣਕਾਰੀ",

    buy: "ਖਰੀਦੋ",
    sell: "ਵੇਚੋ",
    hold: "ਰੁਕੋ",
    wait: "ਉਡੀਕ ਕਰੋ",

    risk: "ਜੋਖਮ",
    low: "ਘੱਟ",
    medium: "ਮੱਧਮ",
    high: "ਉੱਚ",

    profitCalculator: "ਲਾਭ ਕੈਲਕੁਲੇਟਰ",
    currentValue: "ਮੌਜੂਦਾ ਮੁੱਲ",
    predictedValue: "ਅਨੁਮਾਨਿਤ ਮੁੱਲ",
    expectedProfit: "ਅਨੁਮਾਨਿਤ ਲਾਭ",
    expectedLoss: "ਅਨੁਮਾਨਿਤ ਨੁਕਸਾਨ",

    analysisHistory: "ਵਿਸ਼ਲੇਸ਼ਣ ਇਤਿਹਾਸ",
    noHistory: "ਅਜੇ ਤੱਕ ਕੋਈ ਵਿਸ਼ਲੇਸ਼ਣ ਇਤਿਹਾਸ ਨਹੀਂ",
    runAnalysis: "ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਵਿਸ਼ਲੇਸ਼ਣ ਚਲਾਓ",

    priceChart: "ਕੀਮਤ ਚਾਰਟ",
    historical: "ਇਤਿਹਾਸਕ",
    predicted: "ਅਨੁਮਾਨਿਤ",
    loading: "ਚਾਰਟ ਡੇਟਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    noData: "ਕੋਈ ਚਾਰਟ ਡੇਟਾ ਉਪਲਬਧ ਨਹੀਂ",

    share: "ਸਾਂਝਾ ਕਰੋ",
    download: "ਡਾਊਨਲੋਡ",
    copiedToClipboard: "ਕਲਿੱਪਬੋਰਡ ਵਿੱਚ ਕਾਪੀ ਕੀਤਾ!",

    createAlert: "ਸੂਚਨਾ ਬਣਾਓ",
    alertType: "ਸੂਚਨਾ ਕਿਸਮ",
    priceAbove: "ਕੀਮਤ ਤੋਂ ਉੱਪਰ",
    priceBelow: "ਕੀਮਤ ਤੋਂ ਹੇਠਾਂ",
    priceChangeAlert: "ਕੀਮਤ ਬਦਲਾਅ",
    threshold: "ਸੀਮਾ",
    notificationMethod: "ਸੂਚਨਾ ਵਿਧੀ",
    email: "ਈਮੇਲ",
    sms: "ਐਸਐਮਐਸ",
    both: "ਦੋਵੇਂ",

    save: "ਸੁਰੱਖਿਅਤ ਕਰੋ",
    cancel: "ਰੱਦ ਕਰੋ",
    delete: "ਮਿਟਾਓ",
    edit: "ਸੰਪਾਦਿਤ ਕਰੋ",
    close: "ਬੰਦ ਕਰੋ",
    success: "ਸਫਲਤਾ",
    error: "ਗਲਤੀ",
    kg: "ਕਿਲੋ",
    rupees: "₹",
  },

  // Tamil (தமிழ்)
  ta: {
    dashboard: "டாஷ்போர்டு",
    alerts: "எச்சரிக்கைகள்",
    profile: "சுயவிவரம்",
    logout: "வெளியேறு",

    aiCropAdvisor: "AI பயிர் ஆலோசகர்",
    selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",
    selectCity: "நகரத்தைத் தேர்ந்தெடுக்கவும்",
    forecastPeriod: "முன்னறிவிப்பு காலம்",
    quantity: "அளவு (கிலோ)",
    quantityPlaceholder: "கிலோவில் அளவை உள்ளிடவும்",
    analyzeNow: "இப்போது பகுப்பாய்வு செய்யவும்",
    analyzing: "பகுப்பாய்வு செய்கிறது...",

    wheat: "கோதுமை",
    rice: "அரிசி",
    tomato: "தக்காளி",
    potato: "உருளைக்கிழங்கு",
    onion: "வெங்காயம்",
    maize: "சோளம்",
    cotton: "பருத்தி",
    sugarcane: "கரும்பு",

    delhi: "டெல்லி",
    mumbai: "மும்பை",
    bangalore: "பெங்களூரு",
    kolkata: "கொல்கத்தா",
    chennai: "சென்னை",
    hyderabad: "ஹைதராபாத்",
    pune: "புனே",

    days7: "7 நாட்கள்",
    days15: "15 நாட்கள்",
    days30: "30 நாட்கள்",

    quickPresets: "விரைவு விருப்பங்கள்",
    wheat30d: "கோதுமை (30 நாட்கள்)",
    rice30d: "அரிசி (30 நாட்கள்)",
    tomato7d: "தக்காளி (7 நாட்கள்)",

    recommendation: "பரிந்துரை",
    currentPrice: "தற்போதைய விலை",
    predictedPrice: "கணிக்கப்பட்ட விலை",
    priceChange: "விலை மாற்றம்",
    confidence: "நம்பிக்கை",
    bestAction: "சிறந்த நடவடிக்கை",
    marketInsights: "சந்தை நுண்ணறிவு",

    buy: "வாங்கவும்",
    sell: "விற்கவும்",
    hold: "காத்திருக்கவும்",
    wait: "காத்திருக்கவும்",

    risk: "ஆபத்து",
    low: "குறைவு",
    medium: "நடுத்தர",
    high: "அதிகம்",

    profitCalculator: "லாப கணிப்பான்",
    currentValue: "தற்போதைய மதிப்பு",
    predictedValue: "கணிக்கப்பட்ட மதிப்பு",
    expectedProfit: "எதிர்பார்க்கப்படும் லாபம்",
    expectedLoss: "எதிர்பார்க்கப்படும் இழப்பு",

    analysisHistory: "பகுப்பாய்வு வரலாறு",
    noHistory: "இன்னும் பகுப்பாய்வு வரலாறு இல்லை",
    runAnalysis: "தொடங்க பகுப்பாய்வு இயக்கவும்",

    priceChart: "விலை விளக்கப்படம்",
    historical: "வரலாற்று",
    predicted: "கணிக்கப்பட்டது",
    loading: "விளக்கப்பட தரவு ஏற்றப்படுகிறது...",
    noData: "விளக்கப்பட தரவு கிடைக்கவில்லை",

    share: "பகிரவும்",
    download: "பதிவிறக்கவும்",
    copiedToClipboard: "கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது!",

    createAlert: "எச்சரிக்கை உருவாக்கவும்",
    alertType: "எச்சரிக்கை வகை",
    priceAbove: "விலைக்கு மேல்",
    priceBelow: "விலைக்குக் கீழ்",
    priceChangeAlert: "விலை மாற்றம்",
    threshold: "வரம்பு",
    notificationMethod: "அறிவிப்பு முறை",
    email: "மின்னஞ்சல்",
    sms: "குறுஞ்செய்தி",
    both: "இரண்டும்",

    save: "சேமிக்கவும்",
    cancel: "ரத்து செய்யவும்",
    delete: "நீக்கவும்",
    edit: "திருத்தவும்",
    close: "மூடவும்",
    success: "வெற்றி",
    error: "பிழை",
    kg: "கிலோ",
    rupees: "₹",
  },
};

export default translations;
