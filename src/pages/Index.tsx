import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

interface Pizza {
  id: number;
  name: string;
  price: number;
  img: string;
  badge: string | null;
  veg: boolean;
  desc?: string;
}

interface CartItem {
  pizza: Pizza;
  qty: number;
  sizeLabel: string;
  crustLabel: string;
  totalPrice: number;
}

interface Addon {
  id: string;
  name: string;
  sub: string;
  price: number;
  img: string;
}

const ADDON_IMG_1 = "https://cdn.poehali.dev/projects/e6d6e649-ba1f-4345-ba4a-2e96df37ea0d/files/dd17f16e-4426-4239-8bcf-a3d7b7a13e81.jpg";
const ADDON_IMG_2 = "https://cdn.poehali.dev/projects/e6d6e649-ba1f-4345-ba4a-2e96df37ea0d/files/012e5de2-e4df-44cc-858c-feb1191313cc.jpg";
const ADDON_IMG_3 = "https://cdn.poehali.dev/projects/e6d6e649-ba1f-4345-ba4a-2e96df37ea0d/files/a468602b-aba3-4ba0-94e4-29bdabad6f46.jpg";

const ADDONS: Addon[] = [
  { id: "cola", name: "Добрый Кола", sub: "0,5 л", price: 135, img: ADDON_IMG_1 },
  { id: "cake", name: "Чизкейк Нью-Йорк", sub: "100 г", price: 199, img: ADDON_IMG_2 },
  { id: "cocoa", name: "Какао", sub: "0,3 л", price: 139, img: ADDON_IMG_3 },
];

const SIZES = [
  { label: "20 см", scale: 0.72, priceAdd: 0 },
  { label: "25 см", scale: 0.84, priceAdd: 70 },
  { label: "30 см", scale: 0.94, priceAdd: 150 },
  { label: "35 см", scale: 1.0, priceAdd: 240 },
];

const CRUSTS = [
  { label: "Традиционное", emoji: "🥖" },
  { label: "Тонкое", emoji: "🫓" },
  { label: "Сырный борт", emoji: "🧀" },
];

