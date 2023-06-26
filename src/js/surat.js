const search = document.getElementById("cari-surat");
const searchSurat = document.querySelector(".surat-surat");
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

// Fungsi untuk menampilkan daftar surat
function showSuratList() {
  searchSurat.style.display = "block";
}

// Fungsi untuk menyembunyikan daftar surat
function hideSuratList() {
  searchSurat.style.display = "none";
}

// Ketika search aktif, tampilkan daftar surat
search.addEventListener("click", function() {
  showSuratList();
});

// ketika inputan dihapus, sembunyikan daftar surat
search.addEventListener("keyup", function() {
  if (search.querySelector("input").value === "") {
    hideSuratList();
  }
});

// Ketika klik dilakukan di luar search, sembunyikan daftar surat
document.addEventListener("click", function(e) {
  if (e.target.id !== "cari-surat") {
    hideSuratList();
  }
});



// pencarian
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
            <div id="list-surat" onclick="location.href='surat.html?nomorsurat=${surat.nomor}'" class="list-surat-detail">
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
        showSuratList(); // Tampilkan daftar surat setelah hasil pencarian ditemukan
      } else {
        const listSurat = document.querySelector(".surat-list");
        listSurat.innerHTML = suratTidakDitemukan;
        showSuratList(); // Tampilkan daftar surat dengan pesan "Surat tidak ditemukan"
      }
    });
});



// menampilkan list surat di halaman surat berdasarkan nomor surat
function getURL(e) {
    const pageURL = window.location.search.substring(1);
    const urlVariables = pageURL.split('&');

    for (let i = 0; i < urlVariables.length; i++) {
        const parameterName = urlVariables[i].split('=');
        if (parameterName[0] === e) {
            return parameterName[1];
        }
    }
}


// menampilkan detail surat
const titleSurat = document.querySelector(".title-surat");
const suratIsi = document.querySelector(".surat-isi");
const nomorSurat = getURL('nomorsurat');
const judulSurat = document.querySelector(".judul-surat");
const tunggu = document.querySelector("#tunggu");
const error = `<div class="tunggu eror">
<h1>Maaf, terjadi kesalahan</h1>
<p>Surat yang Anda tuju tidak dapat ditampilkan</p>
</div>`;

async function getSurat() {

    try {
        await newDetailSurat();
        tunggu.classList.add = "aktif";
    } catch (err) {
        tunggu.classList.add = "aktif";
        suratIsi.innerHTML = error;
    }
}

async function newDetailSurat() {
    const response = await fetch(`https://equran.id/api/v2/surat/${nomorSurat}`);
    const data = await response.json();

  // ganti title sesuai nama surat
  titleSurat.innerHTML = `${data.data.namaLatin}`;

    // detail surat
    let suratDetail = '';
    suratDetail += `
            <div class="info-surat">
                <h1>${data.data.nomor} </h1>
                <h2>${data.data.namaLatin} - ${data.data.nama} <span>(${data.data.arti})  ${data.data.jumlahAyat} ayat</span> </h2>
            </div>
        `;
    const judulSurat = document.querySelector(".judul-surat");
    judulSurat.innerHTML = suratDetail;
    // akhir detail surat
    // isi surat
    const surat = data.data.ayat;
    let isiSurat = '';
    surat.forEach(ayat => {
        isiSurat += `
            <div class="isi-surat">
                <div class="ayat-surat">${ayat.nomorAyat}</div>
                <div class="bacaan-surat"><h2>${ayat.teksArab}</h2></div>
                <div class="bacaan-surat-latin">${ayat.teksLatin}</div>
                <div class="terjemahan-surat">${ayat.teksIndonesia}</div>
            </div>
            `;
        suratIsi.innerHTML = isiSurat;
    });
}

getSurat();

// next prev surat
const nextSurat = document.querySelector(".next");
const prevSurat = document.querySelector(".prev");
const nomorSuratNext = parseInt(nomorSurat) + 1;
const nomorSuratPrev = parseInt(nomorSurat) - 1;

fetch(`https://equran.id/api/v2/surat/${nomorSuratNext}`)
    .then(response => response.json())
    .then(data => {
        nextSurat.innerHTML = `<b>»</b>  ${data.data.namaLatin} <span style="font-size: 8px;">(${data.data.jumlahAyat} ayat)</span>`;
    });

fetch(`https://equran.id/api/v2/surat/${nomorSuratPrev}`)
    .then(response => response.json())
    .then(data => {
        prevSurat.innerHTML = `<b>«</b> ${data.data.namaLatin} <span style="font-size: 8px;">(${data.data.jumlahAyat} ayat)</span>`;
    });

        prevSurat.addEventListener("click", function() {
            location.href = `surat.html?nomorsurat=${nomorSuratPrev}`;
        }
        );

nextSurat.addEventListener("click", function() {
    location.href = `surat.html?nomorsurat=${nomorSuratNext}`;
}
);



