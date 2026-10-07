const KEY = 'DATA_JOB_PORTAL_APP';

const tabelBody = document.getElementById('tabel-body-admin');
const searchInput = document.getElementById('search-input');
const filterPosisi = document.getElementById('filter-posisi');

window.onload = function() {
  renderTabelAdmin();
};

function renderTabelAdmin() {
  const dataLamaran = JSON.parse(localStorage.getItem(KEY)) || [];
  
  updateStatistik(dataLamaran);

  const kataKunci = searchInput.value.toLowerCase();
  const posSelected = filterPosisi.value;

  const dataFiltered = dataLamaran.filter(item => {
    const cocokText = item.nama.toLowerCase().includes(kataKunci) || 
                      item.code.toLowerCase().includes(kataKunci) || 
                      item.posisi.toLowerCase().includes(kataKunci);
    const cocokPos = posSelected === 'semua' || item.posisi === posSelected;
    return cocokText && cocokPos;
  });

  tabelBody.innerHTML = '';

  if (dataFiltered.length === 0) {
    tabelBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:24px; color:#64748b;">Tidak ada data pelamar ditemukan.</td></tr>';
    return;
  }

  dataFiltered.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="code-badge">${item.code}</span><br><strong>${item.nama}</strong><br><small style="color:#64748b;">${item.kontak}</small></td>
      <td><strong>${item.posisi}</strong><br><small style="color:#64748b;">Tgl: ${item.tanggal}</small></td>
      <td><small style="color:#334155;">"${item.cvSummary}"</small></td>
      <td>
        <select class="status-select" onchange="updateStatusAdmin('${item.id}', this.value)">
          <option value="Terkirim" ${item.status === 'Terkirim' ? 'selected' : ''}>Terkirim</option>
          <option value="Interview" ${item.status === 'Interview' ? 'selected' : ''}>Interview</option>
          <option value="Diterima" ${item.status === 'Diterima' ? 'selected' : ''}>Diterima</option>
          <option value="Ditolak" ${item.status === 'Ditolak' ? 'selected' : ''}>Ditolak</option>
        </select>
      </td>
      <td>
        <div class="action-cell">
          <input type="text" id="note-${item.id}" placeholder="Catatan/Jadwal HR..." value="${item.catatanHr !== 'Berkas dalam tahap verifikasi awal.' ? item.catatanHr : ''}">
          <button class="btn-action" onclick="simpanCatatan('${item.id}')">Simpan</button>
        </div>
      </td>
    `;
    tabelBody.appendChild(tr);
  });
}

function updateStatistik(data) {
  document.getElementById('stat-total').innerText = data.length;
  document.getElementById('stat-terkirim').innerText = data.filter(i => i.status === 'Terkirim').length;
  document.getElementById('stat-interview').innerText = data.filter(i => i.status === 'Interview').length;
  document.getElementById('stat-diterima').innerText = data.filter(i => i.status === 'Diterima').length;
  document.getElementById('stat-ditolak').innerText = data.filter(i => i.status === 'Ditolak').length;
}

window.updateStatusAdmin = function(id, statusBaru) {
  let dataLamaran = JSON.parse(localStorage.getItem(KEY)) || [];
  const index = dataLamaran.findIndex(i => i.id === id);

  if (index !== -1) {
    dataLamaran[index].status = statusBaru;
    localStorage.setItem(KEY, JSON.stringify(dataLamaran));
    renderTabelAdmin();
  }
};

window.simpanCatatan = function(id) {
  const inputEl = document.getElementById(`note-${id}`);
  const teksCatatan = inputEl.value.trim();

  if (!teksCatatan) {
    alert('Isi catatan/pesan HR terlebih dahulu!');
    return;
  }

  let dataLamaran = JSON.parse(localStorage.getItem(KEY)) || [];
  const index = dataLamaran.findIndex(i => i.id === id);

  if (index !== -1) {
    dataLamaran[index].catatanHr = teksCatatan;
    localStorage.setItem(KEY, JSON.stringify(dataLamaran));
    alert('Catatan HR berhasil disimpan!');
    renderTabelAdmin();
  }
};

window.resetSemuaData = function() {
  if (confirm('Hapus seluruh riwayat lamaran pelamar?')) {
    localStorage.removeItem(KEY);
    renderTabelAdmin();
  }
};