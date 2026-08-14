/** Translation dictionaries for AgriSense AI (12 Indian-subcontinent languages). */

export type LanguageCode =
  | "en" | "hi" | "ta" | "te" | "bn" | "mr"
  | "kn" | "ml" | "gu" | "or" | "pa" | "ur";

export interface Dictionary {
  app: { name: string; tagline: string };
  nav: {
    home: string;
    askAI: string;
    marketPrices: string;
    governmentSchemes: string;
    cropImport: string;
    language: string;
  };
  marketPrices: {
    title: string;
    subtitle: string;
    selectState: string;
    selectDistrict: string;
    selectCommodity: string;
    search: string;
    minPrice: string;
    maxPrice: string;
    modalPrice: string;
    market: string;
    variety: string;
    unit: string;
    lastUpdated: string;
    dataSource: string;
    noData: string;
    trend: string;
    all: string;
  };
  governmentSchemes: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    centralGovernment: string;
    stateGovernment: string;
    eligibility: string;
    benefits: string;
    applicationProcess: string;
    requiredDocuments: string;
    officialWebsite: string;
    disclaimer: string;
  };
  ai: {
    placeholder: string;
    send: string;
    thinking: string;
    error: string;
    title: string;
  };
  common: { loading: string; error: string; retry: string; viewAll: string; back: string };
}

const en: Dictionary = {
  app: { name: "AgriSense AI", tagline: "Your Smart Agricultural Assistant" },
  nav: {
    home: "Home",
    askAI: "Ask AgriSense AI",
    marketPrices: "Live Market Prices",
    governmentSchemes: "Government Schemes",
    cropImport: "Bulk crop import",
    language: "Language",
  },
  marketPrices: {
    title: "Live Market Prices",
    subtitle: "Current mandi commodity prices from official Agmarknet / data.gov.in records",
    selectState: "Select State",
    selectDistrict: "District (optional)",
    selectCommodity: "Commodity",
    search: "Search Prices",
    minPrice: "Min price",
    maxPrice: "Max price",
    modalPrice: "Modal price",
    market: "Market",
    variety: "Variety",
    unit: "₹ per quintal",
    lastUpdated: "Last updated",
    dataSource: "Data source",
    noData: "Latest data unavailable — please try again later",
    trend: "Modal price by market",
    all: "All",
  },
  governmentSchemes: {
    title: "Government Schemes",
    subtitle: "Agricultural and farmer welfare schemes",
    searchPlaceholder: "Search schemes…",
    centralGovernment: "Central Government",
    stateGovernment: "State Government",
    eligibility: "Eligibility",
    benefits: "Benefits",
    applicationProcess: "Application process",
    requiredDocuments: "Required documents",
    officialWebsite: "Visit official website",
    disclaimer:
      "This is a preliminary eligibility guide. Please verify details on the official government website.",
  },
  ai: {
    placeholder: "Ask about crops, farming, market prices…",
    send: "Send",
    thinking: "AgriSense AI is thinking…",
    error: "Sorry, I couldn't process your request. Please try again.",
    title: "AgriSense Assistant",
  },
  common: { loading: "Loading…", error: "Error occurred", retry: "Retry", viewAll: "View all", back: "Back" },
};

const hi: Dictionary = {
  app: { name: "एग्रीसेंस AI", tagline: "आपका स्मार्ट कृषि सहायक" },
  nav: {
    home: "होम",
    askAI: "एग्रीसेंस AI से पूछें",
    marketPrices: "लाइव बाज़ार मूल्य",
    governmentSchemes: "सरकारी योजनाएं",
    cropImport: "फसल डेटा अपलोड",
    language: "भाषा",
  },
  marketPrices: {
    title: "लाइव बाज़ार मूल्य",
    subtitle: "आधिकारिक Agmarknet / data.gov.in से वर्तमान मंडी भाव",
    selectState: "राज्य चुनें",
    selectDistrict: "जिला (वैकल्पिक)",
    selectCommodity: "वस्तु",
    search: "मूल्य खोजें",
    minPrice: "न्यूनतम मूल्य",
    maxPrice: "अधिकतम मूल्य",
    modalPrice: "मोडल मूल्य",
    market: "मंडी",
    variety: "किस्म",
    unit: "₹ प्रति क्विंटल",
    lastUpdated: "अंतिम अपडेट",
    dataSource: "डेटा स्रोत",
    noData: "नवीनतम डेटा उपलब्ध नहीं — कृपया बाद में प्रयास करें",
    trend: "मंडी अनुसार मोडल मूल्य",
    all: "सभी",
  },
  governmentSchemes: {
    title: "सरकारी योजनाएं",
    subtitle: "कृषि और किसान कल्याण योजनाएं",
    searchPlaceholder: "योजनाएं खोजें…",
    centralGovernment: "केंद्र सरकार",
    stateGovernment: "राज्य सरकार",
    eligibility: "पात्रता",
    benefits: "लाभ",
    applicationProcess: "आवेदन प्रक्रिया",
    requiredDocuments: "आवश्यक दस्तावेज",
    officialWebsite: "आधिकारिक वेबसाइट देखें",
    disclaimer:
      "यह प्रारंभिक पात्रता सुझाव है। कृपया आधिकारिक सरकारी वेबसाइट पर विवरण सत्यापित करें।",
  },
  ai: {
    placeholder: "फसलों, खेती, बाज़ार मूल्यों के बारे में पूछें…",
    send: "भेजें",
    thinking: "एग्रीसेंस AI सोच रहा है…",
    error: "क्षमा करें, मैं आपका अनुरोध संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।",
    title: "एग्रीसेंस सहायक",
  },
  common: { loading: "लोड हो रहा है…", error: "त्रुटि हुई", retry: "पुनः प्रयास", viewAll: "सभी देखें", back: "वापस" },
};

