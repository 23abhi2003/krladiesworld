'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'te';

export interface Translations {
  // Common
  langName: string;
  selectLanguage: string;
  loading: string;
  save: string;
  saving: string;
  delete: string;
  deleting: string;
  cancel: string;
  close: string;
  search: string;
  searchPlaceholder: string;
  filter: string;
  all: string;
  date: string;
  today: string;
  actions: string;
  status: string;
  phone: string;
  name: string;
  notes: string;
  total: string;
  paid: string;
  due: string;
  balance: string;
  cash: string;
  onlineUpi: string;
  paymentMode: string;
  call: string;
  whatsapp: string;
  confirmDelete: string;
  ownerOnly: string;
  rupeeSymbol: string;

  // Branding & Locations
  shopTitle: string;
  shopSubtitle: string;
  chekkapallyVillage: string;
  storePortal: string;
  owner: string;
  staff: string;
  signOut: string;
  signIn: string;
  switchAccount: string;
  signedInAs: string;

  // Categories
  sarees: string;
  bangles: string;
  dresses: string;
  accessories: string;
  gifts: string;

  // Navigation
  navDashboard: string;
  navCreateOrder: string;
  navOrdersRegister: string;
  navDailyAmount: string;
  navInvestments: string;
  navAnalytics: string;

  // Login Page
  loginWelcome: string;
  loginSubtitle: string;
  loginPhoneLabel: string;
  loginPinLabel: string;
  loginBtn: string;
  loginSuccess: string;
  loginRedirecting: string;
  loginInvalid: string;
  loginLanguageOption: string;

  // Dashboard Page
  dashTodayReceived: string;
  dashTotalOrders: string;
  dashPendingBalance: string;
  dashTotalBilled: string;
  dashTotalInvestments: string;
  dashRecentOrders: string;
  dashViewAllOrders: string;
  dashCreateNewOrder: string;
  dashQuickSummary: string;
  dashNoOrdersYet: string;
  dashOrderNumber: string;
  dashCustomer: string;
  dashCategory: string;
  dashAmountDue: string;

  // Orders Register Page
  ordersTitle: string;
  ordersSubtitle: string;
  tabAll: string;
  tabDue: string;
  tabPaid: string;
  ordersCount: string;
  filterActive: string;
  clearFilter: string;
  noMatchingOrders: string;
  orderNumber: string;
  customerDetails: string;
  itemsPurchased: string;
  paymentStatus: string;
  statusPaid: string;
  statusDue: string;
  deleteOrderPrompt: string;

  // Create Order Wizard
  createOrderTitle: string;
  createOrderSubtitle: string;
  stepCustomer: string;
  stepItems: string;
  stepPayment: string;
  customerNameLabel: string;
  customerPhoneLabel: string;
  orderDateLabel: string;
  addItemRow: string;
  itemNameLabel: string;
  categoryLabel: string;
  quantityLabel: string;
  unitPriceLabel: string;
  totalPriceLabel: string;
  removeItem: string;
  paymentSummary: string;
  totalBill: string;
  advanceReceived: string;
  remainingDue: string;
  notesOptional: string;
  saveOrderBtn: string;
  orderSuccessMsg: string;

  // Daily Amount Page
  dailyTitle: string;
  dailySubtitle: string;
  recordDailyAmount: string;
  recordDailyDesc: string;
  selectDate: string;
  dayTotalAmount: string;
  dayPaymentType: string;
  dayNote: string;
  saveDailyAmountBtn: string;
  dailySavedSuccess: string;
  dailyHistory: string;
  entriesCount: string;
  deleteDailyPrompt: string;
  noDailyRecords: string;

  // Investments Page
  invTitle: string;
  invSubtitle: string;
  recordExpense: string;
  expenseCategory: string;
  expenseAmount: string;
  expenseDesc: string;
  saveExpenseBtn: string;
  invHistory: string;
  totalInvestedAmount: string;
  noInvestmentsYet: string;

  // Analytics Page
  analyticsTitle: string;
  analyticsSubtitle: string;
  analyticsDailyHistory: string;
  analyticsInvHistory: string;
  noAnalyticsData: string;

