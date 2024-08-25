const trades = [];

function showTab(tabId) {
    // Oculta todas las pestañas y muestra la seleccionada
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// Manejador de eventos para el formulario de registro de operaciones
document.getElementById('trade-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const currencyPair = document.getElementById('currency-pair').value;
    const operationType = document.getElementById('operation-type').value;
    const entryPrice = parseFloat(document.getElementById('entry-price').value);
    const exitPrice = parseFloat(document.getElementById('exit-price').value);
    const quantity = parseFloat(document.getElementById('quantity').value);

    if (!date || !currencyPair || !operationType || isNaN(entryPrice) || isNaN(exitPrice) || isNaN(quantity)) {
        alert('Por favor, complete todos los campos requeridos correctamente.');
        return;
    }

    const trade = { date, currencyPair, operationType, entryPrice, exitPrice, quantity };
    trades.push(trade);
    updateSummary();
    updateCharts();
    updateStats();
    updateCurrencyStats();
    this.reset();
});

function updateSummary() {
    const summary = document.getElementById('summary-content');
    const profitLoss = trades.reduce((total, trade) => {
        const pl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.operationType === 'buy' ? 1 : -1);
        return total + pl;
    }, 0);
    summary.innerHTML = `
        <p>Total de operaciones: ${trades.length}</p>
        <p>Beneficio/Pérdida neta: $${profitLoss.toFixed(2)}</p>
    `;
}

function updateCharts() {
    const chartContainer = document.getElementById('chart-container');
    chartContainer.innerHTML = '<canvas id="trade-chart"></canvas>';
    const ctx = document.getElementById('trade-chart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: trades.map(trade => trade.date),
            datasets: [{
                label: 'Evolución de Beneficios/Pérdidas',
                data: trades.map(trade => {
                    const pl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.operationType === 'buy' ? 1 : -1);
                    return pl;
                }),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Beneficio/Pérdida'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function updateStats() {
    const statsContent = document.getElementById('stats-content');
    const totalTrades = trades.length;
    const winningTrades = trades.filter(trade => 
        (trade.exitPrice - trade.entryPrice) * (trade.operationType === 'buy' ? 1 : -1) > 0
    ).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    statsContent.innerHTML = `
        <p>Tasa de acierto: ${winRate.toFixed(2)}%</p>
        <p>Operaciones ganadoras: ${winningTrades}</p>
        <p>Operaciones perdedoras: ${totalTrades - winningTrades}</p>
    `;
}

function updateCurrencyStats() {
    const currencyStatsContent = document.getElementById('currency-stats-content');
    const currencyStats = trades.reduce((acc, trade) => {
        const key = trade.currencyPair;
        if (!acc[key]) {
            acc[key] = { profitLoss: 0, count: 0 };
        }
        const pl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.operationType === 'buy' ? 1 : -1);
        acc[key].profitLoss += pl;
        acc[key].count += 1;
        return acc;
    }, {});

    currencyStatsContent.innerHTML = '<table><tr><th>Par de Divisas</th><th>Total de Operaciones</th><th>Beneficio/Pérdida Neta</th></tr>';
    for (const [pair, stats] of Object.entries(currencyStats)) {
        currencyStatsContent.innerHTML += `
            <tr>
                <td>${pair}</td>
                <td>${stats.count}</td>
                <td>$${stats.profitLoss.toFixed(2)}</td>
            </tr>
        `;
    }
    currencyStatsContent.innerHTML += '</table>';
}

function editTrade() {
    const date = document.getElementById('edit-date').value;
    const currencyPair = document.getElementById('edit-currency-pair').value;
    const operationType = document.getElementById('edit-operation-type').value;
    const entryPrice = parseFloat(document.getElementById('edit-entry-price').value);
    const exitPrice = parseFloat(document.getElementById('edit-exit-price').value);
    const quantity = parseFloat(document.getElementById('edit-quantity').value);

    if (!date || !currencyPair || !operationType || isNaN(entryPrice) || isNaN(exitPrice) || isNaN(quantity)) {
        alert('Por favor, complete todos los campos requeridos correctamente.');
        return;
    }

    const tradeIndex = trades.findIndex(trade => 
        trade.date === date &&
        trade.currencyPair === currencyPair &&
        trade.operationType === operationType
    );

    if (tradeIndex !== -1) {
        trades[tradeIndex] = { date, currencyPair, operationType, entryPrice, exitPrice, quantity };
        updateSummary();
        updateCharts();
        updateStats();
        updateCurrencyStats();
    } else {
        alert('No se encontró la operación para editar.');
    }
}

function exportStats() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + trades.map(e => Object.values(e).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "forex_trading_stats.csv");
    document.body.appendChild(link);
    link.click();
}