const ta: Dictionary = {
  app: { name: "அக்ரிசென்ஸ் AI", tagline: "உங்கள் ஸ்மார்ட் விவசாய உதவியாளர்" },
  nav: {
    home: "முகப்பு",
    askAI: "அக்ரிசென்ஸ் AI-யிடம் கேளுங்கள்",
    marketPrices: "நேரடி சந்தை விலைகள்",
    governmentSchemes: "அரசு திட்டங்கள்",
    cropImport: "பயிர் தரவு பதிவேற்றம்",
    language: "மொழி",
  },
  marketPrices: {
    title: "நேரடி சந்தை விலைகள்",
    subtitle: "அதிகாரப்பூர்வ Agmarknet / data.gov.in தரவுகளின்படி தற்போதைய சந்தை விலை",
    selectState: "மாநிலம்",
    selectDistrict: "மாவட்டம் (விருப்பம்)",
    selectCommodity: "பொருள்",
    search: "விலைகளைத் தேடு",
    minPrice: "குறைந்தபட்ச விலை",
    maxPrice: "அதிகபட்ச விலை",
    modalPrice: "மாதிரி விலை",
    market: "சந்தை",
    variety: "வகை",
    unit: "₹ / குவிண்டால்",
    lastUpdated: "கடைசி புதுப்பிப்பு",
    dataSource: "தரவு ஆதாரம்",
    noData: "சமீபத்திய தரவு கிடைக்கவில்லை — பிறகு முயற்சிக்கவும்",
    trend: "சந்தை வாரியாக மாதிரி விலை",
    all: "அனைத்தும்",
  },
  governmentSchemes: {
    title: "அரசு திட்டங்கள்",
    subtitle: "விவசாய மற்றும் விவசாயிகள் நல திட்டங்கள்",
    searchPlaceholder: "திட்டங்களைத் தேடுங்கள்…",
    centralGovernment: "மத்திய அரசு",
    stateGovernment: "மாநில அரசு",
    eligibility: "தகுதி",
    benefits: "நன்மைகள்",
    applicationProcess: "விண்ணப்ப செயல்முறை",
    requiredDocuments: "தேவையான ஆவணங்கள்",
    officialWebsite: "அதிகாரப்பூர்வ வலைத்தளம்",
    disclaimer:
      "இது ஆரம்ப தகுதி வழிகாட்டி. அதிகாரப்பூர்வ அரசு வலைத்தளத்தில் விவரங்களைச் சரிபார்க்கவும்.",
  },
  ai: {
    placeholder: "பயிர்கள், விவசாயம், சந்தை விலைகள் பற்றி கேளுங்கள்…",
    send: "அனுப்பு",
    thinking: "அக்ரிசென்ஸ் AI யோசிக்கிறது…",
    error: "மன்னிக்கவும், உங்கள் கோரிக்கையை செயல்படுத்த முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    title: "அக்ரிசென்ஸ் உதவியாளர்",
  },
  common: { loading: "ஏற்றுகிறது…", error: "பிழை ஏற்பட்டது", retry: "மீண்டும் முயற்சி", viewAll: "அனைத்தையும் பார்", back: "பின்" },
};

