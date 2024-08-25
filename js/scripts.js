const trades = [];

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

document.getElementById('trade-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!document.getElementById('date').value || !document.getElementById('currency-pair').value) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
    }
    const trade = {
        date: document.getElementById('date').value,
        currencyPair: document.getElementById('currency-pair').value,
        operationType: document.getElementById('operation-type').value,
        entryPrice: parseFloat(document.getElementById('entry-price').value),
        exitPrice: parseFloat(document.getElementById('exit-price').value),
        quantity: parseFloat(document.getElementById('quantity').value)
    };
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
        const pl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (
