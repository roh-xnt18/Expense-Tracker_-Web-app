let transactions = [];

function formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function updateBalance() {
    const balance = transactions.reduce((acc, transaction) => {
        if (transaction.category === 'income') {
            return acc + transaction.amount;
        } else {
            return acc - transaction.amount;
        }
    }, 0);

    const income = transactions
        .filter(t => t.category === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
        .filter(t => t.category === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    document.getElementById('balance').textContent = formatAmount(balance);
    document.getElementById('income').textContent = formatAmount(income);
    document.getElementById('expense').textContent = formatAmount(expense);
}

function addTransaction(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
        category
    };

    transactions.push(transaction);
    updateBalance();
    displayTransactions();

    // Reset form
    e.target.reset();
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateBalance();
    displayTransactions();
}

function displayTransactions() {
    const transactionHistory = document.getElementById('transactionHistory');
    transactionHistory.innerHTML = '';

    transactions.forEach(transaction => {
        const div = document.createElement('div');
        div.classList.add('transaction', transaction.category);

        div.innerHTML = `
            <span>${transaction.description}</span>
            <span class="transaction-amount">
                ${transaction.category === 'income' ? '+' : '-'}${formatAmount(transaction.amount)}
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">×</button>
            </span>
        `;

        transactionHistory.appendChild(div);
    });
}

// Initialize the app
document.getElementById('transactionForm').addEventListener('submit', addTransaction);

// Optional: Load saved transactions from localStorage
const savedTransactions = localStorage.getItem('transactions');
if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
    updateBalance();
    displayTransactions();
}

// Optional: Save transactions to localStorage whenever they change
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Add this to your existing functions where transactions are modified
// After updateBalance() and displayTransactions() calls, add:
// saveTransactions();