const te: Dictionary = {
  app: { name: "అగ్రిసెన్స్ AI", tagline: "మీ స్మార్ట్ వ్యవసాయ సహాయకుడు" },
  nav: {
    home: "హోమ్",
    askAI: "అగ్రిసెన్స్ AI ని అడగండి",
    marketPrices: "ప్రత్యక్ష మార్కెట్ ధరలు",
    governmentSchemes: "ప్రభుత్వ పథకాలు",
    cropImport: "పంట డేటా అప్‌లోడ్",
    language: "భాష",
  },
  marketPrices: {
    title: "ప్రత్యక్ష మార్కెట్ ధరలు",
    subtitle: "అధికారిక Agmarknet / data.gov.in నుండి ప్రస్తుత మార్కెట్ ధరలు",
    selectState: "రాష్ట్రం",
    selectDistrict: "జిల్లా (ఐచ్ఛికం)",
    selectCommodity: "సరుకు",
    search: "ధరలను వెతకండి",
    minPrice: "కనిష్ఠ ధర",
    maxPrice: "గరిష్ఠ ధర",
    modalPrice: "మోడల్ ధర",
    market: "మార్కెట్",
    variety: "రకం",
    unit: "₹ / క్వింటాల్",
    lastUpdated: "చివరి నవీకరణ",
    dataSource: "డేటా మూలం",
    noData: "తాజా డేటా అందుబాటులో లేదు — దయచేసి తర్వాత ప్రయత్నించండి",
    trend: "మార్కెట్ వారీగా మోడల్ ధర",
    all: "అన్నీ",
  },
  governmentSchemes: {
    title: "ప్రభుత్వ పథకాలు",
    subtitle: "వ్యవసాయ మరియు రైతు సంక్షేమ పథకాలు",
    searchPlaceholder: "పథకాలను వెతకండి…",
    centralGovernment: "కేంద్ర ప్రభుత్వం",
    stateGovernment: "రాష్ట్ర ప్రభుత్వం",
    eligibility: "అర్హత",
    benefits: "ప్రయోజనాలు",
    applicationProcess: "దరఖాస్తు విధానం",
    requiredDocuments: "అవసరమైన పత్రాలు",
    officialWebsite: "అధికారిక వెబ్‌సైట్",
    disclaimer:
      "ఇది ప్రాథమిక అర్హత సూచన. దయచేసి అధికారిక ప్రభుత్వ వెబ్‌సైట్‌లో వివరాలను ధృవీకరించండి.",
  },
  ai: {
    placeholder: "పంటలు, వ్యవసాయం, మార్కెట్ ధరల గురించి అడగండి…",
    send: "పంపండి",
    thinking: "అగ్రిసెన్స్ AI ఆలోచిస్తోంది…",
    error: "క్షమించండి, మీ అభ్యర్థనను ప్రాసెస్ చేయలేకపోయాను. మళ్లీ ప్రయత్నించండి.",
    title: "అగ్రిసెన్స్ సహాయకుడు",
  },
  common: { loading: "లోడ్ అవుతోంది…", error: "లోపం సంభవించింది", retry: "మళ్లీ ప్రయత్నించండి", viewAll: "అన్నీ చూడండి", back: "వెనుకకు" },
};

const bn: Dictionary = {
  app: { name: "অ্যাগ্রিসেন্স AI", tagline: "আপনার স্মার্ট কৃষি সহায়ক" },
  nav: {
    home: "হোম",
    askAI: "অ্যাগ্রিসেন্স AI-কে জিজ্ঞাসা করুন",
    marketPrices: "সরাসরি বাজার দর",
    governmentSchemes: "সরকারি প্রকল্প",
    cropImport: "ফসল ডেটা আপলোড",
    language: "ভাষা",
  },
  marketPrices: {
    title: "সরাসরি বাজার দর",
    subtitle: "সরকারি Agmarknet / data.gov.in থেকে বর্তমান বাজার দর",
    selectState: "রাজ্য",
    selectDistrict: "জেলা (ঐচ্ছিক)",
    selectCommodity: "পণ্য",
    search: "দর খুঁজুন",
    minPrice: "সর্বনিম্ন দর",
    maxPrice: "সর্বোচ্চ দর",
    modalPrice: "মডাল দর",
    market: "বাজার",
    variety: "জাত",
    unit: "₹ / কুইন্টাল",
    lastUpdated: "সর্বশেষ আপডেট",
    dataSource: "তথ্যসূত্র",
    noData: "সাম্প্রতিক তথ্য পাওয়া যায়নি — পরে চেষ্টা করুন",
    trend: "বাজার অনুযায়ী মডাল দর",
    all: "সব",
  },
  governmentSchemes: {
    title: "সরকারি প্রকল্প",
    subtitle: "কৃষি ও কৃষক কল্যাণ প্রকল্প",
    searchPlaceholder: "প্রকল্প খুঁজুন…",
    centralGovernment: "কেন্দ্রীয় সরকার",
    stateGovernment: "রাজ্য সরকার",
    eligibility: "যোগ্যতা",
    benefits: "সুবিধা",
    applicationProcess: "আবেদন প্রক্রিয়া",
    requiredDocuments: "প্রয়োজনীয় নথি",
    officialWebsite: "সরকারি ওয়েবসাইট",
    disclaimer:
      "এটি প্রাথমিক যোগ্যতার নির্দেশিকা। অনুগ্রহ করে সরকারি ওয়েবসাইটে বিস্তারিত যাচাই করুন।",
  },
  ai: {
    placeholder: "ফসল, চাষ, বাজার দর সম্পর্কে জিজ্ঞাসা করুন…",
    send: "পাঠান",
    thinking: "অ্যাগ্রিসেন্স AI ভাবছে…",
    error: "দুঃখিত, আপনার অনুরোধ প্রক্রিয়া করা যায়নি। আবার চেষ্টা করুন।",
    title: "অ্যাগ্রিসেন্স সহায়ক",
  },
  common: { loading: "লোড হচ্ছে…", error: "ত্রুটি ঘটেছে", retry: "আবার চেষ্টা", viewAll: "সব দেখুন", back: "ফিরে" },
};

