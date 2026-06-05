import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';

// ── Theme ────────────────────────────────────
const T = {
  primary: '#FF5722',
  secondary: '#1A237E',
  green: '#10b981',
  danger: '#ef4444',
  bg: '#F5F5F5',
  white: '#FFFFFF',
  text: '#1a1a1a',
  muted: '#888888',
  border: '#E5E5E5',
  card: '#FFFFFF',
};

// ── UID Generator ─────────────────────────────
const generateUID = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `BZR-${num}`;
};

// ── Icon Helper ───────────────────────────────
const Icon = ({ name, size = 24, color = T.primary, style }) => {
  const ICON_MAP = {
    home: 'home', discover: 'explore', search: 'search',
    cart: 'shopping-cart', favourite: 'favorite', profile: 'account-circle',
    store: 'store', back: 'arrow-back', forward: 'arrow-forward',
    add: 'add', remove: 'remove', filter: 'filter-list',
    qr: 'qr-code-scanner', pending: 'pending', accepted: 'check-circle',
    rejected: 'cancel', location: 'location-pin', grocery: 'local-grocery-store',
    medical: 'local-hospital', electronics: 'bolt', clothing: 'checkroom',
    food: 'fastfood', vegetables: 'eco', star: 'star', logout: 'logout',
    orders: 'receipt-long', dashboard: 'dashboard', products: 'inventory',
    info: 'info', review: 'rate-review', verified: 'verified', phone: 'phone',
    category: 'category', deals: 'local-offer', compare: 'compare-arrows',
    whatsapp: 'chat', call: 'call', qrcode: 'qr-code-2',
  };
  const iconName = ICON_MAP[name];
  if (!iconName) {
    return (
      <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center' }, style]}>
        <Text style={{ color: '#fff', fontSize: size * 0.4, fontWeight: '800' }}>!</Text>
      </View>
    );
  }
  return <MaterialIcons name={iconName} size={size} color={color} style={style} />;
};

// ── Mock Data ─────────────────────────────────
const MOCK_SHOPS = [
  {
    id: '1', uid: 'BZR-1001', shopName: 'Sharma General Store',
    shopCategory: 'Grocery', shopAddress: 'Main Market, Block A',
    phone: '9876543210', isOpen: true, rating: 4.3, reviews: 128, isVerified: true,
    products: [
      { id: 'p1', name: 'Amul Milk 500ml', price: 32, unit: '500ml', inStock: true },
      { id: 'p2', name: 'Britannia Bread', price: 45, unit: '400g', inStock: true },
      { id: 'p3', name: 'Tata Salt 1kg', price: 22, unit: '1kg', inStock: true },
      { id: 'p4', name: 'Fortune Oil 1L', price: 145, unit: '1L', inStock: false },
    ],
    deals: [{ id: 'd1', title: '10% off on Milk', desc: 'Today only' }],
  },
  {
    id: '2', uid: 'BZR-1002', shopName: 'City Medical Store',
    shopCategory: 'Medical', shopAddress: 'Hospital Road',
    phone: '9876543211', isOpen: true, rating: 4.1, reviews: 89, isVerified: true,
    products: [
      { id: 'p5', name: 'Paracetamol 500mg', price: 15, unit: '10 tabs', inStock: true },
      { id: 'p6', name: 'Band-Aid Box', price: 45, unit: '1 box', inStock: true },
      { id: 'p7', name: 'Dettol 200ml', price: 85, unit: '200ml', inStock: false },
    ],
    deals: [],
  },
  {
    id: '3', uid: 'BZR-1003', shopName: 'Raju Electronics',
    shopCategory: 'Electronics', shopAddress: 'Station Road',
    phone: '9876543212', isOpen: false, rating: 4.5, reviews: 210, isVerified: false,
    products: [
      { id: 'p8', name: 'USB Cable Type-C', price: 120, unit: '1 piece', inStock: true },
      { id: 'p9', name: 'Earphones', price: 299, unit: '1 piece', inStock: true },
    ],
    deals: [{ id: 'd2', title: 'Buy 2 Get 1 Free on Cables', desc: 'This week' }],
  },
  {
    id: '4', uid: 'BZR-1004', shopName: 'Fresh Vegetables',
    shopCategory: 'Vegetables', shopAddress: 'Sabzi Mandi',
    phone: '9876543213', isOpen: true, rating: 4.0, reviews: 67, isVerified: false,
    products: [
      { id: 'p10', name: 'Tomatoes', price: 30, unit: '1kg', inStock: true },
      { id: 'p11', name: 'Potatoes', price: 25, unit: '1kg', inStock: true },
      { id: 'p12', name: 'Onions', price: 35, unit: '1kg', inStock: true },
    ],
    deals: [],
  },
];

const CATEGORY_ICONS = {
  Grocery: 'grocery', Medical: 'medical', Electronics: 'electronics',
  Clothing: 'clothing', Food: 'food', Vegetables: 'vegetables',
};

