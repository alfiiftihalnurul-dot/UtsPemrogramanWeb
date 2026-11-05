// JavaScript utama BookSpace. Data awal berasal dari file data.js dosen.
const angkaHarga = (harga) => typeof harga === "number" ? harga : (Number(String(harga).replace(/[^\d]/g, "")) || 0);
const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(angka)||0);
const ambilPesanan = () => JSON.parse(localStorage.getItem("bookspaceOrders") || "[]");
const simpanPesanan = (data) => localStorage.setItem("bookspaceOrders", JSON.stringify(data));

// Sinkronkan katalog dan tracking agar perubahan tetap tersedia saat pindah halaman.
const katalogTersimpan = localStorage.getItem("bookspaceCatalog");
if (katalogTersimpan) dataKatalogBuku = JSON.parse(katalogTersimpan);

const trackingTersimpan = localStorage.getItem("bookspaceTracking");
if (trackingTersimpan) dataTracking = JSON.parse(trackingTersimpan);

const simpanKatalog = () => localStorage.setItem("bookspaceCatalog", JSON.stringify(dataKatalogBuku));
const simpanTracking = () => localStorage.setItem("bookspaceTracking", JSON.stringify(dataTracking));

// LOGIN menggunakan dataPengguna dari data.js.
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const pengguna = dataPengguna.find((u) => u.email.toLowerCase() === email && u.password === password);
    if (pengguna) {
      sessionStorage.setItem("bookspaceLogin", JSON.stringify({nama:pengguna.nama,email:pengguna.email,role:pengguna.role}));
      window.location.href = "dashboard.html";
    } else alert("email/password yang anda masukkan salah");
  });
  document.querySelectorAll("[data-modal]").forEach((b) => b.addEventListener("click", () => document.getElementById(b.dataset.modal).showModal()));
  document.querySelectorAll(".modal-close").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
  document.getElementById("forgotSubmit").addEventListener("click", () => {
    const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
    if (!email) return alert("Silakan isi email terlebih dahulu.");
    alert(dataPengguna.some((u)=>u.email.toLowerCase()===email) ? "Email terdaftar. Pemulihan password disimulasikan." : "Email tidak ditemukan.");
    document.getElementById("forgotModal").close();
  });
  document.getElementById("registerSubmit").addEventListener("click", () => {
    const nama=document.getElementById("registerName").value.trim(), email=document.getElementById("registerEmail").value.trim();
    if(!nama||!email) return alert("Nama dan email wajib diisi.");
    alert("Pendaftaran disimulasikan. Gunakan akun yang tersedia di data.js untuk login.");
    document.getElementById("registerModal").close();
  });
}

// DASHBOARD dan greeting berdasarkan jam lokal.
const greeting=document.getElementById("greeting");
if(greeting){
  const user=JSON.parse(sessionStorage.getItem("bookspaceLogin")||"null");
  const jam=new Date().getHours();
  const sapaan=jam<11?"Selamat pagi":jam<15?"Selamat siang":jam<18?"Selamat sore":"Selamat malam";
  greeting.textContent=`${sapaan}${user?", "+user.nama:""}!`;
  const date=document.getElementById("todayDate");
  if(date) date.textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
  const a=document.getElementById("totalBooks"),b=document.getElementById("totalStock"),c=document.getElementById("totalOrders");
  if(a)a.textContent=dataKatalogBuku.length;
  if(b)b.textContent=dataKatalogBuku.reduce((sum,book)=>sum+Number(book.stok),0);
  if(c)c.textContent=ambilPesanan().length;
  const profile=document.querySelector(".profile-chip span:last-child");
  if(profile&&user)profile.textContent=`${user.nama} (${user.role})`;
}
const logout=document.getElementById("logoutBtn");
if(logout)logout.addEventListener("click",()=>{sessionStorage.removeItem("bookspaceLogin");window.location.href="login.html";});

