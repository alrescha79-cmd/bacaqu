// Pencarian Surat start
const search = document.getElementById("cari-surat");
const searchMobile = document.querySelector(".cari-surat-mobile");
const backHome = document.querySelector(".list-surat-mobile");
const info = document.querySelector(".info-surat-mobile");
const suratTidakDitemukan = ` <h4 class="surat-tidak-ditemukan"> Masukkan nama surat dengan benar!</h4>
`;


// ketika backHome di klik, maka akan kembali ke halaman utama
backHome.addEventListener("click", function() {
  location.href = `index.html`;
});

// ketika info di klik, maka akan pergi ke halaman info
info.addEventListener("click", function() {
  location.href = `info.html`;
});

// ketika cari-surat-bomile di klik, maka otomatiskan focus ke input
searchMobile.addEventListener("click", function() {
  search.querySelector("input").focus();
}); 


search.addEventListener("input", () => {
  const inputValue = search.querySelector("input").value.toLowerCase();

  fetch(`https://equran.id/api/v2/surat`)
    .then(response => response.json())
    .then(data => {
      const suratList = data.data.filter(item => item.namaLatin.toLowerCase().includes(inputValue));

      if (suratList.length > 0) {
        const listSurat = document.querySelector(".surat-list");
        let suratHTML = '';

        suratList.forEach(surat => {
          suratHTML += `
            <div id="list-surat" onclick="location.href='surat.html?nomorsurat=${surat.nomor}'">
              <h3 class="surat-nomor">${surat.nomor}</h3>
              <h3 class="surat-arab">${surat.nama}</h3>
              <h2 class="surat-latin">${surat.namaLatin}</h2>
              <p class="surat-arti">(${surat.arti})</p>
              <p class="surat-tempat-turun">${surat.tempatTurun}</p>
              <p class="surat-ayat">${surat.jumlahAyat} ayat </p>
            </div>
          `;
        });

        listSurat.innerHTML = suratHTML;
      } else {
        const listSurat = document.querySelector(".surat-list");
        listSurat.innerHTML = suratTidakDitemukan;
      }
    });
});


// Pencarian Surat start


// menampilkan list surat
const listSurat = document.querySelector(".surat-list");
const tunggu = document.querySelector("#tunggu");
const error = `<div class="tunggu eror">
<h1>Maaf, terjadi kesalahan</h1>
<p>Daftar surat tidak dapat ditampilkan</p>
</div>`;

async function getSurat() {

  try {
    await newListSurat();
    tunggu.classList.add = "aktif";
  } catch (err) {
    tunggu.classList.add = "aktif";
    listSurat.innerHTML = error;
  }
}

async function newListSurat() {
  return fetch(`https://equran.id/api/v2/surat`)
    .then(response => response.json())
    .then(data => {
      let suratList = '';
      data.data.forEach(surat => {
        suratList += `
          <div id="list-surat" onclick="location.href='surat.html?nomorsurat=${surat.nomor}'" class="list-surat">
            <h3 class="surat-nomor">${surat.nomor}</h3>
            <h3 class="surat-arab">${surat.nama}</h3>
            <h2 class="surat-latin">${surat.namaLatin}</h2>
            <p class="surat-arti">(${surat.arti})</p>
            <p class="surat-tempat-turun">${surat.tempatTurun}</p>
            <p class="surat-ayat">${surat.jumlahAyat} ayat </p>
          </div>
        `;
      });
      listSurat.innerHTML = suratList;
    });
}
getSurat();