const mr: Dictionary = {
  app: { name: "अ‍ॅग्रीसेन्स AI", tagline: "तुमचा स्मार्ट कृषी सहाय्यक" },
  nav: {
    home: "मुख्यपृष्ठ",
    askAI: "अ‍ॅग्रीसेन्स AI ला विचारा",
    marketPrices: "थेट बाजारभाव",
    governmentSchemes: "शासकीय योजना",
    cropImport: "पीक डेटा अपलोड",
    language: "भाषा",
  },
  marketPrices: {
    title: "थेट बाजारभाव",
    subtitle: "अधिकृत Agmarknet / data.gov.in वरून सध्याचे बाजारभाव",
    selectState: "राज्य",
    selectDistrict: "जिल्हा (ऐच्छिक)",
    selectCommodity: "शेतमाल",
    search: "भाव शोधा",
    minPrice: "किमान भाव",
    maxPrice: "कमाल भाव",
    modalPrice: "मॉडेल भाव",
    market: "बाजार समिती",
    variety: "प्रकार",
    unit: "₹ / क्विंटल",
    lastUpdated: "शेवटचे अद्यतन",
    dataSource: "डेटा स्रोत",
    noData: "अलीकडील डेटा उपलब्ध नाही — कृपया नंतर प्रयत्न करा",
    trend: "बाजारनिहाय मॉडेल भाव",
    all: "सर्व",
  },
  governmentSchemes: {
    title: "शासकीय योजना",
    subtitle: "कृषी व शेतकरी कल्याण योजना",
    searchPlaceholder: "योजना शोधा…",
    centralGovernment: "केंद्र सरकार",
    stateGovernment: "राज्य सरकार",
    eligibility: "पात्रता",
    benefits: "लाभ",
    applicationProcess: "अर्ज प्रक्रिया",
    requiredDocuments: "आवश्यक कागदपत्रे",
    officialWebsite: "अधिकृत संकेतस्थळ",
    disclaimer:
      "हे प्राथमिक पात्रता मार्गदर्शन आहे. कृपया अधिकृत शासकीय संकेतस्थळावर तपशील तपासा.",
  },
  ai: {
    placeholder: "पिके, शेती, बाजारभावाबद्दल विचारा…",
    send: "पाठवा",
    thinking: "अ‍ॅग्रीसेन्स AI विचार करत आहे…",
    error: "क्षमस्व, तुमची विनंती पूर्ण करता आली नाही. पुन्हा प्रयत्न करा.",
    title: "अ‍ॅग्रीसेन्स सहाय्यक",
  },
  common: { loading: "लोड होत आहे…", error: "त्रुटी आली", retry: "पुन्हा प्रयत्न", viewAll: "सर्व पहा", back: "मागे" },
};

const kn: Dictionary = {
  app: { name: "ಅಗ್ರಿಸೆನ್ಸ್ AI", tagline: "ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಹಾಯಕ" },
  nav: {
    home: "ಮುಖಪುಟ",
    askAI: "ಅಗ್ರಿಸೆನ್ಸ್ AI ಕೇಳಿ",
    marketPrices: "ನೇರ ಮಾರುಕಟ್ಟೆ ದರ",
    governmentSchemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    cropImport: "ಬೆಳೆ ದತ್ತಾಂಶ ಅಪ್‌ಲೋಡ್",
    language: "ಭಾಷೆ",
  },
  marketPrices: {
    title: "ನೇರ ಮಾರುಕಟ್ಟೆ ದರ",
    subtitle: "ಅಧಿಕೃತ Agmarknet / data.gov.in ನಿಂದ ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ದರಗಳು",
    selectState: "ರಾಜ್ಯ",
    selectDistrict: "ಜಿಲ್ಲೆ (ಐಚ್ಛಿಕ)",
    selectCommodity: "ಸರಕು",
    search: "ದರ ಹುಡುಕಿ",
    minPrice: "ಕನಿಷ್ಠ ದರ",
    maxPrice: "ಗರಿಷ್ಠ ದರ",
    modalPrice: "ಮಾದರಿ ದರ",
    market: "ಮಾರುಕಟ್ಟೆ",
    variety: "ತಳಿ",
    unit: "₹ / ಕ್ವಿಂಟಾಲ್",
    lastUpdated: "ಕೊನೆಯ ನವೀಕರಣ",
    dataSource: "ದತ್ತಾಂಶ ಮೂಲ",
    noData: "ಇತ್ತೀಚಿನ ದತ್ತಾಂಶ ಲಭ್ಯವಿಲ್ಲ — ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ",
    trend: "ಮಾರುಕಟ್ಟೆವಾರು ಮಾದರಿ ದರ",
    all: "ಎಲ್ಲಾ",
  },
  governmentSchemes: {
    title: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    subtitle: "ಕೃಷಿ ಮತ್ತು ರೈತ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು",
    searchPlaceholder: "ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ…",
    centralGovernment: "ಕೇಂದ್ರ ಸರ್ಕಾರ",
    stateGovernment: "ರಾಜ್ಯ ಸರ್ಕಾರ",
    eligibility: "ಅರ್ಹತೆ",
    benefits: "ಪ್ರಯೋಜನಗಳು",
    applicationProcess: "ಅರ್ಜಿ ಪ್ರಕ್ರಿಯೆ",
    requiredDocuments: "ಅಗತ್ಯ ದಾಖಲೆಗಳು",
    officialWebsite: "ಅಧಿಕೃತ ಜಾಲತಾಣ",
    disclaimer:
      "ಇದು ಪ್ರಾಥಮಿಕ ಅರ್ಹತಾ ಮಾರ್ಗದರ್ಶಿ. ದಯವಿಟ್ಟು ಅಧಿಕೃತ ಜಾಲತಾಣದಲ್ಲಿ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
  },
  ai: {
    placeholder: "ಬೆಳೆ, ಕೃಷಿ, ಮಾರುಕಟ್ಟೆ ದರಗಳ ಬಗ್ಗೆ ಕೇಳಿ…",
    send: "ಕಳುಹಿಸಿ",
    thinking: "ಅಗ್ರಿಸೆನ್ಸ್ AI ಯೋಚಿಸುತ್ತಿದೆ…",
    error: "ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    title: "ಅಗ್ರಿಸೆನ್ಸ್ ಸಹಾಯಕ",
  },
  common: { loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ…", error: "ದೋಷ ಸಂಭವಿಸಿದೆ", retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", viewAll: "ಎಲ್ಲಾ ನೋಡಿ", back: "ಹಿಂದೆ" },
};

const ml: Dictionary = {
  app: { name: "അഗ്രിസെൻസ് AI", tagline: "നിങ്ങളുടെ സ്മാർട്ട് കാർഷിക സഹായി" },
  nav: {
    home: "ഹോം",
    askAI: "അഗ്രിസെൻസ് AI യോട് ചോദിക്കൂ",
    marketPrices: "തത്സമയ വിപണി വില",
    governmentSchemes: "സർക്കാർ പദ്ധതികൾ",
    cropImport: "വിള ഡാറ്റ അപ്‌ലോഡ്",
    language: "ഭാഷ",
  },
  marketPrices: {
    title: "തത്സമയ വിപണി വില",
    subtitle: "ഔദ്യോഗിക Agmarknet / data.gov.in രേഖകളിൽ നിന്നുള്ള നിലവിലെ വില",
    selectState: "സംസ്ഥാനം",
    selectDistrict: "ജില്ല (ഐച്ഛികം)",
    selectCommodity: "ഉൽപ്പന്നം",
    search: "വില തിരയുക",
    minPrice: "കുറഞ്ഞ വില",
    maxPrice: "കൂടിയ വില",
    modalPrice: "മോഡൽ വില",
    market: "വിപണി",
    variety: "ഇനം",
    unit: "₹ / ക്വിന്റൽ",
    lastUpdated: "അവസാന പുതുക്കൽ",
    dataSource: "ഡാറ്റ ഉറവിടം",
    noData: "പുതിയ ഡാറ്റ ലഭ്യമല്ല — ദയവായി പിന്നീട് ശ്രമിക്കുക",
    trend: "വിപണി തിരിച്ചുള്ള മോഡൽ വില",
    all: "എല്ലാം",
  },
  governmentSchemes: {
    title: "സർക്കാർ പദ്ധതികൾ",
    subtitle: "കാർഷിക, കർഷക ക്ഷേമ പദ്ധതികൾ",
    searchPlaceholder: "പദ്ധതികൾ തിരയുക…",
    centralGovernment: "കേന്ദ്ര സർക്കാർ",
    stateGovernment: "സംസ്ഥാന സർക്കാർ",
    eligibility: "യോഗ്യത",
    benefits: "ആനുകൂല്യങ്ങൾ",
    applicationProcess: "അപേക്ഷാ നടപടി",
    requiredDocuments: "ആവശ്യമായ രേഖകൾ",
    officialWebsite: "ഔദ്യോഗിക വെബ്സൈറ്റ്",
    disclaimer:
      "ഇത് പ്രാഥമിക യോഗ്യതാ സൂചനയാണ്. ഔദ്യോഗിക വെബ്സൈറ്റിൽ വിവരങ്ങൾ പരിശോധിക്കുക.",
  },
  ai: {
    placeholder: "വിളകൾ, കൃഷി, വിപണി വില എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ…",
    send: "അയയ്ക്കുക",
    thinking: "അഗ്രിസെൻസ് AI ചിന്തിക്കുന്നു…",
    error: "ക്ഷമിക്കണം, അഭ്യർത്ഥന പ്രോസസ് ചെയ്യാനായില്ല. വീണ്ടും ശ്രമിക്കുക.",
    title: "അഗ്രിസെൻസ് സഹായി",
  },
  common: { loading: "ലോഡ് ചെയ്യുന്നു…", error: "പിശക് സംഭവിച്ചു", retry: "വീണ്ടും ശ്രമിക്കുക", viewAll: "എല്ലാം കാണുക", back: "തിരികെ" },
};

const gu: Dictionary = {
  app: { name: "એગ્રીસેન્સ AI", tagline: "તમારો સ્માર્ટ કૃષિ સહાયક" },
  nav: {
    home: "હોમ",
    askAI: "એગ્રીસેન્સ AI ને પૂછો",
    marketPrices: "લાઇવ બજાર ભાવ",
    governmentSchemes: "સરકારી યોજનાઓ",
    cropImport: "પાક ડેટા અપલોડ",
    language: "ભાષા",
  },
  marketPrices: {
    title: "લાઇવ બજાર ભાવ",
    subtitle: "સત્તાવાર Agmarknet / data.gov.in માંથી વર્તમાન બજાર ભાવ",
    selectState: "રાજ્ય",
    selectDistrict: "જિલ્લો (વૈકલ્પિક)",
    selectCommodity: "જણસ",
    search: "ભાવ શોધો",
    minPrice: "ન્યૂનતમ ભાવ",
    maxPrice: "મહત્તમ ભાવ",
    modalPrice: "મોડલ ભાવ",
    market: "બજાર",
    variety: "જાત",
    unit: "₹ / ક્વિન્ટલ",
    lastUpdated: "છેલ્લું અપડેટ",
    dataSource: "ડેટા સ્રોત",
    noData: "તાજેતરનો ડેટા ઉપલબ્ધ નથી — કૃપા કરીને પછી પ્રયાસ કરો",
    trend: "બજાર પ્રમાણે મોડલ ભાવ",
    all: "બધા",
  },
  governmentSchemes: {
    title: "સરકારી યોજનાઓ",
    subtitle: "કૃષિ અને ખેડૂત કલ્યાણ યોજનાઓ",
    searchPlaceholder: "યોજનાઓ શોધો…",
    centralGovernment: "કેન્દ્ર સરકાર",
    stateGovernment: "રાજ્ય સરકાર",
    eligibility: "પાત્રતા",
    benefits: "લાભ",
    applicationProcess: "અરજી પ્રક્રિયા",
    requiredDocuments: "જરૂરી દસ્તાવેજો",
    officialWebsite: "સત્તાવાર વેબસાઇટ",
    disclaimer:
      "આ પ્રાથમિક પાત્રતા માર્ગદર્શન છે. કૃપા કરીને સત્તાવાર વેબસાઇટ પર વિગતો ચકાસો.",
  },
  ai: {
    placeholder: "પાક, ખેતી, બજાર ભાવ વિશે પૂછો…",
    send: "મોકલો",
    thinking: "એગ્રીસેન્સ AI વિચારી રહ્યું છે…",
    error: "માફ કરશો, તમારી વિનંતી પ્રક્રિયા થઈ શકી નથી. ફરી પ્રયાસ કરો.",
    title: "એગ્રીસેન્સ સહાયક",
  },
  common: { loading: "લોડ થઈ રહ્યું છે…", error: "ભૂલ થઈ", retry: "ફરી પ્રયાસ", viewAll: "બધું જુઓ", back: "પાછળ" },
};

const or: Dictionary = {
  app: { name: "ଆଗ୍ରିସେନ୍ସ AI", tagline: "ଆପଣଙ୍କର ସ୍ମାର୍ଟ କୃଷି ସହାୟକ" },
  nav: {
    home: "ହୋମ",
    askAI: "ଆଗ୍ରିସେନ୍ସ AI କୁ ପଚାରନ୍ତୁ",
    marketPrices: "ସିଧା ବଜାର ଦର",
    governmentSchemes: "ସରକାରୀ ଯୋଜନା",
    cropImport: "ଫସଲ ତଥ୍ୟ ଅପଲୋଡ",
    language: "ଭାଷା",
  },
  marketPrices: {
    title: "ସିଧା ବଜାର ଦର",
    subtitle: "ସରକାରୀ Agmarknet / data.gov.in ରୁ ବର୍ତ୍ତମାନର ବଜାର ଦର",
    selectState: "ରାଜ୍ୟ",
    selectDistrict: "ଜିଲ୍ଲା (ଐଚ୍ଛିକ)",
    selectCommodity: "ସାମଗ୍ରୀ",
    search: "ଦର ଖୋଜନ୍ତୁ",
    minPrice: "ସର୍ବନିମ୍ନ ଦର",
    maxPrice: "ସର୍ବାଧିକ ଦର",
    modalPrice: "ମୋଡାଲ ଦର",
    market: "ବଜାର",
    variety: "ପ୍ରକାର",
    unit: "₹ / କୁଇଣ୍ଟାଲ",
    lastUpdated: "ଶେଷ ଅଦ୍ୟତନ",
    dataSource: "ତଥ୍ୟ ଉତ୍ସ",
    noData: "ନୂତନ ତଥ୍ୟ ଉପଲବ୍ଧ ନାହିଁ — ପରେ ଚେଷ୍ଟା କରନ୍ତୁ",
    trend: "ବଜାର ଅନୁଯାୟୀ ମୋଡାଲ ଦର",
    all: "ସମସ୍ତ",
  },
  governmentSchemes: {
    title: "ସରକାରୀ ଯୋଜନା",
    subtitle: "କୃଷି ଓ କୃଷକ କଲ୍ୟାଣ ଯୋଜନା",
    searchPlaceholder: "ଯୋଜନା ଖୋଜନ୍ତୁ…",
    centralGovernment: "କେନ୍ଦ୍ର ସରକାର",
    stateGovernment: "ରାଜ୍ୟ ସରକାର",
    eligibility: "ଯୋଗ୍ୟତା",
    benefits: "ଲାଭ",
    applicationProcess: "ଆବେଦନ ପ୍ରକ୍ରିୟା",
    requiredDocuments: "ଆବଶ୍ୟକ ଦଲିଲ",
    officialWebsite: "ସରକାରୀ ୱେବସାଇଟ",
    disclaimer:
      "ଏହା ପ୍ରାଥମିକ ଯୋଗ୍ୟତା ସୂଚନା। ଦୟାକରି ସରକାରୀ ୱେବସାଇଟରେ ବିବରଣୀ ଯାଞ୍ଚ କରନ୍ତୁ।",
  },
  ai: {
    placeholder: "ଫସଲ, ଚାଷ, ବଜାର ଦର ବିଷୟରେ ପଚାରନ୍ତୁ…",
    send: "ପଠାନ୍ତୁ",
    thinking: "ଆଗ୍ରିସେନ୍ସ AI ଚିନ୍ତା କରୁଛି…",
    error: "ଦୁଃଖିତ, ଆପଣଙ୍କ ଅନୁରୋଧ ପ୍ରକ୍ରିୟା କରାଯାଇପାରିଲା ନାହିଁ। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।",
    title: "ଆଗ୍ରିସେନ୍ସ ସହାୟକ",
  },
  common: { loading: "ଲୋଡ ହେଉଛି…", error: "ତ୍ରୁଟି ଘଟିଛି", retry: "ପୁଣି ଚେଷ୍ଟା", viewAll: "ସବୁ ଦେଖନ୍ତୁ", back: "ପଛକୁ" },
};

