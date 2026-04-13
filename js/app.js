/* ============================================================
   Ø³Ø§Ù„Ù… Ø¨Ù„ÙˆØ¬ - JavaScript Application
   Salem Blog - Main Application Logic
   Uses multiple free APIs with robust fallback system
   ============================================================ */

// ==================== Configuration ====================
const CONFIG = {
  ARTICLES_PER_PAGE: 9,
  CACHE_DURATION: 15 * 60 * 1000,

  // Multi-source strategy: trusted news first, then broad aggregators, then fallback DB.
  APIS: [
    {
      name: 'guardian',
      base: 'https://content.guardianapis.com',
      key: 'test'
    },
    {
      name: 'gnews',
      base: 'https://gnews.io/api/v4',
      key: 'YOUR_GNEWS_API_KEY'
    },
    {
      name: 'newsapi',
      base: 'https://newsapi.org/v2',
      key: 'YOUR_NEWSAPI_KEY'
    },
    {
      name: 'currentsapi',
      base: 'https://api.currentsapi.services/v1',
      key: 'JcGJJZ7JVWxkT79c4Xn-3YpMGWqzO88i1fqXc4Y35mwLLdU-'
    },
    {
      name: 'newsdata',
      base: 'https://newsdata.io/api/1/latest',
      key: 'pub_8462034ed1b7267f70b1eb8a4bfc9e8d3dbbe'
    }
  ],

  TRUSTED_NEWS_DOMAINS: [
    'theguardian.com',
    'reuters.com',
    'apnews.com',
    'bbc.com',
    'nytimes.com',
    'wsj.com',
    'ft.com',
    'bloomberg.com',
    'theverge.com',
    'wired.com',
    'techcrunch.com',
    'arstechnica.com',
    'engadget.com'
  ],
  
  FALLBACK_IMAGES: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
    'https://images.unsplash.com/photo-1562813733-b31f71025d54?w=600&q=80',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80',
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80'
  ],
  
  CATEGORIES: [
    { id: 'technology', name: 'Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§', icon: 'fas fa-microchip', query: 'technology' },
    { id: 'ai', name: 'Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ', icon: 'fas fa-robot', query: 'artificial intelligence' },
    { id: 'mobile', name: 'Ø§Ù„Ù‡ÙˆØ§ØªÙ', icon: 'fas fa-mobile-alt', query: 'smartphones' },
    { id: 'programming', name: 'Ø§Ù„Ø¨Ø±Ù…Ø¬Ø©', icon: 'fas fa-code', query: 'programming' },
    { id: 'security', name: 'Ø§Ù„Ø£Ù…Ù† Ø§Ù„Ø³ÙŠØ¨Ø±Ø§Ù†ÙŠ', icon: 'fas fa-shield-alt', query: 'cybersecurity' },
    { id: 'gaming', name: 'Ø§Ù„Ø£Ù„Ø¹Ø§Ø¨', icon: 'fas fa-gamepad', query: 'gaming technology' },
    { id: 'science', name: 'Ø§Ù„Ø¹Ù„ÙˆÙ…', icon: 'fas fa-flask', query: 'science technology' },
    { id: 'business', name: 'Ø§Ù„Ø£Ø¹Ù…Ø§Ù„', icon: 'fas fa-chart-line', query: 'tech business' }
  ]
};