// KATALOG: menampilkan dataKatalogBuku dan cover dengan manipulasi DOM.
const catalogTable=document.getElementById("catalogTable");
if(catalogTable){
  const renderCatalog=(keyword="")=>{
    const hasil=dataKatalogBuku.filter(book=>`${book.kodeBarang} ${book.namaBarang} ${book.jenisBarang}`.toLowerCase().includes(keyword.toLowerCase()));
    catalogTable.innerHTML="";
    hasil.forEach((book,index)=>{
      const row=document.createElement("tr");
      row.innerHTML=`<td>${index+1}</td><td><img class="book-cover-thumb" src="${book.cover}" alt="Cover ${book.namaBarang}"></td><td><strong>${book.kodeBarang}</strong></td><td>${book.namaBarang}</td><td>${book.jenisBarang}</td><td>${book.edisi}</td><td>${book.harga}</td><td>${book.stok}</td>`;
      catalogTable.appendChild(row);
    });
    document.getElementById("catalogCount").textContent=`${hasil.length} buku ditemukan`;
  };
  renderCatalog();
  document.getElementById("catalogSearch").addEventListener("input",e=>renderCatalog(e.target.value));
  const form=document.getElementById("bookForm");
  document.getElementById("showBookForm").addEventListener("click",()=>form.classList.toggle("hidden"));
  document.getElementById("cancelBookForm").addEventListener("click",()=>form.classList.add("hidden"));
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const judul=document.getElementById("bookAuthor").value.trim();
    const kode=document.getElementById("bookTitle").value.trim().toUpperCase().replace(/\s+/g,"");
    if(dataKatalogBuku.some(b=>b.kodeBarang===kode))return alert("Kode barang sudah digunakan.");
    dataKatalogBuku.push({kodeBarang:kode,namaBarang:judul,jenisBarang:document.getElementById("bookCategory").value,edisi:"1",stok:Number(document.getElementById("bookStock").value),harga:formatRupiah(document.getElementById("bookPrice").value),cover:"img/pengantar_komunikasi.jpg"});
    simpanKatalog();
    renderCatalog(document.getElementById("catalogSearch").value);form.reset();form.classList.add("hidden");
    alert("Buku berhasil ditambahkan. Cover menggunakan gambar contoh.");
  });
}
// CHECKOUT dan riwayat transaksi.
const checkoutForm=document.getElementById("checkoutForm");
if(checkoutForm){
  const select=document.getElementById("orderBook");
  dataKatalogBuku.forEach(book=>{const opt=document.createElement("option");opt.value=book.kodeBarang;opt.textContent=`${book.namaBarang} | ${book.harga} | stok ${book.stok}`;select.appendChild(opt);});
  const updateSummary=()=>{
    const book=dataKatalogBuku.find(b=>b.kodeBarang===select.value),qty=Number(document.getElementById("orderQty").value)||1;
    document.getElementById("summaryBook").textContent=book?book.namaBarang:"Belum dipilih";
    document.getElementById("summaryQty").textContent=qty;
    document.getElementById("summaryPrice").textContent=book?book.harga:formatRupiah(0);
    document.getElementById("summaryTotal").textContent=book?formatRupiah(angkaHarga(book.harga)*qty):formatRupiah(0);
  };
  select.addEventListener("change",updateSummary);document.getElementById("orderQty").addEventListener("input",updateSummary);updateSummary();
  const renderOrders=()=>{
    const tbody=document.getElementById("ordersTable"),orders=ambilPesanan();tbody.innerHTML="";
    if(!orders.length){tbody.innerHTML='<tr><td colspan="6" class="empty-cell">Belum ada transaksi.</td></tr>';return;}
    orders.forEach(o=>{const row=document.createElement("tr");row.innerHTML=`<td><strong>${o.nomorDO}</strong></td><td>${o.nama}</td><td>${o.buku}</td><td>${formatRupiah(o.total)}</td><td>${o.pembayaran}</td><td><span class="status status-warning">Diproses</span></td>`;tbody.appendChild(row);});
  };
  renderOrders();
  checkoutForm.addEventListener("submit",e=>{
    e.preventDefault();
    const book=dataKatalogBuku.find(b=>b.kodeBarang===select.value),qty=Number(document.getElementById("orderQty").value);
    if(!book||!Number.isInteger(qty)||qty<1)return alert("Pilih buku dan jumlah yang valid.");
    if(qty>Number(book.stok))return alert(`Stok tidak cukup. Stok tersedia: ${book.stok}`);
    const orders=ambilPesanan(),nomorDO=`BS${Date.now()}`,total=angkaHarga(book.harga)*qty;
    const order={nomorDO,nama:document.getElementById("customerName").value.trim(),email:document.getElementById("customerEmail").value.trim(),telepon:document.getElementById("customerPhone").value.trim(),alamat:document.getElementById("customerAddress").value.trim(),buku:book.namaBarang,jumlah:qty,total,pembayaran:document.getElementById("paymentMethod").value};
    book.stok=Number(book.stok)-qty;
    orders.push(order);
    simpanPesanan(orders);
    simpanKatalog();
    dataTracking[nomorDO]={nomorDO,nama:order.nama,status:"Diproses",ekspedisi:"JNE",tanggalKirim:new Date().toISOString().slice(0,10),paket:"Reguler",total:formatRupiah(total),perjalanan:[{waktu:new Date().toLocaleString("sv-SE"),keterangan:"Pesanan diterima dan sedang diproses."}]};
    simpanTracking();
    alert(`Pesanan berhasil disimpan. Nomor DO: ${nomorDO}`);
    checkoutForm.reset();document.getElementById("orderQty").value=1;updateSummary();renderOrders();
  });
}

// TRACKING berdasarkan object dataTracking dari data.js.
const trackingForm=document.getElementById("trackingForm");
if(trackingForm){
  trackingForm.addEventListener("submit",e=>{
    e.preventDefault();
    const nomor=document.getElementById("doNumber").value.trim(),hasil=dataTracking[nomor],result=document.getElementById("trackingResult");
    result.classList.remove("hidden");
    if(!hasil){result.innerHTML='<div class="empty-state"><span>⌕</span><h3>Pesanan tidak ditemukan</h3><p>Coba nomor DO 20230012 atau 20230013.</p></div>';return;}
    const perjalanan=(hasil.perjalanan||[]).map(item=>`<li><strong>${item.waktu}</strong><span>${item.keterangan}</span></li>`).join("");
    result.innerHTML=`<div class="tracking-result-head"><div><p class="eyebrow">NOMOR DELIVERY ORDER</p><h2>${hasil.nomorDO}</h2></div><span class="status status-success">${hasil.status}</span></div>
    <div class="tracking-details"><div><small>Nama pemesan</small><strong>${hasil.nama}</strong></div><div><small>Ekspedisi</small><strong>${hasil.ekspedisi}</strong></div><div><small>Tanggal kirim</small><strong>${hasil.tanggalKirim}</strong></div><div><small>Jenis paket</small><strong>${hasil.paket}</strong></div><div><small>Total pembayaran</small><strong>${hasil.total}</strong></div></div>
    <div class="divider"></div><h3>Riwayat perjalanan</h3><ol class="journey-list">${perjalanan}</ol>`;
  });
}
