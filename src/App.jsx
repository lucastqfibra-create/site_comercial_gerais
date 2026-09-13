import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import CartFloatingButton from './components/CartFloatingButton';
import ProductCard from './components/ProductCard';
import { PRODUCTS, CATEGORIES } from './data/products';

function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const { addToCart } = useCart();

  const filteredProducts =
    selectedCategory === 'todos'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topo / Header */}
      <header className="bg-amber-600 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Comercial Gerais</h1>
            <p className="text-xs text-amber-100">João Pinheiro - MG | (38) 99737-1712</p>
          </div>
          <a
            href="https://wa.me/5538997371712"
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded shadow"
          >
            WhatsApp da Loja
          </a>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-amber-500/10 border-b border-amber-200/50 py-8 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Tudo para sua festa, seu delivery e sua confeitaria
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Monte sua lista de compras online e receba a confirmação rápida de preços e disponibilidade direto no WhatsApp.
          </p>
        </div>
      </section>

      {/* Categorias */}
      <nav className="max-w-6xl mx-auto px-4 py-4 w-full overflow-x-auto flex gap-2">
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
      </nav>

      {/* Grade de Produtos */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center text-xs mt-12">
        <p className="font-semibold text-white">Comercial Gerais LTDA</p>
        <p className="mt-1">Rua Geraldo Rios, 333 - Centro, João Pinheiro - MG</p>
        <p className="mt-1 text-gray-400">Segunda a Sexta: 07h às 18h | Sábado: 07h às 12h</p>
      </footer>

      {/* Gaveta e Botão do Carrinho */}
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