// ==================== Rich Fallback Articles Database ====================
const FALLBACK_DB = {
  technology: [
    {
      title: 'Ø«ÙˆØ±Ø© Ø§Ù„Ø­ÙˆØ³Ø¨Ø© Ø§Ù„ÙƒÙ…ÙˆÙ…ÙŠØ©: ÙƒÙŠÙ Ø³ØªØºÙŠØ± Ø´ÙƒÙ„ Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„ØªÙ‚Ù†ÙŠ',
      description: 'ØªØ´Ù‡Ø¯ Ø§Ù„Ø­ÙˆØ³Ø¨Ø© Ø§Ù„ÙƒÙ…ÙˆÙ…ÙŠØ© ØªØ·ÙˆØ±Ø§Øª ØºÙŠØ± Ù…Ø³Ø¨ÙˆÙ‚Ø© Ø­ÙŠØ« Ù†Ø¬Ø­Øª Ø´Ø±ÙƒØ§Øª Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ Ø§Ù„ÙƒØ¨Ø±Ù‰ ÙÙŠ ØªØ­Ù‚ÙŠÙ‚ Ø§Ø®ØªØ±Ø§Ù‚Ø§Øª Ø¬Ø¯ÙŠØ¯Ø© ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„Ù…Ø¬Ø§Ù„. Ù…Ù† Ø§Ù„Ù…ØªÙˆÙ‚Ø¹ Ø£Ù† ØªØºÙŠØ± Ù‡Ø°Ù‡ Ø§Ù„ØªÙ‚Ù†ÙŠØ© Ø§Ù„Ø«ÙˆØ±ÙŠØ© ÙƒÙ„ Ø´ÙŠØ¡ Ù…Ù† Ø§Ù„ØªØ´ÙÙŠØ± Ø¥Ù„Ù‰ Ø§ÙƒØªØ´Ø§Ù Ø§Ù„Ø£Ø¯ÙˆÙŠØ© ÙˆØªØµÙ…ÙŠÙ… Ø§Ù„Ù…ÙˆØ§Ø¯ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©.',
      content: 'ØªØ´Ù‡Ø¯ Ø§Ù„Ø­ÙˆØ³Ø¨Ø© Ø§Ù„ÙƒÙ…ÙˆÙ…ÙŠØ© ØªØ·ÙˆØ±Ø§Øª ØºÙŠØ± Ù…Ø³Ø¨ÙˆÙ‚Ø© Ø­ÙŠØ« Ù†Ø¬Ø­Øª Ø´Ø±ÙƒØ§Øª Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ Ø§Ù„ÙƒØ¨Ø±Ù‰ ÙÙŠ ØªØ­Ù‚ÙŠÙ‚ Ø§Ø®ØªØ±Ø§Ù‚Ø§Øª Ø¬Ø¯ÙŠØ¯Ø© ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„Ù…Ø¬Ø§Ù„. Ù…Ù† Ø§Ù„Ù…ØªÙˆÙ‚Ø¹ Ø£Ù† ØªØºÙŠØ± Ù‡Ø°Ù‡ Ø§Ù„ØªÙ‚Ù†ÙŠØ© Ø§Ù„Ø«ÙˆØ±ÙŠØ© ÙƒÙ„ Ø´ÙŠØ¡ Ù…Ù† Ø§Ù„ØªØ´ÙÙŠØ± Ø¥Ù„Ù‰ Ø§ÙƒØªØ´Ø§Ù Ø§Ù„Ø£Ø¯ÙˆÙŠØ© ÙˆØªØµÙ…ÙŠÙ… Ø§Ù„Ù…ÙˆØ§Ø¯ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©. Ø£Ø¹Ù„Ù†Øª Ø´Ø±ÙƒØ© IBM Ø¹Ù† Ù…Ø¹Ø§Ù„Ø¬ ÙƒÙ…ÙˆÙ…ÙŠ Ø¬Ø¯ÙŠØ¯ ÙŠØªÙÙˆÙ‚ Ø¹Ù„Ù‰ Ø³Ø§Ø¨Ù‚ÙŠÙ‡ Ø¨Ù…Ø±Ø§Ø­Ù„ØŒ Ø¨ÙŠÙ†Ù…Ø§ ØªØ¹Ù…Ù„ Google Ø¹Ù„Ù‰ ØªØ·ÙˆÙŠØ± Ø®ÙˆØ§Ø±Ø²Ù…ÙŠØ§Øª ÙƒÙ…ÙˆÙ…ÙŠØ© Ø£ÙƒØ«Ø± ÙƒÙØ§Ø¡Ø©. ÙˆÙŠØªÙˆÙ‚Ø¹ Ø§Ù„Ø®Ø¨Ø±Ø§Ø¡ Ø£Ù† ØªØµØ¨Ø­ Ø§Ù„Ø­ÙˆØ³Ø¨Ø© Ø§Ù„ÙƒÙ…ÙˆÙ…ÙŠØ© Ù…ØªØ§Ø­Ø© ØªØ¬Ø§Ø±ÙŠØ§Ù‹ Ø®Ù„Ø§Ù„ Ø§Ù„Ø³Ù†ÙˆØ§Øª Ø§Ù„Ù‚Ù„ÙŠÙ„Ø© Ø§Ù„Ù‚Ø§Ø¯Ù…Ø© Ù…Ù…Ø§ Ø³ÙŠÙØªØ­ Ø¢ÙØ§Ù‚Ø§Ù‹ Ø¬Ø¯ÙŠØ¯Ø© ÙÙŠ Ù…Ø¬Ø§Ù„Ø§Øª Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙˆØ§Ù„Ø£Ù…Ù† Ø§Ù„Ø³ÙŠØ¨Ø±Ø§Ù†ÙŠ ÙˆØ§Ù„Ø¨Ø­Ø« Ø§Ù„Ø¹Ù„Ù…ÙŠ.',
      source: 'ØªÙƒ Ø±ÙŠÙÙŠÙˆ Ø¹Ø±Ø¨ÙŠ',
      publishedAt: new Date(Date.now() - 1 * 3600000).toISOString()
    },
    {
      title: 'Ø´Ø¨ÙƒØ§Øª Ø§Ù„Ø¬ÙŠÙ„ Ø§Ù„Ø³Ø§Ø¯Ø³ 6G: Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„Ø°ÙŠ ÙŠØªØ´ÙƒÙ„ Ø§Ù„Ø¢Ù†',
      description: 'Ø¨ÙŠÙ†Ù…Ø§ Ù„Ø§ ÙŠØ²Ø§Ù„ Ø§Ù„Ø¹Ø§Ù„Ù… ÙŠØªØ¨Ù†Ù‰ ØªÙ‚Ù†ÙŠØ© Ø§Ù„Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø§Ù…Ø³ØŒ Ø¨Ø¯Ø£Øª Ù…Ø±Ø§ÙƒØ² Ø§Ù„Ø£Ø¨Ø­Ø§Ø« Ø§Ù„ÙƒØ¨Ø±Ù‰ ÙÙŠ ÙˆØ¶Ø¹ Ø§Ù„Ø£Ø³Ø³ Ù„Ø´Ø¨ÙƒØ§Øª Ø§Ù„Ø¬ÙŠÙ„ Ø§Ù„Ø³Ø§Ø¯Ø³ Ø§Ù„ØªÙŠ Ø³ØªÙˆÙØ± Ø³Ø±Ø¹Ø§Øª Ø®ÙŠØ§Ù„ÙŠØ© ÙˆØ²Ù…Ù† Ø§Ø³ØªØ¬Ø§Ø¨Ø© Ø´Ø¨Ù‡ Ù…Ø¹Ø¯ÙˆÙ….',
      content: 'Ø¨ÙŠÙ†Ù…Ø§ Ù„Ø§ ÙŠØ²Ø§Ù„ Ø§Ù„Ø¹Ø§Ù„Ù… ÙŠØªØ¨Ù†Ù‰ ØªÙ‚Ù†ÙŠØ© Ø§Ù„Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø§Ù…Ø³ØŒ Ø¨Ø¯Ø£Øª Ù…Ø±Ø§ÙƒØ² Ø§Ù„Ø£Ø¨Ø­Ø§Ø« Ø§Ù„ÙƒØ¨Ø±Ù‰ ÙÙŠ ÙˆØ¶Ø¹ Ø§Ù„Ø£Ø³Ø³ Ù„Ø´Ø¨ÙƒØ§Øª Ø§Ù„Ø¬ÙŠÙ„ Ø§Ù„Ø³Ø§Ø¯Ø³ Ø§Ù„ØªÙŠ Ø³ØªÙˆÙØ± Ø³Ø±Ø¹Ø§Øª Ø®ÙŠØ§Ù„ÙŠØ© ÙˆØ²Ù…Ù† Ø§Ø³ØªØ¬Ø§Ø¨Ø© Ø´Ø¨Ù‡ Ù…Ø¹Ø¯ÙˆÙ…. Ù…Ù† Ø§Ù„Ù…ØªÙˆÙ‚Ø¹ Ø£Ù† ØªÙˆÙØ± Ø´Ø¨ÙƒØ§Øª 6G Ø³Ø±Ø¹Ø§Øª ØªØµÙ„ Ø¥Ù„Ù‰ ØªÙŠØ±Ø§Ø¨Øª ÙÙŠ Ø§Ù„Ø«Ø§Ù†ÙŠØ©ØŒ Ù…Ù…Ø§ Ø³ÙŠÙ…ÙƒÙ† Ù…Ù† ØªØ·Ø¨ÙŠÙ‚Ø§Øª Ù…Ø°Ù‡Ù„Ø© Ù…Ø«Ù„ Ø§Ù„Ù‡ÙˆÙ„ÙˆØ¬Ø±Ø§Ù… Ø«Ù„Ø§Ø«ÙŠ Ø§Ù„Ø£Ø¨Ø¹Ø§Ø¯ ÙÙŠ Ø§Ù„ÙˆÙ‚Øª Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠ ÙˆØ§Ù„ØªÙˆØ£Ù… Ø§Ù„Ø±Ù‚Ù…ÙŠ Ø§Ù„ÙƒØ§Ù…Ù„ Ù„Ù„Ù…Ø¯Ù†.',
      source: 'Ù…ÙˆØ¨Ø§ÙŠÙ„ ØªÙƒ',
      publishedAt: new Date(Date.now() - 3 * 3600000).toISOString()
    },
    {
      title: 'ØªÙ‚Ù†ÙŠØ© Ø§Ù„ÙˆØ§Ù‚Ø¹ Ø§Ù„Ù…ÙƒØ§Ù†ÙŠ ØªÙØªØ­ Ø£Ø¨ÙˆØ§Ø¨Ø§Ù‹ Ø¬Ø¯ÙŠØ¯Ø© Ù„Ù„ØªÙØ§Ø¹Ù„ Ø§Ù„Ø¨Ø´Ø±ÙŠ Ø§Ù„Ø±Ù‚Ù…ÙŠ',
      description: 'Ù…Ø¹ Ø¥Ø·Ù„Ø§Ù‚ Ø£Ø¬Ù‡Ø²Ø© Ø§Ù„ÙˆØ§Ù‚Ø¹ Ø§Ù„Ù…ÙƒØ§Ù†ÙŠ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©ØŒ Ø£ØµØ¨Ø­ Ø§Ù„ØªÙØ§Ø¹Ù„ Ù…Ø¹ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ø±Ù‚Ù…ÙŠ Ø£ÙƒØ«Ø± Ø·Ø¨ÙŠØ¹ÙŠØ© Ù…Ù† Ø£ÙŠ ÙˆÙ‚Øª Ù…Ø¶Ù‰. Ù†Ø³ØªØ¹Ø±Ø¶ ÙƒÙŠÙ Ø³ØªØºÙŠØ± Ù‡Ø°Ù‡ Ø§Ù„ØªÙ‚Ù†ÙŠØ© Ø­ÙŠØ§ØªÙ†Ø§ Ø§Ù„ÙŠÙˆÙ…ÙŠØ©.',
      content: 'Ù…Ø¹ Ø¥Ø·Ù„Ø§Ù‚ Ø£Ø¬Ù‡Ø²Ø© Ø§Ù„ÙˆØ§Ù‚Ø¹ Ø§Ù„Ù…ÙƒØ§Ù†ÙŠ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©ØŒ Ø£ØµØ¨Ø­ Ø§Ù„ØªÙØ§Ø¹Ù„ Ù…Ø¹ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ø±Ù‚Ù…ÙŠ Ø£ÙƒØ«Ø± Ø·Ø¨ÙŠØ¹ÙŠØ© Ù…Ù† Ø£ÙŠ ÙˆÙ‚Øª Ù…Ø¶Ù‰. ØªØ¬Ù…Ø¹ Ù‡Ø°Ù‡ Ø§Ù„ØªÙ‚Ù†ÙŠØ© Ø¨ÙŠÙ† Ø§Ù„ÙˆØ§Ù‚Ø¹ Ø§Ù„Ù…Ø¹Ø²Ø² ÙˆØ§Ù„ÙˆØ§Ù‚Ø¹ Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠ ÙÙŠ ØªØ¬Ø±Ø¨Ø© Ø³Ù„Ø³Ø© ÙˆØ§Ø­Ø¯Ø©.',
      source: 'Ø¯ÙŠØ¬ÙŠØªØ§Ù„ ØªØ±Ù†Ø¯Ø²',
      publishedAt: new Date(Date.now() - 5 * 3600000).toISOString()
    }
  ],
  ai: [
    {
      title: 'Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ Ø§Ù„ØªÙˆÙ„ÙŠØ¯ÙŠ ÙŠØ­Ù‚Ù‚ Ù‚ÙØ²Ø§Øª Ù†ÙˆØ¹ÙŠØ© ÙÙŠ Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ø¥Ø¨Ø¯Ø§Ø¹ÙŠ',
      description: 'Ø´Ù‡Ø¯ Ø¹Ø§Ù… 2026 ØªØ·ÙˆØ±Ø§Øª Ù…Ø°Ù‡Ù„Ø© ÙÙŠ Ù…Ø¬Ø§Ù„ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ Ø§Ù„ØªÙˆÙ„ÙŠØ¯ÙŠØŒ Ø­ÙŠØ« Ø£ØµØ¨Ø­Øª Ø§Ù„Ù†Ù…Ø§Ø°Ø¬ Ø§Ù„Ù„ØºÙˆÙŠØ© Ø§Ù„ÙƒØ¨ÙŠØ±Ø© Ù‚Ø§Ø¯Ø±Ø© Ø¹Ù„Ù‰ Ø¥Ù†ØªØ§Ø¬ Ù…Ø­ØªÙˆÙ‰ Ø£ÙƒØ«Ø± Ø¯Ù‚Ø© ÙˆØ¥Ø¨Ø¯Ø§Ø¹Ø§Ù‹ Ù…Ù† Ø£ÙŠ ÙˆÙ‚Øª Ù…Ø¶Ù‰.',
      content: 'Ø´Ù‡Ø¯ Ø¹Ø§Ù… 2026 ØªØ·ÙˆØ±Ø§Øª Ù…Ø°Ù‡Ù„Ø© ÙÙŠ Ù…Ø¬Ø§Ù„ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ Ø§Ù„ØªÙˆÙ„ÙŠØ¯ÙŠØŒ Ø­ÙŠØ« Ø£ØµØ¨Ø­Øª Ø§Ù„Ù†Ù…Ø§Ø°Ø¬ Ø§Ù„Ù„ØºÙˆÙŠØ© Ø§Ù„ÙƒØ¨ÙŠØ±Ø© Ù‚Ø§Ø¯Ø±Ø© Ø¹Ù„Ù‰ Ø¥Ù†ØªØ§Ø¬ Ù…Ø­ØªÙˆÙ‰ Ø£ÙƒØ«Ø± Ø¯Ù‚Ø© ÙˆØ¥Ø¨Ø¯Ø§Ø¹Ø§Ù‹. ØªØªÙ†Ø§ÙØ³ Ø§Ù„Ø´Ø±ÙƒØ§Øª Ø§Ù„ÙƒØ¨Ø±Ù‰ Ø¹Ù„Ù‰ ØªÙ‚Ø¯ÙŠÙ… Ù†Ù…Ø§Ø°Ø¬ Ø£ÙƒØ«Ø± Ø°ÙƒØ§Ø¡Ù‹ ÙˆÙƒÙØ§Ø¡Ø©ØŒ Ù…Ø¹ Ø§Ù„ØªØ±ÙƒÙŠØ² Ø¹Ù„Ù‰ Ø§Ù„Ø³Ù„Ø§Ù…Ø© ÙˆØ§Ù„Ø£Ø®Ù„Ø§Ù‚ÙŠØ§Øª ÙÙŠ Ø§Ø³ØªØ®Ø¯Ø§Ù… Ù‡Ø°Ù‡ Ø§Ù„ØªÙ‚Ù†ÙŠØ§Øª Ø§Ù„Ø«ÙˆØ±ÙŠØ©. ÙƒÙ…Ø§ Ø¸Ù‡Ø±Øª ØªØ·Ø¨ÙŠÙ‚Ø§Øª Ø¬Ø¯ÙŠØ¯Ø© Ù„Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙÙŠ Ù…Ø¬Ø§Ù„Ø§Øª Ø§Ù„Ø·Ø¨ ÙˆØ§Ù„ØªØ¹Ù„ÙŠÙ… ÙˆØ§Ù„Ù‡Ù†Ø¯Ø³Ø© ØªØ¨Ø´Ø± Ø¨Ù…Ø³ØªÙ‚Ø¨Ù„ ÙˆØ§Ø¹Ø¯.',
      source: 'AI Ø¹Ø±Ø¨ÙŠ',
      publishedAt: new Date(Date.now() - 2 * 3600000).toISOString()
    },
    {
      title: 'ÙˆÙƒÙ„Ø§Ø¡ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ: Ø§Ù„Ù…ÙˆØ¬Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© Ø§Ù„ØªÙŠ Ø³ØªØºÙŠØ± Ø·Ø±ÙŠÙ‚Ø© Ø¹Ù…Ù„Ù†Ø§',
      description: 'ÙˆÙƒÙ„Ø§Ø¡ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ Ø§Ù„Ù…Ø³ØªÙ‚Ù„ÙˆÙ† ÙŠÙ…Ø«Ù„ÙˆÙ† Ø§Ù„ØªØ·ÙˆØ± Ø§Ù„ØªØ§Ù„ÙŠ Ø¨Ø¹Ø¯ Ø±ÙˆØ¨ÙˆØªØ§Øª Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø©ØŒ Ø­ÙŠØ« ÙŠÙ…ÙƒÙ†Ù‡Ù… ØªÙ†ÙÙŠØ° Ù…Ù‡Ø§Ù… Ù…Ø¹Ù‚Ø¯Ø© Ø¨Ø´ÙƒÙ„ Ù…Ø³ØªÙ‚Ù„ ØªÙ…Ø§Ù…Ø§Ù‹.',
      content: 'ÙˆÙƒÙ„Ø§Ø¡ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ Ø§Ù„Ù…Ø³ØªÙ‚Ù„ÙˆÙ† ÙŠÙ…Ø«Ù„ÙˆÙ† Ø§Ù„ØªØ·ÙˆØ± Ø§Ù„ØªØ§Ù„ÙŠ ÙÙŠ Ø¹Ø§Ù„Ù… Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ. Ù‡Ø°Ù‡ Ø§Ù„Ø¨Ø±Ù…Ø¬ÙŠØ§Øª Ø§Ù„Ø°ÙƒÙŠØ© Ù‚Ø§Ø¯Ø±Ø© Ø¹Ù„Ù‰ Ø§Ù„ØªØ®Ø·ÙŠØ· ÙˆØ§Ù„ØªÙ†ÙÙŠØ° ÙˆØ§ØªØ®Ø§Ø° Ø§Ù„Ù‚Ø±Ø§Ø±Ø§Øª Ø¨Ø´ÙƒÙ„ Ù…Ø³ØªÙ‚Ù„ Ù„Ø­Ù„ Ø§Ù„Ù…Ø´ÙƒÙ„Ø§Øª Ø§Ù„Ù…Ø¹Ù‚Ø¯Ø©.',
      source: 'ØªÙƒ ÙƒØ±Ø§Ù†Ø´ Ø¹Ø±Ø¨ÙŠ',
      publishedAt: new Date(Date.now() - 4 * 3600000).toISOString()
    },
    {
      title: 'Ø§Ù„ØªØ¹Ù„Ù… Ø§Ù„Ø¹Ù…ÙŠÙ‚ ÙŠØ­Ù‚Ù‚ Ø§Ø®ØªØ±Ø§Ù‚Ø§Ù‹ ÙÙŠ ÙÙ‡Ù… Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© ÙˆÙ…Ø¹Ø§Ù„Ø¬ØªÙ‡Ø§',
      description: 'Ù†Ù…Ø§Ø°Ø¬ Ø¬Ø¯ÙŠØ¯Ø© Ù„Ù„ØªØ¹Ù„Ù… Ø§Ù„Ø¹Ù…ÙŠÙ‚ ØªØ­Ù‚Ù‚ Ù†ØªØ§Ø¦Ø¬ ØºÙŠØ± Ù…Ø³Ø¨ÙˆÙ‚Ø© ÙÙŠ ÙÙ‡Ù… ÙˆÙ…Ø¹Ø§Ù„Ø¬Ø© Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Ø¨ÙƒÙ„ Ù„Ù‡Ø¬Ø§ØªÙ‡Ø§.',
      content: 'ØªÙ…ÙƒÙ† Ø¨Ø§Ø­Ø«ÙˆÙ† Ù…Ù† ØªØ·ÙˆÙŠØ± Ù†Ù…Ø§Ø°Ø¬ ØªØ¹Ù„Ù… Ø¹Ù…ÙŠÙ‚ Ø¬Ø¯ÙŠØ¯Ø© Ù…ØªØ®ØµØµØ© ÙÙŠ Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© ØªÙÙˆÙ‚ Ø£Ø¯Ø§Ø¡Ù‡Ø§ Ø§Ù„Ù†Ù…Ø§Ø°Ø¬ Ø§Ù„Ø¹Ø§Ù„Ù…ÙŠØ© ÙÙŠ Ù…Ù‡Ø§Ù… Ø§Ù„ØªØ±Ø¬Ù…Ø© ÙˆØ§Ù„ØªÙ„Ø®ÙŠØµ ÙˆØªØ­Ù„ÙŠÙ„ Ø§Ù„Ù…Ø´Ø§Ø¹Ø±.',
      source: 'Ø¨Ø­ÙˆØ« AI',
      publishedAt: new Date(Date.now() - 7 * 3600000).toISOString()
    }
  ],
  mobile: [
    {
      title: 'Ø§Ù„Ù‡ÙˆØ§ØªÙ Ø§Ù„Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„Ø·ÙŠ ØªØ¯Ø®Ù„ Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ù†Ø¶Ø¬ Ù…Ø¹ ØªØµØ§Ù…ÙŠÙ… Ø£ÙƒØ«Ø± Ù…ØªØ§Ù†Ø© ÙˆØ£Ø³Ø¹Ø§Ø± Ù…Ø¹Ù‚ÙˆÙ„Ø©',
      description: 'Ø¨Ø¹Ø¯ Ø³Ù†ÙˆØ§Øª Ù…Ù† Ø§Ù„ØªØ·ÙˆÙŠØ±ØŒ Ø£ØµØ¨Ø­Øª Ø§Ù„Ù‡ÙˆØ§ØªÙ Ø§Ù„Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„Ø·ÙŠ Ø£ÙƒØ«Ø± Ø¹Ù…Ù„ÙŠØ© ÙˆØ¨Ø£Ø³Ø¹Ø§Ø± ÙÙŠ Ù…ØªÙ†Ø§ÙˆÙ„ Ø´Ø±ÙŠØ­Ø© Ø£ÙƒØ¨Ø± Ù…Ù† Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ† Ù…Ø¹ ØªØ­Ø³ÙŠÙ†Ø§Øª ÙƒØ¨ÙŠØ±Ø© ÙÙŠ Ø§Ù„Ù…ØªØ§Ù†Ø©.',
      content: 'Ø¯Ø®Ù„Øª Ø§Ù„Ù‡ÙˆØ§ØªÙ Ø§Ù„Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„Ø·ÙŠ Ù…Ø±Ø­Ù„Ø© Ø¬Ø¯ÙŠØ¯Ø© Ù…Ù† Ø§Ù„Ù†Ø¶Ø¬ Ø­ÙŠØ« Ø£ØµØ¨Ø­Øª Ø£Ø±Ù‚ ÙˆØ£Ø®Ù ÙˆØ£ÙƒØ«Ø± Ù…ØªØ§Ù†Ø© Ù…Ù† Ø£ÙŠ ÙˆÙ‚Øª Ù…Ø¶Ù‰. ØªØªÙ†Ø§ÙØ³ Samsung ÙˆGoogle ÙˆOnePlus Ø¹Ù„Ù‰ ØªÙ‚Ø¯ÙŠÙ… Ø£ÙØ¶Ù„ ØªØ¬Ø±Ø¨Ø© Ù„Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ†.',
      source: 'Ø¬Ø§Ø¯Ø¬ÙŠØª Ø¹Ø±Ø¨ÙŠ',
      publishedAt: new Date(Date.now() - 2.5 * 3600000).toISOString()
    },
    {
      title: 'ÙƒØ§Ù…ÙŠØ±Ø§Øª Ø§Ù„Ù‡ÙˆØ§ØªÙ Ø§Ù„Ø°ÙƒÙŠØ© ØªØªÙÙˆÙ‚ Ø¹Ù„Ù‰ Ø§Ù„ÙƒØ§Ù…ÙŠØ±Ø§Øª Ø§Ù„Ø§Ø­ØªØ±Ø§ÙÙŠØ© ÙÙŠ Ø¨Ø¹Ø¶ Ø§Ù„Ù…Ø¬Ø§Ù„Ø§Øª',
      description: 'Ù…Ø¹ ØªÙ‚Ø¯Ù… ØªÙ‚Ù†ÙŠØ§Øª Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø© Ø§Ù„Ø­Ø§Ø³ÙˆØ¨ÙŠØ© Ù„Ù„ØµÙˆØ±ØŒ Ø£ØµØ¨Ø­Øª ÙƒØ§Ù…ÙŠØ±Ø§Øª Ø§Ù„Ù‡ÙˆØ§ØªÙ Ø§Ù„Ø­Ø¯ÙŠØ«Ø© Ù‚Ø§Ø¯Ø±Ø© Ø¹Ù„Ù‰ Ø§Ù„ØªÙ‚Ø§Ø· ØµÙˆØ± Ù…Ø°Ù‡Ù„Ø©.',
      content: 'ÙˆØµÙ„Øª ÙƒØ§Ù…ÙŠØ±Ø§Øª Ø§Ù„Ù‡ÙˆØ§ØªÙ Ø§Ù„Ø°ÙƒÙŠØ© Ø¥Ù„Ù‰ Ù…Ø³ØªÙˆÙ‰ Ø¬Ø¯ÙŠØ¯ Ù…Ù† Ø§Ù„Ø§Ø­ØªØ±Ø§ÙÙŠØ© Ø¨ÙØ¶Ù„ ØªÙ‚Ù†ÙŠØ§Øª Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙÙŠ Ù…Ø¹Ø§Ù„Ø¬Ø© Ø§Ù„ØµÙˆØ± ÙˆØ§Ù„Ù…Ø³ØªØ´Ø¹Ø±Ø§Øª Ø§Ù„Ù…ØªØ·ÙˆØ±Ø©.',
      source: 'ÙÙˆØªÙˆ ØªÙƒ',
      publishedAt: new Date(Date.now() - 6 * 3600000).toISOString()
    }
  ],
  programming: [
    {
      title: 'Rust ØªØªØµØ¯Ø± Ù‚Ø§Ø¦Ù…Ø© Ù„ØºØ§Øª Ø§Ù„Ø¨Ø±Ù…Ø¬Ø© Ø§Ù„Ø£ÙƒØ«Ø± Ù…Ø­Ø¨ÙˆØ¨Ø© Ù„Ù„Ø¹Ø§Ù… Ø§Ù„Ø®Ø§Ù…Ø³ Ø¹Ù„Ù‰ Ø§Ù„ØªÙˆØ§Ù„ÙŠ',
      description: 'Ù„Ù„Ø¹Ø§Ù… Ø§Ù„Ø®Ø§Ù…Ø³ØŒ ØªØ­ØªÙØ¸ Ù„ØºØ© Rust Ø¨ØµØ¯Ø§Ø±Ø© Ø§Ø³ØªØ·Ù„Ø§Ø¹ Ø§Ù„Ù…Ø·ÙˆØ±ÙŠÙ† ÙƒØ£ÙƒØ«Ø± Ù„ØºØ© Ø¨Ø±Ù…Ø¬Ø© Ù…Ø­Ø¨ÙˆØ¨Ø©ØŒ Ù…Ø¹ ØªØ²Ø§ÙŠØ¯ Ø§Ø³ØªØ®Ø¯Ø§Ù…Ù‡Ø§ ÙÙŠ Ø§Ù„Ø£Ù†Ø¸Ù…Ø© Ø§Ù„Ø­Ø±Ø¬Ø©.',
      content: 'ØªÙˆØ§ØµÙ„ Ù„ØºØ© Rust ØªØµØ¯Ø±Ù‡Ø§ Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù„ØºØ§Øª Ø§Ù„Ø£ÙƒØ«Ø± Ù…Ø­Ø¨ÙˆØ¨Ø© Ø¨ÙŠÙ† Ø§Ù„Ù…Ø·ÙˆØ±ÙŠÙ†ØŒ ÙˆØªØªÙˆØ³Ø¹ Ø§Ø³ØªØ®Ø¯Ø§Ù…Ø§ØªÙ‡Ø§ Ù„ØªØ´Ù…Ù„ ØªØ·ÙˆÙŠØ± Ø£Ù†Ø¸Ù…Ø© Ø§Ù„ØªØ´ØºÙŠÙ„ ÙˆØ§Ù„Ø£Ù„Ø¹Ø§Ø¨ ÙˆØªØ·Ø¨ÙŠÙ‚Ø§Øª Ø§Ù„ÙˆÙŠØ¨ Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ø£Ø¯Ø§Ø¡.',
      source: 'ÙƒÙˆØ¯ Ø¹Ø±Ø¨ÙŠ',
      publishedAt: new Date(Date.now() - 3.5 * 3600000).toISOString()
    },
    {
      title: 'Ù…Ø³ØªÙ‚Ø¨Ù„ ØªØ·ÙˆÙŠØ± Ø§Ù„ÙˆÙŠØ¨: Ø£Ø·Ø± Ø¹Ù…Ù„ Ø¬Ø¯ÙŠØ¯Ø© ØªØ¹ÙŠØ¯ ØªØ¹Ø±ÙŠÙ ØªØ¬Ø±Ø¨Ø© Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…',
      description: 'ØªØ¸Ù‡Ø± Ø£Ø·Ø± Ø¹Ù…Ù„ Ø¬Ø¯ÙŠØ¯Ø© Ù„ØªØ·ÙˆÙŠØ± Ø§Ù„ÙˆÙŠØ¨ ØªØ±ÙƒØ² Ø¹Ù„Ù‰ Ø§Ù„Ø£Ø¯Ø§Ø¡ ÙˆØªØ¬Ø±Ø¨Ø© Ø§Ù„Ù…Ø·ÙˆØ± ÙÙŠ Ø¢Ù† ÙˆØ§Ø­Ø¯.',
      content: 'Ø¹Ø§Ù„Ù… ØªØ·ÙˆÙŠØ± Ø§Ù„ÙˆÙŠØ¨ ÙŠØ´Ù‡Ø¯ Ø«ÙˆØ±Ø© Ù…Ø¹ Ø¸Ù‡ÙˆØ± Ø£Ø·Ø± Ø¹Ù…Ù„ Ø¬Ø¯ÙŠØ¯Ø© ØªØ¬Ù…Ø¹ Ø¨ÙŠÙ† Ø³Ù‡ÙˆÙ„Ø© Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… ÙˆØ§Ù„Ø£Ø¯Ø§Ø¡ Ø§Ù„Ø¹Ø§Ù„ÙŠ ÙˆØ§Ù„Ø­Ø¬Ù… Ø§Ù„ØµØºÙŠØ±.',
      source: 'ÙˆÙŠØ¨ Ø¯ÙŠÙ Ø¹Ø±Ø¨ÙŠ',
      publishedAt: new Date(Date.now() - 8 * 3600000).toISOString()
    }
  ],
  security: [
    {
      title: 'ØªØ­Ø°ÙŠØ±Ø§Øª Ù…Ù† Ù…ÙˆØ¬Ø© Ù‡Ø¬Ù…Ø§Øª Ø³ÙŠØ¨Ø±Ø§Ù†ÙŠØ© Ø¬Ø¯ÙŠØ¯Ø© ØªØ³ØªÙ‡Ø¯Ù Ø§Ù„Ø¨Ù†ÙŠØ© Ø§Ù„ØªØ­ØªÙŠØ© Ø§Ù„Ø­ÙŠÙˆÙŠØ©',
      description: 'Ø®Ø¨Ø±Ø§Ø¡ Ø§Ù„Ø£Ù…Ù† Ø§Ù„Ø³ÙŠØ¨Ø±Ø§Ù†ÙŠ ÙŠØ­Ø°Ø±ÙˆÙ† Ù…Ù† ØªØµØ§Ø¹Ø¯ Ø§Ù„ØªÙ‡Ø¯ÙŠØ¯Ø§Øª Ø§Ù„ØªÙŠ ØªØ³ØªÙ‡Ø¯Ù Ø´Ø¨ÙƒØ§Øª Ø§Ù„Ø·Ø§Ù‚Ø© ÙˆØ§Ù„Ù…ÙŠØ§Ù‡ ÙˆØ§Ù„Ø§ØªØµØ§Ù„Ø§Øª Ø­ÙˆÙ„ Ø§Ù„Ø¹Ø§Ù„Ù….',
      content: 'ÙŠØ­Ø°Ø± Ø®Ø¨Ø±Ø§Ø¡ Ø§Ù„Ø£Ù…Ù† Ø§Ù„Ø³ÙŠØ¨Ø±Ø§Ù†ÙŠ Ù…Ù† Ù…ÙˆØ¬Ø© Ø¬Ø¯ÙŠØ¯Ø© Ù…Ù† Ø§Ù„Ù‡Ø¬Ù…Ø§Øª Ø§Ù„Ù…ØªØ·ÙˆØ±Ø© Ø§Ù„ØªÙŠ ØªØ³ØªÙ‡Ø¯Ù Ø§Ù„Ø¨Ù†ÙŠØ© Ø§Ù„ØªØ­ØªÙŠØ© Ø§Ù„Ø­ÙŠÙˆÙŠØ©. ÙˆÙŠÙ†ØµØ­ÙˆÙ† Ø§Ù„Ù…Ø¤Ø³Ø³Ø§Øª Ø¨ØªØ¹Ø²ÙŠØ² Ø¯ÙØ§Ø¹Ø§ØªÙ‡Ø§ ÙˆØªØ­Ø¯ÙŠØ« Ø£Ù†Ø¸Ù…ØªÙ‡Ø§ Ø¨Ø´ÙƒÙ„ Ø¹Ø§Ø¬Ù„.',
      source: 'Ø³Ø§ÙŠØ¨Ø± Ø³ÙŠÙƒÙŠÙˆØ±ØªÙŠ Ø¹Ø±Ø¨ÙŠ',
      publishedAt: new Date(Date.now() - 4.5 * 3600000).toISOString()
    },
    {
      title: 'ØªÙ‚Ù†ÙŠØ§Øª Ø§Ù„ØªØ´ÙÙŠØ± Ø§Ù„Ù…Ù‚Ø§ÙˆÙ…Ø© Ù„Ù„Ø­ÙˆØ³Ø¨Ø© Ø§Ù„ÙƒÙ…ÙˆÙ…ÙŠØ© ØªØ¯Ø®Ù„ Ù…Ø±Ø­Ù„Ø© Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ Ø§Ù„Ø¹Ù…Ù„ÙŠ',
      description: 'Ø¨Ø¯Ø£Øª Ø§Ù„Ù…Ø¤Ø³Ø³Ø§Øª Ø§Ù„ÙƒØ¨Ø±Ù‰ ÙÙŠ ØªØ¨Ù†ÙŠ Ù…Ø¹Ø§ÙŠÙŠØ± ØªØ´ÙÙŠØ± Ø¬Ø¯ÙŠØ¯Ø© Ù…ØµÙ…Ù…Ø© Ù„Ù…Ù‚Ø§ÙˆÙ…Ø© Ù‚Ø¯Ø±Ø§Øª Ø§Ù„Ø­ÙˆØ§Ø³ÙŠØ¨ Ø§Ù„ÙƒÙ…ÙˆÙ…ÙŠØ© Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ÙŠØ©.',
      content: 'Ù…Ø¹ Ø§Ù‚ØªØ±Ø§Ø¨ Ø¹ØµØ± Ø§Ù„Ø­ÙˆØ³Ø¨Ø© Ø§Ù„ÙƒÙ…ÙˆÙ…ÙŠØ©ØŒ ØªØ³Ø§Ø±Ø¹ Ø§Ù„Ù…Ø¤Ø³Ø³Ø§Øª Ù„ØªØ¨Ù†ÙŠ Ù…Ø¹Ø§ÙŠÙŠØ± ØªØ´ÙÙŠØ± Ø¬Ø¯ÙŠØ¯Ø© ØªÙ‚Ø§ÙˆÙ… Ø§Ù„Ù‚Ø¯Ø±Ø§Øª Ø§Ù„Ø­Ø³Ø§Ø¨ÙŠØ© Ø§Ù„Ù‡Ø§Ø¦Ù„Ø© Ù„Ù‡Ø°Ù‡ Ø§Ù„Ø­ÙˆØ§Ø³ÙŠØ¨.',
      source: 'Ø£Ù…Ù† Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª',
      publishedAt: new Date(Date.now() - 9 * 3600000).toISOString()
    }
  ],
  gaming: [
    {
      title: 'Ø§Ù„Ø£Ù„Ø¹Ø§Ø¨ Ø§Ù„Ø³Ø­Ø§Ø¨ÙŠØ© ØªØ­Ù‚Ù‚ Ù†Ù…ÙˆØ§Ù‹ Ù‚ÙŠØ§Ø³ÙŠØ§Ù‹ Ù…Ø¹ Ø¯Ø®ÙˆÙ„ Ù„Ø§Ø¹Ø¨ÙŠÙ† Ø¬Ø¯Ø¯ Ø¥Ù„Ù‰ Ø§Ù„Ø³ÙˆÙ‚',
      description: 'Ø´Ù‡Ø¯ Ù‚Ø·Ø§Ø¹ Ø§Ù„Ø£Ù„Ø¹Ø§Ø¨ Ø§Ù„Ø³Ø­Ø§Ø¨ÙŠØ© Ù†Ù…ÙˆØ§Ù‹ ØºÙŠØ± Ù…Ø³Ø¨ÙˆÙ‚ Ù…Ø¹ ØªØ­Ø³Ù† Ø§Ù„Ø¨Ù†ÙŠØ© Ø§Ù„ØªØ­ØªÙŠØ© ÙˆØ§Ù†Ø®ÙØ§Ø¶ Ø£Ø³Ø¹Ø§Ø± Ø§Ù„Ø§Ø´ØªØ±Ø§ÙƒØ§Øª.',
      content: 'Ø­Ù‚Ù‚ Ù‚Ø·Ø§Ø¹ Ø§Ù„Ø£Ù„Ø¹Ø§Ø¨ Ø§Ù„Ø³Ø­Ø§Ø¨ÙŠØ© Ù†Ù…ÙˆØ§Ù‹ Ø¨Ù†Ø³Ø¨Ø© 40% Ø®Ù„Ø§Ù„ Ø§Ù„Ø¹Ø§Ù… Ø§Ù„Ù…Ø§Ø¶ÙŠØŒ Ù…Ø¹ Ø¯Ø®ÙˆÙ„ Ø´Ø±ÙƒØ§Øª Ø¬Ø¯ÙŠØ¯Ø© Ø¥Ù„Ù‰ Ù‡Ø°Ø§ Ø§Ù„Ø³ÙˆÙ‚ Ø§Ù„ÙˆØ§Ø¹Ø¯.',
      source: 'Ø¬ÙŠÙ…Ø±Ø² Ø¹Ø±Ø¨ÙŠ',
      publishedAt: new Date(Date.now() - 5.5 * 3600000).toISOString()
    }
  ],
  science: [
    {
      title: 'Ø§ÙƒØªØ´Ø§Ù Ø¹Ù„Ù…ÙŠ Ø¬Ø¯ÙŠØ¯ ÙŠÙ‚Ø±Ø¨ Ø§Ù„Ø¹Ù„Ù…Ø§Ø¡ Ù…Ù† ÙÙ‡Ù… Ø£ØµÙ„ Ø§Ù„ÙƒÙˆÙ†',
      description: 'ÙØ±ÙŠÙ‚ Ø¯ÙˆÙ„ÙŠ Ù…Ù† Ø§Ù„Ø¹Ù„Ù…Ø§Ø¡ ÙŠØ¹Ù„Ù† Ø¹Ù† Ø§ÙƒØªØ´Ø§Ù Ø¬Ø³ÙŠÙ…Ø§Øª Ø¬Ø¯ÙŠØ¯Ø© Ù‚Ø¯ ØªØ³Ø§Ø¹Ø¯ ÙÙŠ Ø­Ù„ Ù„ØºØ² Ø§Ù„Ù…Ø§Ø¯Ø© Ø§Ù„Ù…Ø¸Ù„Ù…Ø©.',
      content: 'Ø£Ø¹Ù„Ù† ÙØ±ÙŠÙ‚ Ø¨Ø­Ø«ÙŠ Ø¯ÙˆÙ„ÙŠ Ø¹Ù† Ø§ÙƒØªØ´Ø§Ù Ø¬Ø³ÙŠÙ…Ø§Øª Ø¬Ø¯ÙŠØ¯Ø© ÙÙŠ ØªØ¬Ø§Ø±Ø¨ Ø§Ù„Ù…ØµØ§Ø¯Ù… Ø§Ù„ÙƒØ¨ÙŠØ±ØŒ Ù…Ù…Ø§ Ù‚Ø¯ ÙŠÙØªØ­ Ø§Ù„Ø¨Ø§Ø¨ Ù„ÙÙ‡Ù… Ø£Ø¹Ù…Ù‚ Ù„Ø¨Ù†ÙŠØ© Ø§Ù„ÙƒÙˆÙ† ÙˆØ§Ù„Ù…Ø§Ø¯Ø© Ø§Ù„Ù…Ø¸Ù„Ù…Ø©.',
      source: 'Ø³Ø§ÙŠÙ†Ø³ Ø¹Ø±Ø¨ÙŠ',
      publishedAt: new Date(Date.now() - 6.5 * 3600000).toISOString()
    }
  ],
  business: [
    {
      title: 'Ø´Ø±ÙƒØ§Øª Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ Ø§Ù„Ø¹Ù…Ù„Ø§Ù‚Ø© ØªØªØ¬Ø§ÙˆØ² Ø­Ø§Ø¬Ø² Ø§Ù„ØªØ±ÙŠÙ„ÙŠÙˆÙ† Ø¯ÙˆÙ„Ø§Ø± Ù…Ø±Ø© Ø£Ø®Ø±Ù‰',
      description: 'Ø¹Ø¯Ø© Ø´Ø±ÙƒØ§Øª ØªÙ‚Ù†ÙŠØ© ØªØ­Ù‚Ù‚ Ù‚ÙŠÙ…Ø§Ù‹ Ø³ÙˆÙ‚ÙŠØ© Ù‚ÙŠØ§Ø³ÙŠØ© Ù…Ø¹ Ø§Ø³ØªÙ…Ø±Ø§Ø± Ø§Ù„Ø·Ù„Ø¨ Ø¹Ù„Ù‰ Ø­Ù„ÙˆÙ„ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙˆØ§Ù„Ø­ÙˆØ³Ø¨Ø© Ø§Ù„Ø³Ø­Ø§Ø¨ÙŠØ©.',
      content: 'ØªÙˆØ§ØµÙ„ Ø´Ø±ÙƒØ§Øª Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ Ø§Ù„ÙƒØ¨Ø±Ù‰ ØªØ­Ù‚ÙŠÙ‚ Ø£Ø±Ù‚Ø§Ù… Ù‚ÙŠØ§Ø³ÙŠØ© ÙÙŠ Ù‚ÙŠÙ…ØªÙ‡Ø§ Ø§Ù„Ø³ÙˆÙ‚ÙŠØ©ØŒ Ù…Ø¯ÙÙˆØ¹Ø© Ø¨Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù…ØªØ²Ø§ÙŠØ¯ Ø¹Ù„Ù‰ Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙˆØ§Ù„Ø­ÙˆØ³Ø¨Ø© Ø§Ù„Ø³Ø­Ø§Ø¨ÙŠØ©.',
      source: 'ØªÙƒ Ø¨Ø²Ù†Ø³',
      publishedAt: new Date(Date.now() - 7.5 * 3600000).toISOString()
    }
  ]
};

