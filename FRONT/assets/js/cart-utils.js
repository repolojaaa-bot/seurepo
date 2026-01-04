const CartUtils = (() => {
    // ALTERADO: Chave genérica para consistência
    const CART_KEY = 'myStoreCart';

    const getCart = () => {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    };

    const getCartCount = () => {
        const cart = getCart();
        return cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    };

    // Atualiza a bolinha vermelha do carrinho no header
    const updateCartBadge = () => {
        const count = getCartCount();
        const badge = document.querySelector('.cart-count');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    };

    return {
        getCart,
        getCartCount,
        updateCartBadge
    };
})();

// Inicializa ao carregar
document.addEventListener('DOMContentLoaded', CartUtils.updateCartBadge);