// ── Main App ──────────────────────────────────
export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold,
  });

  const [screen, setScreen] = useState('welcome');
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopCategory, setShopCategory] = useState('');
  const [shopAddress, setShopAddress] = useState('');

  const F = {
    regular: fontsLoaded ? 'Poppins_400Regular' : 'System',
    semiBold: fontsLoaded ? 'Poppins_600SemiBold' : 'System',
    bold: fontsLoaded ? 'Poppins_700Bold' : 'System',
    extraBold: fontsLoaded ? 'Poppins_800ExtraBold' : 'System',
  };

  const sendOtp = () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter 10 digit number');
      return;
    }
    setOtpSent(true);
    Alert.alert('OTP Sent!', 'Demo OTP: 1234');
  };

  const verifyOtp = () => {
    if (otp !== '1234') {
      Alert.alert('Invalid OTP', 'Demo OTP: 1234');
      return;
    }
    if (role === 'customer') {
      setUser({ id: 'c1', name, phone, area, role: 'customer' });
      setScreen('customerHome');
    } else {
      setUser({
        id: 'v1', name, phone, shopName, shopCategory,
        shopAddress, role: 'vendor', isOpen: true,
        uid: generateUID(), isVerified: false,
      });
      setScreen('vendorHome');
    }
  };

  const logout = () => {
    setUser(null); setScreen('welcome'); setPhone(''); setOtp('');
    setOtpSent(false); setName(''); setArea('');
    setShopName(''); setShopCategory(''); setShopAddress('');
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: T.primary }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  // ── WELCOME ──────────────────────────────────
  if (screen === 'welcome') {
    return (
      <View style={styles.welcomeBg}>
        <View style={styles.welcomeTop}>
          <View style={styles.welcomeLogoBox}>
            <Icon name="store" size={48} color="#fff" />
          </View>
          <Text style={[styles.welcomeTitle, { fontFamily: F.extraBold }]}>BAZAAR</Text>
          <Text style={[styles.welcomeSub, { fontFamily: F.regular }]}>Nearby Shops & Local Market</Text>
        </View>
        <View style={styles.welcomeButtons}>
          <TouchableOpacity style={styles.customerBtn} onPress={() => { setRole('customer'); setScreen('login'); }}>
            <Icon name="cart" size={36} color={T.primary} />
            <Text style={[styles.customerBtnText, { fontFamily: F.bold }]}>I am a Customer</Text>
            <Text style={[styles.btnSub, { fontFamily: F.regular, color: T.muted }]}>Browse shops & place orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.vendorBtn} onPress={() => { setRole('vendor'); setScreen('login'); }}>
            <Icon name="store" size={36} color="#fff" />
            <Text style={[styles.vendorBtnText, { fontFamily: F.bold }]}>I have a Shop</Text>
            <Text style={[styles.btnSub, { fontFamily: F.regular, color: 'rgba(255,255,255,0.8)' }]}>Register & manage your store</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── LOGIN ────────────────────────────────────
  if (screen === 'login') {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg }}>
        <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
          <TouchableOpacity onPress={() => { setScreen('welcome'); setOtpSent(false); }}>
            <Icon name="back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: F.bold }]}>
            {role === 'customer' ? 'Customer Login' : 'Shopkeeper Login'}
          </Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {!otpSent ? (
            <>
              <Text style={[styles.label, { fontFamily: F.semiBold }]}>Phone Number</Text>
              <TextInput style={[styles.input, { fontFamily: F.regular }]} placeholder="10 digit number" keyboardType="numeric" maxLength={10} value={phone} onChangeText={setPhone} />
              <Text style={[styles.label, { fontFamily: F.semiBold }]}>Your Name</Text>
              <TextInput style={[styles.input, { fontFamily: F.regular }]} placeholder="Enter your name" value={name} onChangeText={setName} />
              {role === 'customer' && (
                <>
                  <Text style={[styles.label, { fontFamily: F.semiBold }]}>Your Area</Text>
                  <TextInput style={[styles.input, { fontFamily: F.regular }]} placeholder="E.g. Laxmi Nagar, Delhi" value={area} onChangeText={setArea} />
                </>
              )}
              {role === 'vendor' && (
                <>
                  <Text style={[styles.label, { fontFamily: F.semiBold }]}>Shop Name</Text>
                  <TextInput style={[styles.input, { fontFamily: F.regular }]} placeholder="E.g. Sharma General Store" value={shopName} onChangeText={setShopName} />
                  <Text style={[styles.label, { fontFamily: F.semiBold }]}>Category</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                    {['Grocery', 'Medical', 'Electronics', 'Clothing', 'Food', 'Vegetables'].map(cat => (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.catChip, shopCategory === cat && { backgroundColor: T.primary, borderColor: T.primary }]}
                        onPress={() => setShopCategory(cat)}
                      >
                        <Icon name={CATEGORY_ICONS[cat] || 'store'} size={16} color={shopCategory === cat ? '#fff' : T.muted} />
                        <Text style={[{ fontSize: 13, fontFamily: F.semiBold }, shopCategory === cat && { color: '#fff' }]}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <Text style={[styles.label, { fontFamily: F.semiBold }]}>Shop Address</Text>
                  <TextInput style={[styles.input, { fontFamily: F.regular }]} placeholder="Full address" value={shopAddress} onChangeText={setShopAddress} />
                </>
              )}
              <TouchableOpacity style={styles.primaryBtn} onPress={sendOtp}>
                <Text style={[styles.primaryBtnText, { fontFamily: F.bold }]}>Send OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.label, { fontFamily: F.semiBold }]}>Enter OTP</Text>
              <Text style={{ color: T.muted, fontSize: 12, marginBottom: 8, fontFamily: F.regular }}>Demo OTP: 1234</Text>
              <TextInput style={[styles.input, { fontFamily: F.regular }]} placeholder="4 digit OTP" keyboardType="numeric" maxLength={4} value={otp} onChangeText={setOtp} />
              <TouchableOpacity style={styles.primaryBtn} onPress={verifyOtp}>
                <Text style={[styles.primaryBtnText, { fontFamily: F.bold }]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOtpSent(false)} style={{ alignItems: 'center', marginTop: 16 }}>
                <Text style={{ color: T.primary, fontFamily: F.semiBold }}>Change Phone Number</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  if (screen === 'customerHome') return <CustomerApp user={user} onLogout={logout} F={F} />;
  if (screen === 'vendorHome') return <VendorApp user={user} onLogout={logout} F={F} />;
  return null;
}