// ==================== Cache Manager ====================
class CacheManager {
  static get(key) {
    try {
      const item = localStorage.getItem(`salem_blog_${key}`);
      if (!item) return null;
      const parsed = JSON.parse(item);
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(`salem_blog_${key}`);
        return null;
      }
      return parsed.data;
    } catch { return null; }
  }

  static set(key, data) {
    try {
      localStorage.setItem(`salem_blog_${key}`, JSON.stringify({
        data,
        expiry: Date.now() + CONFIG.CACHE_DURATION
      }));
    } catch { /* Storage full */ }
  }
}

// ==================== Encoding Repair Service ====================
class EncodingService {
  static observer = null;
  static CP1252_REVERSE = {
    0x20AC: 0x80,
    0x201A: 0x82,
    0x0192: 0x83,
    0x201E: 0x84,
    0x2026: 0x85,
    0x2020: 0x86,
    0x2021: 0x87,
    0x02C6: 0x88,
    0x2030: 0x89,
    0x0160: 0x8A,
    0x2039: 0x8B,
    0x0152: 0x8C,
    0x017D: 0x8E,
    0x2018: 0x91,
    0x2019: 0x92,
    0x201C: 0x93,
    0x201D: 0x94,
    0x2022: 0x95,
    0x2013: 0x96,
    0x2014: 0x97,
    0x02DC: 0x98,
    0x2122: 0x99,
    0x0161: 0x9A,
    0x203A: 0x9B,
    0x0153: 0x9C,
    0x017E: 0x9E,
    0x0178: 0x9F
  };