  // Voice & Slip Scanner
  voiceInput: string;
  listening: string;
  speakToEnter: string;
  voiceOrderAssistant: string;
  speakOrderPrompt: string;
  uploadSlipBtn: string;
  scanSlipTitle: string;
  scanSlipDesc: string;
  uploadOrCaptureImage: string;
  scanningImage: string;
  autoGenerateOrder: string;
  recognizedDetails: string;
  recognizedItems: string;
}

const en: Translations = {
  // Common
  langName: 'English',
  selectLanguage: 'Language',
  loading: 'Loading...',
  save: 'Save',
  saving: 'Saving...',
  delete: 'Delete',
  deleting: 'Deleting...',
  cancel: 'Cancel',
  close: 'Close',
  search: 'Search',
  searchPlaceholder: 'Search by customer name, phone, or order ID...',
  filter: 'Filter',
  all: 'All',
  date: 'Date',
  today: 'Today',
  actions: 'Actions',
  status: 'Status',
  phone: 'Phone',
  name: 'Name',
  notes: 'Notes / Remarks',
  total: 'Total',
  paid: 'Paid',
  due: 'Balance Due',
  balance: 'Balance',
  cash: 'Cash',
  onlineUpi: 'Online (UPI / PhonePe)',
  paymentMode: 'Payment Mode',
  call: 'Call',
  whatsapp: 'WhatsApp',
  confirmDelete: 'Are you sure you want to delete this?',
  ownerOnly: 'Owner',
  rupeeSymbol: '₹',

  // Branding & Locations
  shopTitle: 'KR LADIES WORLD',
  shopSubtitle: 'Chekkapally Village • Store Management',
  chekkapallyVillage: 'Chekkapally Village',
  storePortal: 'Store Portal',
  owner: 'Store Owner',
  staff: 'Store Staff',
  signOut: 'Sign Out',
  signIn: 'Sign In',
  switchAccount: 'Switch Account / Login',
  signedInAs: 'Signed in as',

  // Categories
  sarees: 'Sarees',
  bangles: 'Bangles',
  dresses: 'Dresses',
  accessories: 'Accessories',
  gifts: 'Gifts',

  // Navigation
  navDashboard: 'Dashboard',
  navCreateOrder: 'Create Order',
  navOrdersRegister: 'Orders Register',
  navDailyAmount: 'Daily Amount',
  navInvestments: 'Investments',
  navAnalytics: 'Analytics',

  // Login Page
  loginWelcome: 'Sign In to Store Portal',
  loginSubtitle: 'Enter Phone Number and PIN to access the store',
  loginPhoneLabel: 'Phone Number',
  loginPinLabel: 'PIN Number',
  loginBtn: 'Sign In',
  loginSuccess: 'Login Successful!',
  loginRedirecting: 'Redirecting to store dashboard...',
  loginInvalid: 'Invalid credentials. Please enter correct Phone Number and PIN.',
  loginLanguageOption: 'Choose Language / భాష ఎంచుకోండి',

  // Dashboard Page
  dashTodayReceived: "Today's Amount",
  dashTotalOrders: 'Total Orders',
  dashPendingBalance: 'Pending Balance',
  dashTotalBilled: 'Total Billing',
  dashTotalInvestments: 'Total Expenses',
  dashRecentOrders: 'Recent Orders Register',
  dashViewAllOrders: 'View All Orders',
  dashCreateNewOrder: 'Create New Order',
  dashQuickSummary: 'Overview of today and recent orders',
  dashNoOrdersYet: 'No orders recorded yet. Click Create Order to begin.',
  dashOrderNumber: 'Order #',
  dashCustomer: 'Customer',
  dashCategory: 'Category',
  dashAmountDue: 'Balance Due',

  // Orders Register Page
  ordersTitle: 'Orders Register',
  ordersSubtitle: 'Track all customer orders, payments, and balances',
  tabAll: 'All Orders',
  tabDue: 'Balance Due',
  tabPaid: 'Fully Paid',
  ordersCount: 'Orders',
  filterActive: 'Filtered by',
  clearFilter: 'Clear Filter',
  noMatchingOrders: 'No matching orders found.',
  orderNumber: 'Order No.',
  customerDetails: 'Customer Details',
  itemsPurchased: 'Items Purchased',
  paymentStatus: 'Payment Status',
  statusPaid: 'Fully Paid',
  statusDue: 'Balance Due',
  deleteOrderPrompt: 'Delete this order permanently?',

  // Create Order Wizard
  createOrderTitle: 'Create New Order',
  createOrderSubtitle: 'Record customer purchase, items, and advance payment',
  stepCustomer: 'Customer Details',
  stepItems: 'Items List',
  stepPayment: 'Payment & Advance',
  customerNameLabel: 'Customer Name',
  customerPhoneLabel: 'Customer Mobile Number',
  orderDateLabel: 'Order Date',
  addItemRow: '+ Add Item',
  itemNameLabel: 'Item Description',
  categoryLabel: 'Category',
  quantityLabel: 'Qty',
  unitPriceLabel: 'Price (₹)',
  totalPriceLabel: 'Total (₹)',
  removeItem: 'Remove',
  paymentSummary: 'Payment Summary',
  totalBill: 'Total Amount',
  advanceReceived: 'Advance Paid',
  remainingDue: 'Balance Due',
  notesOptional: 'Special Instructions / Notes (Optional)',
  saveOrderBtn: 'Save & Generate Order',
  orderSuccessMsg: 'Order saved successfully!',

  // Daily Amount Page
  dailyTitle: 'Daily Amount Ledger',
  dailySubtitle: 'Record total collection across all customers per day',
  recordDailyAmount: 'Record Daily Collection',
  recordDailyDesc: 'Add total amount collected from all customers for a specific date',
  selectDate: 'Date',
  dayTotalAmount: 'Total Collected Amount (₹)',
  dayPaymentType: 'Payment Method',
  dayNote: 'Description / Note',
  saveDailyAmountBtn: 'Save Daily Collection',
  dailySavedSuccess: 'Daily amount recorded successfully!',
  dailyHistory: 'Daily Collections History',
  entriesCount: 'entries',
  deleteDailyPrompt: 'Delete this day collection entry?',
  noDailyRecords: 'No daily records found. Add one above.',

  // Investments Page
  invTitle: 'Investments & Expenses',
  invSubtitle: 'Track stock purchases, shop rent, transport, and other costs',
  recordExpense: 'Add New Expense',
  expenseCategory: 'Expense Category',
  expenseAmount: 'Amount (₹)',
  expenseDesc: 'Description / Remarks',
  saveExpenseBtn: 'Save Expense',
  invHistory: 'Expense History',
  totalInvestedAmount: 'Total Expenses Recorded',
  noInvestmentsYet: 'No expenses recorded yet.',

  // Analytics Page
  analyticsTitle: 'Store Analytics',
  analyticsSubtitle: 'Daily cash collections vs. capital expenses',
  analyticsDailyHistory: 'Daily Received Amount History',
  analyticsInvHistory: 'Expenses by Date',
  noAnalyticsData: 'No data recorded yet.',

  // Voice & Slip Scanner
  voiceInput: 'Voice Input',
  listening: 'Listening... Please speak now',
  speakToEnter: 'Speak into microphone to enter',
  voiceOrderAssistant: 'Voice Order Assistant',
  speakOrderPrompt: 'Speak order details (e.g. "Sunitha, phone 9876543210, 2 Sarees 2000, advance 500")',
  uploadSlipBtn: 'Upload Order Slip / List',
  scanSlipTitle: 'Scan Order Slip Image',
  scanSlipDesc: 'Upload a photo of handwritten slip or list to automatically create an order',
  uploadOrCaptureImage: 'Click or drop an image of the order slip/list here',
  scanningImage: 'Scanning and recognizing handwritten slip...',
  autoGenerateOrder: 'Auto-Generate Order',
  recognizedDetails: 'Recognized Order Information',
  recognizedItems: 'Items List',
};

