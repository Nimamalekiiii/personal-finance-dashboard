
particlesJS("particles-js", {
    particles: {
        number: { value: 70 },
        size: { value: 3 },
        color: { value: "#00ffcc" },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#00ffcc",
            opacity: 0.4,
            width: 1
        },
        move: { enable: true, speed: 2 }
    }
});



let barChart;
let pieChart;
let lineChart;
let allData = [];



function toggleTheme() {
    document.body.classList.toggle("light-mode");
}



async function loadExpenses() {
    const response = await fetch("/expenses");
    allData = await response.json();
    renderData();
}



function renderData() {
    const list = document.getElementById("expense-list");
    list.innerHTML = "";

    const monthFilter = document.getElementById("monthFilter").value;
    const search = document.getElementById("searchInput").value.toLowerCase();

    let incomeTotal = 0;
    let expenseTotal = 0;
    const categoryTotals = {};
    const monthlyTotals = {};

    const filtered = allData.filter(e => {
        const [id, name, amount, category, date, type] = e;

        if (monthFilter && !date.startsWith(monthFilter)) return false;
        if (search && !name.toLowerCase().includes(search)) return false;

        return true;
    });

    filtered.forEach(e => {
        const [id, name, amount, category, date, type] = e;

        const month = date.substring(0, 7);

        if (!monthlyTotals[month]) monthlyTotals[month] = 0;

        if (type === "income") {
            incomeTotal += amount;
            monthlyTotals[month] += amount;
        } else {
            expenseTotal += amount;
            monthlyTotals[month] -= amount;

            if (!categoryTotals[category]) categoryTotals[category] = 0;
            categoryTotals[category] += amount;
        }

        list.innerHTML += `
            <div class="expense-item ${type}">
                <span>
                    ${name} - ${amount} kr 
                    (${category}) 
                    <small>${date.substring(0,10)}</small>
                </span>
                <button onclick="deleteExpense(${id})">🗑</button>
            </div>
        `;
    });

    const balance = incomeTotal - expenseTotal;

    document.getElementById("total-income").innerText = incomeTotal + " kr";
    document.getElementById("total-expense").innerText = expenseTotal + " kr";
    document.getElementById("balance").innerText = balance + " kr";

    createBarChart(filtered);
    createPieChart(categoryTotals);
    createLineChart(monthlyTotals);
}



function createBarChart(data) {
    const ctx = document.getElementById("barChart").getContext("2d");

    if (barChart) barChart.destroy();

    barChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(e => e[1]),
            datasets: [{
                label: "Beløp",
                data: data.map(e => e[2]),
                backgroundColor: data.map(e =>
                    e[5] === "income" ? "#00ff88" : "#ff4d4d"
                )
            }]
        },
        options: {
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}



function createPieChart(categoryTotals) {
    const ctx = document.getElementById("pieChart").getContext("2d");

    if (pieChart) pieChart.destroy();

    pieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    "#00ff88",
                    "#00cfff",
                    "#ff00ff",
                    "#ffaa00",
                    "#ff4d4d"
                ]
            }]
        },
        options: {
            animation: {
                duration: 1500
            }
        }
    });
}



function createLineChart(monthlyTotals) {

    if (!document.getElementById("lineChart")) return;

    const ctx = document.getElementById("lineChart").getContext("2d");

    if (lineChart) lineChart.destroy();

    lineChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: Object.keys(monthlyTotals),
            datasets: [{
                label: "Månedlig Netto",
                data: Object.values(monthlyTotals),
                borderColor: "#00ffcc",
                backgroundColor: "rgba(0,255,204,0.2)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            animation: {
                duration: 1500
            }
        }
    });
}


async function addExpense() {
    const name = document.getElementById("name").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const type = document.getElementById("type").value;

    if (!name || !amount || !date) {
        alert("Fyll ut alle felt");
        return;
    }

    await fetch("/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, amount, category, date, type })
    });

    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";

    loadExpenses();
}



async function deleteExpense(id) {
    await fetch("/delete/" + id, { method: "DELETE" });
    loadExpenses();
}



const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll(".footer-box, .kpi-card").forEach(el => {
    el.classList.add("hidden");
    observer.observe(el);
});


document.getElementById("monthFilter").addEventListener("change", renderData);
document.getElementById("searchInput").addEventListener("input", renderData);



loadExpenses();