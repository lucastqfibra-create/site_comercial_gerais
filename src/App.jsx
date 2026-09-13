import React, { createContext, useContext, useState, useEffect } from 'react';

// ==========================================
// 1. DADOS E CONFIGURAÇÕES
// ==========================================
const WHATSAPP_NUMBER = '5538997371712'; // Comercial Gerais

const CATEGORIES = [
  { id: 'todos', label: 'Todos os Produtos' },
  { id: 'embalagens', label: 'Embalagens & Delivery' },
  { id: 'confeitaria', label: 'Confeitaria & Doces' },
  { id: 'festas', label: 'Artigos para Festas' },
  { id: 'descartaveis', label: 'Descartáveis & Limpeza' },
];

const PRODUCTS = [
  {
    id: 1,
    name: 'Caixa para Bolo com Tampa',
    category: 'embalagens',
    description: 'Ideal para bolos decorados e tortas. Estrutura firme e apresentação profissional.',
    unit: 'Pacote c/ 10 un.',
    image: '',
  },
  {
    id: 2,
    name: 'Balões de Látex nº 9 Pic Pic',
    category: 'festas',
    description: 'Alta resistência e brilho uniforme para arcos, painéis e arranjos.',
    unit: 'Pacote c/ 50 un.',
    image: '',
  },
  {
    id: 3,
    name: 'Cobertura de Chocolate em Barra 1kg',
    category: 'confeitaria',
    description: 'Ideal para bombons, raspas decorativas, trufas e banhos.',
    unit: 'Barra 1kg',
    image: '',
  },
  {
    id: 4,
    name: 'Copo Descartável 200ml Transparente',
    category: 'descartaveis',
    description: 'Praticidade e resistência para empresas, eventos e uso diário.',
    unit: 'Fardo c/ 1000 un.',
    image: '',
  },
  {
    id: 5,
    name: 'Marmitex de Alumínio c/ Fechamento',
    category: 'embalagens',
    description: 'Vedação segura para delivery de refeições quentes.',
    unit: 'Caixa c/ 100 un.',
    image: '',
  },
  {
    id: 6,
    name: 'Saco Kraft para Delivery',
    category: 'embalagens',
    description: 'Resistente e sustentável, valoriza a entrega de lanches e refeições.',
    unit: 'Fardo c/ 50 un.',
    image: '',
  },
  {
    id: 7,
    name: 'Granulado Macio para Brigadeiro',
    category: 'confeitaria',
    description: 'Sabor acentuado e acabamento brilhante para doces artesanais.',
    unit: 'Pacote 500g',
    image: '',
  },
  {
    id: 8,
    name: 'Vela de Aniversário e Faísca',
    category: 'festas',
    description: 'Modelos tradicionais, numéricos e vulcão para comemorações.',
    unit: 'Unidade',
    image: '',
  },
  {
    id: 9,
    name: 'Garrafa para Suco 300ml c/ Tampa Lacre',
    category: 'embalagens',
    description: 'Garrafa plástica descartável com tampa lacre, ideal para sucos naturais e água de coco.',
    unit: 'Fardo c/ 50 ou 100 un.',
    image: './embalagem-suco.jpg',
  },
  {
    id: 10,
    name: 'Garrafa para Suco 500ml c/ Tampa Lacre',
    category: 'embalagens',
    description: 'Garrafa resistente com fechamento seguro para sucos, caldo de cana e vitaminas delivery.',
    unit: 'Fardo c/ 50 ou 100 un.',
    image: './embalagem-suco.jpg',
  },
  {
    id: 11,
    name: 'Garrafa para Suco 1 Litro c/ Tampa Lacre',
    category: 'embalagens',
    description: 'Garrafa plástica de 1L com vedação lacre, ideal para bebidas em maior volume.',
    unit: 'Fardo c/ 50 un.',
    image: './embalagem-suco.jpg',
  }
];

// ==========================================
// 2. CONTEXTO DO CARRINHO
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
// 3. LOGO & CARD RESPONSIVO COM ZOOM
// ==========================================
function Logo() {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="w-10 h-10 rounded-full border-2 border-emerald-700 bg-white flex items-center justify-center font-serif font-bold text-emerald-800 text-base shadow-xs">
        CG
      </div>
    );
  }

  return (
    <img
      src="./logo.jpg"
      alt="Comercial Gerais Logo"
      onError={() => setImgError(true)}
      className="w-10 h-10 rounded-full object-contain bg-white border border-emerald-600 shadow-xs"
    />
  );
}