const te: Translations = {
  // Common
  langName: 'తెలుగు',
  selectLanguage: 'భాష',
  loading: 'లోడ్ అవుతోంది...',
  save: 'భద్రపరచండి (సేవ్)',
  saving: 'సేవ్ అవుతోంది...',
  delete: 'తొలగించు (డిలీట్)',
  deleting: 'తొలగిస్తోంది...',
  cancel: 'రద్దు చేయి',
  close: 'మూసివేయి',
  search: 'వెతకండి',
  searchPlaceholder: 'కస్టమర్ పేరు, ఫోన్ లేదా ఆర్డర్ నంబర్ ద్వారా వెతకండి...',
  filter: 'ఫిల్టర్',
  all: 'అన్నీ',
  date: 'తేదీ',
  today: 'ఈరోజు',
  actions: 'చర్యలు',
  status: 'స్థితి',
  phone: 'ఫోన్ నంబర్',
  name: 'పేరు',
  notes: 'గమనిక / సూచనలు',
  total: 'మొత్తం',
  paid: 'చెల్లించినది',
  due: 'బాకీ ఉన్నది',
  balance: 'మిగిలిన బాకీ',
  cash: 'నగదు (Cash)',
  onlineUpi: 'ఆన్‌లైన్ (PhonePe / GPay)',
  paymentMode: 'చెల్లింపు విధానం',
  call: 'ఫోన్ చేయండి',
  whatsapp: 'వాట్సాప్',
  confirmDelete: 'ఖచ్చితంగా తొలగించాలనుకుంటున్నారా?',
  ownerOnly: 'యజమాని',
  rupeeSymbol: '₹',

  // Branding & Locations
  shopTitle: 'కేఆర్ లేడీస్ వరల్డ్',
  shopSubtitle: 'చెక్కపల్లి గ్రామం • స్టోర్ నిర్వహణ',
  chekkapallyVillage: 'చెక్కపల్లి గ్రామం',
  storePortal: 'స్టోర్ పోర్టల్',
  owner: 'షాప్ యజమాని',
  staff: 'షాప్ సిబ్బంది',
  signOut: 'లాగ్అవుట్ (బయటకు)',
  signIn: 'లాగిన్ (ప్రవేశించండి)',
  switchAccount: 'ఖాతా మార్చండి / లాగిన్',
  signedInAs: 'లాగిన్ అయినది:',

  // Categories
  sarees: 'చీరలు (Sarees)',
  bangles: 'గాజులు (Bangles)',
  dresses: 'డ్రెస్సులు (Dresses)',
  accessories: 'యాక్సెసరీస్ (Accessories)',
  gifts: 'గిఫ్ట్స్ (Gifts)',

  // Navigation
  navDashboard: 'డ్యాష్‌బోర్డ్',
  navCreateOrder: 'కొత్త ఆర్డర్',
  navOrdersRegister: 'ఆర్డర్ల రిజిస్టర్',
  navDailyAmount: 'రోజువారీ మొత్తం',
  navInvestments: 'ఖర్చులు & పెట్టుబడులు',
  navAnalytics: 'విశ్లేషణలు',

  // Login Page
  loginWelcome: 'షాప్ పోర్టల్‌లోకి ప్రవేశించండి',
  loginSubtitle: 'షాప్ వివరాలు చూసేందుకు ఫోన్ నంబర్ మరియు పిన్ నమోదు చేయండి',
  loginPhoneLabel: 'ఫోన్ నంబర్',
  loginPinLabel: 'పిన్ నంబర్ (PIN)',
  loginBtn: 'లాగిన్ అవ్వండి',
  loginSuccess: 'లాగిన్ విజయవంతమైంది!',
  loginRedirecting: 'డ్యాష్‌బోర్డ్‌కు వెళ్తున్నారు...',
  loginInvalid: 'సరైన ఫోన్ నంబర్ మరియు పిన్ నమోదు చేయండి.',
  loginLanguageOption: 'భాషను ఎంచుకోండి / Select Language',

  // Dashboard Page
  dashTodayReceived: 'ఈరోజు వసూలైన మొత్తం',
  dashTotalOrders: 'మొత్తం ఆర్డర్లు',
  dashPendingBalance: 'రావలసిన బాకీ (బ్యాలెన్స్)',
  dashTotalBilled: 'మొత్తం అమ్మకాలు',
  dashTotalInvestments: 'మొత్తం ఖర్చులు',
  dashRecentOrders: 'ఇటీవలి ఆర్డర్ల రిజిస్టర్',
  dashViewAllOrders: 'అన్ని ఆర్డర్లు చూడండి',
  dashCreateNewOrder: 'కొత్త ఆర్డర్ రాయండి',
  dashQuickSummary: 'ఈరోజు లెక్కలు మరియు ఆర్డర్ల వివరాలు',
  dashNoOrdersYet: 'ఇంకా ఆర్డర్లు ఏమీ లేవు. కొత్త ఆర్డర్ రాయండి.',
  dashOrderNumber: 'ఆర్డర్ నం.',
  dashCustomer: 'కస్టమర్ పేరు',
  dashCategory: 'వస్తువు రకం',
  dashAmountDue: 'బాకీ మొత్తం',

  // Orders Register Page
  ordersTitle: 'ఆర్డర్ల రిజిస్టర్',
  ordersSubtitle: 'కస్టమర్ల ఆర్డర్లు, చెల్లించిన మొత్తం మరియు బాకీల లెక్క',
  tabAll: 'అన్ని ఆర్డర్లు',
  tabDue: 'బాకీ ఉన్నవి',
  tabPaid: 'పూర్తయినవి (Paid)',
  ordersCount: 'ఆర్డర్లు',
  filterActive: 'ఫిల్టర్ చేసినవి:',
  clearFilter: 'ఫిల్టర్ తీసివేయి',
  noMatchingOrders: 'ఎటువంటి ఆర్డర్లు కనపడలేదు.',
  orderNumber: 'ఆర్డర్ సంఖ్య',
  customerDetails: 'కస్టమర్ వివరాలు',
  itemsPurchased: 'కొనుగోలు చేసిన వస్తువులు',
  paymentStatus: 'చెల్లింపు స్థితి',
  statusPaid: 'పూర్తిగా చెల్లించారు',
  statusDue: 'బాకీ ఉంది',
  deleteOrderPrompt: 'ఈ ఆర్డర్‌ను ఖచ్చితంగా తొలగించాలా?',

  // Create Order Wizard
  createOrderTitle: 'కొత్త ఆర్డర్ నమోదు చేయండి',
  createOrderSubtitle: 'కస్టమర్ వివరాలు, వస్తువులు మరియు అడ్వాన్స్ నమోదు చేయండి',
  stepCustomer: 'కస్టమర్ వివరాలు',
  stepItems: 'వస్తువుల వివరాలు',
  stepPayment: 'చెల్లింపు & అడ్వాన్స్',
  customerNameLabel: 'కస్టమర్ పేరు',
  customerPhoneLabel: 'కస్టమర్ ఫోన్ నంబర్',
  orderDateLabel: 'ఆర్డర్ తేదీ',
  addItemRow: '+ మరో వస్తువు చేర్చండి',
  itemNameLabel: 'వస్తువు వివరాలు / పేరు',
  categoryLabel: 'వస్తువు రకం',
  quantityLabel: 'సంఖ్య (Qty)',
  unitPriceLabel: 'ధర (₹)',
  totalPriceLabel: 'మొత్తం (₹)',
  removeItem: 'తీసివేయి',
  paymentSummary: 'చెల్లింపు లెక్కలు',
  totalBill: 'మొత్తం బిల్లు',
  advanceReceived: 'అడ్వాన్స్ ఇచ్చినది',
  remainingDue: 'మిగిలిన బాకీ',
  notesOptional: 'గమనికలు / ప్రత్యేక సూచనలు (ఐచ్ఛికం)',
  saveOrderBtn: 'ఆర్డర్ భద్రపరచండి (సేవ్)',
  orderSuccessMsg: 'ఆర్డర్ విజయవంతంగా సేవ్ చేయబడింది!',

  // Daily Amount Page
  dailyTitle: 'రోజువారీ వసూళ్ల లెక్క (డైలీ అమౌంట్)',
  dailySubtitle: 'రోజూ కస్టమర్ల నుండి వసూలైన మొత్తం అమౌంట్ వివరాలు',
  recordDailyAmount: 'ఈరోజు మొత్తం కలెక్షన్ నమోదు చేయండి',
  recordDailyDesc: 'ఒక రోజుకు కస్టమర్ల నుండి వచ్చిన మొత్తం సొమ్మును ఇక్కడ నమోదు చేయండి',
  selectDate: 'తేదీ',
  dayTotalAmount: 'వచ్చిన మొత్తం రూపాయలు (₹)',
  dayPaymentType: 'వచ్చిన విధానం (నగదు / ఆన్‌లైన్)',
  dayNote: 'వివరణ / గమనిక',
  saveDailyAmountBtn: 'రోజు మొత్తం భద్రపరచండి',
  dailySavedSuccess: 'రోజు కలెక్షన్ విజయవంతంగా నమోదైంది!',
  dailyHistory: 'గత రోజుల వసూళ్ల లెక్కలు',
  entriesCount: 'నమోదులు',
  deleteDailyPrompt: 'ఈ రోజు రికార్డును తొలగించాలా?',
  noDailyRecords: 'ఇంకా ఏమీ రికార్డు కాలేదు. పైన నమోదు చేయండి.',

  // Investments Page
  invTitle: 'ఖర్చులు మరియు పెట్టుబడులు',
  invSubtitle: 'సరుకు కొనుగోలు, దుకాణం అద్దె, ప్రయాణం మరియు ఇతర ఖర్చులు',
  recordExpense: 'కొత్త ఖర్చును నమోదు చేయండి',
  expenseCategory: 'ఖర్చు రకం (సరుకు / అద్దె / కరెంట్ బిల్లు)',
  expenseAmount: 'ఖర్చు అయిన మొత్తం (₹)',
  expenseDesc: 'ఖర్చు వివరాలు / కారణం',
  saveExpenseBtn: 'ఖర్చును సేవ్ చేయండి',
  invHistory: 'గత ఖర్చుల వివరాలు',
  totalInvestedAmount: 'మొత్తం ఖర్చులు',
  noInvestmentsYet: 'ఇంకా ఏ ఖర్చులు నమోదు చేయలేదు.',

  // Analytics Page
  analyticsTitle: 'వ్యాపార విశ్లేషణ',
  analyticsSubtitle: 'రోజువారీ వసూళ్లు మరియు షాపు ఖర్చుల పోలిక',
  analyticsDailyHistory: 'రోజువారీ కలెక్షన్ వివరాలు',
  analyticsInvHistory: 'తేదీల వారీగా ఖర్చులు',
  noAnalyticsData: 'ఇంకా వివరాలు లేవు.',

  // Voice & Slip Scanner
  voiceInput: 'వాయిస్ ద్వారా నమోదు',
  listening: 'వింటున్నాము... మైక్‌లో మాట్లాడండి',
  speakToEnter: 'మైక్‌లో మాట్లాడి నమోదు చేయండి',
  voiceOrderAssistant: 'వాయిస్ ఆర్డర్ అసిస్టెంట్',
  speakOrderPrompt: 'ఆర్డర్ వివరాలు మాట్లాడండి (ఉదాహరణకు: "సునీత, ఫోన్ 9876543210, రెండు చీరలు 2000, అడ్వాన్స్ 500")',
  uploadSlipBtn: 'ఆర్డర్ చీటీ / లిస్ట్ ఫోటో అప్‌లోడ్',
  scanSlipTitle: 'ఆర్డర్ లిస్ట్ ఫోటో స్కాన్ చేయండి',
  scanSlipDesc: 'చేతిరాత చీటీ లేదా కస్టమర్ లిస్ట్ ఫోటో అప్‌లోడ్ చేసి ఆటోమేటిక్‌గా ఆర్డర్ తయారు చేయండి',
  uploadOrCaptureImage: 'ఆర్డర్ చీటీ ఫోటోను ఇక్కడ ఎంచుకోండి లేదా డ్రాప్ చేయండి',
  scanningImage: 'AI ద్వారా చీటీ వివరాలను చదువుతోంది...',
  autoGenerateOrder: 'ఆర్డర్ తయారు చేయండి (Auto-Generate)',
  recognizedDetails: 'గుర్తించబడిన ఆర్డర్ వివరాలు',
  recognizedItems: 'వస్తువుల జాబితా',
};

const translations = { en, te };

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  toggleLang: () => void;
  t: Translations;
  isTelugu: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: en,
  isTelugu: false,
});

const STORAGE_KEY = 'kr_ladies_world_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved === 'en' || saved === 'te') {
        setLangState(saved);
      }
    } catch {
      // localStorage may fail in private mode or SSR
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'te' : 'en');
  };

  const t = translations[lang] || en;
  const isTelugu = lang === 'te';

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isTelugu }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
