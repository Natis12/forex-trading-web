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
    
    // Guardar la operación en el JSON (simulado)
    let operations = JSON.parse(localStorage.getItem('operations')) || [];
    operations.push(operation);
    localStorage.setItem('operations', JSON.stringify(operations));
    
    // Actualizar resumen
    updateSummary();
});

function updateSummary() {
    const operations = JSON.parse(localStorage.getItem('operations')) || [];
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = '';
    
    operations.forEach(op => {
        summaryDiv.innerHTML += `<p>${op.date} - ${op.pair}: Ganancia/Pérdida: ${op.profit.toFixed(2)}</p>`;
    });
}

document.addEventListener('DOMContentLoaded', updateSummary);