function ProductCard({ product, onAddToCart }) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleDirectWhatsApp = (e) => {
    e.stopPropagation();
    const text = `Olá! Vi o produto *${product.name}* no catálogo da Comercial Gerais e gostaria de verificar valores e disponibilidade.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group">
        {/* Imagem Proporcional 1:1 */}
        <div
          onClick={() => product.image && setIsZoomOpen(true)}
          className={`relative w-full aspect-square bg-gray-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden ${
            product.image ? 'cursor-pointer' : ''
          }`}
          title={product.image ? 'Toque para ampliar' : ''}
        >
          {product.image ? (
            <>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute bottom-2 right-2 bg-black/60 text-white px-1.5 py-0.5 rounded text-[10px] opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-opacity">
                🔍 Zoom
              </span>
            </>
          ) : (
            <div className="text-emerald-800/60 font-semibold text-xs flex flex-col items-center gap-1 text-center p-2">
              <span className="text-3xl sm:text-4xl">📦</span>
              <span className="text-[11px] leading-tight text-gray-400">{product.name}</span>
            </div>
          )}
        </div>

        {/* Textos */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-800 uppercase tracking-wider block truncate">
              {product.category}
            </span>
            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mt-0.5 line-clamp-2 leading-snug">
              {product.name}
            </h3>
            <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 hidden sm:block">
              {product.description}
            </p>
            <span className="inline-block bg-emerald-50 text-emerald-900 border border-emerald-200/50 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md mt-2">
              {product.unit}
            </span>
          </div>

          {/* Ações */}
          <div className="mt-3 flex flex-col sm:flex-row gap-1.5 sm:gap-2 pt-2 border-t border-gray-50">
            <button
              onClick={() => onAddToCart(product)}
              className="w-full sm:flex-1 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold py-2 px-2 rounded-lg transition-colors shadow-xs"
            >
              + Adicionar
            </button>
            <button
              onClick={handleDirectWhatsApp}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-xs"
              title="Pedir direto no WhatsApp"
            >
              <span>💬</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Lightbox */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-2xl p-4 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 text-xl font-bold p-1 leading-none"
            >
              ✕
            </button>
            <h4 className="text-sm font-bold text-gray-800 mb-3 text-center px-6">
              {product.name}
            </h4>
            <div className="w-full max-h-[70vh] flex items-center justify-center bg-gray-50 rounded-xl p-2">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
              />
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">{product.description}</p>
          </div>
        </div>
      )}
    </>
  );
}

// ==========================================
// 4. SEÇÃO "SOBRE NÓS"
// ==========================================
function AboutSection({ onGoToCatalog }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-2 bg-emerald-50 rounded-full mb-2">
          <Logo />
        </div>
        <h2 className="text-3xl font-extrabold text-emerald-950">
          Comercial Gerais
        </h2>
        <p className="text-emerald-800 text-sm font-medium tracking-wide">
          Tradição, variedade e compromisso com o comércio de João Pinheiro
        </p>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto pt-2">
          A Comercial Gerais faz parte da rotina de João Pinheiro há mais de 30 anos. Atendemos tanto famílias que buscam artigos para festas e momentos especiais quanto confeiteiros, lanchonetes e empreendedores locais que dependem de embalagens confiáveis e doces de qualidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center space-y-2">
          <span className="text-3xl">🎂</span>
          <h3 className="font-bold text-gray-900 text-base">Festas & Decoração</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Balões, descartáveis temáticos, velas e artigos completos para aniversários e celebrações.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center space-y-2">
          <span className="text-3xl">🧁</span>
          <h3 className="font-bold text-gray-900 text-base">Confeitaria & Doces</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Chocolates em barra, confeitos, formas e os ingredientes que fazem a diferença na confeitaria.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center space-y-2">
          <span className="text-3xl">🛵</span>
          <h3 className="font-bold text-gray-900 text-base">Embalagens & Delivery</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Caixas térmicas, marmitex, sacolas kraft e potes para restaurantes e lanchonetes.
          </p>
        </div>
      </div>

      <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="bg-emerald-800 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Nossa Loja Física
            </span>
            <h3 className="text-2xl font-bold">Visite nossa loja no Centro</h3>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Compre direto no balcão ou monte sua lista no catálogo online para agilizar sua retirada.
            </p>
            <div className="pt-2 text-xs space-y-1 text-emerald-200">
              <p>📍 <strong>Endereço:</strong> Rua Geraldo Rios, 333 - Centro, João Pinheiro - MG</p>
              <p>⏰ <strong>Horário:</strong> Segunda a Sexta das 07h às 18h | Sábado das 07h às 12h</p>
              <p>📱 <strong>WhatsApp:</strong> (38) 99737-1712</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center items-start md:items-end">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá, Comercial Gerais! Gostaria de falar com um atendente.')}`}
              target="_blank"
              rel="noreferrer"
              className="bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs py-3 px-6 rounded-xl shadow transition-colors w-full sm:w-auto text-center"
            >
              Falar no WhatsApp
            </a>
            <button
              onClick={onGoToCatalog}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs py-3 px-6 rounded-xl border border-emerald-700 transition-colors w-full sm:w-auto text-center"
            >
              Ver Catálogo de Produtos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. GAVETA DO CARRINHO & BOTÃO FLUTUANTE
