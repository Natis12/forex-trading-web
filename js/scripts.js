document.getElementById('operation-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const date = document.getElementById('date').value;
    const pair = document.getElementById('pair').value;
    const entryPrice = parseFloat(document.getElementById('entry-price').value);
    const exitPrice = parseFloat(document.getElementById('exit-price').value);
    const quantity = parseFloat(document.getElementById('quantity').value);
    
    const profit = (exitPrice - entryPrice) * quantity;
    
    const operation = {
        date,
        pair,
        entryPrice,
        exitPrice,
        quantity,
        profit
    };
    
    // Guardar la operación en el JSON (simulado con localStorage)
    let operations = JSON.parse(localStorage.getItem('operations')) || [];
    operations.push(operation);
    localStorage.setItem('operations', JSON.stringify(operations));
    
    // Actualizar resumen
    updateSummary(pair);
});

document.querySelectorAll('#tabs a').forEach(tab => {
    tab.addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        updateSummary(this.dataset.pair);
    });
});

function updateSummary(pair) {
    const operations = JSON.parse(localStorage.getItem('operations')) || [];
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = '';

    const filteredOperations = operations.filter(op => op.pair === pair);
    
    filteredOperations.forEach(op => {
        summaryDiv.innerHTML += `<p>${op.date} - ${op.pair}: Ganancia/Pérdida: ${op.profit.toFixed(2)}</p>`;
    });
}

// Actualiza el resumen para el par seleccionado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        updateSummary(activeTab.dataset.pair);
    }
});
