export interface BrandConfig {
  name: {
    en: string;
    bn: string;
  };
  tagline: {
    en: string;
    bn: string;
  };
  description: {
    en: string;
    bn: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    whatsappDisplay: string;
  };
  shop: {
    address: {
      en: string;
      bn: string;
    };
    city: string;
    state: string;
    pincode: string;
    openingHours: {
      en: string;
      bn: string;
    };
  };
  socials: {
    instagram: string;
    facebook: string;
    youtube?: string;
  };
  currency: {
    code: string;
    symbol: string;
    localeEn: string;
    localeBn: string;
  };
  payments: {
    demoUpiVpa: string;
    upiMerchantName: string;
    codEnabled: boolean;
    codFeePaise: number;
    codAdvancePaise: number;
    manualUpiEnabled: boolean;
    razorpayEnabled: boolean;
  };
  tax: {
    gstDefaultThresholdPaise: number; // e.g. ₹2500 = 250000 paise
    gstRateBelowThreshold: number; // 5%
    gstRateAboveThreshold: number; // 18%
    pricesGstInclusive: boolean;
    gstNotice: {
      en: string;
      bn: string;
    };
  };
  shipping: {
    freeShippingThresholdPaise: number; // e.g. ₹1500 = 150000 paise
    zones: {
      id: string;
      name: { en: string; bn: string };
      chargePaise: number;
      etaDays: string;
      pincodePrefixes: string[];
    }[];
    storePickup: {
      enabled: boolean;
      chargePaise: number;
      instructions: { en: string; bn: string };
    };
  };
  policies: {
    returnExchangeDays: number;
    customSizeProductionDays: number;
    customSizeFeesPaise: number;
  };
  imageStyle: "product-only" | "with-models";
}

export const brandConfig: BrandConfig = {
  name: {
    en: "AZAD HAYA",
    bn: "আজাদ হায়া",
  },
  tagline: {
    en: "Modesty, beautifully made.",
    bn: "শালীনতায় সৌন্দর্য।",
  },
  description: {
    en: "Premium, modest Islamic attire crafted with elegance for the modern Muslimah and family in Bengal.",
    bn: "বাঙালির রুচিশীল শালীন পোশাক ও আভিজাত্যের বিশ্বস্ত ঠিকানা — প্রিমিয়াম বোরকা, হিজাব, আবায়া ও পাঞ্জাবি।",
  },
  contact: {
    phone: "+91 90000 00000",
    email: "contact@azadhaya.demo",
    whatsapp: "919000000000",
    whatsappDisplay: "+91 90000 00000",
  },
  shop: {
    address: {
      en: "Station Road, Near Curzon Gate, Bardhaman Railway Station Area, Bardhaman 713101, West Bengal",
      bn: "স্টেশন রোড, কার্জন গেট ও বর্ধমান রেলওয়ে স্টেশনের নিকট, বর্ধমান ৭১৩১০১, পশ্চিমবঙ্গ",
    },
    city: "Bardhaman",
    state: "West Bengal",
    pincode: "713101",
    openingHours: {
      en: "Daily 10:00 AM – 9:00 PM (Closed Friday prayer hours 12:30 – 2:30 PM)",
      bn: "প্রতিদিন সকাল ১০:০০ – রাত ৯:০০ (শুক্রবার জুম্মার নামাজে দুপুর ১২:৩০ – ২:৩০ বন্ধ)",
    },
  },
  socials: {
    instagram: "https://instagram.com/azadhaya.demo",
    facebook: "https://facebook.com/azadhaya.demo",
  },
  currency: {
    code: "INR",
    symbol: "₹",
    localeEn: "en-IN",
    localeBn: "bn-IN",
  },
  payments: {
    demoUpiVpa: "azadhaya@demo",
    upiMerchantName: "AZAD HAYA ISLAMIC WEAR",
    codEnabled: true,
    codFeePaise: 4000, // ₹40
    codAdvancePaise: 0,
    manualUpiEnabled: true,
    razorpayEnabled: false,
  },
  tax: {
    gstDefaultThresholdPaise: 250000, // ₹2,500
    gstRateBelowThreshold: 0.05, // 5%
    gstRateAboveThreshold: 0.18, // 18%
    pricesGstInclusive: true,
    gstNotice: {
      en: "Prices are inclusive of GST (Apparel up to ₹2,500 @ 5%, above @ 18%). Confirm with CA.",
      bn: "সকল পণ্যের মূল্যের সাথে জিএসটি যুক্ত (পোশাক ₹২,৫০০ পর্যন্ত ৫%, উর্ধ্বে ১৮%)। সিএ দ্বারা নিশ্চিত করুন।",
    },
  },
  shipping: {
    freeShippingThresholdPaise: 149900, // ₹1,499
    zones: [
      {
        id: "kolkata_metro",
        name: {
          en: "Kolkata & Nearby Districts",
          bn: "কলকাতা ও পার্শ্ববর্তী জেলাসমূহ",
        },
        chargePaise: 6000, // ₹60
        etaDays: "1–2 business days",
        pincodePrefixes: ["700", "711", "712", "743"],
      },
      {
        id: "west_bengal",
        name: {
          en: "Rest of West Bengal",
          bn: "পশ্চিমবঙ্গের অন্যান্য জেলা",
        },
        chargePaise: 8000, // ₹80
        etaDays: "2–4 business days",
        pincodePrefixes: ["71", "72", "73", "74"],
      },
      {
        id: "rest_of_india",
        name: {
          en: "Rest of India",
          bn: "ভারতের অন্যান্য রাজ্য",
        },
        chargePaise: 12000, // ₹120
        etaDays: "4–6 business days",
        pincodePrefixes: [],
      },
    ],
    storePickup: {
      enabled: true,
      chargePaise: 0,
      instructions: {
        en: "Collect from our Park Circus showroom within 3 days of ready notification.",
        bn: "অর্ডার প্রস্তুতের নোটিফিকেশন পাওয়ার ৩ দিনের মধ্যে আমাদের পার্ক সার্কাস শোরুম থেকে সংগ্রহ করুন।",
      },
    },
  },
  policies: {
    returnExchangeDays: 7,
    customSizeProductionDays: 4,
    customSizeFeesPaise: 15000, // ₹150 tailoring fee
  },
  imageStyle: "product-only",
};