const pa: Dictionary = {
  app: { name: "ਐਗਰੀਸੈਂਸ AI", tagline: "ਤੁਹਾਡਾ ਸਮਾਰਟ ਖੇਤੀ ਸਹਾਇਕ" },
  nav: {
    home: "ਹੋਮ",
    askAI: "ਐਗਰੀਸੈਂਸ AI ਨੂੰ ਪੁੱਛੋ",
    marketPrices: "ਲਾਈਵ ਮੰਡੀ ਭਾਅ",
    governmentSchemes: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
    cropImport: "ਫਸਲ ਡਾਟਾ ਅਪਲੋਡ",
    language: "ਭਾਸ਼ਾ",
  },
  marketPrices: {
    title: "ਲਾਈਵ ਮੰਡੀ ਭਾਅ",
    subtitle: "ਸਰਕਾਰੀ Agmarknet / data.gov.in ਤੋਂ ਮੌਜੂਦਾ ਮੰਡੀ ਭਾਅ",
    selectState: "ਰਾਜ",
    selectDistrict: "ਜ਼ਿਲ੍ਹਾ (ਵਿਕਲਪਿਕ)",
    selectCommodity: "ਜਿਣਸ",
    search: "ਭਾਅ ਲੱਭੋ",
    minPrice: "ਘੱਟੋ-ਘੱਟ ਭਾਅ",
    maxPrice: "ਵੱਧ ਤੋਂ ਵੱਧ ਭਾਅ",
    modalPrice: "ਮਾਡਲ ਭਾਅ",
    market: "ਮੰਡੀ",
    variety: "ਕਿਸਮ",
    unit: "₹ / ਕੁਇੰਟਲ",
    lastUpdated: "ਆਖਰੀ ਅਪਡੇਟ",
    dataSource: "ਡਾਟਾ ਸਰੋਤ",
    noData: "ਤਾਜ਼ਾ ਡਾਟਾ ਉਪਲਬਧ ਨਹੀਂ — ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    trend: "ਮੰਡੀ ਅਨੁਸਾਰ ਮਾਡਲ ਭਾਅ",
    all: "ਸਾਰੇ",
  },
  governmentSchemes: {
    title: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
    subtitle: "ਖੇਤੀਬਾੜੀ ਅਤੇ ਕਿਸਾਨ ਭਲਾਈ ਸਕੀਮਾਂ",
    searchPlaceholder: "ਸਕੀਮਾਂ ਲੱਭੋ…",
    centralGovernment: "ਕੇਂਦਰ ਸਰਕਾਰ",
    stateGovernment: "ਰਾਜ ਸਰਕਾਰ",
    eligibility: "ਯੋਗਤਾ",
    benefits: "ਲਾਭ",
    applicationProcess: "ਅਰਜ਼ੀ ਪ੍ਰਕਿਰਿਆ",
    requiredDocuments: "ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼",
    officialWebsite: "ਸਰਕਾਰੀ ਵੈੱਬਸਾਈਟ",
    disclaimer:
      "ਇਹ ਮੁੱਢਲੀ ਯੋਗਤਾ ਜਾਣਕਾਰੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਰਕਾਰੀ ਵੈੱਬਸਾਈਟ 'ਤੇ ਵੇਰਵੇ ਪਰਖੋ।",
  },
  ai: {
    placeholder: "ਫਸਲਾਂ, ਖੇਤੀ, ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਪੁੱਛੋ…",
    send: "ਭੇਜੋ",
    thinking: "ਐਗਰੀਸੈਂਸ AI ਸੋਚ ਰਿਹਾ ਹੈ…",
    error: "ਮਾਫ਼ ਕਰਨਾ, ਬੇਨਤੀ ਪੂਰੀ ਨਹੀਂ ਹੋ ਸਕੀ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    title: "ਐਗਰੀਸੈਂਸ ਸਹਾਇਕ",
  },
  common: { loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…", error: "ਗਲਤੀ ਹੋਈ", retry: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼", viewAll: "ਸਭ ਵੇਖੋ", back: "ਵਾਪਸ" },
};