  static looksBroken(text) {
    if (typeof text !== 'string' || text.length < 2) return false;
    return /(?:Ø.|Ù.|Ã.|Â.|Ð.|Ñ.|Ò.|Ó.|Ô.|Õ.|×.|Ý.|Þ.|ß.|â€|ï»)/.test(text);
  }

  static decodeWithEscape(text) {
    try {
      // Legacy but very effective for UTF-8 text decoded as Latin-1 (Ø§Ù„...)
      return decodeURIComponent(escape(text));
    } catch {
      return text;
    }
  }

  static decodeWithTextDecoder(text) {
    try {
      const bytes = Uint8Array.from([...text].map(ch => {
        const code = ch.charCodeAt(0);
        if (code <= 255) return code;
        if (Object.prototype.hasOwnProperty.call(this.CP1252_REVERSE, code)) {
          return this.CP1252_REVERSE[code];
        }
        return 63;
      }));
      return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    } catch {
      return text;
    }
  }

  static scoreArabic(text) {
    if (!text) return 0;
    const arabicCount = (text.match(/[ء-ي]/g) || []).length;
    return arabicCount / text.length;
  }

  static decodeBrokenText(text) {
    if (!this.looksBroken(text)) return text;

    let current = text;
    for (let i = 0; i < 3; i++) {
      const candidates = [
        current,
        this.decodeWithEscape(current),
        this.decodeWithTextDecoder(current)
      ];

      // Prefer candidate with highest Arabic score and without replacement chars.
      const best = candidates
        .map(value => ({ value, score: this.scoreArabic(value), hasReplacement: value.includes('�') }))
        .sort((a, b) => {
          if (a.hasReplacement !== b.hasReplacement) return a.hasReplacement ? 1 : -1;
          return b.score - a.score;
        })[0]?.value || current;

      if (best === current) break;
      current = best;
      if (!this.looksBroken(current)) break;
    }

    return current;
  }

  static fixTextNode(node) {
    if (!node || typeof node.nodeValue !== 'string') return;
    const fixed = this.decodeBrokenText(node.nodeValue);
    if (fixed !== node.nodeValue) {
      node.nodeValue = fixed;
    }
  }

  static fixElementAttributes(element) {
    if (!(element instanceof Element)) return;
    const attrs = ['title', 'placeholder', 'aria-label', 'alt', 'value'];
    attrs.forEach(attr => {
      if (!element.hasAttribute(attr)) return;
      const value = element.getAttribute(attr);
      const fixed = this.decodeBrokenText(value);
      if (fixed !== value) {
        element.setAttribute(attr, fixed);
      }
    });
  }

  static fixTree(root) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
      this.fixTextNode(root);
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;

    if (root instanceof Element) {
      this.fixElementAttributes(root);
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let current = walker.nextNode();
    while (current) {
      this.fixTextNode(current);
      current = walker.nextNode();
    }

    if (root.querySelectorAll) {
      root.querySelectorAll('*').forEach(el => this.fixElementAttributes(el));
    }
  }

  static fixDocument() {
    this.fixTree(document.body);
    const fixedTitle = this.decodeBrokenText(document.title);
    if (fixedTitle !== document.title) {
      document.title = fixedTitle;
    }
  }

  static startObserver() {
    if (this.observer || !document.body) return;

    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'characterData') {
          this.fixTextNode(mutation.target);
          return;
        }