// ==========================================
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
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-emerald-800 text-white">
            <div>
              <h2 className="text-base font-bold">Minha Lista de Pedido</h2>
              <p className="text-xs text-emerald-200">
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
                <p className="text-xs mt-1">Navegue pelas categorias e adicione os produtos desejados.</p>
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
                  placeholder="Ex: Ana (Confeitaria)"
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-700"
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
                  placeholder="Ex: Retirada hoje à tarde"
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-700"
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
      className="fixed bottom-6 right-6 z-40 bg-emerald-800 hover:bg-emerald-900 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105"
      aria-label="Abrir lista de pedidos"
    >
      <span className="text-xl">🛒</span>
      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
        {totalItemsCount}
      </span>
    </button>
  );
}

// ==========================================
// 6. LAYOUT PRINCIPAL (2 COLUNAS NO MOBILE)
// ==========================================
function MainLayout() {
  const [activeTab, setActiveTab] = useState('catalogo');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const { addToCart } = useCart();

  const filteredProducts =
    selectedCategory === 'todos'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      {/* Topo */}
      <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-tight">Comercial Gerais</h1>
              <p className="text-[11px] text-emerald-200">João Pinheiro - MG</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 bg-emerald-950/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('catalogo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'catalogo'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => setActiveTab('sobre')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'sobre'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Sobre Nós
            </button>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs transition-colors items-center gap-1.5"
          >
            <span>Atendimento</span>
          </a>
        </div>
      </header>

      {/* Conteúdo Dinâmico */}
      {activeTab === 'sobre' ? (
        <AboutSection onGoToCatalog={() => setActiveTab('catalogo')} />
      ) : (
        <>
          <section className="bg-gradient-to-b from-emerald-50/80 to-gray-50 py-8 sm:py-10 px-4 text-center border-b border-gray-200/50">
            <div className="max-w-2xl mx-auto">
              <span className="bg-emerald-100 text-emerald-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Catálogo Digital
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3 leading-tight">
                Embalagens, festas e confeitaria em João Pinheiro
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                Monte sua lista de itens e envie sua solicitação direto para nossa equipe pelo WhatsApp.
              </p>
            </div>
          </section>

          {/* Categorias */}
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 w-full">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grade Responsiva: 2 colunas no celular */}
          <main className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-4 flex-1 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          </main>
        </>
      )}

      {/* Rodapé */}
      <footer className="bg-emerald-950 text-emerald-200 py-8 text-center text-xs mt-12 border-t border-emerald-900">
        <p className="font-bold text-white text-sm">Comercial Gerais LTDA</p>
        <p className="mt-1">Rua Geraldo Rios, 333 - Centro, João Pinheiro - MG</p>
        <p className="mt-1 text-emerald-300">Segunda a Sexta: 07h às 18h | Sábado: 07h às 12h</p>
        <p className="mt-4 text-emerald-400 text-[11px]">
          Catálogo digital informativo • Pedidos e orçamentos via WhatsApp
        </p>
      </footer>

      {/* Elementos Flutuantes */}
      <CartDrawer />
      <CartFloatingButton />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}
