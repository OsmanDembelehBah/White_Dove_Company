/**
 * WHITE DOVE ELECTRICAL & ENGINEERING COMPANY
 * Unified Supabase Client & Real-time Cross-Dashboard Data Store
 * Freetown, Sierra Leone
 */

(function (global) {
  "use strict";

  // Storage Keys
  const DATA_KEY = "wd_data_v3";
  const USERS_KEY = "wd_users";
  const AUTH_MANAGER_KEY = "wd_manager_session";
  const AUTH_SELLER_KEY = "wd_seller_session";
  const BROADCAST_KEY = "wd_realtime_sync";
  const THEME_KEY = "wd_theme";
  const SUPABASE_URL_KEY = "supabase_url";
  const SUPABASE_KEY_KEY = "supabase_anon_key";

  // Complete 71-Product Catalog
  const DEFAULT_PRODUCTS = [
    { id: "p1", name: "1.5 mm² Cable", sku: "CBL-1.5", category: "Cables", price: 1600, stock: 25, minStock: 5, emoji: "🔌", description: "Pure copper flame retardant electrical building cable" },
    { id: "p2", name: "25 mm² Cable roll", sku: "CBL-25", category: "Cables", price: 2500, stock: 15, minStock: 3, emoji: "🔌", description: "Heavy duty power distribution cable roll" },
    { id: "p3", name: "5 meter Snake light", sku: "LGT-SNK5", category: "Lighting", price: 150, stock: 20, minStock: 5, emoji: "💡", description: "Flexible decorative LED strip snake light" },
    { id: "p4", name: "4 way Consumer unit", sku: "DB-4WAY", category: "Distribution", price: 550, stock: 8, minStock: 2, emoji: "🔧", description: "4-way metal enclosure distribution board" },
    { id: "p5", name: "6 way Consumer unit", sku: "DB-6WAY", category: "Distribution", price: 650, stock: 8, minStock: 2, emoji: "🔧", description: "6-way metal enclosure distribution board" },
    { id: "p6", name: "8 way Consumer unit", sku: "DB-8WAY", category: "Distribution", price: 750, stock: 8, minStock: 2, emoji: "🔧", description: "8-way metal enclosure distribution board" },
    { id: "p7", name: "3/3 Ivory box", sku: "BOX-33IV", category: "Boxes", price: 10, stock: 200, minStock: 20, emoji: "📦", description: "Standard square surface mount box" },
    { id: "p8", name: "3/6 Ivory box", sku: "BOX-36IV", category: "Boxes", price: 15, stock: 100, minStock: 10, emoji: "📦", description: "Double width surface mount box" },
    { id: "p9", name: "3/3 Emkay box PVC", sku: "BOX-33PVC", category: "Boxes", price: 15, stock: 400, minStock: 40, emoji: "📦", description: "Durable PVC conduit flush pattern box" },
    { id: "p10", name: "3/6 Emkay box PVC", sku: "BOX-36PVC", category: "Boxes", price: 20, stock: 200, minStock: 20, emoji: "📦", description: "Double width PVC flush mount enclosure box" },
    { id: "p11", name: "7 Watts Spotlight Blue", sku: "SPT-7B", category: "Lighting", price: 40, stock: 50, minStock: 5, emoji: "💡", description: "7W energy saving blue accent ceiling spotlight" },
    { id: "p12", name: "7 Watts Spotlight W/H", sku: "SPT-7WH", category: "Lighting", price: 40, stock: 50, minStock: 5, emoji: "💡", description: "7W warm/cool dual mode spotlight" },
    { id: "p13", name: "Batten lamp holder", sku: "HLD-BAT", category: "Lighting", price: 15, stock: 200, minStock: 20, emoji: "💡", description: "Standard B22/E27 straight batten fitting" },
    { id: "p14", name: "Angle lamp holder", sku: "HLD-ANG", category: "Lighting", price: 15, stock: 100, minStock: 10, emoji: "💡", description: "45 degree angled wall lamp holder" },
    { id: "p15", name: "Ceiling Rose lamp holder", sku: "HLD-ROSE", category: "Lighting", price: 30, stock: 60, minStock: 10, emoji: "💡", description: "Complete ceiling rose with pendant cord grip" },
    { id: "p16", name: "4 Way Extension", sku: "EXT-4W", category: "Extension", price: 170, stock: 12, minStock: 3, emoji: "🔌", description: "4-gang heavy duty surge protected extension cord" },
    { id: "p17", name: "5 Way Extension", sku: "EXT-5W", category: "Extension", price: 200, stock: 10, minStock: 3, emoji: "🔌", description: "5-gang surge protected multi-socket extension" },
    { id: "p18", name: "4 Way with USB", sku: "EXT-4WUSB", category: "Extension", price: 230, stock: 10, minStock: 3, emoji: "🔌", description: "4-gang power strip with dual fast charging USB ports" },
    { id: "p19", name: "5 meter Neon snake light", sku: "LGT-NEON5", category: "Lighting", price: 230, stock: 10, minStock: 2, emoji: "💡", description: "IP67 waterproof silicone neon flex strip" },
    { id: "p20", name: "16 mm x 2 core", sku: "CBL-162C", category: "Cables", price: 120, stock: 100, minStock: 15, emoji: "🔌", description: "16mm twin core armored power cable (per meter)" },
    { id: "p21", name: "25 mm x 2 core", sku: "CBL-252C", category: "Cables", price: 20, stock: 500, minStock: 50, emoji: "🔌", description: "25mm 2-core power cable line" },
    { id: "p22", name: "Long blade fan", sku: "FAN-LONG", category: "Fans", price: 600, stock: 8, minStock: 2, emoji: "🌀", description: "56 inch industrial ceiling fan with regulator" },
    { id: "p23", name: "Short blade fan", sku: "FAN-SHRT", category: "Fans", price: 550, stock: 10, minStock: 2, emoji: "🌀", description: "48 inch compact high-speed ceiling fan" },
    { id: "p24", name: "5 Watt bulbs", sku: "BLB-5W", category: "Lighting", price: 13, stock: 100, minStock: 20, emoji: "💡", description: "5W LED cool daylight energy saving bulb" },
    { id: "p25", name: "7 Watts bulbs", sku: "BLB-7W", category: "Lighting", price: 15, stock: 100, minStock: 20, emoji: "💡", description: "7W LED energy bulb" },
    { id: "p26", name: "9 Watts bulbs", sku: "BLB-9W", category: "Lighting", price: 17, stock: 100, minStock: 20, emoji: "💡", description: "9W LED energy bulb" },
    { id: "p27", name: "18 Watts bulbs", sku: "BLB-18W", category: "Lighting", price: 30, stock: 100, minStock: 20, emoji: "💡", description: "18W high lumen daylight bulb" },
    { id: "p28", name: "Double socket B.G", sku: "SOC-DBG", category: "Sockets", price: 50, stock: 50, minStock: 10, emoji: "🔌", description: "British General 13A 2-gang switched socket" },
    { id: "p29", name: "Single Socket B.G", sku: "SOC-SBG", category: "Sockets", price: 25, stock: 100, minStock: 15, emoji: "🔌", description: "British General 13A 1-gang switched socket" },
    { id: "p30", name: "3 gang Switch Original", sku: "SW-3GORG", category: "Switches", price: 40, stock: 60, minStock: 10, emoji: "🔘", description: "3-gang 2-way original wall light switch" },
    { id: "p31", name: "2 gang Switch Original", sku: "SW-2GORG", category: "Switches", price: 35, stock: 60, minStock: 10, emoji: "🔘", description: "2-gang 2-way original wall light switch" },
    { id: "p32", name: "1 gang Switch Original", sku: "SW-1GORG", category: "Switches", price: 30, stock: 60, minStock: 10, emoji: "🔘", description: "1-gang 2-way original wall light switch" },
    { id: "p33", name: "Double Socket", sku: "SOC-DBL", category: "Sockets", price: 70, stock: 35, minStock: 5, emoji: "🔌", description: "Heavy duty 13A dual power outlet" },
    { id: "p34", name: "Single Socket", sku: "SOC-SGL", category: "Sockets", price: 35, stock: 60, minStock: 10, emoji: "🔌", description: "Heavy duty 13A single power outlet" },
    { id: "p35", name: "A/C Switch Original", sku: "SW-ACORG", category: "Switches", price: 35, stock: 24, minStock: 5, emoji: "🔘", description: "20A/45A DP air conditioner switch with neon light" },
    { id: "p36", name: "Earth rod (Big)", sku: "EAR-BIG", category: "Earthing", price: 130, stock: 20, minStock: 5, emoji: "⛓️", description: "5/8 inch copper bonded earth electrode rod" },
    { id: "p37", name: "Double Socket Gold", sku: "SOC-DGLD", category: "Sockets", price: 120, stock: 15, minStock: 3, emoji: "✨", description: "Luxury brushed gold finish 2-gang socket" },
    { id: "p38", name: "Single Socket Gold", sku: "SOC-SGLD", category: "Sockets", price: 60, stock: 20, minStock: 3, emoji: "✨", description: "Luxury brushed gold finish 1-gang socket" },
    { id: "p39", name: "1 gang Switch Gold", sku: "SW-1GGLD", category: "Switches", price: 40, stock: 20, minStock: 3, emoji: "✨", description: "Luxury brushed gold 1-gang switch" },
    { id: "p40", name: "2 gang Switch Gold", sku: "SW-2GGLD", category: "Switches", price: 50, stock: 20, minStock: 3, emoji: "✨", description: "Luxury brushed gold 2-gang switch" },
    { id: "p41", name: "3 gang Switch Gold", sku: "SW-3GGLD", category: "Switches", price: 60, stock: 20, minStock: 3, emoji: "✨", description: "Luxury brushed gold 3-gang switch" },
    { id: "p42", name: "Double Socket Black", sku: "SOC-DBLK", category: "Sockets", price: 120, stock: 15, minStock: 3, emoji: "⚫", description: "Matte black modern 2-gang 13A socket" },
    { id: "p43", name: "Single Socket Black", sku: "SOC-SBLK", category: "Sockets", price: 60, stock: 20, minStock: 3, emoji: "⚫", description: "Matte black modern 1-gang 13A socket" },
    { id: "p44", name: "1 gang Switch Black", sku: "SW-1GBLK", category: "Switches", price: 35, stock: 20, minStock: 3, emoji: "⚫", description: "Matte black modern 1-gang wall switch" },
    { id: "p45", name: "2 gang Switch Black", sku: "SW-2GBLK", category: "Switches", price: 45, stock: 20, minStock: 3, emoji: "⚫", description: "Matte black modern 2-gang wall switch" },
    { id: "p46", name: "3 gang Switch Black", sku: "SW-3GBLK", category: "Switches", price: 60, stock: 20, minStock: 3, emoji: "⚫", description: "Matte black modern 3-gang wall switch" },
    { id: "p47", name: "Rechargeable bulbs", sku: "BLB-RCHG", category: "Lighting", price: 80, stock: 25, minStock: 5, emoji: "💡", description: "Emergency rechargeable battery backup LED bulb" },
    { id: "p48", name: "Isolating tape", sku: "ACC-TAPE", category: "Accessories", price: 10, stock: 200, minStock: 30, emoji: "📏", description: "High voltage PVC electrical insulating tape" },
    { id: "p49", name: "32A Knife changeover 2P", sku: "CHG-32A2P", category: "Distribution", price: 50, stock: 15, minStock: 3, emoji: "⚡", description: "32A double pole manual generator changeover switch" },
    { id: "p50", name: "100A Knife changeover 2P", sku: "CHG-100A2P", category: "Distribution", price: 100, stock: 10, minStock: 2, emoji: "⚡", description: "100A heavy duty double pole changeover" },
    { id: "p51", name: "63A Knife changeover 2P", sku: "CHG-63A2P", category: "Distribution", price: 70, stock: 10, minStock: 2, emoji: "⚡", description: "63A double pole changeover switch" },
    { id: "p52", name: "100A 3P Knife changeover", sku: "CHG-100A3P", category: "Distribution", price: 150, stock: 8, minStock: 2, emoji: "⚡", description: "100A triple pole 3-phase industrial changeover" },
    { id: "p53", name: "Single Circuit breaker 10A", sku: "MCB-10A", category: "Breakers", price: 30, stock: 25, minStock: 5, emoji: "⚡", description: "10A 1-pole miniature circuit breaker" },
    { id: "p54", name: "Single Circuit breaker 16A", sku: "MCB-16A", category: "Breakers", price: 30, stock: 25, minStock: 5, emoji: "⚡", description: "16A 1-pole miniature circuit breaker" },
    { id: "p55", name: "Single Circuit breaker 20A", sku: "MCB-20A", category: "Breakers", price: 30, stock: 25, minStock: 5, emoji: "⚡", description: "20A 1-pole miniature circuit breaker" },
    { id: "p56", name: "Single Circuit breaker 32A", sku: "MCB-32A", category: "Breakers", price: 30, stock: 25, minStock: 5, emoji: "⚡", description: "32A 1-pole miniature circuit breaker" },
    { id: "p57", name: "Single Circuit breaker 63A", sku: "MCB-63A", category: "Breakers", price: 30, stock: 25, minStock: 5, emoji: "⚡", description: "63A 1-pole miniature circuit breaker" },
    { id: "p58", name: "63A Breaker Double Pole", sku: "MCB-63A2P", category: "Breakers", price: 80, stock: 12, minStock: 3, emoji: "⚡", description: "63A double pole main circuit breaker" },
    { id: "p59", name: "1 gang switch B.G", sku: "SW-1GBG", category: "Switches", price: 15, stock: 50, minStock: 10, emoji: "🔘", description: "British General 1-gang light switch" },
    { id: "p60", name: "2 gang switch B.G", sku: "SW-2GBG", category: "Switches", price: 20, stock: 50, minStock: 10, emoji: "🔘", description: "British General 2-gang light switch" },
    { id: "p61", name: "Double USB socket", sku: "SOC-DUSB", category: "Sockets", price: 200, stock: 18, minStock: 4, emoji: "🔌", description: "Dual socket with built-in high-speed smart USB charger" },
    { id: "p62", name: "48W Panel white LED", sku: "PNL-48W", category: "Lighting", price: 180, stock: 15, minStock: 3, emoji: "💡", description: "600x600mm 48W ultra slim LED ceiling panel" },
    { id: "p63", name: "36W Panel white LED", sku: "PNL-36W", category: "Lighting", price: 100, stock: 15, minStock: 3, emoji: "💡", description: "36W high efficiency recessed LED ceiling panel" },
    { id: "p64", name: "24W Panel white LED", sku: "PNL-24W", category: "Lighting", price: 80, stock: 15, minStock: 3, emoji: "💡", description: "24W round/square recessed panel light" },
    { id: "p65", name: "18W Panel white LED", sku: "PNL-18W", category: "Lighting", price: 60, stock: 20, minStock: 4, emoji: "💡", description: "18W recessed LED ceiling light" },
    { id: "p66", name: "18W Remote light", sku: "LGT-18WRMT", category: "Lighting", price: 150, stock: 12, minStock: 3, emoji: "💡", description: "18W dimmable RGB LED fixture with remote control" },
    { id: "p67", name: "12W Remote light", sku: "LGT-12WRMT", category: "Lighting", price: 120, stock: 12, minStock: 3, emoji: "💡", description: "12W multi-color ceiling light with wireless remote" },
    { id: "p68", name: "6W Remote light", sku: "LGT-6WRMT", category: "Lighting", price: 100, stock: 12, minStock: 3, emoji: "💡", description: "6W smart ambient light with remote controller" },
    { id: "p69", name: "3/4 Trunking (White)", sku: "TRK-34", category: "Accessories", price: 40, stock: 35, minStock: 5, emoji: "📏", description: "Self-adhesive electrical cable wire trunking (3m)" },
    { id: "p70", name: "10 mm Cable clips", sku: "CLP-10MM", category: "Accessories", price: 25, stock: 30, minStock: 5, emoji: "📎", description: "10mm masonry cable clips pack with steel nails" },
    { id: "p71", name: "12 mm Cable clips", sku: "CLP-12MM", category: "Accessories", price: 30, stock: 30, minStock: 5, emoji: "📎", description: "12mm masonry cable clips pack with steel nails" }
  ];

  // Default User Profiles
  const DEFAULT_USERS = [
    {
      id: "u_sol",
      name: "White Dove Solutions",
      email: "Solutionswhitedoveelectrical@gmail.com",
      altEmails: ["solutions@whitedove.com", "seller@whitedove.com", "manager@whitedove.com", "admin@whitedove.com"],
      passwords: ["Whitedove2026"],
      role: "both", // Authorized for both Manager and Seller
      roles: ["manager", "seller"],
      title: "General Manager & Senior Sales Director",
      phone: "+232 75 862 299",
      avatar: "WD",
      created: new Date().toISOString()
    },
    {
      id: "u1",
      name: "Achmed Thoronka",
      email: "achmed@whitedove.com",
      altEmails: ["manager@whitedove.com", "admin@whitedove.com"],
      passwords: ["Manager@2024", "Whitedove2026", "admin123"],
      role: "manager",
      roles: ["manager"],
      title: "Chief Executive Officer",
      phone: "+232 79 419 105",
      avatar: "AT",
      created: new Date().toISOString()
    },
    {
      id: "u2",
      name: "Mariama Sesay",
      email: "mariama@whitedove.com",
      altEmails: ["operations@whitedove.com"],
      passwords: ["Manager@2024", "Whitedove2026", "admin123"],
      role: "manager",
      roles: ["manager"],
      title: "Operations Manager",
      phone: "+232 34 592 373",
      avatar: "MS",
      created: new Date().toISOString()
    },
    {
      id: "u4",
      name: "Mohamed Bangura",
      email: "mohamed@whitedove.com",
      altEmails: ["mohamed.seller@whitedove.com"],
      passwords: ["seller123", "Whitedove2026"],
      role: "seller",
      roles: ["seller"],
      title: "Sales Representative",
      phone: "+232 78 400 785",
      avatar: "MB",
      created: new Date().toISOString()
    },
    {
      id: "u5",
      name: "Sorie Kamara",
      email: "sorie@whitedove.com",
      altEmails: ["seller2@whitedove.com"],
      passwords: ["seller123", "Whitedove2026"],
      role: "seller",
      roles: ["seller"],
      title: "Sales Representative",
      phone: "+232 76 123 456",
      avatar: "SK",
      created: new Date().toISOString()
    }
  ];

  // Supabase Client Management
  let _supabaseClient = null;

  function getSupabaseCredentials() {
    return {
      url: localStorage.getItem(SUPABASE_URL_KEY) || "",
      key: localStorage.getItem(SUPABASE_KEY_KEY) || ""
    };
  }

  function setSupabaseCredentials(url, key) {
    if (url) localStorage.setItem(SUPABASE_URL_KEY, url.trim());
    else localStorage.removeItem(SUPABASE_URL_KEY);

    if (key) localStorage.setItem(SUPABASE_KEY_KEY, key.trim());
    else localStorage.removeItem(SUPABASE_KEY_KEY);

    _supabaseClient = null; // reset instance
    return initSupabase();
  }

  function initSupabase() {
    if (_supabaseClient) return _supabaseClient;
    const { url, key } = getSupabaseCredentials();
    if (url && key && window.supabase && typeof window.supabase.createClient === "function") {
      try {
        _supabaseClient = window.supabase.createClient(url, key, {
          auth: { persistSession: true, autoRefreshToken: true },
          realtime: { params: { eventsPerSecond: 10 } }
        });
        console.log("⚡ Supabase Client initialized successfully for:", url);
      } catch (err) {
        console.warn("Could not initialize Supabase client:", err);
        _supabaseClient = null;
      }
    }
    return _supabaseClient;
  }

  // Cross-Tab Broadcast Channel
  let _channel = null;
  function getBroadcastChannel() {
    if (!_channel && typeof BroadcastChannel !== "undefined") {
      try {
        _channel = new BroadcastChannel(BROADCAST_KEY);
      } catch (e) {
        console.warn("BroadcastChannel not supported", e);
      }
    }
    return _channel;
  }

  // Local Storage Data Get/Set
  function getStoredData() {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          return {
            products: parsed.products,
            sales: Array.isArray(parsed.sales) ? parsed.sales : []
          };
        }
      }
    } catch (e) {
      console.error("Error reading stored data", e);
    }
    // Return default initial data
    const initialData = { products: DEFAULT_PRODUCTS, sales: [] };
    saveData(initialData, false);
    return initialData;
  }

  function saveData(data, broadcast = true) {
    try {
      const payload = {
        products: Array.isArray(data.products) ? data.products : DEFAULT_PRODUCTS,
        sales: Array.isArray(data.sales) ? data.sales : [],
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(DATA_KEY, JSON.stringify(payload));

      if (broadcast) {
        broadcastMessage({
          type: "DATA_UPDATED",
          products: payload.products,
          sales: payload.sales
        });
      }
    } catch (e) {
      console.error("Error saving data", e);
    }
  }

  function broadcastMessage(message) {
    const ch = getBroadcastChannel();
    if (ch) {
      try {
        ch.postMessage(message);
      } catch (err) {
        console.warn("BroadcastChannel postMessage error", err);
      }
    }
    // Also trigger storage event for listeners in other tabs
    try {
      localStorage.setItem("wd_last_sync_event", JSON.stringify({ ...message, _t: Date.now() }));
    } catch (e) {}
  }

  function subscribeBroadcast(callback) {
    const ch = getBroadcastChannel();
    const handler = (e) => {
      if (e && e.data) callback(e.data);
    };
    if (ch) {
      ch.addEventListener("message", handler);
    }
    // Fallback on storage event
    const storageHandler = (e) => {
      if (e.key === "wd_last_sync_event" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          callback(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener("storage", storageHandler);

    return () => {
      if (ch) ch.removeEventListener("message", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }

  // User Accounts Management
  function getUsers() {
    let users = null;
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          users = parsed;
        }
      }
    } catch (e) {}

    if (!users) {
      users = [...DEFAULT_USERS];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return users;
    }

    // Ensure Solutionswhitedoveelectrical@gmail.com is present and granted both Manager and Seller privileges
    const solEmail = "solutionswhitedoveelectrical@gmail.com";
    const solIdx = users.findIndex(
      (u) =>
        (u.email && u.email.toLowerCase() === solEmail) ||
        (Array.isArray(u.altEmails) && u.altEmails.some((ae) => ae.toLowerCase() === solEmail))
    );

    if (solIdx >= 0) {
      const existing = users[solIdx];
      const existingPws = Array.isArray(existing.passwords)
        ? existing.passwords
        : existing.password
        ? [existing.password]
        : [];
      const updatedPws = Array.from(new Set([...existingPws, "Whitedove2026"]));
      users[solIdx] = {
        ...existing,
        name: existing.name || "White Dove Solutions",
        email: "Solutionswhitedoveelectrical@gmail.com",
        passwords: updatedPws,
        role: "both",
        roles: ["manager", "seller"],
        title: existing.title || "General Manager & Senior Sales Director",
        phone: existing.phone || "+232 75 862 299",
        avatar: existing.avatar || "WD"
      };
    } else {
      users.unshift({
        id: "u_sol",
        name: "White Dove Solutions",
        email: "Solutionswhitedoveelectrical@gmail.com",
        altEmails: ["solutions@whitedove.com", "seller@whitedove.com", "manager@whitedove.com", "admin@whitedove.com"],
        passwords: ["Whitedove2026"],
        role: "both",
        roles: ["manager", "seller"],
        title: "General Manager & Senior Sales Director",
        phone: "+232 75 862 299",
        avatar: "WD",
        created: new Date().toISOString()
      });
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users;
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      broadcastMessage({ type: "USERS_UPDATED", users });
    } catch (e) {}
  }

  // Unified Authenticate Helper
  function authenticate(email, password, requiredRole = null) {
    if (!email || typeof email !== "string" || !email.trim()) {
      return { success: false, message: "Access Denied: Please enter your email address." };
    }
    if (!password || typeof password !== "string" || !password.trim()) {
      return { success: false, message: "Access Denied: Please enter your password." };
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanPw = password.trim();

    const allUsers = getUsers();
    const user = allUsers.find((u) => {
      const mainMatch = u.email && u.email.toLowerCase() === cleanEmail;
      const altMatch = Array.isArray(u.altEmails) && u.altEmails.some((ae) => ae.toLowerCase() === cleanEmail);
      if (!mainMatch && !altMatch) return false;

      // Strict Password Verification
      if (u.password && u.password === cleanPw) return true;
      if (Array.isArray(u.passwords) && u.passwords.includes(cleanPw)) return true;
      return false;
    });

    if (!user) {
      return {
        success: false,
        message: "Access Denied: Invalid email or password. Unauthorized access is strictly prohibited."
      };
    }

    // Role check: supports dual role ("both", "all", "admin") or roles array containing requiredRole
    const hasRolePermission = (roleReq) => {
      if (!roleReq) return true;
      if (user.role === "both" || user.role === "admin" || user.role === "all") return true;
      if (user.role === roleReq) return true;
      if (Array.isArray(user.roles) && (user.roles.includes(roleReq) || user.roles.includes("both") || user.roles.includes("admin") || user.roles.includes("all"))) {
        return true;
      }
      return false;
    };

    if (requiredRole && !hasRolePermission(requiredRole)) {
      return {
        success: false,
        message: `Access Denied: Your account (${user.email}) does not have permission to access the ${requiredRole === "manager" ? "Manager Portal" : "Seller POS Terminal"}.`
      };
    }

    const effectiveRole = requiredRole || (user.role === "manager" || (Array.isArray(user.roles) && user.roles.includes("manager")) ? "manager" : "seller");

    let dynamicTitle = user.title;
    if (!dynamicTitle || dynamicTitle === "Manager" || dynamicTitle === "Seller") {
      if (user.role === "both" || (Array.isArray(user.roles) && user.roles.includes("manager") && user.roles.includes("seller"))) {
        dynamicTitle = effectiveRole === "manager" ? "General Manager" : "Senior POS Specialist";
      } else if (effectiveRole === "manager") {
        dynamicTitle = "Executive Manager";
      } else {
        dynamicTitle = "Sales Representative";
      }
    }

    const session = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userTitle: dynamicTitle,
      role: effectiveRole,
      avatar: user.avatar || user.name.slice(0, 2).toUpperCase(),
      loginTime: new Date().toISOString(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };

    // Store in appropriate keys
    if (effectiveRole === "manager") {
      sessionStorage.setItem(AUTH_MANAGER_KEY, JSON.stringify(session));
      localStorage.setItem(AUTH_MANAGER_KEY + "_remember", JSON.stringify(session));
      sessionStorage.setItem("userRole", "manager");
      sessionStorage.setItem("userName", user.name);
      sessionStorage.setItem("userEmail", user.email);
    } else {
      sessionStorage.setItem(AUTH_SELLER_KEY, JSON.stringify(session));
      localStorage.setItem(AUTH_SELLER_KEY + "_remember", JSON.stringify(session));
      sessionStorage.setItem("userRole", "seller");
      sessionStorage.setItem("userName", user.name);
      sessionStorage.setItem("userEmail", user.email);
    }

    return { success: true, user, session };
  }

  function getManagerSession() {
    try {
      const raw = sessionStorage.getItem(AUTH_MANAGER_KEY) || localStorage.getItem(AUTH_MANAGER_KEY + "_remember");
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (Date.now() > s.expiresAt) {
        clearManagerSession();
        return null;
      }
      return s;
    } catch {
      return null;
    }
  }

  function clearManagerSession() {
    sessionStorage.removeItem(AUTH_MANAGER_KEY);
    localStorage.removeItem(AUTH_MANAGER_KEY + "_remember");
    if (sessionStorage.getItem("userRole") === "manager") {
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("userEmail");
    }
  }

  function getSellerSession() {
    try {
      const raw = sessionStorage.getItem(AUTH_SELLER_KEY) || localStorage.getItem(AUTH_SELLER_KEY + "_remember");
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (Date.now() > s.expiresAt) {
        clearSellerSession();
        return null;
      }
      return s;
    } catch {
      return null;
    }
  }

  function clearSellerSession() {
    sessionStorage.removeItem(AUTH_SELLER_KEY);
    localStorage.removeItem(AUTH_SELLER_KEY + "_remember");
    if (sessionStorage.getItem("userRole") === "seller") {
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("userEmail");
    }
  }

  // ─── SUPABASE CLOUD SYNC OPERATIONS ─────────────────────────
  async function testSupabaseConnection(url, key) {
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      return { success: false, message: "Supabase JS library not loaded." };
    }
    try {
      const client = window.supabase.createClient(url, key);
      const { data, error } = await client.from("inventory").select("id").limit(1);
      if (error && error.code !== "PGRST116" && error.code !== "42P01") {
        return { success: false, message: error.message || "Connection error" };
      }
      return { success: true, message: "Connected to Supabase PostgreSQL database!" };
    } catch (err) {
      return { success: false, message: err.message || "Failed to connect to Supabase." };
    }
  }

  async function syncFromSupabase() {
    const client = initSupabase();
    if (!client) return null;

    try {
      const [invRes, salesRes] = await Promise.all([
        client.from("inventory").select("*").order("product_name", { ascending: true }),
        client.from("sales").select("*").order("sold_at", { ascending: false }).limit(200)
      ]);

      let updatedProducts = null;
      if (invRes.data && invRes.data.length > 0) {
        updatedProducts = invRes.data.map((row) => ({
          id: row.id,
          name: row.product_name || row.name,
          sku: row.sku || `SKU-${row.id.toString().slice(0, 6)}`,
          category: row.category || "Other",
          price: Number(row.unit_price || row.price || 0),
          stock: Number(row.stock_quantity ?? row.stock ?? 0),
          minStock: Number(row.low_stock_threshold ?? row.minStock ?? 5),
          description: row.description || "",
          emoji: row.emoji || "📦"
        }));
      }

      let updatedSales = null;
      if (salesRes.data && salesRes.data.length > 0) {
        updatedSales = salesRes.data.map((row) => ({
          id: row.id,
          receiptNo: row.receipt_no || `WD-${row.id.toString().slice(-4)}`,
          sellerName: row.seller_name || "Sales Rep",
          sellerEmail: row.seller_email || "",
          items: [
            {
              productId: row.product_id,
              name: row.product_name,
              qty: row.quantity_sold || 1,
              unitPrice: Number(row.rate_per_unit || row.total_price),
              total: Number(row.total_price || 0)
            }
          ],
          total: Number(row.total_price || 0),
          payment: row.payment_method || "Cash",
          customer: row.customer_name || "Walk-in Customer",
          customerPhone: row.customer_phone || "N/A",
          timestamp: row.sold_at || new Date().toISOString()
        }));
      }

      if (updatedProducts || updatedSales) {
        const current = getStoredData();
        const nextData = {
          products: updatedProducts || current.products,
          sales: updatedSales || current.sales
        };
        saveData(nextData, true);
        return nextData;
      }
    } catch (e) {
      console.warn("Supabase sync failed (offline or network error):", e);
    }
    return null;
  }

  async function pushProductToSupabase(product) {
    const client = initSupabase();
    if (!client) return;

    try {
      const payload = {
        id: product.id,
        product_name: product.name,
        sku: product.sku || null,
        category: product.category || "Other",
        stock_quantity: Number(product.stock || 0),
        unit_price: Number(product.price || 0),
        low_stock_threshold: Number(product.minStock || 5),
        description: product.description || ""
      };
      await client.from("inventory").upsert(payload, { onConflict: "id" });
    } catch (e) {
      console.warn("Error pushing product to Supabase:", e);
    }
  }

  async function deleteProductFromSupabase(productId) {
    const client = initSupabase();
    if (!client) return;
    try {
      await client.from("inventory").delete().eq("id", productId);
    } catch (e) {
      console.warn("Error deleting product from Supabase:", e);
    }
  }

  async function pushSaleToSupabase(sale) {
    const client = initSupabase();
    if (!client) return;

    try {
      const rows = (sale.items || []).map((item) => ({
        seller_name: sale.sellerName || "Sales Rep",
        product_id: item.productId && !item.productId.startsWith("p") ? item.productId : null,
        product_name: item.name,
        quantity_sold: Number(item.qty || 1),
        rate_per_unit: Number(item.unitPrice || 0),
        total_price: Number(item.total || (item.unitPrice * item.qty)),
        customer_name: sale.customer || "Walk-in Customer",
        payment_method: sale.payment || "Cash",
        sold_at: sale.timestamp || new Date().toISOString()
      }));

      if (rows.length > 0) {
        await client.from("sales").insert(rows);
      }
    } catch (e) {
      console.warn("Error pushing sale to Supabase:", e);
    }
  }

  function setupSupabaseRealtime(onSaleReceived, onInventoryUpdated) {
    const client = initSupabase();
    if (!client) return () => {};

    try {
      const channel = client
        .channel("whitedove-realtime")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "sales" }, (payload) => {
          if (onSaleReceived && payload.new) {
            onSaleReceived(payload.new);
          }
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, (payload) => {
          if (onInventoryUpdated && payload.new) {
            onInventoryUpdated(payload);
          }
        })
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } catch (e) {
      console.warn("Realtime subscription setup failed:", e);
      return () => {};
    }
  }

  // Format Currency
  const fmt = (n) =>
    `SLE ${Number(n || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  // Export Store to global scope
  const WD_STORE = {
    DEFAULT_PRODUCTS,
    DEFAULT_USERS,
    DATA_KEY,
    USERS_KEY,
    AUTH_MANAGER_KEY,
    AUTH_SELLER_KEY,
    BROADCAST_KEY,
    THEME_KEY,
    fmt,
    getStoredData,
    saveData,
    getUsers,
    saveUsers,
    authenticate,
    getManagerSession,
    clearManagerSession,
    getSellerSession,
    clearSellerSession,
    broadcastMessage,
    subscribeBroadcast,
    getSupabaseCredentials,
    setSupabaseCredentials,
    initSupabase,
    testSupabaseConnection,
    syncFromSupabase,
    pushProductToSupabase,
    deleteProductFromSupabase,
    pushSaleToSupabase,
    setupSupabaseRealtime
  };

  global.WD_STORE = WD_STORE;

  // Auto-init on script load
  initSupabase();
})(typeof window !== "undefined" ? window : this);
