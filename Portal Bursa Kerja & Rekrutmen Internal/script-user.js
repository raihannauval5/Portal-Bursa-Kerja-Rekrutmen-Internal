const KEY = 'DATA_JOB_PORTAL_APP';

const form = document.getElementById('form-lamaran');
const tabelBody = document.getElementById('tabel-body-user');

window.onload = function() {
  renderTabelUser();
};

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const nama = document.getElementById('nama').value;
  const kontak = document.getElementById('kontak').value;
  const posisi = document.getElementById('posisi').value;
  const cvSummary = document.getElementById('cv-summary').value;

  let dataLamaran = JSON.parse(localStorage.getItem(KEY)) || [];

  // Generate ID Unik Lamaran (Contoh: JOB-5421)
  const idLamaran = 'JOB-' + Math.floor(1000 + Math.random() * 9000);

  const lamaranBaru = {
    id: Date.now().toString(),
    code: idLamaran,
    nama: nama,
    kontak: kontak,
    posisi: posisi,
    cvSummary: cvSummary,
    status: 'Terkirim',
    catatanHr: 'Berkas dalam tahap verifikasi awal.',
    tanggal: new Date().toLocaleDateString('id-ID')
  };

  dataLamaran.unshift(lamaranBaru);
  localStorage.setItem(KEY, JSON.stringify(dataLamaran));

  alert(`Lamaran berhasil dikirim! Kode Referensi Anda: ${idLamaran}`);
  form.reset();
  renderTabelUser();
});

function renderTabelUser() {
  const dataLamaran = JSON.parse(localStorage.getItem(KEY)) || [];
  tabelBody.innerHTML = '';

  if (dataLamaran.length === 0) {
    tabelBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:#64748b;">Belum ada lamaran yang dikirim.</td></tr>';
    return;
  }

  dataLamaran.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="code-badge">${item.code}</span></td>
      <td><strong>${item.posisi}</strong><br><small style="color:#64748b;">An. ${item.nama}</small></td>
      <td>${item.tanggal}</td>
      <td><span class="badge status-${item.status.toLowerCase()}">${item.status}</span></td>
      <td><small>${item.catatanHr}</small></td>
    `;
    tabelBody.appendChild(tr);
  });
}