const ur: Dictionary = {
  app: { name: "ایگری سینس AI", tagline: "آپ کا سمارٹ زرعی معاون" },
  nav: {
    home: "ہوم",
    askAI: "ایگری سینس AI سے پوچھیں",
    marketPrices: "منڈی کے تازہ نرخ",
    governmentSchemes: "سرکاری اسکیمیں",
    cropImport: "فصل ڈیٹا اپ لوڈ",
    language: "زبان",
  },
  marketPrices: {
    title: "منڈی کے تازہ نرخ",
    subtitle: "سرکاری Agmarknet / data.gov.in سے موجودہ منڈی نرخ",
    selectState: "ریاست",
    selectDistrict: "ضلع (اختیاری)",
    selectCommodity: "جنس",
    search: "نرخ تلاش کریں",
    minPrice: "کم سے کم نرخ",
    maxPrice: "زیادہ سے زیادہ نرخ",
    modalPrice: "موڈل نرخ",
    market: "منڈی",
    variety: "قسم",
    unit: "₹ / کوئنٹل",
    lastUpdated: "آخری اپ ڈیٹ",
    dataSource: "ڈیٹا ماخذ",
    noData: "تازہ ڈیٹا دستیاب نہیں — براہ کرم بعد میں کوشش کریں",
    trend: "منڈی کے مطابق موڈل نرخ",
    all: "تمام",
  },
  governmentSchemes: {
    title: "سرکاری اسکیمیں",
    subtitle: "زراعت اور کسان بہبود اسکیمیں",
    searchPlaceholder: "اسکیمیں تلاش کریں…",
    centralGovernment: "مرکزی حکومت",
    stateGovernment: "ریاستی حکومت",
    eligibility: "اہلیت",
    benefits: "فوائد",
    applicationProcess: "درخواست کا طریقہ",
    requiredDocuments: "ضروری دستاویزات",
    officialWebsite: "سرکاری ویب سائٹ",
    disclaimer:
      "یہ ابتدائی اہلیت کی رہنمائی ہے۔ براہ کرم سرکاری ویب سائٹ پر تفصیلات کی تصدیق کریں۔",
  },
  ai: {
    placeholder: "فصلوں، کھیتی، منڈی نرخوں کے بارے میں پوچھیں…",
    send: "بھیجیں",
    thinking: "ایگری سینس AI سوچ رہا ہے…",
    error: "معذرت، آپ کی درخواست مکمل نہیں ہو سکی۔ دوبارہ کوشش کریں۔",
    title: "ایگری سینس معاون",
  },
  common: { loading: "لوڈ ہو رہا ہے…", error: "خرابی ہوئی", retry: "دوبارہ کوشش", viewAll: "سب دیکھیں", back: "واپس" },
};

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
  translations: Dictionary;
}

export const LANGUAGES: Record<LanguageCode, LanguageMeta> = {
  en: { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", translations: en },
  hi: { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", translations: hi },
  ta: { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", translations: ta },
  te: { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", translations: te },
  bn: { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳", translations: bn },
  mr: { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", translations: mr },
  kn: { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳", translations: kn },
  ml: { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳", translations: ml },
  gu: { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", translations: gu },
  or: { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳", translations: or },
  pa: { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", translations: pa },
  ur: { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", rtl: true, translations: ur },
};

export const LANGUAGE_LIST = Object.values(LANGUAGES);

/** Instruction appended to AI prompts so answers come back in the chosen language. */
export const AI_LANGUAGE_INSTRUCTION: Record<LanguageCode, string> = {
  en: "Respond in English.",
  hi: "Respond in Hindi (हिन्दी).",
  ta: "Respond in Tamil (தமிழ்).",
  te: "Respond in Telugu (తెలుగు).",
  bn: "Respond in Bengali (বাংলা).",
  mr: "Respond in Marathi (मराठी).",
  kn: "Respond in Kannada (ಕನ್ನಡ).",
  ml: "Respond in Malayalam (മലയാളം).",
  gu: "Respond in Gujarati (ગુજરાતી).",
  or: "Respond in Odia (ଓଡ଼ିଆ).",
  pa: "Respond in Punjabi (ਪੰਜਾਬੀ).",
  ur: "Respond in Urdu (اردو).",
};
