import type { SdlcPhaseId } from "./sdlcData";

/**
 * Capaian pembelajaran terukur per fase SDLC.
 * Format: "Selesai fase ini, peserta dapat … dengan kriteria …"
 */
export const learningOutcomesByPhase: Record<SdlcPhaseId, string[]> = {
  planning: [
    "Selesai fase ini, peserta dapat menyusun Project Charter yang memuat tujuan, ruang lingkup, dan stakeholder utama, dengan kriteria seluruh bagian wajib terisi dan disetujui sponsor.",
    "Selesai fase ini, peserta dapat menilai kelayakan proyek menggunakan kerangka TELOS, dengan kriteria minimal tiga dimensi (teknis, ekonomis, operasional) terdokumentasi beserta rekomendasi go/no-go.",
  ],
  analysis: [
    "Selesai fase ini, peserta dapat menyusun SRS yang memuat kebutuhan fungsional dan non-fungsional, dengan kriteria setiap kebutuhan memiliki ID unik dan acceptance criteria yang dapat diuji.",
    "Selesai fase ini, peserta dapat memodelkan proses bisnis ke DFD Level 0–2 dan use case, dengan kriteria setiap aliran data terhubung ke proses dan data store yang jelas.",
  ],
  design: [
    "Selesai fase ini, peserta dapat menormalisasi skema hingga 3NF, dengan kriteria tidak ada redundansi data dan ketergantungan transitif pada tabel transaksi.",
    "Selesai fase ini, peserta dapat merancang ERD dan kontrak API, dengan kriteria setiap relasi memakai primary key/foreign key dan setiap endpoint memiliki definisi input-output.",
  ],
  development: [
    "Selesai fase ini, peserta dapat menerapkan strategi branch dan code review, dengan kriteria setiap perubahan melewati pull request, minimal satu reviewer, dan CI lulus sebelum merge.",
    "Selesai fase ini, peserta dapat menulis unit test untuk logika inti, dengan kriteria kasus normal, batas, dan error utama tercakup.",
  ],
  testing: [
    "Selesai fase ini, peserta dapat merancang test case dengan Equivalence Partitioning dan Boundary Value Analysis, dengan kriteria setiap acceptance criteria memiliki minimal satu skenario uji.",
    "Selesai fase ini, peserta dapat memprioritaskan bug memakai matriks severity-priority, dengan kriteria bug kritis ditangani sebelum UAT.",
  ],
  deployment: [
    "Selesai fase ini, peserta dapat menyusun deployment dan rollback plan, dengan kriteria environment parity, smoke test, dan titik rollback terdokumentasi.",
    "Selesai fase ini, peserta dapat merencanakan migrasi data legacy, dengan kriteria strategi backup, verifikasi, dan rencana pemulihan tersedia.",
  ],
  maintenance: [
    "Selesai fase ini, peserta dapat menganalisis degradasi performa, dengan kriteria diagnosis berbasis profiling/EXPLAIN sebelum menyimpulkan penyebab.",
    "Selesai fase ini, peserta dapat mengelola Change Request dan SLA, dengan kriteria setiap CR memiliki dampak, prioritas, dan status penyelesaian yang tercatat.",
  ],
};

/** Latihan aplikasi singkat per fase, lengkap dengan contoh jawaban. */
export const practiceByPhase: Record<
  SdlcPhaseId,
  { prompt: string; expectedAnswer: string }
> = {
  planning: {
    prompt:
      "Sebuah koperasi ingin membangun aplikasi simpan pinjam. Tuliskan tiga pertanyaan utama yang harus dijawab dalam studi kelayakan sebelum coding dimulai.",
    expectedAnswer:
      "Contoh jawaban: (1) Apakah manfaat finansial (ROI/payback period) melebihi biaya pengembangan dan operasional? (2) Apakah infrastruktur, data, dan tim tersedia secara teknis? (3) Apakah proses bisnis dan regulasi koperasi mendukung, serta siapa sponsor yang menyetujui ruang lingkup?",
  },
  analysis: {
    prompt:
      "Dua stakeholder meminta fitur yang bertentangan: dokter ingin akses rekam medis dari mana saja, kepala klinik ingin akses hanya dari jaringan internal. Tuliskan langkah analisis yang kamu ambil.",
    expectedAnswer:
      "Dokumentasikan kedua kebutuhan di SRS sebagai konflik, catat dampak masing-masing, fasilitasi diskusi dengan sponsor, lalu sepakati solusi yang memenuhi keduanya (mis. VPN + role-based access control + audit log) dan minta sign-off.",
  },
  design: {
    prompt:
      "Tabel Orders berisi OrderID, CustomerName, CustomerEmail, ProductName, ProductPrice, Quantity. Rancang tabel hasil normalisasi hingga 3NF.",
    expectedAnswer:
      "Pisahkan menjadi Customers(CustomerID, Name, Email), Products(ProductID, Name, Price), Orders(OrderID, CustomerID, …), dan OrderItems(OrderID, ProductID, Quantity). Dengan OrderID sebagai PK, atribut order bergantung pada order; ketergantungan transitif ke customer/product dihapus sehingga 3NF terpenuhi.",
  },
  development: {
    prompt:
      "Tim 6 developer akan mengerjakan fitur checkout. Tentukan alur branch, review, dan pengujian sebelum kode masuk ke main.",
    expectedAnswer:
      "Buat feature branch dari develop, commit kecil dan terfokus, buka pull request, wajib minimal satu reviewer, jalankan unit test + lint + build di CI, selesaikan konflik, lalu merge setelah pipeline hijau. Main dilindungi dari commit langsung.",
  },
  testing: {
    prompt:
      "Fitur input nominal pembayaran menerima angka 0–10.000.000. Tuliskan contoh kasus uji dengan Boundary Value Analysis.",
    expectedAnswer:
      "Uji batas bawah (0), tepat di atas batas bawah (1), nilai tengah (5.000.000), tepat di batas atas (10.000.000), dan di atas batas (10.000.001). Tambahkan kasus negatif, kosong, dan non-angka.",
  },
  deployment: {
    prompt:
      "Aplikasi akan dirilis Jumat malam. Susun minimal empat item checklist deployment yang wajib ada.",
    expectedAnswer:
      "Contoh: (1) build artifact final yang sudah lulus UAT, (2) migration script teruji di staging setara produksi, (3) backup database dan rollback plan, (4) smoke test pasca-deploy, (5) monitoring/alerting aktif, (6) jadwal dan penanggung jawab rilis.",
  },
  maintenance: {
    prompt:
      "Laporan bulanan melambat dari 3 menit menjadi 45 menit setelah data naik 30x. Tuliskan langkah diagnosis sebelum mengusulkan upgrade hardware.",
    expectedAnswer:
      "Lakukan profiling query (EXPLAIN ANALYZE), cek full table scan dan index yang hilang, deteksi N+1 query, tinjau ukuran tabel dan partitioning, ukur dampak per query. Baru setelah data menunjukkan bottleneck non-query, pertimbangkan upgrade hardware.",
  },
};