// ── CUSTOMER APP ──────────────────────────────
function CustomerApp({ user, onLogout, F }) {
  const [tab, setTab] = useState('home');
  const [selectedShop, setSelectedShop] = useState(null);
  const [cart, setCart] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shopTab, setShopTab] = useState('ratelist');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const addToCart = (p) => {
    const ex = cart.find(i => i.id === p.id);
    if (ex) setCart(cart.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
    else setCart([...cart, { ...p, qty: 1 }]);
  };

  const removeFromCart = (id) => {
    const ex = cart.find(i => i.id === id);
    if (ex?.qty === 1) setCart(cart.filter(i => i.id !== id));
    else setCart(cart.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i));
  };

  const placeOrder = (method) => {
    const order = {
      id: Date.now().toString(),
      shopName: selectedShop.shopName,
      shopId: selectedShop.id,
      items: [...cart],
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
      paymentMethod: method,
      status: 'pending',
      time: new Date().toLocaleTimeString(),
    };
    setOrders([...orders, order]);
    setCart([]);
    setSelectedShop(null);
    Alert.alert('Order Placed!', 'Your order has been sent to the shopkeeper.');
    setTab('orders');
  };

  const toggleFav = (shop) => {
    if (favourites.find(f => f.id === shop.id)) setFavourites(favourites.filter(f => f.id !== shop.id));
    else setFavourites([...favourites, shop]);
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const categories = ['All', 'Grocery', 'Medical', 'Electronics', 'Clothing', 'Food', 'Vegetables'];

  const filtered = MOCK_SHOPS.filter(s => {
    const matchSearch = s.shopName.toLowerCase().includes(search.toLowerCase()) || s.shopCategory.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || s.shopCategory === activeCategory;
    return matchSearch && matchCat;
  });

  // ── Shop Screen ───────────────────────────────
  if (selectedShop) {
    const isFav = favourites.find(f => f.id === selectedShop.id);
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: 44 }]}>
          <TouchableOpacity onPress={() => { setSelectedShop(null); setShopTab('ratelist'); }} style={{ marginRight: 12 }}>
            <Icon name="back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.headerTitle, { fontFamily: F.bold }]}>{selectedShop.shopName}</Text>
              {selectedShop.isVerified && (
                <View style={{ backgroundColor: '#1a90ff', borderRadius: 10, padding: 2 }}>
                  <Icon name="verified" size={16} color="#fff" />
                </View>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: F.regular }}>
                {selectedShop.uid} · ⭐ {selectedShop.rating} ({selectedShop.reviews}) · {selectedShop.isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => toggleFav(selectedShop)}>
            <Icon name="favourite" size={28} color={isFav ? '#FFD700' : 'rgba(255,255,255,0.6)'} />
          </TouchableOpacity>
        </View>

        {/* Status bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: selectedShop.isOpen ? '#e8f5e9' : '#ffebee', paddingHorizontal: 16, paddingVertical: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: selectedShop.isOpen ? T.green : T.danger }} />
            <Text style={{ fontSize: 13, fontFamily: F.semiBold, color: selectedShop.isOpen ? T.green : T.danger }}>
              {selectedShop.isOpen ? 'Currently Open' : 'Currently Closed'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="location" size={14} color={T.muted} />
            <Text style={{ fontSize: 12, color: T.muted, fontFamily: F.regular }}>{selectedShop.shopAddress}</Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: T.white, borderBottomWidth: 1, borderBottomColor: T.border, maxHeight: 48 }}>
          {[['ratelist', 'Rate List', 'products'], ['orders', 'Order', 'cart'], ['compare', 'Compare', 'compare'], ['deals', 'Deals', 'deals'], ['reviews', 'Reviews', 'review'], ['info', 'Info', 'info'], ['qr', 'QR Code', 'qrcode']].map(([k, l, icon]) => (
            <TouchableOpacity key={k} style={[styles.shopTab, shopTab === k && styles.shopTabActive]} onPress={() => setShopTab(k)}>
              <Icon name={icon} size={16} color={shopTab === k ? T.primary : T.muted} />
              <Text style={[styles.shopTabText, { fontFamily: F.semiBold }, shopTab === k && { color: T.primary }]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>

          {/* Rate List */}
          {shopTab === 'ratelist' && (
            selectedShop.products.length === 0 ? (
              <View style={styles.empty}>
                <Icon name="products" size={48} color={T.border} />
                <Text style={[styles.emptyText, { fontFamily: F.semiBold }]}>No products yet</Text>
              </View>
            ) : selectedShop.products.map(p => (
              <View key={p.id} style={[styles.productCard, !p.inStock && { opacity: 0.5 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.productName, { fontFamily: F.semiBold }]}>{p.name}</Text>
                  <Text style={{ fontSize: 12, color: T.muted, fontFamily: F.regular }}>{p.unit}</Text>
                  {!p.inStock && <Text style={{ fontSize: 11, color: T.danger, fontFamily: F.semiBold }}>Out of Stock</Text>}
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <Text style={[styles.productPrice, { fontFamily: F.bold }]}>₹{p.price}</Text>
                  {p.inStock && (cart.find(i => i.id === p.id) ? (
                    <View style={styles.stepper}>
                      <TouchableOpacity style={styles.stepBtn} onPress={() => removeFromCart(p.id)}>
                        <Icon name="remove" size={18} color="#fff" />
                      </TouchableOpacity>
                      <Text style={[{ fontSize: 15, minWidth: 24, textAlign: 'center' }, { fontFamily: F.bold }]}>
                        {cart.find(i => i.id === p.id)?.qty}
                      </Text>
                      <TouchableOpacity style={styles.stepBtn} onPress={() => addToCart(p)}>
                        <Icon name="add" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(p)}>
                      <Icon name="add" size={16} color="#fff" />
                      <Text style={[styles.addBtnText, { fontFamily: F.bold }]}>Add</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          )}

          {/* Order Tab */}
          {shopTab === 'orders' && (
            cart.length === 0 ? (
              <View style={styles.empty}>
                <Icon name="cart" size={48} color={T.border} />
                <Text style={[styles.emptyText, { fontFamily: F.semiBold }]}>Cart is empty</Text>
                <Text style={{ color: T.muted, fontSize: 13, fontFamily: F.regular }}>Add items from Rate List</Text>
              </View>
            ) : (
              <View style={{ padding: 12 }}>
                {cart.map(i => (
                  <View key={i.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: T.white, borderRadius: 8, marginBottom: 6 }}>
                    <Text style={{ fontFamily: F.regular }}>{i.name} × {i.qty}</Text>
                    <Text style={{ color: T.green, fontWeight: '700', fontFamily: F.bold }}>₹{i.price * i.qty}</Text>
                  </View>
                ))}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: T.white, borderRadius: 10, marginTop: 8, borderWidth: 1, borderColor: T.border }}>
                  <Text style={{ fontSize: 16, fontFamily: F.bold }}>Total</Text>
                  <Text style={{ fontSize: 18, fontFamily: F.extraBold, color: T.primary }}>₹{cartTotal}</Text>
                </View>
                <Text style={{ fontSize: 14, fontFamily: F.bold, marginTop: 16, marginBottom: 8 }}>Select Payment Method</Text>
                <TouchableOpacity style={[styles.primaryBtn, { flexDirection: 'row', gap: 8 }]} onPress={() => placeOrder('cash')}>
                  <Icon name="store" size={20} color="#fff" />
                  <Text style={[styles.primaryBtnText, { fontFamily: F.bold }]}>Cash on Pickup</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: T.secondary, marginTop: 8, flexDirection: 'row', gap: 8 }]} onPress={() => placeOrder('upi')}>
                  <Icon name="phone" size={20} color="#fff" />
                  <Text style={[styles.primaryBtnText, { fontFamily: F.bold }]}>Pay via UPI</Text>
                </TouchableOpacity>
              </View>
            )
          )}

          {/* Compare Tab */}
          {shopTab === 'compare' && (
            <View style={{ padding: 12 }}>
              <Text style={[styles.sectionTitle, { fontFamily: F.bold }]}>Price Comparison</Text>
              <Text style={{ color: T.muted, fontSize: 13, fontFamily: F.regular, marginBottom: 12 }}>Same items across nearby shops</Text>
              {selectedShop.products.map(p => {
                const comparisons = MOCK_SHOPS.flatMap(s =>
                  s.products.filter(sp => sp.name === p.name).map(sp => ({ ...sp, shopName: s.shopName, shopId: s.id }))
                );
                if (comparisons.length <= 1) return null;
                const cheapest = Math.min(...comparisons.map(c => c.price));
                return (
                  <View key={p.id} style={[styles.shopCard, { marginBottom: 12 }]}>
                    <Text style={[styles.shopName, { fontFamily: F.bold, marginBottom: 8 }]}>{p.name}</Text>
                    {comparisons.map(c => (
                      <View key={c.shopId} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: T.border }}>
                        <Text style={{ fontFamily: F.regular, fontSize: 13 }}>{c.shopName}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[{ fontFamily: F.bold, fontSize: 14 }, c.price === cheapest && { color: T.green }]}>₹{c.price}</Text>
                          {c.price === cheapest && (
                            <View style={{ backgroundColor: T.green, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                              <Text style={{ color: '#fff', fontSize: 10, fontFamily: F.bold }}>Best</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          )}

          {/* Deals Tab */}
          {shopTab === 'deals' && (
            <View style={{ padding: 12 }}>
              <Text style={[styles.sectionTitle, { fontFamily: F.bold }]}>Deals & Offers</Text>
              {selectedShop.deals.length === 0 ? (
                <View style={styles.empty}>
                  <Icon name="deals" size={48} color={T.border} />
                  <Text style={[styles.emptyText, { fontFamily: F.semiBold }]}>No deals right now</Text>
                </View>
              ) : selectedShop.deals.map(d => (
                <View key={d.id} style={[styles.shopCard, { borderLeftWidth: 4, borderLeftColor: T.primary }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Icon name="deals" size={20} color={T.primary} />
                    <Text style={[styles.shopName, { fontFamily: F.bold }]}>{d.title}</Text>
                  </View>
                  <Text style={{ color: T.muted, fontSize: 13, fontFamily: F.regular }}>{d.desc}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Reviews Tab */}
          {shopTab === 'reviews' && (
            <View style={{ padding: 12 }}>
              <View style={[styles.shopCard, { alignItems: 'center', marginBottom: 12 }]}>
                <Text style={{ fontSize: 48, fontFamily: F.extraBold, color: T.primary }}>{selectedShop.rating}</Text>
                <View style={{ flexDirection: 'row', gap: 4, marginVertical: 8 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Icon key={s} name="star" size={20} color={s <= Math.floor(selectedShop.rating) ? '#FFD700' : T.border} />
                  ))}
                </View>
                <Text style={{ color: T.muted, fontFamily: F.regular }}>{selectedShop.reviews} reviews</Text>
              </View>
              <View style={styles.empty}>
                <Icon name="review" size={48} color={T.border} />
                <Text style={[styles.emptyText, { fontFamily: F.semiBold }]}>Reviews coming soon</Text>
              </View>
            </View>
          )}

          {/* Info Tab */}
          {shopTab === 'info' && (
            <View style={{ padding: 12, gap: 8 }}>
              {/* Call & WhatsApp buttons */}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
                <TouchableOpacity style={[styles.primaryBtn, { flex: 1, marginHorizontal: 0, backgroundColor: T.green, flexDirection: 'row', gap: 6 }]}>
                  <Icon name="call" size={18} color="#fff" />
                  <Text style={[styles.primaryBtnText, { fontFamily: F.bold, fontSize: 14 }]}>Call Shop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.primaryBtn, { flex: 1, marginHorizontal: 0, backgroundColor: '#25D366', flexDirection: 'row', gap: 6 }]}>
                  <Icon name="whatsapp" size={18} color="#fff" />
                  <Text style={[styles.primaryBtnText, { fontFamily: F.bold, fontSize: 14 }]}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
              {[['location', 'Address', selectedShop.shopAddress], ['phone', 'Phone', selectedShop.phone], ['category', 'Category', selectedShop.shopCategory], ['store', 'Status', selectedShop.isOpen ? 'Open Now' : 'Closed'], ['qrcode', 'Shop ID', selectedShop.uid]].map(([icon, l, v]) => (
                <View key={l} style={[styles.shopCard, { flexDirection: 'row', gap: 12, alignItems: 'center' }]}>
                  <Icon name={icon} size={22} color={T.primary} />
                  <View>
                    <Text style={{ fontSize: 12, color: T.muted, fontFamily: F.regular }}>{l}</Text>
                    <Text style={{ fontSize: 14, fontFamily: F.semiBold }}>{v}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* QR Code Tab */}
          {shopTab === 'qr' && (
            <View style={{ padding: 20, alignItems: 'center', gap: 16 }}>
              <Text style={[styles.sectionTitle, { fontFamily: F.bold, textAlign: 'center' }]}>Shop QR Code</Text>
              <Text style={{ color: T.muted, fontSize: 13, fontFamily: F.regular, textAlign: 'center' }}>
                Scan to visit this shop's profile on Bazaar
              </Text>
              <View style={{ backgroundColor: T.white, padding: 16, borderRadius: 16, elevation: 4, alignItems: 'center', gap: 12 }}>
                <Image
                  source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedShop.uid}&bgcolor=ffffff&color=1A237E&qzone=2` }}
                  style={{ width: 200, height: 200, borderRadius: 8 }}
                />
                <Text style={[{ fontSize: 18, fontFamily: F.extraBold, color: T.secondary, letterSpacing: 2 }]}>
                  {selectedShop.uid}
                </Text>
                {selectedShop.isVerified && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e8f4ff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Icon name="verified" size={18} color="#1a90ff" />
                    <Text style={{ color: '#1a90ff', fontFamily: F.bold, fontSize: 13 }}>Verified Shop</Text>
                  </View>
                )}
              </View>
              <Text style={{ color: T.muted, fontSize: 12, fontFamily: F.regular, textAlign: 'center' }}>
                Share this QR code with your customers so they can find your shop instantly on Bazaar
              </Text>
            </View>
          )}
        </ScrollView>

        {cartCount > 0 && (
          <TouchableOpacity style={styles.cartFloat} onPress={() => setShopTab('orders')}>
            <Icon name="cart" size={20} color="#fff" />
            <Text style={[{ color: '#fff', fontSize: 15, fontFamily: F.bold }]}>{cartCount} items · ₹{cartTotal}</Text>
            <Icon name="forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // ── Customer Home Tabs ────────────────────────
  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>

        {tab === 'home' && (
          <View>
            <View style={styles.header}>
              <View>
                <Text style={[styles.headerTitle, { fontFamily: F.extraBold }]}>BAZAAR</Text>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: F.regular }}>
                  Welcome, {user.name || 'Guest'}!
                </Text>
              </View>
              <TouchableOpacity onPress={() => setTab('profile')}>
                <Icon name="profile" size={32} color="rgba(255,255,255,0.9)" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Icon name="search" size={20} color={T.muted} />
              <TextInput
                style={[{ flex: 1, fontSize: 14, fontFamily: F.regular }]}
                placeholder="Search shops or items..."
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Icon name="rejected" size={20} color={T.muted} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 12, marginBottom: 8 }}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, activeCategory === cat && { backgroundColor: T.primary, borderColor: T.primary }]}
                  onPress={() => setActiveCategory(cat)}
                >
                  {cat !== 'All' && <Icon name={CATEGORY_ICONS[cat] || 'store'} size={16} color={activeCategory === cat ? '#fff' : T.muted} />}
                  <Text style={[{ fontSize: 13, fontFamily: F.semiBold, color: activeCategory === cat ? '#fff' : T.text }]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {MOCK_SHOPS.some(s => s.deals.length > 0) && (
              <View style={{ margin: 12, backgroundColor: T.secondary, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Icon name="deals" size={28} color="#FFD700" />
                <View style={{ flex: 1 }}>
                  <Text style={[{ color: '#fff', fontSize: 15, fontFamily: F.bold }]}>Deals Available!</Text>
                  <Text style={[{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: F.regular }]}>Check shops for special offers</Text>
                </View>
                <Icon name="forward" size={20} color="rgba(255,255,255,0.7)" />
              </View>
            )}

            <Text style={[styles.sectionTitle, { fontFamily: F.bold }]}>Nearby Shops</Text>

            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <Icon name="discover" size={48} color={T.border} />
                <Text style={[styles.emptyText, { fontFamily: F.semiBold }]}>No shops found</Text>
              </View>
            ) : filtered.map(shop => (
              <TouchableOpacity
                key={shop.id}
                style={styles.shopCard}
                onPress={() => { setSelectedShop(shop); setShopTab('ratelist'); }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={styles.shopIconBox}>
                    <Icon name={CATEGORY_ICONS[shop.shopCategory] || 'store'} size={26} color={T.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.shopName, { fontFamily: F.bold }]}>{shop.shopName}</Text>
                      {shop.isVerified && <Icon name="verified" size={16} color="#1a90ff" />}
                      {shop.deals.length > 0 && (
                        <View style={{ backgroundColor: T.primary, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
                          <Text style={{ color: '#fff', fontSize: 9, fontFamily: F.bold }}>DEAL</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Icon name="star" size={12} color="#FFD700" />
                      <Text style={{ fontSize: 12, color: T.muted, fontFamily: F.regular }}>
                        {shop.rating} · {shop.shopCategory} · {shop.uid}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Icon name="location" size={12} color={T.muted} />
                      <Text style={{ fontSize: 11, color: T.muted, fontFamily: F.regular }}>{shop.shopAddress}</Text>
                    </View>
                  </View>
                  <View style={[styles.badge, { backgroundColor: shop.isOpen ? T.green : T.danger }]}>
                    <Text style={[styles.badgeText, { fontFamily: F.bold }]}>{shop.isOpen ? 'Open' : 'Closed'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {tab === 'orders' && (
          <View>
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { fontFamily: F.bold }]}>My Orders</Text>
            </View>
            {orders.length === 0 ? (
              <View style={styles.empty}>
                <Icon name="orders" size={48} color={T.border} />
                <Text style={[styles.emptyText, { fontFamily: F.semiBold }]}>No orders yet</Text>
              </View>
            ) : orders.map(o => (
              <View key={o.id} style={styles.shopCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.shopName, { fontFamily: F.bold }]}>{o.shopName}</Text>
                    <Text style={{ fontSize: 12, color: T.muted, fontFamily: F.regular, marginTop: 2 }}>
                      {o.items.length} items · ₹{o.total} · {o.paymentMethod.toUpperCase()}
                    </Text>
                    <Text style={{ fontSize: 11, color: T.muted, fontFamily: F.regular, marginTop: 2 }}>{o.time}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: T.primary, flexDirection: 'row', gap: 4 }]}>
                    <Icon name="pending" size={12} color="#fff" />
                    <Text style={[styles.badgeText, { fontFamily: F.bold }]}>Pending</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === 'favourites' && (
          <View>
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { fontFamily: F.bold }]}>Favourites</Text>
            </View>
            {favourites.length === 0 ? (
              <View style={styles.empty}>
                <Icon name="favourite" size={48} color={T.border} />
                <Text style={[styles.emptyText, { fontFamily: F.semiBold }]}>No favourites yet</Text>
                <Text style={{ color: T.muted, fontSize: 13, fontFamily: F.regular }}>Tap ♥ on any shop</Text>
              </View>
            ) : favourites.map(shop => (
              <TouchableOpacity key={shop.id} style={styles.shopCard} onPress={() => setSelectedShop(shop)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={styles.shopIconBox}>
                    <Icon name={CATEGORY_ICONS[shop.shopCategory] || 'store'} size={26} color={T.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.shopName, { fontFamily: F.bold }]}>{shop.shopName}</Text>
                      {shop.isVerified && <Icon name="verified" size={16} color="#1a90ff" />}
                    </View>
                    <Text style={{ fontSize: 12, color: T.muted, fontFamily: F.regular }}>{shop.shopCategory}</Text>
                  </View>
                  <Icon name="favourite" size={22} color={T.danger} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {tab === 'profile' && (
          <View>
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { fontFamily: F.bold }]}>My Profile</Text>
            </View>
            <View style={[styles.shopCard, { alignItems: 'center', padding: 28, margin: 12 }]}>
              <Icon name="profile" size={72} color={T.primary} />
              <Text style={[styles.shopName, { fontFamily: F.bold, fontSize: 20, marginTop: 12 }]}>{user.name || 'Guest'}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Icon name="phone" size={16} color={T.muted} />
                <Text style={{ color: T.muted, fontFamily: F.regular }}>{user.phone}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Icon name="location" size={16} color={T.muted} />
                <Text style={{ color: T.muted, fontFamily: F.regular }}>{user.area || 'Area not set'}</Text>
              </View>
            </View>
            <View style={[styles.shopCard, { margin: 12, gap: 4 }]}>
              <Text style={[styles.sectionTitle, { fontFamily: F.bold, margin: 0, marginBottom: 8 }]}>Stats</Text>
              {[['orders', `${orders.length} Orders`, 'Total orders placed'], ['favourite', `${favourites.length} Favourites`, 'Saved shops']].map(([icon, val, desc]) => (
                <View key={val} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: T.border }}>
                  <Icon name={icon} size={22} color={T.primary} />
                  <View>
                    <Text style={{ fontFamily: F.bold, fontSize: 15 }}>{val}</Text>
                    <Text style={{ fontFamily: F.regular, fontSize: 12, color: T.muted }}>{desc}</Text>
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Icon name="logout" size={20} color={T.danger} />
              <Text style={[styles.logoutBtnText, { fontFamily: F.bold }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[['home', 'home', 'Home'], ['orders', 'orders', 'Orders'], ['favourites', 'favourite', 'Saved'], ['profile', 'profile', 'Profile']].map(([k, icon, l]) => (
          <TouchableOpacity key={k} style={styles.navItem} onPress={() => setTab(k)}>
            <Icon name={icon} size={24} color={tab === k ? T.primary : T.muted} />
            <Text style={[styles.navLabel, { fontFamily: F.semiBold }, tab === k && { color: T.primary }]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── VENDOR APP ────────────────────────────────
function VendorApp({ user, onLogout, F }) {
  const [tab, setTab] = useState('dashboard');
  const [orders, setOrders] = useState([
    {
      id: '1', customerName: 'Rahul Kumar',
      items: [{ name: 'Amul Milk', qty: 2, price: 32 }],
      total: 64, paymentMethod: 'cash', status: 'pending', time: '10:30 AM',
    },
  ]);
  const [products, setProducts] = useState([
    { id: 'p1', name: 'Amul Milk 500ml', price: 32, unit: '500ml', inStock: true },
    { id: 'p2', name: 'Britannia Bread', price: 45, unit: '400g', inStock: true },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pUnit, setPUnit] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const addProduct = () => {
    if (!pName || !pPrice) { Alert.alert('Error', 'Name and price required'); return; }
    setProducts([...products, { id: Date.now().toString(), name: pName, price: parseInt(pPrice), unit: pUnit, inStock }]);
    setPName(''); setPPrice(''); setPUnit(''); setInStock(true); setShowAdd(false);
    Alert.alert('Success', 'Product added!');
  };

  const updateOrder = (id, status) => setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  const toggleStock = (id) => setProducts(products.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));

  const pending = orders.filter(o => o.status === 'pending').length;
  const todaySales = orders.filter(o => o.status === 'accepted').reduce((s, o) => s + o.total, 0);

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>

        {tab === 'dashboard' && (
          <View>
            <View style={[styles.header, { backgroundColor: T.secondary }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.headerTitle, { fontFamily: F.bold }]}>Dashboard</Text>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: F.regular }}>
                  {user.shopName || 'My Shop'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.badge, { backgroundColor: isOpen ? T.green : T.danger, paddingVertical: 6, paddingHorizontal: 12 }]}
                onPress={() => setIsOpen(!isOpen)}
              >
                <Text style={[styles.badgeText, { fontFamily: F.bold }]}>{isOpen ? 'Open' : 'Closed'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 }}>
              {[
                ['₹' + todaySales, "Today's Sales", T.green, 'deals'],
                [orders.length, 'Total Orders', T.secondary, 'orders'],
                [pending, 'Pending', T.danger, 'pending'],
                [products.length, 'Products', T.primary, 'products'],
              ].map(([v, l, c, icon]) => (
                <View key={l} style={styles.statCard}>
                  <Icon name={icon} size={24} color={c} />
                  <Text style={[styles.statVal, { color: c, fontFamily: F.extraBold }]}>{v}</Text>
                  <Text style={[styles.statLabel, { fontFamily: F.regular }]}>{l}</Text>
                </View>
              ))}
            </View>
            {pending > 0 && (
              <TouchableOpacity style={styles.alertBox} onPress={() => setTab('orders')}>
                <Icon name="pending" size={20} color={T.primary} />
                <Text style={{ fontSize: 14, fontFamily: F.semiBold, flex: 1 }}>
                  {pending} new order{pending > 1 ? 's' : ''} waiting!
                </Text>
                <Icon name="forward" size={20} color={T.primary} />
              </TouchableOpacity>
            )}
            {/* UID Card */}
            <View style={[styles.shopCard, { margin: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
              <Icon name="qrcode" size={28} color={T.secondary} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: T.muted, fontFamily: F.regular }}>Your Shop ID</Text>
                <Text style={{ fontSize: 18, fontFamily: F.extraBold, color: T.secondary, letterSpacing: 2 }}>
                  {user.uid || 'BZR-0000'}
                </Text>
              </View>
              {user.isVerified ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#e8f4ff', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Icon name="verified" size={16} color="#1a90ff" />
                  <Text style={{ color: '#1a90ff', fontFamily: F.bold, fontSize: 12 }}>Verified</Text>
                </View>
              ) : (
                <View style={{ backgroundColor: '#fff3ef', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: T.primary, fontFamily: F.bold, fontSize: 12 }}>Pending</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {tab === 'orders' && (
          <View>
            <View style={[styles.header, { backgroundColor: T.secondary }]}>
              <Text style={[styles.headerTitle, { fontFamily: F.bold }]}>Orders</Text>
            </View>
            {orders.length === 0 ? (
              <View style={styles.empty}>
                <Icon name="orders" size={48} color={T.border} />
                <Text style={[styles.emptyText, { fontFamily: F.semiBold }]}>No orders yet</Text>
              </View>
            ) : orders.map(o => (
              <View key={o.id} style={styles.shopCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <View>
                    <Text style={[styles.shopName, { fontFamily: F.bold }]}>{o.customerName}</Text>
                    <Text style={{ fontSize: 12, color: T.muted, fontFamily: F.regular }}>
                      {o.items.length} items · ₹{o.total} · {o.paymentMethod.toUpperCase()} · {o.time}
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: o.status === 'pending' ? T.primary : o.status === 'accepted' ? T.green : T.danger }]}>
                    <Text style={[styles.badgeText, { fontFamily: F.bold }]}>{o.status.toUpperCase()}</Text>
                  </View>
                </View>
                {o.items.map((i, idx) => (
                  <Text key={idx} style={{ fontSize: 13, color: T.text, fontFamily: F.regular, marginBottom: 2 }}>
                    • {i.name} × {i.qty} = ₹{i.price * i.qty}
                  </Text>
                ))}
                {o.status === 'pending' && (
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: T.green, flexDirection: 'row', gap: 6 }]} onPress={() => updateOrder(o.id, 'accepted')}>
                      <Icon name="accepted" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, { fontFamily: F.bold }]}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: T.danger, flexDirection: 'row', gap: 6 }]} onPress={() => updateOrder(o.id, 'rejected')}>
                      <Icon name="rejected" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, { fontFamily: F.bold }]}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {tab === 'products' && (
          <View>
            <View style={[styles.header, { backgroundColor: T.secondary }]}>
              <Text style={[styles.headerTitle, { fontFamily: F.bold }]}>Products</Text>
            </View>
            <TouchableOpacity style={[styles.primaryBtn, { margin: 12, flexDirection: 'row', gap: 8 }]} onPress={() => setShowAdd(!showAdd)}>
              <Icon name="add" size={20} color="#fff" />
              <Text style={[styles.primaryBtnText, { fontFamily: F.bold }]}>Add New Product</Text>
            </TouchableOpacity>
            {showAdd && (
              <View style={[styles.shopCard, { margin: 12, gap: 10 }]}>
                <Text style={[styles.sectionTitle, { fontFamily: F.bold, margin: 0 }]}>New Product</Text>
                <TextInput style={[styles.input, { fontFamily: F.regular }]} placeholder="Product name" value={pName} onChangeText={setPName} />
                <TextInput style={[styles.input, { fontFamily: F.regular }]} placeholder="Price (₹)" keyboardType="numeric" value={pPrice} onChangeText={setPPrice} />
                <TextInput style={[styles.input, { fontFamily: F.regular }]} placeholder="Unit (e.g. 500ml, 1kg)" value={pUnit} onChangeText={setPUnit} />
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: inStock ? T.green : T.danger, marginHorizontal: 0, flexDirection: 'row', gap: 8 }]}
                  onPress={() => setInStock(!inStock)}
                >
                  <Icon name={inStock ? 'accepted' : 'rejected'} size={18} color="#fff" />
                  <Text style={[styles.primaryBtnText, { fontFamily: F.bold }]}>{inStock ? 'In Stock' : 'Out of Stock'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.primaryBtn, { marginHorizontal: 0 }]} onPress={addProduct}>
                  <Text style={[styles.primaryBtnText, { fontFamily: F.bold }]}>Save Product</Text>
                </TouchableOpacity>
              </View>
            )}
            {products.map(p => (
              <View key={p.id} style={styles.productCard}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.productName, { fontFamily: F.semiBold }]}>{p.name}</Text>
                  <Text style={{ fontSize: 12, color: T.muted, fontFamily: F.regular }}>{p.unit}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <Text style={[styles.productPrice, { fontFamily: F.bold }]}>₹{p.price}</Text>
                  <TouchableOpacity
                    style={[styles.badge, { backgroundColor: p.inStock ? T.green : T.danger, flexDirection: 'row', gap: 4 }]}
                    onPress={() => toggleStock(p.id)}
                  >
                    <Icon name={p.inStock ? 'accepted' : 'rejected'} size={12} color="#fff" />
                    <Text style={[styles.badgeText, { fontFamily: F.bold }]}>{p.inStock ? 'In Stock' : 'Out'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === 'shopProfile' && (
          <View>
            <View style={[styles.header, { backgroundColor: T.secondary }]}>
              <Text style={[styles.headerTitle, { fontFamily: F.bold }]}>Shop Profile</Text>
            </View>
            <View style={[styles.shopCard, { alignItems: 'center', padding: 28, margin: 12 }]}>
              <Icon name="store" size={72} color={T.secondary} />
              <Text style={[styles.shopName, { fontFamily: F.bold, fontSize: 20, marginTop: 12 }]}>
                {user.shopName || 'My Shop'}
              </Text>
              {[['phone', user.phone], ['location', user.shopAddress || 'Address not set'], ['category', user.shopCategory || 'Category not set']].map(([icon, val]) => (
                <View key={icon} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <Icon name={icon} size={16} color={T.muted} />
                  <Text style={{ color: T.muted, fontFamily: F.regular }}>{val}</Text>
                </View>
              ))}
            </View>

            {/* QR Code in shop profile */}
            <View style={[styles.shopCard, { margin: 12, alignItems: 'center', gap: 12, padding: 20 }]}>
              <Text style={[styles.sectionTitle, { fontFamily: F.bold, margin: 0 }]}>Your QR Code</Text>
              <Text style={{ color: T.muted, fontSize: 12, fontFamily: F.regular, textAlign: 'center' }}>
                Share with customers to find your shop instantly
              </Text>
              <Image
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${user.uid || 'BZR-0000'}&bgcolor=ffffff&color=1A237E&qzone=2` }}
                style={{ width: 180, height: 180, borderRadius: 8 }}
              />
              <Text style={[{ fontSize: 20, fontFamily: F.extraBold, color: T.secondary, letterSpacing: 3 }]}>
                {user.uid || 'BZR-0000'}
              </Text>
              {user.isVerified ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e8f4ff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 }}>
                  <Icon name="verified" size={18} color="#1a90ff" />
                  <Text style={{ color: '#1a90ff', fontFamily: F.bold }}>Verified Shop</Text>
                </View>
              ) : (
                <View style={{ backgroundColor: '#fff3ef', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 }}>
                  <Text style={{ color: T.primary, fontFamily: F.semiBold, fontSize: 13 }}>Verification Pending</Text>
                </View>
              )}
            </View>

            <View style={[styles.shopCard, { margin: 12, gap: 4 }]}>
              <Text style={[styles.sectionTitle, { fontFamily: F.bold, margin: 0, marginBottom: 8 }]}>Performance</Text>
              {[
                ['orders', `${orders.length} Orders`, 'Total received'],
                ['deals', `₹${todaySales}`, "Today's revenue"],
                ['products', `${products.length} Products`, 'In catalog'],
              ].map(([icon, val, desc]) => (
                <View key={val} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: T.border }}>
                  <Icon name={icon} size={22} color={T.secondary} />
                  <View>
                    <Text style={{ fontFamily: F.bold, fontSize: 15 }}>{val}</Text>
                    <Text style={{ fontFamily: F.regular, fontSize: 12, color: T.muted }}>{desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Icon name="logout" size={20} color={T.danger} />
              <Text style={[styles.logoutBtnText, { fontFamily: F.bold }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[['dashboard', 'dashboard', 'Dashboard'], ['orders', 'orders', 'Orders'], ['products', 'products', 'Products'], ['shopProfile', 'store', 'Profile']].map(([k, icon, l]) => (
          <TouchableOpacity key={k} style={styles.navItem} onPress={() => setTab(k)}>
            <Icon name={icon} size={24} color={tab === k ? T.secondary : T.muted} />
            <Text style={[styles.navLabel, { fontFamily: F.semiBold }, tab === k && { color: T.secondary }]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── STYLES ────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  welcomeBg: { flex: 1, backgroundColor: '#FF5722' },
  welcomeTop: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  welcomeLogoBox: { width: 100, height: 100, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  welcomeTitle: { fontSize: 44, color: '#fff', letterSpacing: 6 },
  welcomeSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  welcomeButtons: { padding: 24, gap: 12, paddingBottom: 48 },
  customerBtn: { backgroundColor: '#fff', borderRadius: 16, padding: 22, alignItems: 'center', gap: 6 },
  customerBtnText: { fontSize: 20, color: '#FF5722' },
  vendorBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 22, alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', gap: 6 },
  vendorBtnText: { fontSize: 20, color: '#fff' },
  btnSub: { fontSize: 13, marginTop: 2 },
  header: { backgroundColor: '#FF5722', padding: 20, paddingTop: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 22, color: '#fff' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 12, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, elevation: 2, gap: 10 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, elevation: 1, borderWidth: 1, borderColor: '#E5E5E5' },
  sectionTitle: { fontSize: 15, margin: 14, marginBottom: 8 },
  shopCard: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8, borderRadius: 12, padding: 14, elevation: 2 },
  shopIconBox: { width: 52, height: 52, borderRadius: 14, backgroundColor: '#fff3ef', justifyContent: 'center', alignItems: 'center' },
  shopName: { fontSize: 15, color: '#1a1a1a' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: '#fff', fontSize: 11 },
  shopTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  shopTabActive: { borderBottomColor: '#FF5722' },
  shopTabText: { fontSize: 13, color: '#888' },
  productCard: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 6, borderRadius: 10, padding: 14, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  productName: { fontSize: 14, color: '#1a1a1a' },
  productPrice: { fontSize: 15, color: '#10b981' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FF5722', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  addBtnText: { color: '#fff', fontSize: 12 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FF5722', justifyContent: 'center', alignItems: 'center' },
  cartFloat: { position: 'absolute', bottom: 82, left: 12, right: 12, backgroundColor: '#FF5722', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 8 },
  primaryBtn: { backgroundColor: '#FF5722', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', marginHorizontal: 12, marginTop: 8, flexDirection: 'row', gap: 8 },
  primaryBtnText: { color: '#fff', fontSize: 16 },
  label: { fontSize: 13, color: '#888', marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, fontSize: 15, borderWidth: 1, borderColor: '#E5E5E5' },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flex: 1, minWidth: '45%', alignItems: 'center', elevation: 1, gap: 4 },
  statVal: { fontSize: 24 },
  statLabel: { fontSize: 12, color: '#888' },
  alertBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff3ef', margin: 12, borderRadius: 10, padding: 14, borderLeftWidth: 4, borderLeftColor: '#FF5722' },
  actionBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { color: '#fff', fontSize: 14 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 12, borderRadius: 10, padding: 14, borderWidth: 1.5, borderColor: '#ef4444' },
  logoutBtnText: { color: '#ef4444', fontSize: 15 },
  empty: { alignItems: 'center', padding: 40, gap: 8 },
  emptyText: { fontSize: 16, color: '#888' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E5E5', paddingBottom: 8, position: 'absolute', bottom: 0, left: 0, right: 0, elevation: 10 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, color: '#888', marginTop: 2 },
});