function PizzaModal({ pizza, onClose, onAdd }: { pizza: Pizza; onClose: () => void; onAdd: (id: number, sizeLabel: string, crustLabel: string, price: number) => void }) {
  const [sizeIdx, setSizeIdx] = useState(1);
  const [crustIdx, setCrustIdx] = useState(0);
  const [adding, setAdding] = useState(false);

  const size = SIZES[sizeIdx];
  const totalPrice = pizza.price + size.priceAdd;

  const handleAdd = () => {
    setAdding(true);
    onAdd(pizza.id, size.label, CRUSTS[crustIdx].label, totalPrice);
    setTimeout(() => {
      setAdding(false);
      onClose();
    }, 600);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Pizza visual scale: 20cm=0.62, 25cm=0.76, 30cm=0.88, 35cm=1.0
  const pizzaScales = [0.62, 0.76, 0.88, 1.0];
  const pizzaScale = pizzaScales[sizeIdx];

  return (
    <div className="fixed inset-0 z-[100] max-w-md mx-auto animate-modal-up overflow-hidden" style={{ background: "#b8ad9e" }}>

      {/* Scrollable content */}
      <div className="h-full overflow-y-auto">

        {/* Pizza image — full width, edge to edge, covers top half */}
        <div className="relative w-full" style={{ paddingTop: "100%" }}>
          <img
            src={pizza.img}
            alt={pizza.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out origin-center"
            style={{ transform: `scale(${pizzaScale})` }}
          />

          {/* Close button — top left */}
          <button
            onClick={onClose}
            className="absolute top-10 left-4 z-20 w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "rgba(90,82,74,0.7)" }}
          >
            <Icon name="X" size={20} className="text-white" />
          </button>

          {/* "Настроить состав" — bottom right over image */}
          <button
            className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full px-5 py-3 shadow-lg"
            style={{ background: "rgba(255,255,255,0.92)" }}
          >
            <Icon name="Pencil" size={14} className="text-[#333]" />
            <span className="text-sm font-semibold text-[#222]">Настроить состав</span>
          </button>
        </div>

        {/* Info block — directly below image, same bg, no cards */}
        <div className="px-5 pt-5 pb-10">
          <h2 className="text-[28px] font-rubik font-black text-center mb-2" style={{ color: "#1c1710" }}>
            {pizza.name}
          </h2>
          <p className="text-[15px] text-center leading-relaxed mb-6 px-1" style={{ color: "#6e6256" }}>
            {pizza.desc || "Пикантная начинка, увеличенная порция моцареллы, фирменный томатный соус"}
          </p>

          {/* Size selector */}
          <div className="rounded-[18px] p-[5px] flex items-center mb-3" style={{ background: "rgba(100,90,78,0.35)" }}>
            {SIZES.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setSizeIdx(i)}
                className="flex-1 py-3 rounded-[14px] text-sm font-bold transition-all duration-200"
                style={
                  sizeIdx === i
                    ? { background: "#fff", color: "#1c1710", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }
                    : { color: "#6e6256" }
                }
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Crust selector */}
          <div className="rounded-[18px] px-4 py-3.5 flex items-center justify-between mb-6" style={{ background: "rgba(100,90,78,0.35)" }}>
            <button
              onClick={() => setCrustIdx(i => Math.max(0, i - 1))}
              style={{ color: "#7a6e60" }}
            >
              <Icon name="ChevronLeft" size={22} />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{CRUSTS[crustIdx].emoji}</span>
              <span className="text-[15px] font-semibold" style={{ color: "#2e261e" }}>{CRUSTS[crustIdx].label}</span>
            </div>
            <button
              onClick={() => setCrustIdx(i => Math.min(CRUSTS.length - 1, i + 1))}
              style={{ color: "#7a6e60" }}
            >
              <Icon name="ChevronRight" size={22} />
            </button>
          </div>

          {/* Add button */}
          <button
            onClick={handleAdd}
            className={`w-full py-[18px] rounded-full font-rubik font-black text-[18px] text-white transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-3 ${
              adding ? "bg-green-500" : ""
            }`}
            style={!adding ? { background: "#ef7b22", boxShadow: "0 6px 24px rgba(220,100,20,0.3)" } : undefined}
          >
            {adding ? (
              <>
                <Icon name="Check" size={22} />
                Добавлено!
              </>
            ) : (
              <>
                <Icon name="Plus" size={22} />
                {totalPrice} ₽
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartScreen({
  items, onClose, onChangeQty, onClear, onAddonAdd, addons
}: {
  items: CartItem[];
  onClose: () => void;
  onChangeQty: (pizzaId: number, delta: number) => void;
  onClear: () => void;
  onAddonAdd: (addon: Addon) => void;
  addons: { addon: Addon; qty: number }[];
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const pizzaTotal = items.reduce((s, i) => s + i.totalPrice * i.qty, 0);
  const addonTotal = addons.reduce((s, a) => s + a.addon.price * a.qty, 0);
  const total = pizzaTotal + addonTotal;
  const isEmpty = items.length === 0 && addons.length === 0;

  return (
    <div className="fixed inset-0 z-[100] max-w-md mx-auto animate-modal-up" style={{ background: "#141414" }}>
      <div className="h-full flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-10 pb-3">
          <button onClick={onClose}>
            <Icon name="X" size={24} className="text-[hsl(14,100%,57%)]" />
          </button>
          <span className="text-lg font-rubik font-bold">Корзина</span>
          {!isEmpty && (
            <button onClick={onClear}>
              <Icon name="Trash2" size={22} className="text-[hsl(14,100%,57%)]" />
            </button>
          )}
          {isEmpty && <div className="w-6" />}
        </div>

        {/* Address bar */}
        <div className="mx-4 mb-4 flex items-center gap-3 bg-[#1c1c1c] rounded-2xl px-4 py-3">
          <span className="text-[hsl(14,100%,57%)]">🚶</span>
          <span className="text-sm font-semibold flex-1">ул. Ленина, 42</span>
          <Icon name="ChevronRight" size={18} className="text-[#555]" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">

          {isEmpty && (
            <div className="flex flex-col items-center justify-center h-60 text-center">
              <span className="text-5xl mb-4">🛒</span>
              <p className="text-lg font-semibold text-[#888]">Корзина пуста</p>
              <p className="text-sm text-[#555] mt-1">Добавьте пиццу из меню</p>
            </div>
          )}

          {/* Cart items */}
          {items.map(item => (
            <div key={item.pizza.id} className="mb-4">
              <div className="flex gap-4">
                <img src={item.pizza.img} alt={item.pizza.name} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold leading-tight">{item.pizza.name}</p>
                  <p className="text-xs text-[#888] mt-1">{item.sizeLabel}, {item.crustLabel.toLowerCase()}</p>
                  <button className="text-xs text-[hsl(14,100%,57%)] font-semibold mt-1">Изменить</button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center bg-[#2a2a2a] rounded-xl">
                  <button
                    onClick={() => onChangeQty(item.pizza.id, -1)}
                    className="w-10 h-10 flex items-center justify-center text-white"
                  >
                    <Icon name="Minus" size={16} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                  <button
                    onClick={() => onChangeQty(item.pizza.id, 1)}
                    className="w-10 h-10 flex items-center justify-center text-white"
                  >
                    <Icon name="Plus" size={16} />
                  </button>
                </div>
                <span className="text-lg font-rubik font-bold">{item.totalPrice * item.qty} ₽</span>
              </div>
              <div className="border-b border-[#252525] mt-4" />
            </div>
          ))}

          {/* Addons in cart */}
          {addons.map(a => (
            <div key={a.addon.id} className="flex items-center gap-3 mb-3">
              <img src={a.addon.img} alt={a.addon.name} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{a.addon.name}</p>
                <p className="text-xs text-[#888]">{a.addon.sub}</p>
              </div>
              <span className="text-sm font-bold">{a.addon.price * a.qty} ₽</span>
            </div>
          ))}

          {/* Suggested addons */}
          {!isEmpty && (
            <>
              <h3 className="text-xl font-rubik font-bold mt-6 mb-4">Добавить к заказу?</h3>
              <div className="flex gap-3 overflow-x-auto banner-scroll pb-2">
                {ADDONS.map(addon => (
                  <div key={addon.id} className="flex-shrink-0 w-40 bg-[#1c1c1c] rounded-3xl border border-[#252525] overflow-hidden">
                    <div className="h-28 bg-[#222] flex items-center justify-center p-3">
                      <img src={addon.img} alt={addon.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold leading-tight">{addon.name}</p>
                      <p className="text-xs text-[#888] mt-0.5">{addon.sub}</p>
                      <button
                        onClick={() => onAddonAdd(addon)}
                        className="w-full mt-3 py-2 rounded-xl bg-[#2a2a2a] text-sm font-bold text-white hover:bg-[#333] transition-colors active:scale-95"
                      >
                        {addon.price} ₽
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom bar */}
        {!isEmpty && (
          <div className="px-4 pb-8 pt-2 border-t border-[#1e1e1e]">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-[hsl(14,100%,57%)]">🚶</span>
              <span className="text-sm text-[#aaa]">Доставим бесплатно</span>
              <Icon name="Info" size={14} className="text-[#555]" />
            </div>
            <button className="w-full py-4 rounded-2xl bg-[hsl(14,100%,57%)] text-white font-rubik font-bold text-lg transition-all active:scale-[0.97] shadow-lg shadow-orange-900/30">
              Оформить заказ на {total} ₽
            </button>
          </div>
        )}

        {isEmpty && (
          <div className="px-4 pb-8 pt-2">
            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-[#2a2a2a] text-white font-rubik font-bold text-base"
            >
              Перейти в меню
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const PIZZA_IMG_1 = "https://cdn.poehali.dev/projects/e6d6e649-ba1f-4345-ba4a-2e96df37ea0d/files/da102dc8-ddc7-4af4-a702-3a5139682419.jpg";
const PIZZA_IMG_2 = "https://cdn.poehali.dev/projects/e6d6e649-ba1f-4345-ba4a-2e96df37ea0d/files/ca8ab024-882c-406d-a9e4-5d2aa2d0e94d.jpg";
const PIZZA_IMG_3 = "https://cdn.poehali.dev/projects/e6d6e649-ba1f-4345-ba4a-2e96df37ea0d/files/3b64571c-2fb8-4296-a8e3-cfe008554527.jpg";
const PIZZA_IMG_4 = "https://cdn.poehali.dev/projects/e6d6e649-ba1f-4345-ba4a-2e96df37ea0d/files/d6da802c-996a-4b66-a5a0-f181224165af.jpg";
const PIZZA_IMG_5 = "https://cdn.poehali.dev/projects/e6d6e649-ba1f-4345-ba4a-2e96df37ea0d/files/5801ff20-132c-42ec-a401-69c81231bda3.jpg";
const BANNER_IMG = "https://cdn.poehali.dev/projects/e6d6e649-ba1f-4345-ba4a-2e96df37ea0d/files/57345a1a-b8f9-4058-b422-4959dc98d59d.jpg";

const categories = ["Для вас", "Пиццы", "Комбо", "Роллы", "Напитки", "Десерты"];

const pizzas: Pizza[] = [
  { id: 1, name: "Пепперони Фреш", price: 279, img: PIZZA_IMG_1, badge: "ХИТ", veg: false, desc: "Пикантная пепперони, увеличенная порция моцареллы, фирменный томатный соус" },
  { id: 2, name: "Четыре сыра", price: 349, img: PIZZA_IMG_2, badge: null, veg: false, desc: "Моцарелла, пармезан, дор-блю и чеддер — классика итальянской кухни" },
  { id: 3, name: "Гавайская", price: 359, img: PIZZA_IMG_3, badge: null, veg: false, desc: "Сочная ветчина, ананас, моцарелла и нежный сливочный соус" },
  { id: 4, name: "Двойная пепперони", price: 449, img: PIZZA_IMG_4, badge: "НОВИНКА", veg: false, desc: "Двойная порция пепперони, томатный соус, моцарелла — для настоящих любителей" },
  { id: 5, name: "Маргарита", price: 279, img: PIZZA_IMG_5, badge: null, veg: true, desc: "Классика: томатный соус, моцарелла и свежий базилик" },
  { id: 6, name: "Пепперони классик", price: 349, img: PIZZA_IMG_1, badge: null, veg: false, desc: "Классическая пепперони на томатной основе с тягучей моцареллой" },
];

const reviews = [
  { id: 1, name: "Анна К.", rating: 5, text: "Пицца приехала горячей, курьер очень вежливый. Очень вкусно!", avatar: "🧑‍🦰", time: "2 дня назад" },
  { id: 2, name: "Михаил Д.", rating: 5, text: "Слежу за курьером на карте — это просто магия! Знаю точно когда ждать.", avatar: "👨‍💻", time: "3 дня назад" },
  { id: 3, name: "Светлана Р.", rating: 4, text: "Очень вкусная пепперони, буду заказывать снова. Спасибо!", avatar: "👩‍🦱", time: "5 дней назад" },
  { id: 4, name: "Иван П.", rating: 5, text: "Заказываю каждую неделю. Стабильное качество и быстрая доставка.", avatar: "🧔", time: "1 неделю назад" },
];

const navItems = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "menu", label: "Меню", icon: "UtensilsCrossed" },
  { id: "track", label: "Заказ", icon: "MapPin" },
  { id: "reviews", label: "Отзывы", icon: "Star" },
  { id: "contacts", label: "Контакты", icon: "Phone" },
];

const courierPath = [
  { x: 30, y: 70 },
  { x: 45, y: 58 },
  { x: 60, y: 50 },
  { x: 72, y: 42 },
];

export default function Index() {
  const [activeNav, setActiveNav] = useState("home");
  const [activeCategory, setActiveCategory] = useState("Для вас");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartAddons, setCartAddons] = useState<{ addon: Addon; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [courierStep, setCourierStep] = useState(0);
  const [orderStatus, setOrderStatus] = useState(2);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCourierStep(s => (s + 1) % courierPath.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const addToCart = (id: number, sizeLabel?: string, crustLabel?: string, price?: number) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.pizza.id === id);
      if (existing) {
        return prev.map(i => i.pizza.id === id ? { ...i, qty: i.qty + 1 } : i);
      }
      const p = pizzas.find(p => p.id === id);
      if (!p) return prev;
      return [...prev, {
        pizza: p,
        qty: 1,
        sizeLabel: sizeLabel || "25 см",
        crustLabel: crustLabel || "Традиционное",
        totalPrice: price || p.price + 70,
      }];
    });
  };

  const changeCartQty = (pizzaId: number, delta: number) => {
    setCartItems(prev =>
      prev.map(i => i.pizza.id === pizzaId ? { ...i, qty: i.qty + delta } : i)
          .filter(i => i.qty > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCartAddons([]);
  };

  const addAddon = (addon: Addon) => {
    setCartAddons(prev => {
      const existing = prev.find(a => a.addon.id === addon.id);
      if (existing) return prev.map(a => a.addon.id === addon.id ? { ...a, qty: a.qty + 1 } : a);
      return [...prev, { addon, qty: 1 }];
    });
  };

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0) + cartAddons.reduce((s, a) => s + a.qty, 0);
  const isInCart = (id: number) => cartItems.some(i => i.pizza.id === id);

  const filteredPizzas = searchQuery
    ? pizzas.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : pizzas;

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const courier = courierPath[courierStep];
  const statusLabels = ["Принят", "Готовится", "В пути", "Доставлен"];
  const statusIcons = ["CheckCircle", "ChefHat", "Bike", "Home"];
  const eta = 18;

  return (
    <div className="min-h-screen bg-[#141414] text-white font-golos max-w-md mx-auto relative overflow-x-hidden pb-24">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#141414]/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3 border-b border-[#1e1e1e]">
        <div className="w-10 h-10 rounded-2xl bg-[hsl(14,100%,57%)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-900/30">
          <span className="text-xl">🍕</span>
        </div>

        <button className="flex-1 flex items-center gap-1 text-left" onClick={() => scrollToSection("contacts")}>
          <div>
            <div className="text-[10px] text-[#666] leading-none">Доставка по адресу</div>
            <div className="text-sm font-semibold flex items-center gap-1 mt-0.5">
              ул. Ленина, 42
              <Icon name="ChevronDown" size={14} className="text-[#888]" />
            </div>
          </div>
        </button>

        <button
          className="w-10 h-10 rounded-2xl bg-[#222] flex items-center justify-center"
          onClick={() => setSearchOpen(o => !o)}
        >
          <Icon name={searchOpen ? "X" : "Search"} size={18} />
        </button>

        <button
          className="w-10 h-10 rounded-2xl bg-[#222] flex items-center justify-center relative"
          onClick={() => setCartOpen(true)}
        >
          <Icon name="ShoppingCart" size={18} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[hsl(14,100%,57%)] text-[10px] font-bold flex items-center justify-center text-white">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {searchOpen && (
        <div className="px-4 pb-3 pt-3 bg-[#141414] border-b border-[#1e1e1e]">
          <div className="flex items-center gap-2 bg-[#222] rounded-2xl px-4 py-3">
            <Icon name="Search" size={16} className="text-[#666]" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Поиск по меню..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#555]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <Icon name="X" size={16} className="text-[#666]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ГЛАВНАЯ */}
      <section id="home">
        <div className="px-4 pt-4 pb-2">
          <div className="flex gap-3 overflow-x-auto banner-scroll pb-1">
            <div className="flex-shrink-0 w-44 h-52 rounded-3xl overflow-hidden relative shadow-xl">
              <img src={BANNER_IMG} alt="Акция" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-xs font-bold leading-tight">Когда хочется горячего</p>
                <p className="text-[10px] text-white/60 mt-1">Новинки сезона</p>
              </div>
            </div>

            <div className="flex-shrink-0 w-44 h-52 rounded-3xl overflow-hidden relative bg-[hsl(14,100%,57%)] shadow-xl shadow-orange-900/30">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
                <span className="text-5xl mb-3">🎁</span>
                <p className="text-sm font-bold leading-tight">Комбо со скидкой</p>
                <p className="text-2xl font-rubik font-black mt-1">−30%</p>
                <p className="text-[10px] mt-2 opacity-80 bg-white/20 rounded-xl px-2 py-1">от 800 ₽</p>
              </div>
            </div>

            <div className="flex-shrink-0 w-44 h-52 rounded-3xl overflow-hidden relative bg-[#0d1b2a] shadow-xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
                <span className="text-5xl mb-3">⚡</span>
                <p className="text-sm font-bold leading-tight">Доставка за 35 минут</p>
                <p className="text-[10px] mt-2 text-white/60">или пицца бесплатно</p>
              </div>
            </div>

            <div className="flex-shrink-0 w-44 h-52 rounded-3xl overflow-hidden relative bg-[#0f2b1a] shadow-xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
                <span className="text-5xl mb-3">🌿</span>
                <p className="text-sm font-bold leading-tight">Вегетарианское меню</p>
                <p className="text-[10px] mt-2 text-white/60">5 новых позиций</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-4 mt-4 mb-6 rounded-2xl bg-[#1a1a1a] border border-[#252525] px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🚀</span>
          <div className="flex-1">
            <p className="text-sm font-semibold">Первый заказ со скидкой!</p>
            <p className="text-xs text-[#777]">Промокод ПЕРВЫЙ — −15%</p>
          </div>
          <button className="text-xs font-bold text-[hsl(14,100%,57%)] bg-[hsl(14,100%,57%)]/10 px-3 py-2 rounded-xl whitespace-nowrap">
            Забрать
          </button>
        </div>
      </section>

      {/* МЕНЮ */}
      <section id="menu">
        <div className="px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto banner-scroll pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-white text-[#141414]"
                    : "bg-[#1e1e1e] text-[#aaa] hover:bg-[#252525]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 mb-4 flex items-center justify-between">
          <h2 className="text-xl font-rubik font-bold">
            {searchQuery ? `"${searchQuery}"` : activeCategory}
          </h2>
          <span className="text-xs text-[#666]">{filteredPizzas.length} позиций</span>
        </div>

        <div className="px-4 grid grid-cols-2 gap-3 mb-10">
          {filteredPizzas.map((pizza, i) => (
            <div
              key={pizza.id}
              className="pizza-card bg-[#1c1c1c] rounded-3xl overflow-hidden border border-[#252525] cursor-pointer"
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => setSelectedPizza(pizza)}
            >
              <div className="relative aspect-square bg-[#202020] p-3">
                <img
                  src={pizza.img}
                  alt={pizza.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
                {pizza.badge && (
                  <span className="absolute top-2 left-2 text-[9px] font-black bg-[hsl(14,100%,57%)] text-white px-2 py-0.5 rounded-lg tracking-wide">
                    {pizza.badge}
                  </span>
                )}
                {pizza.veg && (
                  <span className="absolute top-2 right-2 text-sm">🌿</span>
                )}
              </div>
              <div className="p-3 pt-2">
                <p className="text-sm font-semibold leading-tight mb-3 min-h-[2.5rem]">{pizza.name}</p>
                <button
                  onClick={e => { e.stopPropagation(); setSelectedPizza(pizza); }}
                  className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                    isInCart(pizza.id)
                      ? "bg-[hsl(14,100%,57%)] text-white"
                      : "bg-[#2a2a2a] text-white hover:bg-[#333]"
                  }`}
                >
                  {isInCart(pizza.id) ? "✓ В корзине" : `от ${pizza.price} ₽`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ОТСЛЕЖИВАНИЕ */}
      <section id="track" className="px-4 mb-10">
        <h2 className="text-xl font-rubik font-bold mb-4">Отслеживание заказа</h2>

        <div className="bg-[#1c1c1c] rounded-3xl overflow-hidden border border-[#252525]">
          {/* MAP */}
          <div className="relative h-56 bg-[#111d2e] overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <rect width="100" height="100" fill="#0d1520" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="#1a2a40" strokeWidth="2.5"/>
              <line x1="0" y1="60" x2="100" y2="60" stroke="#1a2a40" strokeWidth="2.5"/>
              <line x1="0" y1="80" x2="100" y2="80" stroke="#1a2a40" strokeWidth="1.5"/>
              <line x1="25" y1="0" x2="25" y2="100" stroke="#1a2a40" strokeWidth="2.5"/>
              <line x1="55" y1="0" x2="55" y2="100" stroke="#1a2a40" strokeWidth="2.5"/>
              <line x1="80" y1="0" x2="80" y2="100" stroke="#1a2a40" strokeWidth="1.5"/>
              <rect x="28" y="32" width="10" height="12" fill="#162035" rx="1.5"/>
              <rect x="58" y="32" width="14" height="10" fill="#162035" rx="1.5"/>
              <rect x="28" y="62" width="16" height="12" fill="#162035" rx="1.5"/>
              <rect x="60" y="62" width="10" height="12" fill="#162035" rx="1.5"/>
              <polyline
                points="10,80 25,60 45,50 72,42 88,30"
                fill="none"
                stroke="#1e3a6e"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={`${courier.x},${courier.y} 88,30`}
                fill="none"
                stroke="hsl(14,100%,57%)"
                strokeWidth="2.5"
                strokeDasharray="5 4"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>

            {/* Courier */}
            <div
              className="absolute transition-all duration-1500 ease-in-out"
              style={{ left: `${courier.x}%`, top: `${courier.y}%`, transform: "translate(-50%, -50%)", transitionDuration: "1.8s" }}
            >
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-full bg-[hsl(14,100%,57%)]/25 animate-ping" style={{ animationDuration: "1.5s" }} />
                <div className="absolute inset-1 rounded-full bg-[hsl(14,100%,57%)] flex items-center justify-center shadow-lg shadow-orange-500/40">
                  <span className="text-sm">🛵</span>
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="absolute" style={{ right: "10%", top: "28%", transform: "translateY(-50%)" }}>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/20">
                <span className="text-base">🏠</span>
              </div>
            </div>

            {/* ETA */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/10">
              <div className="text-[9px] text-white/50 uppercase tracking-wider">Прибудет через</div>
              <div className="text-xl font-rubik font-black text-[hsl(14,100%,57%)] leading-none mt-0.5">{eta} мин</div>
            </div>

            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/10">
              <div className="text-[9px] text-white/50 uppercase tracking-wider">Заказ</div>
              <div className="text-sm font-bold leading-none mt-0.5">#4821</div>
            </div>
          </div>

          {/* Status bar */}
          <div className="px-5 py-5">
            <div className="flex items-start justify-between relative">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#2a2a2a]" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-[hsl(14,100%,57%)] transition-all duration-700"
                style={{ width: `${(orderStatus - 1) * 33.3}%` }}
              />
              {statusLabels.map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    i + 1 <= orderStatus ? "bg-[hsl(14,100%,57%)] shadow-md shadow-orange-500/30" : "bg-[#2a2a2a]"
                  }`}>
                    <Icon name={statusIcons[i]} size={14} className={i + 1 <= orderStatus ? "text-white" : "text-[#555]"} fallback="Circle" />
                  </div>
                  <span className={`text-[10px] font-medium text-center leading-tight ${i + 1 <= orderStatus ? "text-white" : "text-[#555]"}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Courier card */}
          <div className="mx-4 mb-4 bg-[#252525] rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#333] flex items-center justify-center text-2xl">🧑‍🦯</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Алексей</div>
              <div className="text-xs text-[#888]">Ваш курьер · Рейтинг 4.9 ⭐</div>
            </div>
            <a href="tel:+79001234567" className="w-9 h-9 rounded-xl bg-[hsl(14,100%,57%)] flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Icon name="Phone" size={16} className="text-white" />
            </a>
          </div>
        </div>
      </section>

      {/* О НАС */}
      <section id="about" className="px-4 mb-10">
        <h2 className="text-xl font-rubik font-bold mb-5">О нас</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icon: "🍕", title: "14 лет", sub: "делаем пиццу" },
            { icon: "⚡", title: "35 мин", sub: "средняя доставка" },
            { icon: "⭐", title: "4.9", sub: "рейтинг на 2ГИС" },
            { icon: "🏆", title: "50 000+", sub: "довольных клиентов" },
          ].map(stat => (
            <div key={stat.title} className="bg-[#1c1c1c] rounded-3xl p-5 border border-[#252525]">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-xl font-rubik font-black text-[hsl(14,100%,57%)]">{stat.title}</div>
              <div className="text-xs text-[#888] mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
        <div className="bg-[#1c1c1c] rounded-3xl p-5 border border-[#252525]">
          <p className="text-sm text-[#bbb] leading-relaxed">
            Мы готовим пиццу из свежих ингредиентов каждый день. Наше тесто выдерживается 48 часов, а соус варится по секретному рецепту. Доставляем горячей — или возвращаем деньги.
          </p>
        </div>
      </section>

      {/* ДОСТАВКА */}
      <section id="delivery" className="px-4 mb-10">
        <h2 className="text-xl font-rubik font-bold mb-5">Доставка</h2>
        <div className="space-y-3">
          {[
            { icon: "🆓", title: "Бесплатная доставка", desc: "При заказе от 800 ₽" },
            { icon: "⏱", title: "Гарантия 35 минут", desc: "Или пицца бесплатно" },
            { icon: "📍", title: "Зона доставки", desc: "Весь город и пригород до 20 км" },
            { icon: "🗺", title: "Трекинг курьера", desc: "Смотри где курьер в реальном времени" },
          ].map(item => (
            <div key={item.title} className="bg-[#1c1c1c] rounded-2xl px-5 py-4 flex items-center gap-4 border border-[#252525]">
              <span className="text-2xl w-9 text-center flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="text-xs text-[#888] mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-[hsl(14,100%,57%)]/8 border border-[hsl(14,100%,57%)]/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" size={16} className="text-[hsl(14,100%,57%)]" />
            <span className="text-sm font-semibold">Время работы</span>
          </div>
          <div className="text-sm text-[#bbb]">Пн–Пт: 10:00 – 23:00</div>
          <div className="text-sm text-[#bbb]">Сб–Вс: 10:00 – 00:00</div>
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section id="reviews" className="px-4 mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-rubik font-bold">Отзывы</h2>
          <div className="flex items-center gap-1.5 bg-[#1c1c1c] rounded-2xl px-3 py-1.5 border border-[#252525]">
            <span className="text-sm">⭐</span>
            <span className="text-sm font-bold">4.9</span>
            <span className="text-xs text-[#888]">/ 5</span>
          </div>
        </div>
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="bg-[#1c1c1c] rounded-3xl p-4 border border-[#252525]">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#2a2a2a] flex items-center justify-center text-2xl flex-shrink-0">{r.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold">{r.name}</span>
                    <span className="text-[10px] text-[#666] flex-shrink-0">{r.time}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < r.rating ? "text-yellow-400" : "text-[#333]"}`}>★</span>
                    ))}
                  </div>
                  <p className="text-xs text-[#aaa] leading-relaxed">{r.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-3.5 rounded-2xl bg-[#1c1c1c] border border-[#252525] text-sm text-[#888] font-medium hover:bg-[#222] transition-colors">
          Все отзывы →
        </button>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contacts" className="px-4 mb-6">
        <h2 className="text-xl font-rubik font-bold mb-5">Контакты</h2>
        <div className="space-y-3">
          <a href="tel:+78001234567" className="flex items-center gap-4 bg-[#1c1c1c] rounded-3xl px-5 py-4 border border-[#252525] hover:border-[hsl(14,100%,57%)]/30 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-[hsl(14,100%,57%)] flex items-center justify-center">
              <Icon name="Phone" size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">8 800 123-45-67</div>
              <div className="text-xs text-[#888]">Бесплатный звонок</div>
            </div>
            <Icon name="ChevronRight" size={16} className="text-[#444] ml-auto" />
          </a>

          <a href="https://t.me/pizzarum" className="flex items-center gap-4 bg-[#1c1c1c] rounded-3xl px-5 py-4 border border-[#252525] hover:border-[#2AABEE]/30 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-[#2AABEE] flex items-center justify-center">
              <Icon name="Send" size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">Telegram</div>
              <div className="text-xs text-[#888]">@pizzarum</div>
            </div>
            <Icon name="ChevronRight" size={16} className="text-[#444] ml-auto" />
          </a>

          <div className="flex items-center gap-4 bg-[#1c1c1c] rounded-3xl px-5 py-4 border border-[#252525]">
            <div className="w-11 h-11 rounded-2xl bg-[#0f2b1a] flex items-center justify-center">
              <Icon name="MapPin" size={18} className="text-green-400" />
            </div>
            <div>
              <div className="text-sm font-semibold">ул. Ленина, 42</div>
              <div className="text-xs text-[#888]">Самовывоз: 10:00 – 23:00</div>
            </div>
          </div>
        </div>

        <button
          className="w-full mt-6 py-4 rounded-3xl bg-[hsl(14,100%,57%)] text-white font-rubik font-bold text-base hover:bg-[hsl(14,100%,50%)] transition-all duration-200 active:scale-95 shadow-lg shadow-orange-900/30"
          onClick={() => scrollToSection("menu")}
        >
          Заказать пиццу
        </button>
      </section>

      {/* PIZZA MODAL */}
      {selectedPizza && (
        <PizzaModal
          pizza={selectedPizza}
          onClose={() => setSelectedPizza(null)}
          onAdd={(id, sizeLabel, crustLabel, price) => addToCart(id, sizeLabel, crustLabel, price)}
        />
      )}

      {/* CART SCREEN */}
      {cartOpen && (
        <CartScreen
          items={cartItems}
          addons={cartAddons}
          onClose={() => setCartOpen(false)}
          onChangeQty={changeCartQty}
          onClear={clearCart}
          onAddonAdd={addAddon}
        />
      )}

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#0e0e0e]/98 backdrop-blur-md border-t border-[#1e1e1e] z-50">
        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 ${
                activeNav === item.id ? "bg-[hsl(14,100%,57%)]/12" : ""
              }`}
            >
              <Icon
                name={item.icon}
                size={21}
                className={activeNav === item.id ? "text-[hsl(14,100%,57%)]" : "text-[#555]"}
              />
              <span className={`text-[10px] font-medium ${activeNav === item.id ? "text-[hsl(14,100%,57%)]" : "text-[#555]"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}