        mutation.addedNodes.forEach(node => {
          this.fixTree(node);
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  static init() {
    this.fixDocument();
    this.startObserver();
    // Safety rescans for any deferred rendering/update pipelines.
    setTimeout(() => this.fixDocument(), 300);
    setTimeout(() => this.fixDocument(), 1200);
    setTimeout(() => this.fixDocument(), 2500);
  }
}

// ==================== Data Repair Service ====================
class DataRepairService {
  static repaired = false;

  static decode(value) {
    return typeof value === 'string' ? EncodingService.decodeBrokenText(value) : value;
  }

  static deepDecode(input) {
    if (Array.isArray(input)) {
      input.forEach((item, index) => {
        input[index] = this.deepDecode(item);
      });
      return input;
    }

    if (input && typeof input === 'object') {
      Object.keys(input).forEach(key => {
        input[key] = this.deepDecode(input[key]);
      });
      return input;
    }

    return this.decode(input);
  }

  static repairStaticData() {
    if (this.repaired) return;
    this.repaired = true;

    this.deepDecode(CONFIG.CATEGORIES);
    this.deepDecode(FALLBACK_DB);
  }
}

// ==================== Auth Service ====================
class AuthService {
  static login(email, password) {
    if (email && password) {
      const existing = this.getUser();
      const joinedAt = existing?.email === email && existing?.joinedAt
        ? existing.joinedAt
        : new Date().toISOString();
      const user = {
        name: existing?.email === email ? existing.name : email.split('@')[0],
        email,
        joinedAt,
        bio: existing?.bio || 'مهتم بمتابعة أحدث اتجاهات التقنية والمحتوى العملي.',
        location: existing?.location || 'غير محدد',
        website: existing?.website || '',
        role: existing?.role || 'كاتب تقني'
      };
      localStorage.setItem('salem_user', JSON.stringify(user));
      window.location.href = 'index.html';
    }
  }

  static register(name, email, password) {
    if (name && email && password) {
       const user = {
         name,
         email,
         joinedAt: new Date().toISOString(),
         bio: 'مهتم بإنشاء محتوى تقني مفيد ومشاركة المعرفة مع المجتمع.',
         location: 'غير محدد',
         website: '',
         role: 'كاتب تقني'
       };
       localStorage.setItem('salem_user', JSON.stringify(user));
       window.location.href = 'index.html';
    }
  }

  static logout() {
    localStorage.removeItem('salem_user');
    window.location.href = 'login.html';
  }

  static getUser() {
    try {
      return JSON.parse(localStorage.getItem('salem_user'));
    } catch { return null; }
  }

  static initAuth() {
    const user = this.getUser();
    if (user) {
      const hasSearchModal = !!document.getElementById('searchModal');
      const searchButton = hasSearchModal ? `
            <button class="nav-search-btn" data-bs-toggle="modal" data-bs-target="#searchModal" aria-label="بحث">
               <i class="fas fa-search"></i>
            </button>
      ` : '';

      document.querySelectorAll('.navbar-collapse').forEach(nav => {
        const authDiv = nav.querySelector('.d-flex.gap-2') || nav.querySelector('.d-flex.align-items-center.gap-2');
        if (authDiv) {
          authDiv.innerHTML = `
            <a href="profile.html" class="btn btn-outline-light btn-sm px-3" style="border-radius: 8px;">
               <i class="fas fa-user-circle ms-1"></i> ${user.name}
            </a>
            <a href="#" onclick="event.preventDefault(); AuthService.logout()" class="btn btn-light btn-sm text-danger" style="border-radius: 8px;" title="تسجيل الخروج">
               <i class="fas fa-sign-out-alt"></i>
            </a>
            ${searchButton}
          `;
        }
      });
      
      const logoutBtn = document.querySelector('.btn-outline-danger');
      if (logoutBtn) {
        logoutBtn.onclick = (e) => { e.preventDefault(); AuthService.logout(); };
      }
    }
    
  }
}

// ==================== Layout Service ====================
class LayoutService {
  static AUTH_PAGES = ['login.html', 'register.html'];

  static getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  static isAuthPage(page = this.getCurrentPage()) {
    return this.AUTH_PAGES.includes(page);
  }

  static initGlobalLayout() {
    const currentPage = this.getCurrentPage();
    if (this.isAuthPage(currentPage)) return;

    this.injectNavbar(currentPage);
    this.injectFooter();
    this.injectBackToTop();
  }

  static injectNavbar(currentPage) {
    const nav = document.querySelector('nav.navbar-salem');
    const navbarMarkup = this.buildNavbar(currentPage);

    if (nav) {
      nav.outerHTML = navbarMarkup;
      return;
    }

    document.body.insertAdjacentHTML('afterbegin', navbarMarkup);
  }

  static injectFooter() {
    const footer = document.querySelector('footer.footer-section');
    const footerMarkup = this.buildFooter();

    if (footer) {
      footer.outerHTML = footerMarkup;
      return;
    }

    const script = document.querySelector('script:last-of-type');
    if (script) {
      script.insertAdjacentHTML('beforebegin', footerMarkup);
    } else {
      document.body.insertAdjacentHTML('beforeend', footerMarkup);
    }
  }

  static injectBackToTop() {
    if (document.getElementById('backToTop')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <button class="back-to-top" id="backToTop" aria-label="العودة للأعلى">
        <i class="fas fa-chevron-up"></i>
      </button>
    `);
  }

  static navClass(page, target) {
    const aliases = {
      'article.html': 'articles.html'
    };
    const current = aliases[page] || page;
    return current === target ? 'nav-link active' : 'nav-link';
  }

  static buildNavbar(page) {
    const hasSearchModal = !!document.getElementById('searchModal');
    const searchButton = hasSearchModal ? `
          <button class="nav-search-btn ms-2" data-bs-toggle="modal" data-bs-target="#searchModal" aria-label="بحث">
            <i class="fas fa-search"></i>
          </button>` : '';

    return `
      <nav class="navbar navbar-expand-lg navbar-salem fixed-top">
        <div class="container">
          <a class="navbar-brand navbar-brand-salem" href="index.html">
            <div class="brand-icon">م</div>
            <div class="brand-text">
              <span class="brand-name">مدونتي</span>
            </div>
          </a>

          <button class="navbar-toggler navbar-toggler-salem" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
              <li class="nav-item"><a class="${this.navClass(page, 'index.html')}" href="index.html"><i class="fas fa-home ms-1"></i> الرئيسية</a></li>
              <li class="nav-item"><a class="${this.navClass(page, 'articles.html')}" href="articles.html"><i class="fas fa-newspaper ms-1"></i> المقالات</a></li>
              <li class="nav-item"><a class="${this.navClass(page, 'categories.html')}" href="categories.html"><i class="fas fa-th-large ms-1"></i> التصنيفات</a></li>
              <li class="nav-item"><a class="${this.navClass(page, 'add-article.html')}" href="add-article.html"><i class="fas fa-plus-circle ms-1"></i> إضافة مقال</a></li>
              <li class="nav-item"><a class="${this.navClass(page, 'about.html')}" href="about.html"><i class="fas fa-info-circle ms-1"></i> من نحن</a></li>
              <li class="nav-item"><a class="${this.navClass(page, 'contact.html')}" href="contact.html"><i class="fas fa-envelope ms-1"></i> تواصل معنا</a></li>
            </ul>

            <div class="d-flex align-items-center gap-2">
              <a href="login.html" class="btn btn-outline-light btn-sm"><i class="fas fa-sign-in-alt ms-1"></i> دخول</a>
              <a href="register.html" class="btn btn-light btn-sm text-primary fw-bold"><i class="fas fa-user-plus ms-1"></i> تسجيل</a>
              ${searchButton}
            </div>
          </div>
        </div>
      </nav>`;
  }

  static buildFooter() {
    return `
      <footer class="footer-section">
        <div class="container">
          <div class="row">
            <div class="col-lg-4 mb-4 mb-lg-0">
              <div class="d-flex align-items-center gap-2 mb-3">
                <div class="brand-icon">م</div>
                <h3 class="footer-brand-name mb-0">مدونتي</h3>
              </div>
              <p class="footer-description">
                مدونة تقنية عربية تقدم أحدث المقالات من مصادر عالمية موثوقة في التكنولوجيا والذكاء الاصطناعي.
              </p>
              <div class="footer-social">
                <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
              </div>
            </div>

            <div class="col-6 col-lg-2 mb-4 mb-lg-0">
              <h4 class="footer-title">روابط سريعة</h4>
              <ul class="footer-links">
                <li><a href="index.html">الرئيسية</a></li>
                <li><a href="articles.html">المقالات</a></li>
                <li><a href="about.html">من نحن</a></li>
                <li><a href="contact.html">تواصل معنا</a></li>
              </ul>
            </div>

            <div class="col-6 col-lg-2 mb-4 mb-lg-0">
              <h4 class="footer-title">التصنيفات</h4>
              <ul class="footer-links">
                <li><a href="categories.html">التكنولوجيا</a></li>
                <li><a href="categories.html">الذكاء الاصطناعي</a></li>
                <li><a href="categories.html">البرمجة</a></li>
                <li><a href="categories.html">الأمن السيبراني</a></li>
              </ul>
            </div>

            <div class="col-lg-4">
              <h4 class="footer-title">تواصل معنا</h4>
              <ul class="footer-links">
                <li>
                  <a href="mailto:info@salemblog.com">
                    <i class="fas fa-envelope ms-2" style="color: var(--accent);"></i>
                    info@salemblog.com
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i class="fas fa-map-marker-alt ms-2" style="color: var(--accent);"></i>
                    القاهرة، مصر
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <p>جميع الحقوق محفوظة &copy; ${new Date().getFullYear()} <strong style="color: var(--white);">مدونتي</strong></p>
          </div>
        </div>
      </footer>`;
  }
}

// ==================== API Service ====================
class ArticleService {
  static getApiConfig(name) {
    return CONFIG.APIS.find(api => api.name === name);
  }

  static hasApiKey(api) {
    if (!api || !api.key) return false;
    const key = api.key.trim();
    return key.length > 10 && !key.startsWith('YOUR_');
  }

  static normalizeQuery(query = 'technology') {
    const aliases = {
      ai: 'artificial intelligence',
      mobile: 'smartphones',
      programming: 'software engineering',
      security: 'cybersecurity',
      gaming: 'gaming technology',
      science: 'science and technology',
      business: 'technology business'
    };
    return aliases[query] || query;
  }

  static domainFromUrl(url = '') {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }

  static isTrustedDomain(url = '') {
    const domain = this.domainFromUrl(url);
    if (!domain) return false;
    return CONFIG.TRUSTED_NEWS_DOMAINS.some(allowed => domain === allowed || domain.endsWith(`.${allowed}`));
  }

  static extractArticleList(payload) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return [];

    const candidates = [
      payload.articles,
      payload.results,
      payload.items,
      payload.news,
      payload.data,
      payload.data?.articles,
      payload.data?.results,
      payload.data?.items,
      payload.response?.results,
      payload.response?.articles,
      payload.payload?.articles,
      payload.payload?.items
    ];

    return candidates.find(Array.isArray) || [];
  }

  static firstNonEmpty(...values) {
    for (const value of values) {
      if (typeof value === 'string' && value.trim()) return value.trim();
      if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    }
    return '';
  }

  static sanitizeText(value, fallback = '') {
    const raw = typeof value === 'string' ? value : value == null ? '' : String(value);
    const decoded = EncodingService.decodeBrokenText(raw);
    const withoutHtml = decoded
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/g, '\'');

    const compact = withoutHtml.replace(/\s+/g, ' ').trim();
    return compact || fallback;
  }

  static normalizeCategory(category = '', fallback = 'technology') {
    const normalized = String(category || '').toLowerCase().trim();
    if (!normalized) return fallback;

    const match = CONFIG.CATEGORIES.find(cat => {
      const id = cat.id.toLowerCase();
      const query = cat.query.toLowerCase();
      const name = EncodingService.decodeBrokenText(cat.name).toLowerCase();
      return normalized === id ||
             normalized === query ||
             normalized === name ||
             normalized.includes(id) ||
             normalized.includes(query) ||
             normalized.includes(name);
    });

    return match ? match.id : fallback;
  }

  static normalizeDate(value) {
    if (!value) return new Date().toISOString();
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  }

  static normalizeSource(article = {}) {
    const sourceName = this.firstNonEmpty(
      article.source?.name,
      article.source_name,
      article.sourceName,
      article.source,
      article.publisher,
      article.author,
      article.byline
    );
    return this.sanitizeText(sourceName, 'Tech Source');
  }

  static adaptApiArticle(article = {}, fallbackCategory = 'technology', index = 0) {
    const rawCategory = this.firstNonEmpty(
      article.category,
      article.sectionId,
      article.sectionName,
      article.topic,
      article.category_name,
      article.category_id,
      Array.isArray(article.categories) ? article.categories[0] : '',
      Array.isArray(article.tags) ? article.tags[0] : ''
    );
    const category = this.normalizeCategory(rawCategory, this.normalizeCategory(fallbackCategory, 'technology'));

    const adapted = {
      id: this.firstNonEmpty(article.id, article.uuid, article._id),
      title: this.firstNonEmpty(article.title, article.webTitle, article.headline, article.name),
      description: this.firstNonEmpty(
        article.description,
        article.summary,
        article.excerpt,
        article.fields?.trailText,
        article.trailText,
        article.subtitle
      ),
      content: this.firstNonEmpty(
        article.content,
        article.body,
        article.fields?.bodyText,
        article.description,
        article.summary
      ),
      url: this.firstNonEmpty(article.url, article.webUrl, article.link, article.permalink),
      image: this.firstNonEmpty(
        article.image,
        article.image_url,
        article.urlToImage,
        article.thumbnail,
        article.cover_image,
        article.coverImage,
        article.fields?.thumbnail,
        article.media?.url
      ),
      publishedAt: this.firstNonEmpty(
        article.publishedAt,
        article.published_at,
        article.pubDate,
        article.webPublicationDate,
        article.date,
        article.createdAt,
        article.created_at
      ),
      source: this.normalizeSource(article),
      sourceUrl: this.firstNonEmpty(
        article.source?.url,
        article.source_url,
        article.sourceUrl,
        article.url,
        article.webUrl,
        article.link
      ),
      category
    };

    return this.normalizeArticle(adapted, category, index);
  }

  static dedupeArticles(articles = []) {
    const seen = new Set();
    return articles.filter(article => {
      const key = `${(article.url || '').toLowerCase()}|${(article.title || '').toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  static normalizeArticle(article, category, index = 0) {
    const normalizedCategory = this.normalizeCategory(article?.category || category, 'technology');
    const imageCandidate = this.firstNonEmpty(article?.image);
    const image = /^https?:\/\//i.test(imageCandidate) || /^data:image\//i.test(imageCandidate)
      ? imageCandidate
      : CONFIG.FALLBACK_IMAGES[index % CONFIG.FALLBACK_IMAGES.length];

    return {
      ...article,
      id: article.id || this.generateId(article.title),
      title: this.sanitizeText(article.title, 'مقال تقني'),
      description: this.sanitizeText(article.description || article.content, 'محتوى تقني جديد'),
      content: this.sanitizeText(article.content || article.description, article.title || 'محتوى تقني جديد'),
      url: this.firstNonEmpty(article.url, '#'),
      image,
      publishedAt: this.normalizeDate(article.publishedAt),
      source: this.sanitizeText(article.source, 'Tech Source'),
      sourceUrl: this.firstNonEmpty(article.sourceUrl, article.url, '#'),
      category: normalizedCategory
    };
  }

  static prioritizeTrusted(articles = [], max = 10, category = 'technology') {
    if (!articles.length) return null;

    const withPriority = articles
      .filter(article => article?.title && article?.url)
      .map((article, index) => this.normalizeArticle(article, category, index));

    const trusted = withPriority.filter(article => this.isTrustedDomain(article.url) || this.isTrustedDomain(article.sourceUrl));
    const pool = trusted.length >= 3 ? trusted : withPriority;

    return pool.slice(0, max);
  }

  static async fetchFromGuardian(query, max = 10) {
    try {
      const api = this.getApiConfig('guardian');
      if (!api || !api.base) return null;

      const normalizedQuery = this.normalizeQuery(query);
      const url = `${api.base}/search?api-key=${api.key || 'test'}&section=technology&q=${encodeURIComponent(normalizedQuery)}&order-by=newest&page-size=${Math.min(max * 2, 25)}&show-fields=trailText,bodyText,thumbnail`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Guardian API failed (${response.status})`);

      const data = await response.json();
      const results = this.extractArticleList(data);
      if (!results.length) return null;

      const mapped = results.map((item, i) => this.adaptApiArticle({
        ...item,
        source: item.source || 'The Guardian',
        sourceUrl: item.sourceUrl || 'https://www.theguardian.com',
        category: item.sectionId || query
      }, query, i));

      return this.prioritizeTrusted(mapped, max, query);
    } catch (e) {
      console.log('Guardian API unavailable:', e.message);
      return null;
    }
  }

  static async fetchFromGNews(query, max = 10) {
    try {
      const api = this.getApiConfig('gnews');
      if (!this.hasApiKey(api)) return null;

      const normalizedQuery = this.normalizeQuery(query);
      const url = `${api.base}/search?q=${encodeURIComponent(normalizedQuery)}&lang=en&sortby=publishedAt&max=${Math.min(max * 2, 25)}&apikey=${api.key}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`GNews failed (${response.status})`);

      const data = await response.json();
      const results = this.extractArticleList(data);
      if (!results.length) return null;

      const mapped = results.map((item, i) => this.adaptApiArticle({
        ...item,
        category: item.category || query
      }, query, i));

      return this.prioritizeTrusted(mapped, max, query);
    } catch (e) {
      console.log('GNews unavailable:', e.message);
      return null;
    }
  }

  static async fetchFromNewsAPI(query, max = 10) {
    try {
      const api = this.getApiConfig('newsapi');
      if (!this.hasApiKey(api)) return null;

      const normalizedQuery = this.normalizeQuery(query);
      const domains = CONFIG.TRUSTED_NEWS_DOMAINS.join(',');
      const url = `${api.base}/everything?q=${encodeURIComponent(normalizedQuery)}&domains=${domains}&language=en&sortBy=publishedAt&pageSize=${Math.min(max * 2, 30)}&apiKey=${api.key}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`NewsAPI failed (${response.status})`);

      const data = await response.json();
      const results = this.extractArticleList(data);
      if (!results.length) return null;

      const mapped = results.map((item, i) => this.adaptApiArticle({
        ...item,
        category: item.category || query
      }, query, i));

      return this.prioritizeTrusted(mapped, max, query);
    } catch (e) {
      console.log('NewsAPI unavailable:', e.message);
      return null;
    }
  }

  static async fetchFromCurrentsAPI(query, max = 10) {
    try {
      const api = this.getApiConfig('currentsapi');
      if (!this.hasApiKey(api)) return null;

      const url = `${api.base}/search?keywords=${encodeURIComponent(this.normalizeQuery(query))}&language=en&apiKey=${api.key}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Currents API failed');

      const data = await response.json();
      const results = this.extractArticleList(data);
      if (!results.length) return null;

      const mapped = results.slice(0, max).map((item, i) => this.adaptApiArticle({
        ...item,
        image: item.image && item.image !== 'None' ? item.image : item.image_url,
        category: item.category || query
      }, query, i));

      return this.prioritizeTrusted(mapped, max, query);
    } catch (e) {
      console.log('Currents API unavailable:', e.message);
      return null;
    }
  }

  static async fetchFromNewsData(query, max = 10) {
    try {
      const api = this.getApiConfig('newsdata');
      if (!this.hasApiKey(api)) return null;

      const url = `${api.base}?apikey=${api.key}&q=${encodeURIComponent(this.normalizeQuery(query))}&language=en&category=technology`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('NewsData API failed');

      const data = await response.json();
      const results = this.extractArticleList(data);
      if (!results.length) return null;

      const mapped = results.slice(0, max).map((item, i) => this.adaptApiArticle({
        ...item,
        category: item.category || query
      }, query, i));

      return this.prioritizeTrusted(mapped, max, query);
    } catch (e) {
      console.log('NewsData API unavailable:', e.message);
      return null;
    }
  }

  static async fetchTopFromGNews(max = 10) {
    try {
      const api = this.getApiConfig('gnews');
      if (!this.hasApiKey(api)) return null;

      const url = `${api.base}/top-headlines?category=technology&lang=en&max=${Math.min(max * 2, 25)}&apikey=${api.key}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`GNews top headlines failed (${response.status})`);

      const data = await response.json();
      const results = this.extractArticleList(data);
      if (!results.length) return null;

      const mapped = results.map((item, i) => this.adaptApiArticle({
        ...item,
        category: item.category || 'technology'
      }, 'technology', i));

      return this.prioritizeTrusted(mapped, max, 'technology');
    } catch (e) {
      console.log('GNews top headlines unavailable:', e.message);
      return null;
    }
  }

  static async fetchTopFromGuardian(max = 10) {
    try {
      const api = this.getApiConfig('guardian');
      if (!api || !api.base) return null;

      const url = `${api.base}/search?api-key=${api.key || 'test'}&section=technology&order-by=newest&page-size=${Math.min(max * 2, 25)}&show-fields=trailText,bodyText,thumbnail`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Guardian top headlines failed (${response.status})`);

      const data = await response.json();
      const results = this.extractArticleList(data);
      if (!results.length) return null;

      const mapped = results.map((item, i) => this.adaptApiArticle({
        ...item,
        source: item.source || 'The Guardian',
        sourceUrl: item.sourceUrl || 'https://www.theguardian.com',
        category: item.sectionId || 'technology'
      }, 'technology', i));

      return this.prioritizeTrusted(mapped, max, 'technology');
    } catch (e) {
      console.log('Guardian top headlines unavailable:', e.message);
      return null;
    }
  }

  static async fetchTopFromNewsAPI(max = 10) {
    try {
      const api = this.getApiConfig('newsapi');
      if (!this.hasApiKey(api)) return null;

      const url = `${api.base}/top-headlines?category=technology&country=us&pageSize=${Math.min(max * 2, 30)}&apiKey=${api.key}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`NewsAPI top headlines failed (${response.status})`);

      const data = await response.json();
      const results = this.extractArticleList(data);
      if (!results.length) return null;

      const mapped = results.map((item, i) => this.adaptApiArticle({
        ...item,
        category: item.category || 'technology'
      }, 'technology', i));

      return this.prioritizeTrusted(mapped, max, 'technology');
    } catch (e) {
      console.log('NewsAPI top headlines unavailable:', e.message);
      return null;
    }
  }

  static async fetchArticles(query = 'technology', max = 10) {
    const cacheKey = `articles_${query}_${max}`;
    const cached = CacheManager.get(cacheKey);
    if (cached) return cached;

    const timeoutMs = 5000;
    let articles = null;

    try {
      const apiCall = async () => {
        let result = await this.fetchFromGuardian(query, max);
        if (!result || !result.length) result = await this.fetchFromGNews(query, max);
        if (!result || !result.length) result = await this.fetchFromNewsAPI(query, max);
        if (!result || !result.length) result = await this.fetchFromCurrentsAPI(query, max);
        if (!result || !result.length) result = await this.fetchFromNewsData(query, max);
        return result;
      };

      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), timeoutMs));
      articles = await Promise.race([apiCall(), timeoutPromise]);
    } catch (e) {
      articles = null;
    }

    if (!articles || articles.length === 0) {
      articles = this.getFallbackArticles(query, max);
    }

    articles = this.dedupeArticles((articles || []).map((article, index) => this.normalizeArticle(article, query, index))).slice(0, max);
    CacheManager.set(cacheKey, articles);
    return articles;
  }

  static async fetchTopHeadlines(max = 10) {
    const cacheKey = `headlines_${max}`;
    const cached = CacheManager.get(cacheKey);
    if (cached) return cached;

    const timeoutMs = 5000;
    let articles = null;

    try {
      const apiCall = async () => {
        let result = await this.fetchTopFromGuardian(max);
        if (!result || !result.length) result = await this.fetchTopFromGNews(max);
        if (!result || !result.length) result = await this.fetchTopFromNewsAPI(max);
        if (!result || !result.length) result = await this.fetchFromCurrentsAPI('technology', max);
        if (!result || !result.length) result = await this.fetchFromNewsData('technology', max);
        return result;
      };

      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), timeoutMs));
      articles = await Promise.race([apiCall(), timeoutPromise]);
    } catch (e) {
      articles = null;
    }

    if (!articles || articles.length === 0) {
      articles = this.getFallbackArticles('technology', max);
    }

    articles = this.dedupeArticles((articles || []).map((article, index) => this.normalizeArticle(article, 'technology', index))).slice(0, max);
    CacheManager.set(cacheKey, articles);
    return articles;
  }
  static generateId(title) {
    if (!title) return `article-${Date.now()}`;

    const normalized = this.sanitizeText(title, 'article').toLowerCase();
    const slug = normalized
      .replace(/[^\u0600-\u06FFa-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 56) || 'article';

    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
      hash |= 0;
    }

    return `${slug}-${Math.abs(hash).toString(36)}`;
  }

  static getFallbackArticles(category = 'technology', max = 10) {
    // Build a rich set from FALLBACK_DB
    const catKey = Object.keys(FALLBACK_DB).find(k => category.toLowerCase().includes(k)) || 'technology';
    const primaryArticles = FALLBACK_DB[catKey] || [];
    
    // Gather from other categories too
    let allArticles = [...primaryArticles];
    Object.keys(FALLBACK_DB).forEach(key => {
      if (key !== catKey) {
        allArticles = allArticles.concat(FALLBACK_DB[key]);
      }
    });

    return allArticles.slice(0, max).map((article, i) => ({
      id: this.generateId(article.title),
      title: EncodingService.decodeBrokenText(article.title),
      description: EncodingService.decodeBrokenText(article.description),
      content: EncodingService.decodeBrokenText(article.content),
      url: '#',
      image: CONFIG.FALLBACK_IMAGES[i % CONFIG.FALLBACK_IMAGES.length],
      publishedAt: article.publishedAt,
      source: EncodingService.decodeBrokenText(article.source),
      sourceUrl: '#',
      category: catKey
    }));
  }
}

// ==================== UI Helpers ====================
class UI {
  
  static formatDate(dateString) {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return 'غير محدد';
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      if (diffDays < 7) return `منذ ${diffDays} يوم`;

      return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return 'غير محدد'; }
  }

  static formatDateFull(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return '';
      return date.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return ''; }
  }

  static truncate(text, length = 150) {
    if (!text || text.length <= length) return text || '';
    return text.substring(0, length).trim() + '...';
  }

  static escapeHtml(value = '') {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  static safeImageUrl(url, index = 0) {
    const candidate = String(url || '').trim();
    if (/^https?:\/\//i.test(candidate) || /^data:image\//i.test(candidate)) {
      return candidate;
    }
    return CONFIG.FALLBACK_IMAGES[index % CONFIG.FALLBACK_IMAGES.length];
  }

  static getInitials(name) {
    if (!name) return 'S';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2);
  }

  static getCategoryName(query) {
    const cat = CONFIG.CATEGORIES.find(c => c.query === query || c.id === query);
    return cat ? EncodingService.decodeBrokenText(cat.name) : 'تكنولوجيا';
  }

  static handleImageError(img, index = 0) {
    img.onerror = null;
    img.src = CONFIG.FALLBACK_IMAGES[index % CONFIG.FALLBACK_IMAGES.length];
  }

  static createSkeletonCards(count = 6) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="article-card">
            <div class="skeleton skeleton-img"></div>
            <div class="article-card-body">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-text mt-2"></div>
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text-short mt-1"></div>
            </div>
          </div>
        </div>`;
    }
    return html;
  }

  static safeEncode(article) {
    return btoa(encodeURIComponent(JSON.stringify(article)));
  }

  static safeDecode(encoded) {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  }

  static createArticleCard(article, index = 0) {
    const dateFormatted = this.formatDate(article.publishedAt);
    const excerpt = this.truncate(article.description, 120);
    const categoryName = this.getCategoryName(article.category);
    const initials = this.getInitials(article.source);
    const encoded = this.safeEncode(article);
    const safeTitle = this.escapeHtml(article.title);
    const safeExcerpt = this.escapeHtml(excerpt);
    const safeSource = this.escapeHtml(article.source);
    const safeCategory = this.escapeHtml(categoryName);
    const safeImage = this.safeImageUrl(article.image, index);
    const safeDate = this.escapeHtml(dateFormatted);

    return `
      <div class="col-md-6 col-lg-4 mb-4 fade-up">
        <div class="article-card" onclick="App.openArticle('${encoded}')" role="button" tabindex="0">
          <div class="article-card-img-wrapper">
            <img src="${safeImage}" alt="${safeTitle}" 
                 class="article-card-img" loading="lazy"
                 onerror="UI.handleImageError(this, ${index})">
            <span class="article-card-category">${safeCategory}</span>
            <span class="article-card-bookmark" onclick="event.stopPropagation(); App.toggleBookmark('${article.id}', this)">
              <i class="far fa-bookmark"></i>
            </span>
            <div class="article-card-overlay">
              <span class="read-btn"><i class="fas fa-arrow-left"></i> اقرأ المقال</span>
            </div>
          </div>
          <div class="article-card-body">
            <h3 class="article-card-title">${safeTitle}</h3>
            <p class="article-card-excerpt">${safeExcerpt}</p>
            <div class="article-card-footer">
              <div class="article-card-author">
                <div class="author-avatar-placeholder">${initials}</div>
                <span class="author-name">${safeSource}</span>
              </div>
              <span class="article-card-date">
                <i class="far fa-clock"></i>
                ${safeDate}
              </span>
            </div>
          </div>
        </div>
      </div>`;
  }

  static createFeaturedCard(article) {
    const dateFormatted = this.formatDate(article.publishedAt);
    const encoded = this.safeEncode(article);
    const safeTitle = this.escapeHtml(article.title);
    const safeExcerpt = this.escapeHtml(UI.truncate(article.description, 200));
    const safeSource = this.escapeHtml(article.source);
    const safeDate = this.escapeHtml(dateFormatted);
    const safeImage = this.safeImageUrl(article.image, 0);

    return `
      <div class="featured-article-card fade-up">
        <div class="row g-0">
          <div class="col-lg-6">
            <img src="${safeImage}" alt="${safeTitle}" 
                 class="featured-article-img w-100" loading="lazy"
                 onerror="UI.handleImageError(this, 0)">
          </div>
          <div class="col-lg-6">
            <div class="featured-article-body">
              <span class="featured-label">
                <i class="fas fa-star"></i>
                مقال مميز
              </span>
              <h2 class="featured-article-title">${safeTitle}</h2>
              <p class="featured-article-excerpt">${safeExcerpt}</p>
              <div class="d-flex align-items-center gap-3 mb-3">
                <span class="article-card-date"><i class="far fa-clock"></i> ${safeDate}</span>
                <span class="article-card-date"><i class="far fa-newspaper"></i> ${safeSource}</span>
              </div>
              <a href="#" class="read-more-btn" onclick="event.preventDefault(); App.openArticle('${encoded}')">
                اقرأ المزيد <i class="fas fa-arrow-left"></i>
              </a>
            </div>
          </div>
        </div>
      </div>`;
  }

  static createHeroFeaturedCard(article) {
    const encoded = this.safeEncode(article);
    const safeTitle = this.escapeHtml(article.title);
    const safeSource = this.escapeHtml(article.source);
    const safeDate = this.escapeHtml(UI.formatDate(article.publishedAt));
    const safeImage = this.safeImageUrl(article.image, 0);

    return `
      <a href="#" onclick="event.preventDefault(); App.openArticle('${encoded}')">
        <div class="hero-featured-card">
          <img src="${safeImage}" alt="${safeTitle}" 
               class="hero-featured-img" loading="lazy"
               onerror="UI.handleImageError(this, 0)">
          <div class="hero-featured-body">
            <span class="hero-featured-tag">
              <i class="fas fa-bolt"></i> أحدث الأخبار
            </span>
            <h3 class="hero-featured-title">${safeTitle}</h3>
            <div class="hero-featured-meta">
              <span><i class="far fa-clock"></i> ${safeDate}</span>
              <span><i class="far fa-newspaper"></i> ${safeSource}</span>
            </div>
          </div>
        </div>
      </a>`;
  }

  static createTrendingItem(article, index) {
    const encoded = this.safeEncode(article);
    const safeTitle = this.escapeHtml(article.title);
    const safeDate = this.escapeHtml(UI.formatDate(article.publishedAt));
    return `
      <a href="#" class="trending-item" onclick="event.preventDefault(); App.openArticle('${encoded}')">
        <span class="trending-number">${String(index + 1).padStart(2, '0')}</span>
        <div>
          <h4 class="trending-content-title">${safeTitle}</h4>
          <span class="trending-meta">${safeDate}</span>
        </div>
      </a>`;
  }

  static initAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }

  static showToast(message, icon = 'fas fa-check-circle') {
    let toast = document.getElementById('salem-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'salem-toast';
      toast.className = 'toast-salem';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

// ==================== Main Application ====================
class App {
  static currentPage = 'home';
  static allArticles = [];
  static currentCategory = 'all';
  static bookmarks = JSON.parse(localStorage.getItem('salem_bookmarks') || '[]');
  static articlesPageState = {
    allArticles: [],
    filteredArticles: [],
    category: 'all',
    search: '',
    sort: 'newest',
    page: 1
  };
  static categoriesPageState = {
    categories: [],
    visible: [],
    search: ''
  };
  static searchDebounce = null;

  static async init() {
    const currentPage = LayoutService.getCurrentPage();
    this.initNavbar();
    this.initBackToTop();
    AuthService.initAuth();

    if (currentPage === 'index.html' || currentPage === '') {
      await this.loadHomePage();
      return;
    }

    if (currentPage === 'articles.html') {
      await this.loadArticlesPage();
      return;
    }

    if (currentPage === 'categories.html') {
      await this.loadCategoriesPage();
      return;
    }

    if (currentPage === 'profile.html') {
      await ProfilePage.init();
    }
  }

  static initNavbar() {
    const navbar = document.querySelector('.navbar-salem');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  static initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  static async loadHomePage() {
    this.currentPage = 'home';
    
    const articlesGrid = document.getElementById('articles-grid');
    if (articlesGrid) articlesGrid.innerHTML = UI.createSkeletonCards(6);

    try {
      const [headlines, techArticles] = await Promise.all([
        ArticleService.fetchTopHeadlines(10),
        ArticleService.fetchArticles('technology', 10)
      ]);

      this.allArticles = [...headlines, ...techArticles];
      
      // Deduplicate by title
      const seen = new Set();
      this.allArticles = this.allArticles.filter(a => {
        if (seen.has(a.title)) return false;
        seen.add(a.title);
        return true;
      });

      // Hero featured
      const heroFeatured = document.getElementById('hero-featured');
      if (heroFeatured && this.allArticles.length > 0) {
        heroFeatured.innerHTML = UI.createHeroFeaturedCard(this.allArticles[0]);
      }

      // Featured article
      const featuredSection = document.getElementById('featured-article');
      if (featuredSection && this.allArticles.length > 1) {
        featuredSection.innerHTML = UI.createFeaturedCard(this.allArticles[1]);
      }

      // Articles grid
      const gridArticles = this.allArticles.slice(2);
      if (articlesGrid) {
        if (gridArticles.length > 0) {
          articlesGrid.innerHTML = gridArticles.map((a, i) => UI.createArticleCard(a, i + 2)).join('');
        } else {
          articlesGrid.innerHTML = `
            <div class="col-12">
              <div class="empty-state">
                <div class="empty-state-icon"><i class="fas fa-newspaper"></i></div>
                <h3 class="empty-state-title">لا توجد مقالات حاليًا</h3>
                <p class="empty-state-text">جاري تحميل المحتوى، يرجى المحاولة لاحقًا</p>
              </div>
            </div>`;
        }
      }

      // Trending sidebar
      const trendingList = document.getElementById('trending-list');
      if (trendingList) {
        trendingList.innerHTML = this.allArticles.slice(0, 5).map((a, i) => UI.createTrendingItem(a, i)).join('');
      }

      this.updateStats();
      setTimeout(() => UI.initAnimations(), 100);

    } catch (error) {
      console.error('Error loading home:', error);
      if (articlesGrid) {
        articlesGrid.innerHTML = `
          <div class="col-12">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="fas fa-exclamation-triangle"></i></div>
              <h3 class="empty-state-title">حدث خطأ في التحميل</h3>
              <p class="empty-state-text">يرجى المحاولة مرة أخرى</p>
              <button class="read-more-btn mt-3" onclick="App.loadHomePage()">
                <i class="fas fa-redo"></i> إعادة المحاولة
              </button>
            </div>
          </div>`;
      }
    }
  }

  static getCategoryById(categoryId = '') {
    const normalized = String(categoryId || '').toLowerCase().trim();
    return CONFIG.CATEGORIES.find(cat => cat.id === normalized || cat.query === normalized) || null;
  }

  static parseArticlesPageParams() {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    const queryParam = params.get('q');

    const category = categoryParam && this.getCategoryById(categoryParam)
      ? this.getCategoryById(categoryParam).id
      : 'all';

    return {
      category,
      query: queryParam ? EncodingService.decodeBrokenText(queryParam).trim() : ''
    };
  }

  static updateArticlesPageUrlState() {
    const params = new URLSearchParams();
    const state = this.articlesPageState;

    if (state.category && state.category !== 'all') {
      params.set('category', state.category);
    }
    if (state.search && state.search.trim()) {
      params.set('q', state.search.trim());
    }

    const query = params.toString();
    const nextUrl = query ? `articles.html?${query}` : 'articles.html';
    history.replaceState({}, '', nextUrl);
  }

  static renderArticlesCategoryPills() {
    const container = document.getElementById('articles-category-pills');
    if (!container) return;

    const pills = [
      { id: 'all', name: 'الكل', icon: 'fas fa-globe' },
      ...CONFIG.CATEGORIES.map(cat => ({
        id: cat.id,
        name: EncodingService.decodeBrokenText(cat.name),
        icon: cat.icon
      }))
    ];

    container.innerHTML = pills.map(cat => {
      const isActive = this.articlesPageState.category === cat.id ? 'active' : '';
      return `
        <button class="category-pill ${isActive}" type="button"
                onclick="App.setArticlesCategory('${cat.id}', this)">
          <i class="${cat.icon}"></i>
          ${UI.escapeHtml(cat.name)}
        </button>`;
    }).join('');
  }

  static bindArticlesPageControls() {
    const searchInput = document.getElementById('articles-search-input');
    const sortSelect = document.getElementById('articles-sort-select');

    if (searchInput) {
      searchInput.value = this.articlesPageState.search;
      searchInput.addEventListener('input', (event) => {
        clearTimeout(this.searchDebounce);
        this.searchDebounce = setTimeout(() => {
          this.articlesPageState.search = event.target.value.trim();
          this.articlesPageState.page = 1;
          this.updateArticlesPageUrlState();
          this.applyArticlesPageFilters();
        }, 300);
      });
    }

    if (sortSelect) {
      sortSelect.value = this.articlesPageState.sort;
      sortSelect.addEventListener('change', (event) => {
        this.articlesPageState.sort = event.target.value || 'newest';
        this.articlesPageState.page = 1;
        this.applyArticlesPageFilters();
      });
    }
  }

  static async loadArticlesPage() {
    this.currentPage = 'articles';
    const parsed = this.parseArticlesPageParams();
    this.articlesPageState = {
      allArticles: [],
      filteredArticles: [],
      category: parsed.category,
      search: parsed.query,
      sort: 'newest',
      page: 1
    };

    this.renderArticlesCategoryPills();
    this.bindArticlesPageControls();
    await this.refreshArticlesPageData();
  }

  static async refreshArticlesPageData() {
    const state = this.articlesPageState;
    const grid = document.getElementById('articles-page-grid');
    const featured = document.getElementById('articles-page-featured');

    if (grid) grid.innerHTML = UI.createSkeletonCards(6);
    if (featured) {
      featured.innerHTML = `
        <div class="featured-article-card">
          <div class="row g-0">
            <div class="col-lg-6"><div class="skeleton" style="height: 330px;"></div></div>
            <div class="col-lg-6 p-4">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text-short"></div>
            </div>
          </div>
        </div>`;
    }

    try {
      let articles = [];
      if (state.category === 'all') {
        const [headlines, tech, ai, programming] = await Promise.all([
          ArticleService.fetchTopHeadlines(24),
          ArticleService.fetchArticles('technology', 16),
          ArticleService.fetchArticles('artificial intelligence', 16),
          ArticleService.fetchArticles('software engineering', 16)
        ]);

        articles = [
          ...(headlines || []),
          ...(tech || []),
          ...(ai || []),
          ...(programming || [])
        ];
      } else {
        const cat = this.getCategoryById(state.category);
        const query = cat ? cat.query : state.category;
        const [byCategory, headlines] = await Promise.all([
          ArticleService.fetchArticles(query, 40),
          ArticleService.fetchTopHeadlines(10)
        ]);

        articles = [...(byCategory || []), ...(headlines || [])]
          .filter(article => {
            const normalized = ArticleService.normalizeCategory(article.category, state.category);
            return normalized === state.category || state.category === 'all';
          });
      }

      state.allArticles = ArticleService.dedupeArticles(articles)
        .map((article, index) => ArticleService.normalizeArticle(article, state.category === 'all' ? 'technology' : state.category, index));

      if (!state.allArticles.length) {
        state.allArticles = ArticleService.getFallbackArticles(
          state.category === 'all' ? 'technology' : state.category,
          24
        );
      }

      if (featured && state.allArticles.length > 0) {
        featured.innerHTML = UI.createFeaturedCard(state.allArticles[0]);
      }

      this.applyArticlesPageFilters();
    } catch (error) {
      console.error('Articles page load error:', error);
      if (grid) {
        grid.innerHTML = `
          <div class="col-12">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="fas fa-exclamation-triangle"></i></div>
              <h3 class="empty-state-title">تعذر تحميل المقالات</h3>
              <p class="empty-state-text">تحقق من الاتصال ثم أعد المحاولة.</p>
              <button class="read-more-btn mt-3" onclick="App.refreshArticlesPageData()">
                <i class="fas fa-rotate"></i> إعادة المحاولة
              </button>
            </div>
          </div>`;
      }
    }
  }

  static applyArticlesPageFilters() {
    const state = this.articlesPageState;
    const searchText = state.search.toLowerCase().trim();

    let filtered = [...state.allArticles];
    if (searchText) {
      filtered = filtered.filter(article => {
        const haystack = `${article.title} ${article.description} ${article.source}`.toLowerCase();
        return haystack.includes(searchText);
      });
    }

    if (state.sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    } else if (state.sort === 'source') {
      filtered.sort((a, b) => a.source.localeCompare(b.source, 'ar'));
    } else {
      filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }

    state.filteredArticles = filtered;
    const totalPages = Math.max(1, Math.ceil(filtered.length / CONFIG.ARTICLES_PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * CONFIG.ARTICLES_PER_PAGE;
    const currentItems = filtered.slice(start, start + CONFIG.ARTICLES_PER_PAGE);
    const grid = document.getElementById('articles-page-grid');

    if (grid) {
      if (currentItems.length) {
        grid.innerHTML = currentItems.map((article, index) => UI.createArticleCard(article, start + index)).join('');
      } else {
        grid.innerHTML = `
          <div class="col-12">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="fas fa-search"></i></div>
              <h3 class="empty-state-title">لا توجد نتائج مطابقة</h3>
              <p class="empty-state-text">جرّب كلمات بحث أخرى أو غيّر التصنيف.</p>
            </div>
          </div>`;
      }
    }

    this.renderArticlesPagePagination(totalPages);
    this.updateArticlesPageSummary();
    setTimeout(() => UI.initAnimations(), 100);
  }

  static renderArticlesPagePagination(totalPages) {
    const container = document.getElementById('articles-page-pagination');
    if (!container) return;

    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    const current = this.articlesPageState.page;
    const pageNumbers = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, current + 2);

    for (let page = start; page <= end; page++) {
      pageNumbers.push(`
        <li class="page-item ${page === current ? 'active' : ''}">
          <a class="page-link" href="#" onclick="event.preventDefault(); App.goToArticlesPage(${page})">${page}</a>
        </li>`);
    }

    container.innerHTML = `
      <ul class="pagination">
        <li class="page-item ${current === 1 ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="event.preventDefault(); App.goToArticlesPage(${current - 1})">
            <i class="fas fa-chevron-right"></i>
          </a>
        </li>
        ${pageNumbers.join('')}
        <li class="page-item ${current === totalPages ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="event.preventDefault(); App.goToArticlesPage(${current + 1})">
            <i class="fas fa-chevron-left"></i>
          </a>
        </li>
      </ul>`;
  }

  static goToArticlesPage(page) {
    const totalPages = Math.max(1, Math.ceil(this.articlesPageState.filteredArticles.length / CONFIG.ARTICLES_PER_PAGE));
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    this.articlesPageState.page = nextPage;
    this.applyArticlesPageFilters();
    document.getElementById('articles-page-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  static async setArticlesCategory(categoryId, element) {
    const normalized = categoryId === 'all'
      ? 'all'
      : (this.getCategoryById(categoryId)?.id || 'all');

    this.articlesPageState.category = normalized;
    this.articlesPageState.page = 1;

    document.querySelectorAll('#articles-category-pills .category-pill').forEach(pill => {
      pill.classList.remove('active');
    });
    if (element) element.classList.add('active');

    this.updateArticlesPageUrlState();
    await this.refreshArticlesPageData();
  }

  static updateArticlesPageSummary() {
    const state = this.articlesPageState;
    const category = state.category === 'all' ? null : this.getCategoryById(state.category);

    const titleEl = document.getElementById('articles-page-title');
    const subtitleEl = document.getElementById('articles-page-subtitle');
    const totalEl = document.getElementById('articles-total-count');
    const resultsEl = document.getElementById('articles-results-count');

    if (titleEl) {
      titleEl.textContent = category
        ? `مقالات ${EncodingService.decodeBrokenText(category.name)}`
        : 'كل المقالات التقنية';
    }

    if (subtitleEl) {
      subtitleEl.textContent = category
        ? 'تحديثات يومية من مصادر موثوقة في نفس المجال.'
        : 'مجموعة متنوعة من أحدث الأخبار والمقالات التقنية.';
    }

    if (totalEl) totalEl.textContent = `${state.allArticles.length}+`;
    if (resultsEl) resultsEl.textContent = state.filteredArticles.length;
  }

  static openCategory(categoryId) {
    const valid = this.getCategoryById(categoryId);
    const query = valid ? `?category=${encodeURIComponent(valid.id)}` : '';
    window.location.href = `articles.html${query}`;
  }

  static bindCategoriesPageControls() {
    const searchInput = document.getElementById('categories-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (event) => {
      const value = event.target.value.trim();
      this.categoriesPageState.search = value;
      this.filterCategoriesPage(value);
    });
  }

  static async loadCategoriesPage() {
    this.currentPage = 'categories';
    this.categoriesPageState = { categories: [], visible: [], search: '' };
    this.bindCategoriesPageControls();

    const grid = document.getElementById('categories-page-grid');
    if (grid) {
      grid.innerHTML = Array.from({ length: 6 }).map(() => `
        <div class="col-sm-6 col-lg-4">
          <div class="category-showcase-card">
            <div class="skeleton" style="height: 64px; width: 64px; border-radius: 16px;"></div>
            <div class="skeleton skeleton-title mt-3"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text-short"></div>
          </div>
        </div>`).join('');
    }

    try {
      const data = await Promise.all(
        CONFIG.CATEGORIES.map(async (cat) => {
          const articles = await ArticleService.fetchArticles(cat.query, 16);
          const normalizedArticles = ArticleService.dedupeArticles(
            (articles || []).map((article, index) => ArticleService.normalizeArticle(article, cat.id, index))
          );

          return {
            ...cat,
            name: EncodingService.decodeBrokenText(cat.name),
            count: normalizedArticles.length,
            sourceCount: [...new Set(normalizedArticles.map(article => article.source))].length,
            latest: normalizedArticles[0] || null
          };
        })
      );

      this.categoriesPageState.categories = data;
      this.categoriesPageState.visible = data;
      this.renderCategoriesPage();
    } catch (error) {
      console.error('Categories page load error:', error);
      if (grid) {
        grid.innerHTML = `
          <div class="col-12">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="fas fa-layer-group"></i></div>
              <h3 class="empty-state-title">تعذر تحميل التصنيفات</h3>
              <p class="empty-state-text">حاول إعادة التحميل بعد قليل.</p>
            </div>
          </div>`;
      }
    }
  }

  static filterCategoriesPage(searchQuery = '') {
    const search = searchQuery.toLowerCase().trim();
    this.categoriesPageState.visible = this.categoriesPageState.categories.filter(cat => {
      const haystack = `${cat.name} ${cat.id} ${cat.query}`.toLowerCase();
      return haystack.includes(search);
    });
    this.renderCategoriesPage();
  }

  static renderCategoriesPage() {
    const categories = this.categoriesPageState.visible;
    const grid = document.getElementById('categories-page-grid');
    const topList = document.getElementById('categories-top-list');

    if (grid) {
      if (!categories.length) {
        grid.innerHTML = `
          <div class="col-12">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="fas fa-search"></i></div>
              <h3 class="empty-state-title">لا توجد تصنيفات مطابقة</h3>
              <p class="empty-state-text">جرّب كلمة بحث أخرى.</p>
            </div>
          </div>`;
      } else {
        grid.innerHTML = categories.map(cat => {
          const latestTitle = cat.latest ? UI.escapeHtml(UI.truncate(cat.latest.title, 90)) : 'اكتشف أحدث المقالات في هذا المجال.';
          return `
            <div class="col-sm-6 col-lg-4 fade-up">
              <article class="category-showcase-card" role="button" tabindex="0"
                       onclick="App.openCategory('${cat.id}')"
                       onkeypress="if(event.key === 'Enter'){App.openCategory('${cat.id}')}">
                <div class="category-showcase-icon">
                  <i class="${cat.icon}"></i>
                </div>
                <h3 class="category-showcase-title">${UI.escapeHtml(cat.name)}</h3>
                <p class="category-showcase-text">${latestTitle}</p>
                <div class="category-showcase-meta">
                  <span><i class="far fa-newspaper"></i> ${cat.count} مقال</span>
                  <span><i class="fas fa-link"></i> ${cat.sourceCount || 1} مصدر</span>
                </div>
                <button class="category-open-btn" type="button">تصفح المقالات</button>
              </article>
            </div>`;
        }).join('');
      }
    }

    const sorted = [...this.categoriesPageState.categories].sort((a, b) => b.count - a.count).slice(0, 5);
    if (topList) {
      topList.innerHTML = sorted.map((cat, index) => `
        <a href="#" class="trending-item" onclick="event.preventDefault(); App.openCategory('${cat.id}')">
          <span class="trending-number">${String(index + 1).padStart(2, '0')}</span>
          <div>
            <h4 class="trending-content-title">${UI.escapeHtml(cat.name)}</h4>
            <span class="trending-meta">${cat.count} مقال</span>
          </div>
        </a>`).join('');
    }

    const categoriesCountEl = document.getElementById('categories-count');
    const totalArticlesEl = document.getElementById('categories-articles-count');
    const totalSourcesEl = document.getElementById('categories-sources-count');

    if (categoriesCountEl) categoriesCountEl.textContent = this.categoriesPageState.categories.length;
    if (totalArticlesEl) {
      const total = this.categoriesPageState.categories.reduce((sum, cat) => sum + cat.count, 0);
      totalArticlesEl.textContent = total;
    }
    if (totalSourcesEl) {
      const totalSources = this.categoriesPageState.categories.reduce((sum, cat) => sum + (cat.sourceCount || 0), 0);
      totalSourcesEl.textContent = totalSources;
    }

    setTimeout(() => UI.initAnimations(), 100);
  }

  static async filterByCategory(categoryId, element) {
    document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
    if (element) element.classList.add('active');

    this.currentCategory = categoryId;
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) return;

    articlesGrid.innerHTML = UI.createSkeletonCards(6);

    // Scroll to articles
    document.querySelector('.articles-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      let articles;
      if (categoryId === 'all') {
        articles = await ArticleService.fetchTopHeadlines(10);
      } else {
        const cat = CONFIG.CATEGORIES.find(c => c.id === categoryId);
        const query = cat ? cat.query : categoryId;
        articles = await ArticleService.fetchArticles(query, 10);
      }

      if (articles.length > 0) {
        articlesGrid.innerHTML = articles.map((a, i) => UI.createArticleCard(a, i)).join('');
      } else {
        articlesGrid.innerHTML = `
          <div class="col-12">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="fas fa-search"></i></div>
              <h3 class="empty-state-title">لا توجد مقالات في هذا التصنيف</h3>
              <p class="empty-state-text">جرّب تصنيفًا آخر</p>
            </div>
          </div>`;
      }
      setTimeout(() => UI.initAnimations(), 100);
    } catch (error) {
      console.error('Category filter error:', error);
    }
  }

  static openArticle(encoded) {
    try {
      const article = UI.safeDecode(encoded);
      sessionStorage.setItem('current_article', JSON.stringify(article));
      window.location.href = 'article.html';
    } catch (error) {
      console.error('Error opening article:', error);
    }
  }

  static async performSearch(query) {
    if (!query || query.trim().length < 2) return;

    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '<div class="text-center py-3"><div class="spinner-border text-light spinner-border-sm"></div></div>';

    try {
      const articles = await ArticleService.fetchArticles(query, 5);
      
      if (articles.length === 0) {
        resultsContainer.innerHTML = `<div class="text-center py-3"><p style="color: rgba(255,255,255,.4);">لا توجد نتائج لـ "${query}"</p></div>`;
        return;
      }

      resultsContainer.innerHTML = articles.map(article => {
        const encoded = UI.safeEncode(article);
        const safeTitle = UI.escapeHtml(article.title);
        const safeExcerpt = UI.escapeHtml(UI.truncate(article.description, 80));
        const safeImage = UI.safeImageUrl(article.image, 0);
        return `
          <div class="search-result-item" onclick="App.openArticle('${encoded}')">
            <img src="${safeImage}" alt="" class="search-result-img" onerror="UI.handleImageError(this, 0)">
            <div>
              <h4 class="search-result-title">${safeTitle}</h4>
              <p class="search-result-excerpt">${safeExcerpt}</p>
            </div>
          </div>`;
      }).join('');
    } catch (error) {
      resultsContainer.innerHTML = '<div class="text-center py-3"><p style="color: rgba(255,255,255,.4);">حدث خطأ في البحث</p></div>';
    }
  }

  static heroSearch(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('hero-search-input');
    if (input && input.value.trim()) {
      const modal = new bootstrap.Modal(document.getElementById('searchModal'));
      const modalInput = document.getElementById('modal-search-input');
      if (modalInput) {
        modalInput.value = input.value.trim();
        modal.show();
        this.performSearch(input.value.trim());
      }
    }
  }

  static toggleBookmark(articleId, element) {
    const index = this.bookmarks.indexOf(articleId);
    if (index > -1) {
      this.bookmarks.splice(index, 1);
      if (element) { element.classList.remove('active'); element.innerHTML = '<i class="far fa-bookmark"></i>'; }
      UI.showToast('تم إزالة المقال من المحفوظات', 'fas fa-bookmark');
    } else {
      this.bookmarks.push(articleId);
      if (element) { element.classList.add('active'); element.innerHTML = '<i class="fas fa-bookmark"></i>'; }
      UI.showToast('تم حفظ المقال بنجاح', 'fas fa-bookmark');
    }
    localStorage.setItem('salem_bookmarks', JSON.stringify(this.bookmarks));
  }

  static updateStats() {
    const totalEl = document.getElementById('stat-total');
    const catEl = document.getElementById('stat-categories');
    const sourcesEl = document.getElementById('stat-sources');

    if (totalEl) this.animateNumber(totalEl, Math.max(this.allArticles.length * 12, 120));
    if (catEl) this.animateNumber(catEl, CONFIG.CATEGORIES.length);
    if (sourcesEl) {
      const uniqueSources = [...new Set(this.allArticles.map(a => a.source))].length;
      this.animateNumber(sourcesEl, Math.max(uniqueSources, 15));
    }
  }

  static animateNumber(element, target) {
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      element.textContent = current + '+';
    }, 40);
  }
}

// ==================== Profile Page Logic ====================
class ProfilePage {
  static USER_ARTICLES_KEY = 'salem_user_articles';

  static getUserArticles() {
    try {
      const parsed = JSON.parse(localStorage.getItem(this.USER_ARTICLES_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.map((article, index) => ArticleService.normalizeArticle(article, article.category || 'technology', index));
    } catch {
      return [];
    }
  }

  static getCachedArticles() {
    const articles = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('salem_blog_')) continue;

      try {
        const payload = JSON.parse(localStorage.getItem(key) || '{}');
        if (Array.isArray(payload.data)) {
          articles.push(...payload.data);
        }
      } catch {
        // Ignore malformed cache entries.
      }
    }

    return ArticleService.dedupeArticles(
      articles.map((article, index) => ArticleService.normalizeArticle(article, article.category || 'technology', index))
    );
  }

  static getSavedArticles() {
    const bookmarkIds = JSON.parse(localStorage.getItem('salem_bookmarks') || '[]');
    if (!Array.isArray(bookmarkIds) || !bookmarkIds.length) return [];

    const cached = this.getCachedArticles();
    const byId = new Map(cached.map(article => [String(article.id), article]));
    const fallbackPool = ArticleService.getFallbackArticles('technology', Math.max(bookmarkIds.length, 6));

    return bookmarkIds.map((id, index) => {
      const found = byId.get(String(id));
      if (found) return found;
      return {
        ...fallbackPool[index % fallbackPool.length],
        id: String(id)
      };
    });
  }

  static createEntryCard(article, index = 0) {
    const encoded = UI.safeEncode(article);
    const safeTitle = UI.escapeHtml(article.title);
    const safeImage = UI.safeImageUrl(article.image, index);
    const safeDate = UI.escapeHtml(UI.formatDate(article.publishedAt));
    const safeSource = UI.escapeHtml(article.source);

    return `
      <article class="profile-entry-card">
        <img src="${safeImage}" alt="${safeTitle}" class="profile-entry-thumb" onerror="UI.handleImageError(this, ${index})">
        <div class="flex-grow-1">
          <h4 class="profile-entry-title">
            <a href="#" onclick="event.preventDefault(); App.openArticle('${encoded}')">${safeTitle}</a>
          </h4>
          <div class="profile-entry-meta">
            <i class="far fa-clock"></i> ${safeDate}
            <span style="margin: 0 .35rem;">•</span>
            <i class="far fa-newspaper"></i> ${safeSource}
          </div>
        </div>
      </article>`;
  }

  static renderEmptyState(container, icon, title, text, actionHref, actionLabel) {
    if (!container) return;
    container.innerHTML = `
      <div class="empty-state py-4">
        <div class="empty-state-icon"><i class="${icon}"></i></div>
        <h3 class="empty-state-title">${UI.escapeHtml(title)}</h3>
        <p class="empty-state-text">${UI.escapeHtml(text)}</p>
        <a href="${actionHref}" class="btn btn-outline-secondary rounded-pill mt-2 px-4">${UI.escapeHtml(actionLabel)}</a>
      </div>`;
  }

  static ensureUserMetadata(user) {
    if (!user.joinedAt) user.joinedAt = new Date().toISOString();
    if (!user.bio) user.bio = 'مهتم بالتقنية ومتابعة أحدث الأخبار والمقالات المتخصصة.';
    if (!user.location) user.location = 'غير محدد';
    if (!user.website) user.website = '';
    localStorage.setItem('salem_user', JSON.stringify(user));
    return user;
  }

  static fillProfileInfo(user, userArticles, savedArticles) {
    const normalizedUser = this.ensureUserMetadata(user);
    const displayName = EncodingService.decodeBrokenText(normalizedUser.name || normalizedUser.email?.split('@')[0] || 'مستخدم');
    const email = EncodingService.decodeBrokenText(normalizedUser.email || '--');

    const uniqueSources = new Set([...userArticles, ...savedArticles].map(article => article.source).filter(Boolean)).size;

    const setText = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };

    const avatar = document.getElementById('profile-avatar');
    if (avatar) {
      avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=16213e&color=ffffff&size=240`;
      avatar.alt = displayName;
    }

    setText('profile-name', displayName);
    setText('profile-role', normalizedUser.role || 'كاتب تقني');
    setText('profile-email', email);
    setText('profile-bio', EncodingService.decodeBrokenText(normalizedUser.bio));
    setText('profile-location', EncodingService.decodeBrokenText(normalizedUser.location));
    setText('profile-joined', new Date(normalizedUser.joinedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' }));
    setText('profile-articles-count', userArticles.length);
    setText('profile-bookmarks-count', savedArticles.length);
    setText('profile-sources-count', uniqueSources);
    setText('profile-articles-title', `مقالاتي (${userArticles.length})`);
    setText('profile-saved-title', `المحفوظات (${savedArticles.length})`);

    const websiteEl = document.getElementById('profile-website');
    if (websiteEl) {
      if (normalizedUser.website) {
        websiteEl.href = normalizedUser.website;
        websiteEl.textContent = normalizedUser.website;
      } else {
        websiteEl.href = '#';
        websiteEl.textContent = 'غير متوفر';
      }
    }
  }

  static renderLists(userArticles, savedArticles) {
    const articlesContainer = document.getElementById('profile-articles-list');
    const savedContainer = document.getElementById('profile-saved-list');

    if (!userArticles.length) {
      this.renderEmptyState(
        articlesContainer,
        'far fa-newspaper',
        'لا توجد مقالات منشورة بعد',
        'ابدأ بكتابة أول مقال لك وسيظهر هنا تلقائيًا.',
        'add-article.html',
        'اكتب أول مقال'
      );
    } else if (articlesContainer) {
      articlesContainer.innerHTML = userArticles
        .slice(0, 12)
        .map((article, index) => this.createEntryCard(article, index))
        .join('');
    }

    if (!savedArticles.length) {
      this.renderEmptyState(
        savedContainer,
        'far fa-bookmark',
        'لا توجد مقالات محفوظة',
        'احفظ المقالات المهمة من صفحة المقالات للرجوع إليها لاحقًا.',
        'articles.html',
        'تصفح المقالات'
      );
    } else if (savedContainer) {
      savedContainer.innerHTML = savedArticles
        .slice(0, 12)
        .map((article, index) => this.createEntryCard(article, index))
        .join('');
    }
  }

  static async init() {
    if (!window.location.pathname.includes('profile.html')) return;

    const user = AuthService.getUser();
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    const userArticles = this.getUserArticles();
    const savedArticles = this.getSavedArticles();

    this.fillProfileInfo(user, userArticles, savedArticles);
    this.renderLists(userArticles, savedArticles);
  }
}

// ==================== Article Page Logic ====================
class ArticlePage {
  static async init() {
    const article = JSON.parse(sessionStorage.getItem('current_article'));
    if (!article) { window.location.href = 'index.html'; return; }

    this.renderArticle(article);
    this.loadRelatedArticles(article.category);
    App.initNavbar();
    App.initBackToTop();
    AuthService.initAuth();
  }

  static renderArticle(article) {
    const heroImg = document.getElementById('article-hero-img');
    if (heroImg) {
      heroImg.src = article.image;
      heroImg.alt = article.title;
      heroImg.onerror = function() { UI.handleImageError(this, 0); };
    }

    const title = document.getElementById('article-title');
    if (title) title.textContent = article.title;
    document.title = `${article.title} - مدونتي`;

    const source = document.getElementById('article-source');
    if (source) source.textContent = article.source;

    const date = document.getElementById('article-date');
    if (date) date.textContent = UI.formatDateFull(article.publishedAt);

    const category = document.getElementById('article-category-name');
    if (category) category.textContent = UI.getCategoryName(article.category);

    const content = document.getElementById('article-content');
    if (content) {
      const fullContent = article.content || article.description;
      const paragraphs = fullContent.split(/[.!؟]\s+/).filter(p => p.trim().length > 15);
      
      let html = '';
      paragraphs.forEach((p, i) => {
        if (i === 0) {
          html += `<p class="lead" style="font-size: 1.15rem; font-weight: 500; color: var(--gray-500);">${p.trim()}.</p>`;
        } else if (i === Math.floor(paragraphs.length / 2) && paragraphs.length > 2) {
          html += `<blockquote>${p.trim()}.</blockquote>`;
        } else {
          html += `<p>${p.trim()}.</p>`;
        }
      });

      if (paragraphs.length < 3) {
        html += `
          <h2>المزيد من التفاصيل</h2>
          <p>${article.description || 'يتناول هذا المقال أحدث التطورات في مجال التكنولوجيا والابتكار.'}</p>
          <p>للاطلاع على المقال كاملًا يمكنك زيارة المصدر الأصلي.</p>
        `;
      }

      if (article.url && article.url !== '#') {
        html += `
          <div class="mt-4 p-3" style="background: var(--off-white); border-radius: var(--radius-md); border-right: 4px solid var(--accent);">
            <strong style="color: var(--primary);">المصدر الأصلي:</strong>
            <a href="${article.url}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); margin-right: .5rem;">
              ${article.source} <i class="fas fa-external-link-alt" style="font-size: .75rem;"></i>
            </a>
          </div>`;
      }

      content.innerHTML = html;
    }

    this.initShareButtons(article);
  }

  static initShareButtons(article) {
    const shareUrl = article.url || window.location.href;
    const shareText = article.title;

    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.platform;
        let url = '';
        switch(platform) {
          case 'twitter': url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`; break;
          case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`; break;
          case 'whatsapp': url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`; break;
          case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`; break;
        }
        if (url) window.open(url, '_blank', 'width=600,height=400');
      });
    });
  }

  static async loadRelatedArticles(category) {
    const container = document.getElementById('related-articles');
    if (!container) return;

    try {
      const cat = CONFIG.CATEGORIES.find(c => c.id === category || c.query === category);
      const query = cat ? cat.query : 'technology';
      const articles = await ArticleService.fetchArticles(query, 4);

      container.innerHTML = articles.slice(0, 3).map((a, i) => {
        const encoded = UI.safeEncode(a);
        const safeTitle = UI.escapeHtml(a.title);
        const safeImage = UI.safeImageUrl(a.image, i);
        const safeDate = UI.escapeHtml(UI.formatDate(a.publishedAt));
        return `
          <div class="col-md-4 mb-3">
            <div class="article-card" onclick="App.openArticle('${encoded}')" role="button">
              <div class="article-card-img-wrapper" style="height: 160px;">
                <img src="${safeImage}" alt="${safeTitle}" class="article-card-img" loading="lazy"
                     onerror="UI.handleImageError(this, ${i})">
              </div>
              <div class="article-card-body">
                <h3 class="article-card-title" style="font-size: .95rem;">${safeTitle}</h3>
                <span class="article-card-date"><i class="far fa-clock"></i> ${safeDate}</span>
              </div>
            </div>
          </div>`;
      }).join('');

      setTimeout(() => UI.initAnimations(), 100);
    } catch (error) {
      console.error('Related articles error:', error);
    }
  }
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
  EncodingService.init();
  DataRepairService.repairStaticData();

  const currentPage = LayoutService.getCurrentPage();
  const isAuthPage = LayoutService.isAuthPage(currentPage);
  const isArticlePage = currentPage === 'article.html';

  if (!isAuthPage) {
    LayoutService.initGlobalLayout();
  }

  if (isArticlePage) {
    ArticlePage.init();
    return;
  }

  if (isAuthPage) {
    App.initNavbar();
    return;
  }

  App.init();
  if (document.querySelector('.fade-up')) {
    UI.initAnimations();
  }
});

