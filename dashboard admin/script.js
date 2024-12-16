document.addEventListener('DOMContentLoaded', function() {
    // Fungsi untuk menampilkan section yang dipilih
    function showSection(sectionId) {
        document.querySelectorAll('main > section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
    }

    // Event listener untuk menu navigasi
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Data penjualan bulanan
    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56]
    };

    // Membuat grafik penjualan bulanan
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: salesData.labels,
            datasets: [{
                label: 'Penjualan (dalam juta Rupiah)',
                data: salesData.data,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Data distribusi produk
    const productData = {
        labels: ['Elektronik', 'Pakaian', 'Makanan', 'Buku', 'Lainnya'],
        data: [30, 25, 20, 15, 10]
    };

    // Membuat grafik distribusi produk
    const productCtx = document.getElementById('productChart').getContext('2d');
    new Chart(productCtx, {
        type: 'doughnut',
        data: {
            labels: productData.labels,
            datasets: [{
                data: productData.data,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Data pengguna
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer' },
    ];

    // Mengisi tabel pengguna
    const userTableBody = document.querySelector('#userTable tbody');
    users.forEach(user => {
        const row = userTableBody.insertRow();
        row.insertCell(0).textContent = user.id;
        row.insertCell(1).textContent = user.name;
        row.insertCell(2).textContent = user.email;
        row.insertCell(3).textContent = user.role;
        const actionCell = row.insertCell(4);
        actionCell.innerHTML = '<button class="edit-btn">Edit</button> <button class="delete-btn">Hapus</button>';
    });

    // Data produk
    const products = [
        { id: 1, name: 'Laptop Asus', category: 'Elektronik', price: 10000000, stock: 50, sales: 75 },
        { id: 2, name: 'iPhone 12', category: 'Elektronik', price: 15000000, stock: 30, sales: 90 },
        { id: 3, name: 'Baju Polo', category: 'Pakaian', price: 200000, stock: 100, sales: 60 },
        { id: 4, name: 'Sepatu Nike', category: 'Sepatu', price: 1500000, stock: 40, sales: 80 },
        { id: 5, name: 'Kamera Canon', category: 'Elektronik', price: 8000000, stock: 25, sales: 70 },
    ];

    // Fungsi untuk membuat diagram batang
    function createBarChart(percentage) {
        return `
            <div class="bar-chart">
                <div class="bar" style="width: ${percentage}%">${percentage}%</div>
            </div>
        `;
    }

    // Mengisi tabel produk
    const productTableBody = document.querySelector('#productTable tbody');
    products.forEach(product => {
        const row = productTableBody.insertRow();
        row.insertCell(0).textContent = product.id;
        row.insertCell(1).textContent = product.name;
        row.insertCell(2).textContent = product.category;
        row.insertCell(3).textContent = 'Rp ' + product.price.toLocaleString('id-ID');
        row.insertCell(4).textContent = product.stock;
        row.insertCell(5).innerHTML = createBarChart(product.sales);
        const actionCell = row.insertCell(6);
        actionCell.innerHTML = '<button class="edit-btn">Edit</button> <button class="delete-btn">Hapus</button>';
    });

    // Data pesanan
    const orders = [
        { id: '001', customer: 'John Doe', date: '2023-05-01', total: 1500000, status: 'Selesai' },
        { id: '002', customer: 'Jane Smith', date: '2023-05-02', total: 2000000, status: 'Diproses' },
        { id: '003', customer: 'Bob Johnson', date: '2023-05-03', total: 1000000, status: 'Dibatalkan' },
    ];

    // Mengisi tabel pesanan
    const orderTableBody = document.querySelector('#orderTable tbody');
    orders.forEach(order => {
        const row = orderTableBody.insertRow();
        row.insertCell(0).textContent = order.id;
        row.insertCell(1).textContent = order.customer;
        row.insertCell(2).textContent = order.date;
        row.insertCell(3).textContent = 'Rp ' + order.total.toLocaleString('id-ID');
        const statusCell = row.insertCell(4);
        statusCell.textContent = order.status;
        statusCell.className = 'status status-' + order.status.toLowerCase();
        const actionCell = row.insertCell(5);
        actionCell.innerHTML = '<button class="view-btn">Lihat</button> <button class="edit-btn">Edit</button>';
    });

    // Event listener untuk tombol laporan
    document.getElementById('salesReportBtn').addEventListener('click', function() {
        document.getElementById('reportContent').innerHTML = '<h3>Laporan Penjualan</h3><p>Ini adalah tempat untuk menampilkan laporan penjualan.</p>';
    });

    document.getElementById('inventoryReportBtn').addEventListener('click', function() {
        document.getElementById('reportContent').innerHTML = '<h3>Laporan Inventaris</h3><p>Ini adalah tempat untuk menampilkan laporan inventaris.</p>';
    });

    document.getElementById('customerReportBtn').addEventListener('click', function() {
        document.getElementById('reportContent').innerHTML = '<h3>Laporan Pelanggan</h3><p>Ini adalah tempat untuk menampilkan laporan pelanggan.</p>';
    });

    // Event listener untuk form pengaturan
    document.getElementById('settingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Pengaturan telah disimpan!');
    });

    // Fungsi untuk menambahkan aktivitas terbaru
    function addRecentActivities() {
        const activities = [
            "Pesanan #1234 telah selesai",
            "Produk baru 'Smartphone X' ditambahkan",
            "Stok produk 'Laptop Y' diperbarui",
            "Pelanggan baru mendaftar: John Doe",
            "Ulasan baru untuk produk 'Kamera Z'"
        ];

        const activityList = document.getElementById('activityList');
        activities.forEach(activity => {
            const li = document.createElement('li');
            li.textContent = activity;
            activityList.appendChild(li);
        });
    }

    // Fungsi untuk menambahkan produk terlaris
    function addTopProducts() {
        const topProducts = [
            "Smartphone X",
            "Laptop Y",
            "Kamera Z",
            "Headphone A",
            "Smartwatch B"
        ];

        const topProductsList = document.getElementById('topProductsList');
        topProducts.forEach(product => {
            const li = document.createElement('li');
            li.textContent = product;
            topProductsList.appendChild(li);
        });
    }

    // Tambahkan aktivitas terbaru dan produk terlaris
    addRecentActivities();
    addTopProducts();

    // Animasi untuk progress bar
    setTimeout(() => {
        const progressBar = document.getElementById('salesProgress');
        progressBar.style.width = '75%';
    }, 500);
});
