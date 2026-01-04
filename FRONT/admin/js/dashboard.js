document.addEventListener('DOMContentLoaded', async () => {
    // ALTERADO PARA LOCALHOST (VERSÃO DE VENDA)
    const API_URL = 'http://localhost:8080/api/dashboard';
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        window.location.href = '/FRONT/login/HTML/login.html';
        return;
    }

    const apiClient = axios.create({
        baseURL: API_URL,
        headers: { 'Authorization': `Bearer ${token}` }
    });

    // Elementos dos Cards
    const totalVendasEl = document.getElementById('total-vendas');
    const pedidosPendentesEl = document.getElementById('pedidos-pendentes');
    const produtosEstoqueEl = document.getElementById('produtos-estoque');
    const faturamentoMensalEl = document.getElementById('faturamento-mensal');

    // Inicialização dos Gráficos (Chart.js)
    let salesChart, categoryChart;

    async function loadDashboardData() {
        try {
            const response = await apiClient.get('/stats');
            const data = response.data;

            // Preenche os Cards
            totalVendasEl.textContent = data.totalVendas || 0;
            pedidosPendentesEl.textContent = data.pedidosPendentes || 0;
            produtosEstoqueEl.textContent = data.produtosBaixoEstoque || 0;
            
            const fat = data.faturamentoTotal || 0;
            faturamentoMensalEl.textContent = fat.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            // Atualiza Gráficos
            updateSalesChart(data.vendasPorMes || []);
            updateCategoryChart(data.vendasPorCategoria || []);

        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            if (error.response && error.response.status === 403) {
                window.location.href = '/FRONT/login/HTML/login.html';
            }
        }
    }

    function updateSalesChart(data) {
        const ctx = document.getElementById('salesChart').getContext('2d');
        
        // Se já existe, destrói para criar novo
        if (salesChart) salesChart.destroy();

        salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.mes), // Ex: ['Jan', 'Fev']
                datasets: [{
                    label: 'Vendas (R$)',
                    data: data.map(d => d.valor),
                    borderColor: '#ff7a00',
                    backgroundColor: 'rgba(255, 122, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#333' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    function updateCategoryChart(data) {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        if (categoryChart) categoryChart.destroy();

        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(d => d.categoria),
                datasets: [{
                    data: data.map(d => d.quantidade),
                    backgroundColor: ['#ff7a00', '#ff9a3d', '#ffb978', '#e2e8f0'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: { 
                    legend: { position: 'bottom', labels: { color: '#fff' } } 
                }
            }
        });
    }

    loadDashboardData();
});