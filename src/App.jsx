import React, { createContext, useContext, useState, useEffect } from 'react';

// ==========================================
// 1. CONFIGURAÇÕES & DADOS DOS PRODUTOS
// ==========================================
const WHATSAPP_NUMBER = '5538997371712'; // Telefone oficial da Comercial Gerais

const CATEGORIES = [
  { id: 'todos', label: 'Todos os Produtos' },
  { id: 'embalagens', label: 'Embalagens & Delivery' },
  { id: 'confeitaria', label: 'Confeitaria & Doces' },
  { id: 'festas', label: 'Artigos para Festas' },
  { id: 'descartaveis', label: 'Descartáveis' },
];

const PRODUCTS = [
  {
    id: 1,
    name: 'Caixa para Bolo com Tampa',
    category: 'embalagens',
    description: 'Ideal para bolos decorados e tortas. Estrutura firme.',
    unit: 'Pacote c/ 10 un.',
    image: '',
  },
  {
    id: 2,
    name: 'Balões de Látex nº 9 Pic Pic',
    category: 'festas',
    description: 'Alta resistência e brilho uniforme para arcos e decorações.',
    unit: 'Pacote c/ 50 un.',
    image: '',
  },
  {
    id: 3,
    name: 'Cobertura de Chocolate em Barra 1kg',
    category: 'confeitaria',
    description: 'Ideal para trufas, raspas, bombons e banhos.',
    unit: 'Barra 1kg',
    image: '',
  },
  {
    id: 4,
    name: 'Copo Descartável 200ml Transparente',
    category: 'descartaveis',
    description: 'Praticidade para festas, comércio e eventos.',
    unit: 'Fardo c/ 1000 un.',
    image: '',
  },
  {
    id: 5,
    name: 'Marmitex de Alumínio c/ Tampa',
    category: 'embalagens',
    description: 'Excelente vedação para almoço e marmitas delivery.',
    unit: 'Caixa c/ 100 un.',
    image: '',
  },
  {
    id: 6,
    name: 'Saco Kraft para Delivery Grande',
    category: 'embalagens',
    description: 'Resistente e sustentável para entregas de alimentos.',
    unit: 'Fardo c/ 50 un.',
    image: '',
  }
];

// ==========================================
// 2. CONTEXTO DO CARRINHO (ESTADO GLOBAL)
// ==========================================
const CartContext = createContext();

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cg_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cg_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsDrawerOpen(true);
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => useContext(CartContext);

// ==========================================
// 3. COMPONENTES DO CATÁLOGO
// ==========================================

function ProductCard({ product, onAddToCart }) {
  const handleDirectWhatsApp = () => {
    const text = `Olá! Vi o produto *${product.name}* no catálogo da Comercial Gerais e gostaria de consultar valores e disponibilidade.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
      <div className="h-40 bg-amber-50 flex items-center justify-center p-4 text-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="max-h-full object-contain" />
        ) : (
          <div className="text-amber-700/60 font-semibold text-xs flex flex-col items-center gap-1">
            <span className="text-2xl">📦</span>
            <span>{product.name}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="font-semibold text-gray-900 text-sm mt-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          <span className="inline-block bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded mt-2 font-medium">
            {product.unit}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
          >
            + Adicionar
          </button>
          <button
            onClick={handleDirectWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            title="Pedir direto no WhatsApp"
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer() {
  const { cartItems, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  if (!isDrawerOpen) return null;

  const handleSendOrder = () => {
    if (cartItems.length === 0) return;

    let message = `*Olá, Comercial Gerais! Gostaria de consultar um pedido pelo site:*\n\n`;

    if (customerName.trim()) {
      message += `👤 *Cliente:* ${customerName.trim()}\n\n`;
    }

    message += `📋 *Itens solicitados:*\n`;
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.quantity}x* ${item.name} (${item.unit || 'un'})\n`;
    });

    if (notes.trim()) {
      message += `\n💬 *Observação:* ${notes.trim()}\n`;
    }

    message += `\n_Poderiam me confirmar a disponibilidade e valores para retirada/entrega?_`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-amber-600 text-white">
            <div>
              <h2 className="text-base font-bold">Minha Lista de Pedido</h2>
              <p className="text-xs text-amber-100">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} na lista
              </p>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-white/80 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <span className="text-4xl block mb-2">🛒</span>
                <p className="text-sm font-medium text-gray-600">Sua lista está vazia</p>
                <p className="text-xs mt-1">Navegue pelas categorias e selecione os itens desejados.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-gray-800 truncate">{item.name}</h4>
                    <span className="text-[11px] text-gray-500 block">{item.unit}</span>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 text-base p-1"
                    title="Remover item"
                  >
                    🗑
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-4 border-t border-gray-200 space-y-3 bg-gray-50">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Seu Nome (opcional):
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Maria da Confeitaria"
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Observações (opcional):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Retirada no balcão"
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none focus:border-amber-600"
                />
              </div>

              <button
                onClick={handleSendOrder}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition-colors"
              >
                <span>Enviar Pedido via WhatsApp</span>
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-gray-400 hover:text-red-600 py-1"
              >
                Limpar lista
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CartFloatingButton() {
  const { totalItemsCount, setIsDrawerOpen } = useCart();

  if (totalItemsCount === 0) return null;

  return (
    <button
      onClick={() => setIsDrawerOpen(true)}
      className="fixed bottom-6 right-6 z-40 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105"
      aria-label="Abrir lista de pedidos"
    >
      <span className="text-xl">🛒</span>
      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
        {totalItemsCount}
      </span>
    </button>
  );
}

function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const { addToCart } = useCart();

  const filteredProducts =
    selectedCategory === 'todos'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* Topo */}
      <header className="bg-amber-600 text-white shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black tracking-tight">Comercial Gerais</h1>
            <p className="text-[11px] text-amber-100">João Pinheiro - MG | (38) 99737-1712</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-amber-50 to-gray-50 py-10 px-4 text-center border-b border-gray-200/60">
        <div className="max-w-2xl mx-auto">
          <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Catálogo Online
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3 leading-tight">
            Embalagens, festas e confeitaria no centro de João Pinheiro
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Escolha os itens que precisa para o seu negócio ou evento e envie a cotação direto para os nossos atendentes.
          </p>
        </div>
      </section>

      {/* Menu de Categorias */}
      <div className="max-w-6xl mx-auto px-4 py-4 w-full">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grade de Produtos */}
      <main className="max-w-6xl mx-auto px-4 py-4 flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </main>

      {/* Rodapé Institucional */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center text-xs mt-12 border-t border-gray-800">
        <p className="font-bold text-white text-sm">Comercial Gerais LTDA</p>
        <p className="mt-1 text-gray-400">Rua Geraldo Rios, 333 - Centro, João Pinheiro - MG</p>
        <p className="mt-1 text-gray-400">Segunda a Sexta: 07h às 18h | Sábado: 07h às 12h</p>
        <p className="mt-4 text-gray-500 text-[11px]">
          Catálogo digital não transacional • Orçamentos e pedidos via WhatsApp
        </p>
      </footer>

      {/* Componentes Flutuantes */}
      <CartDrawer />
      <CartFloatingButton />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Catalog />
    </CartProvider>
  );
}
