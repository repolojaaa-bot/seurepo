document.addEventListener('DOMContentLoaded', async () => {
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

    const totalVendasEl = document.getElementById('total-vendas');
    const pedidosPendentesEl = document.getElementById('pedidos-pendentes');
    const produtosEstoqueEl = document.getElementById('produtos-estoque');
    const faturamentoMensalEl = document.getElementById('faturamento-mensal');

    let salesChart, categoryChart;

    async function loadDashboardData() {
        try {
            const response = await apiClient.get('/stats');
            const data = response.data;

            totalVendasEl.textContent = data.totalVendas || 0;
            pedidosPendentesEl.textContent = data.pedidosPendentes || 0;
            produtosEstoqueEl.textContent = data.produtosBaixoEstoque || 0;
            
            const fat = data.faturamentoTotal || 0;
            faturamentoMensalEl.textContent = fat.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
        if (salesChart) salesChart.destroy();

        salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.mes),
                datasets: [{
                    label: 'Vendas (R$)',
                    data: data.map(d => d.valor),
                    // COR PRINCIPAL: ROXO VIBRANTE
                    borderColor: '#9d4edd', 
                    // FUNDO: ROXO CLARO TRANSPARENTE
                    backgroundColor: 'rgba(157, 78, 221, 0.1)', 
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
                    // PALETA DE ROXOS PARA O GRÁFICO DE ROSCA
                    backgroundColor: ['#9d4edd', '#b5179e', '#7209b7', '#e2e8f0'],
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