export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  phase: string;
  scenario: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  wrongExplanations: Record<string, string>;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    phase: "Planning",
    scenario:
      "Anda ditunjuk sebagai Business Analyst untuk proyek pengembangan sistem informasi manajemen aset di sebuah BUMN. Direktur IT meminta Anda segera mulai coding karena anggaran sudah cair.",
    question:
      "Sebagai BA yang profesional, langkah pertama yang harus Anda lakukan adalah...",
    options: [
      { id: "a", text: "Langsung mulai coding karena anggaran sudah ada dan direktur sudah meminta." },
      { id: "b", text: "Menyusun Project Charter dan melakukan Studi Kelayakan (Feasibility Study) terlebih dahulu sebelum memulai aktivitas teknis apapun." },
      { id: "c", text: "Membuat wireframe UI langsung karena itu lebih cepat dipahami klien." },
      { id: "d", text: "Memilih tech stack dan framework yang akan digunakan untuk memulai setup development environment." },
    ],
    correctOptionId: "b",
    explanation:
      "Fase Planning adalah fondasi proyek. Tanpa Project Charter yang mendefinisikan ruang lingkup, tujuan, dan batasan, serta Feasibility Study yang memvalidasi kelayakan teknis-finansial, tim berisiko membangun sistem yang salah, melebihi anggaran, atau gagal memenuhi kebutuhan bisnis. Ini adalah langkah wajib sebelum aktivitas teknis apapun dimulai.",
    wrongExplanations: {
      a: "Memulai coding tanpa perencanaan adalah kesalahan fatal (Anti-pattern: 'Code and Fix'). Tanpa ruang lingkup yang jelas, kode yang dibuat berpotensi besar tidak sesuai kebutuhan dan harus dibuang.",
      c: "Wireframe adalah artefak fase Design, bukan fase pertama. Tanpa analisis kebutuhan yang mendalam, wireframe yang dibuat hanya berupa tebakan.",
      d: "Pemilihan tech stack dilakukan di fase Design setelah kebutuhan sistem dipahami sepenuhnya. Memilih teknologi sebelum kebutuhan jelas dapat menyebabkan technical debt.",
    },
  },
  {
    id: 2,
    phase: "Planning",
    scenario:
      "Tim Anda sedang melakukan Studi Kelayakan untuk sistem e-procurement senilai Rp 2,4 miliar. CFO mempertanyakan mengapa proyek ini layak dilanjutkan dari sisi finansial.",
    question:
      "Komponen utama apa yang harus ada dalam Studi Kelayakan untuk menjawab pertanyaan CFO tersebut?",
    options: [
      { id: "a", text: "Entity Relationship Diagram (ERD) yang menunjukkan kompleksitas sistem." },
      { id: "b", text: "Analisis Return on Investment (ROI), estimasi payback period, dan proyeksi penghematan biaya operasional." },
      { id: "c", text: "Mockup tampilan antarmuka sistem yang menarik untuk dipresentasikan." },
      { id: "d", text: "Daftar lengkap teknologi (tech stack) beserta lisensi software yang akan digunakan." },
    ],
    correctOptionId: "b",
    explanation:
      "Feasibility Study dari sisi finansial (Economic Feasibility) harus mencakup analisis Cost-Benefit Analysis (CBA), Return on Investment (ROI), payback period, dan Total Cost of Ownership (TCO). Ini adalah bahasa yang dipahami CFO untuk mengevaluasi kelayakan investasi teknologi.",
    wrongExplanations: {
      a: "ERD adalah artefak fase Design untuk merancang basis data, bukan untuk analisis kelayakan finansial.",
      c: "Mockup UI adalah artefak fase Design. Presentasi visual tidak menjawab pertanyaan kelayakan investasi CFO.",
      d: "Daftar tech stack adalah keputusan teknis di fase Design. Belum relevan pada tahap studi kelayakan.",
    },
  },
  {
    id: 3,
    phase: "Analysis",
    scenario:
      "Anda adalah System Analyst di proyek pengembangan aplikasi klinik. Saat sesi wawancara dengan dokter dan staf administrasi, Anda menemukan kebutuhan yang saling bertentangan: dokter ingin rekam medis bisa diakses dari mana saja, sementara Kepala Klinik menginginkan akses dibatasi hanya dari jaringan internal untuk alasan keamanan.",
    question:
      "Bagaimana cara terbaik Anda menangani konflik kebutuhan ini sebagai System Analyst?",
    options: [
      { id: "a", text: "Mengikuti keinginan dokter karena dokter adalah pengguna utama sistem." },
      { id: "b", text: "Mengikuti keinginan Kepala Klinik karena beliau adalah pemegang otoritas tertinggi di klinik." },
      { id: "c", text: "Mendokumentasikan kedua kebutuhan yang berkonflik, eskalasi ke sponsor/stakeholder utama untuk resolusi, lalu mencari solusi teknis yang dapat mengakomodasi kedua kepentingan (misal: VPN access)." },
      { id: "d", text: "Mengabaikan konflik ini dan melanjutkan ke fase berikutnya; tim developer akan memutuskan nanti." },
    ],
    correctOptionId: "c",
    explanation:
      "Konflik kebutuhan adalah hal normal dalam analisis sistem. SA wajib mendokumentasikan semua kebutuhan (termasuk yang berkonflik), mengfasilitasi resolusi melalui stakeholder yang berwenang, dan mengeksplorasi solusi win-win. Mendokumentasikan dalam SRS sebagai 'requirement conflict' kemudian menetapkan keputusan resmi via stakeholder sign-off adalah proses yang benar.",
    wrongExplanations: {
      a: "SA tidak boleh memihak tanpa dasar. Keputusan harus melalui proses formal dengan stakeholder yang berwenang, bukan berdasarkan hierarki pengguna.",
      b: "Mirip seperti opsi A, memihak salah satu pihak tanpa musyawarah merupakan tindakan keliru karena kebutuhan dokter juga berdasar pada alasan operasional yang valid.",
      d: "Mengabaikan konflik dan melempar tanggung jawab ke developer adalah tanda kegagalan SA. Developer tidak memiliki konteks bisnis untuk membuat keputusan ini.",
    },
  },
  {
    id: 4,
    phase: "Analysis",
    scenario:
      "Tim proyek sistem informasi logistik sudah masuk minggu ke-3 fase Analysis. Klien baru saja menyampaikan kebutuhan tambahan yang 'terlupakan': integrasi real-time dengan 5 vendor eksternal via API. Ini secara signifikan memperluas ruang lingkup proyek.",
    question:
      "Sebagai Business Analyst, respons yang paling tepat adalah...",
    options: [
      { id: "a", text: "Langsung menambahkan kebutuhan baru ke SRS tanpa pemberitahuan apapun karena klien adalah bos." },
      { id: "b", text: "Menolak kebutuhan baru tersebut karena tidak ada dalam Project Charter awal." },
      { id: "c", text: "Mendokumentasikan kebutuhan baru, menganalisis dampaknya terhadap scope/timeline/biaya, dan memprosesnya melalui mekanisme formal Change Request (CR) untuk persetujuan sponsor." },
      { id: "d", text: "Meminta developer untuk mulai implementasi integrasi API sambil menunggu persetujuan formal." },
    ],
    correctOptionId: "c",
    explanation:
      "Perluasan ruang lingkup yang tidak terkelola disebut 'Scope Creep' dan merupakan salah satu penyebab utama kegagalan proyek. Mekanisme Change Request adalah prosedur formal untuk mengevaluasi dampak (impact analysis) terhadap scope, waktu, dan biaya, lalu mendapatkan persetujuan resmi dari sponsor sebelum perubahan dieksekusi.",
    wrongExplanations: {
      a: "Menambah scope secara diam-diam tanpa impact analysis dan persetujuan formal adalah pemicu scope creep yang berbahaya.",
      b: "Menolak mentah-mentah juga bukan solusi profesional. Kebutuhan bisnis bisa saja valid dan perlu diakomodasi dengan penyesuaian scope/budget.",
      d: "Memulai implementasi sebelum ada persetujuan formal adalah pelanggaran prosedur manajemen proyek dan berisiko pekerjaan sia-sia.",
    },
  },
  {
    id: 5,
    phase: "Design",
    scenario:
      "Anda merancang basis data untuk sistem e-commerce. Tabel Orders memiliki kolom: OrderID, CustomerName, CustomerEmail, CustomerPhone, ProductName, ProductPrice, Quantity, TotalPrice. Klien meminta sistem bisa berjalan cepat dan data tidak redundan.",
    question:
      "Apa masalah utama desain tabel tersebut dari perspektif Database Design dan bagaimana solusinya?",
    options: [
      { id: "a", text: "Tidak ada masalah; satu tabel besar lebih mudah di-query." },
      { id: "b", text: "Tabel melanggar prinsip normalisasi (terdapat data redundansi dan anomali update). Solusinya: pisahkan ke tabel Customers, Products, dan Orders dengan foreign key." },
      { id: "c", text: "Masalahnya hanya pada penamaan kolom yang tidak konsisten; cukup diubah naming convention-nya." },
      { id: "d", text: "Tambahkan saja index pada semua kolom untuk mempercepat query." },
    ],
    correctOptionId: "b",
    explanation:
      "Tabel tersebut melanggar aturan 2NF dan 3NF karena data pelanggan dan data produk bercampur dalam satu tempat. Hal ini mengakibatkan data pelanggan berulang kali tercatat secara berlebihan dan menyulitkan pembaruan data. Solusi yang tepat adalah normalisasi ke dalam tabel terpisah dengan relasi kunci asing.",
    wrongExplanations: {
      a: "Satu tabel besar (flat table) untuk data relasional menyebabkan redundansi parah, anomali insert/update/delete, dan query yang tidak efisien saat data besar.",
      c: "Penamaan kolom bukan masalah utama. Masalah struktural (normalisasi) jauh lebih kritis dari konvensi penamaan.",
      d: "Index pada semua kolom justru memperlambat operasi INSERT/UPDATE dan tidak menyelesaikan masalah redundansi data.",
    },
  },
  {
    id: 6,
    phase: "Testing",
    scenario:
      "Klien meminta penambahan fitur payment gateway baru ketika proses coding proyek Waterfall sudah berjalan 80%. Fitur ini tidak ada dalam SRS yang telah disetujui dan akan mempengaruhi modul checkout, laporan keuangan, dan integrasi bank.",
    question:
      "Sebagai System Analyst, tindakan prosedural apa yang harus Anda lakukan?",
    options: [
      { id: "a", text: "Langsung minta developer menambahkan fitur payment gateway karena klien yang membayar." },
      { id: "b", text: "Tolak permintaan klien karena proyek sudah di fase coding dan SRS sudah final." },
      { id: "c", text: "Hentikan sementara coding yang terdampak, buat Change Request formal, lakukan impact analysis (scope/timeline/biaya), presentasikan ke sponsor untuk persetujuan, dan update SRS setelah disetujui." },
      { id: "d", text: "Tambahkan ke backlog dan implementasikan setelah proyek selesai tanpa memberitahu klien tentang implikasinya." },
    ],
    correctOptionId: "c",
    explanation:
      "Ini adalah skenario klasik scope creep di Waterfall. Prosedur yang benar adalah: (1) Jangan langsung implementasi, (2) Dokumentasikan sebagai Change Request, (3) Lakukan Impact Analysis menyeluruh pada modul yang terdampak, (4) Estimasi tambahan waktu & biaya, (5) Dapatkan persetujuan formal sponsor/klien dengan kontrak tambahan, (6) Update SRS & rencana testing. Ini melindungi tim dari over-commitment dan klien dari kejutan biaya.",
    wrongExplanations: {
      a: "Menerapkan perubahan tanpa analisis dampak sangat berisiko merusak fitur yang sudah berjalan dan menunda jadwal proyek tanpa kompensasi biaya.",
      b: "Menolak mentah-mentah tidak profesional. Kebutuhan bisnis bisa valid; proses Change Request adalah jalan tengah yang benar.",
      d: "Tidak memberitahu klien tentang implikasi adalah pelanggaran etika profesional dan dapat berujung pada perselisihan kontrak.",
    },
  },
  {
    id: 7,
    phase: "Testing",
    scenario:
      "Tim QA menemukan 15 bug saat Blackbox Testing pada modul pembayaran. 3 di antaranya adalah bug kritis (sistem crash saat input nominal Rp 0), 7 adalah bug mayor (kalkulasi pajak salah), dan 5 adalah bug minor (typo label UI).",
    question:
      "Sebagai QA Lead, bagaimana Anda memprioritaskan penanganan bug ini?",
    options: [
      { id: "a", text: "Perbaiki semua bug secara berurutan dari yang ditemukan pertama (FIFO)." },
      { id: "b", text: "Perbaiki bug minor dulu karena lebih mudah dan cepat selesai, baru yang besar." },
      { id: "c", text: "Selesaikan bug kritis terlebih dahulu yang menghambat pengujian, kemudian perbaiki bug fungsional, dan terakhir bug tampilan dengan panduan matriks prioritas." },
      { id: "d", text: "Laporkan semua bug ke klien dan biarkan klien yang memutuskan mana yang perlu diperbaiki." },
    ],
    correctOptionId: "c",
    explanation:
      "Bug triage menggunakan severity-priority matrix adalah standar industri. Bug Critical (crash, data loss, security breach) harus diselesaikan sebelum UAT dimulai karena dapat memblokir seluruh proses testing. Bug Mayor (fungsionalitas salah) diperbaiki berikutnya karena mempengaruhi akurasi bisnis. Bug Minor (kosmetik/UI) bisa dijadwalkan di sprint berikutnya. Pendekatan ini memaksimalkan efektivitas tim dengan fokus pada risiko bisnis tertinggi.",
    wrongExplanations: {
      a: "FIFO tidak mempertimbangkan dampak bisnis. Bug kritis yang ditemukan terakhir bisa memblokir seluruh proyek jika tidak diprioritaskan.",
      b: "'Quick wins' di bug minor memang terasa memuaskan, tapi meninggalkan bug kritis (crash) adalah risiko bisnis yang tidak dapat diterima.",
      d: "Menentukan urutan penanganan bug adalah kewajiban tim QA, sehingga menyerahkan keputusan teknis kepada klien yang awam merupakan tindakan yang kurang profesional.",
    },
  },
  {
    id: 8,
    phase: "Deployment",
    scenario:
      "Sistem informasi keuangan perusahaan siap dirilis ke produksi besok pagi. Tiba-tiba tim DevOps menemukan bahwa server produksi memiliki versi database yang berbeda (PostgreSQL 13) dari environment staging (PostgreSQL 15). Migration script sudah diuji di staging.",
    question:
      "Tindakan yang paling tepat sebagai System Analyst / DevOps Lead adalah...",
    options: [
      { id: "a", text: "Lanjutkan deployment sesuai jadwal; perbedaan minor versi database biasanya tidak bermasalah." },
      { id: "b", text: "Tunda deployment, upgrade PostgreSQL di server produksi ke versi 15, uji kompatibilitas migration script di environment yang setara, baru lanjutkan deployment." },
      { id: "c", text: "Deploy langsung dan pantau; jika ada error, lakukan rollback." },
      { id: "d", text: "Batalkan proyek karena environment tidak sesuai spesifikasi." },
    ],
    correctOptionId: "b",
    explanation:
      "Perbedaan versi database antara staging dan production adalah risiko tinggi untuk sistem keuangan. PostgreSQL 13 vs 15 memiliki perbedaan signifikan dalam syntax SQL, fungsi built-in, dan perilaku query optimizer. Prinsip 'environment parity' (staging = production) adalah best practice deployment. Menunda dan menyamakan environment adalah keputusan profesional yang melindungi integritas data keuangan.",
    wrongExplanations: {
      a: "Perbedaan versi database sekecil apa pun dapat membuat query gagal atau berperilaku tak terduga, situasi yang sangat berbahaya bagi sistem finansial.",
      c: "'Deploy and pray' adalah anti-pattern berbahaya untuk sistem keuangan. Jika terjadi korupsi data, rollback tidak bisa mengembalikan kepercayaan stakeholder.",
      d: "Pembatalan total berlebihan. Masalah ini bisa diselesaikan dengan upgrade dan testing tambahan dalam waktu yang relatif singkat.",
    },
  },
  {
    id: 9,
    phase: "Maintenance",
    scenario:
      "Enam bulan setelah go-live, pengguna melaporkan bahwa laporan bulanan sistem HRD membutuhkan waktu 45 menit untuk dihasilkan (sebelumnya 3 menit saat UAT). Data karyawan telah berkembang dari 500 menjadi 15.000 orang.",
    question:
      "Sebagai System Analyst yang menangani maintenance, analisis paling tepat untuk akar masalah ini adalah...",
    options: [
      { id: "a", text: "Sistem perlu diganti karena tidak mampu menangani beban kerja nyata." },
      { id: "b", text: "Ini adalah masalah hardware; server perlu di-upgrade RAM dan CPU segera." },
      { id: "c", text: "Kemungkinan besar masalah query performance: missing database index, query yang tidak dioptimasi (N+1 problem), atau kebutuhan table partitioning untuk data skala besar. Lakukan query profiling & explain plan analysis terlebih dahulu." },
      { id: "d", text: "Minta pengguna untuk bersabar karena ini adalah perilaku normal sistem." },
    ],
    correctOptionId: "c",
    explanation:
      "Degradasi performa yang proporsional dengan pertumbuhan data adalah indikasi kuat masalah query optimization, bukan masalah hardware. Langkah diagnostik yang benar: (1) Profiling query dengan EXPLAIN ANALYZE, (2) Identifikasi query tanpa index (full table scan), (3) Cek N+1 query problem di ORM, (4) Pertimbangkan database indexing, query rewriting, atau table partitioning. Upgrade hardware adalah solusi terakhir jika optimasi query tidak cukup.",
    wrongExplanations: {
      a: "Mengganti sistem adalah keputusan ekstrem dan mahal. Masalah performa hampir selalu bisa diselesaikan dengan optimasi teknis.",
      b: "Hardware upgrade tanpa diagnosis adalah pemborosan. Jika root cause-nya adalah query tidak efisien, RAM 10x pun tidak akan menyelesaikan masalah secara fundamental.",
      d: "Menyuruh pengguna 'bersabar' adalah sikap tidak profesional yang melanggar SLA dan merusak kepercayaan pengguna terhadap sistem.",
    },
  },
  {
    id: 10,
    phase: "Planning",
    scenario:
      "Perusahaan startup fintech ingin membangun aplikasi pinjaman online. Kebutuhan bisnis berubah cepat mengikuti regulasi OJK yang baru, tim developer terdiri dari 8 orang junior, dan investor meminta demo fungsional dalam 3 bulan.",
    question:
      "Model SDLC mana yang paling tepat direkomendasikan untuk situasi ini dan mengapa?",
    options: [
      { id: "a", text: "Waterfall, karena dokumentasi lengkap diperlukan untuk sistem keuangan yang diatur oleh regulasi." },
      { id: "b", text: "Agile Scrum, karena kebutuhan yang berubah cepat, tim kecil, dan kebutuhan demo cepat sangat cocok dengan siklus sprint pendek (2 minggu) dan adaptabilitas Agile." },
      { id: "c", text: "Spiral Model, karena pengelolaan risiko paling komprehensif untuk sistem keuangan." },
      { id: "d", text: "Prototype Model, karena investor perlu melihat tampilan UI secepat mungkin." },
    ],
    correctOptionId: "b",
    explanation:
      "Agile Scrum adalah pilihan tepat karena: (1) Kebutuhan berubah cepat → Agile mengakomodasi perubahan di setiap sprint, (2) Demo 3 bulan → Sprint 2 minggu menghasilkan increment yang bisa didemonstrasikan, (3) Tim kecil (8 orang) → Scrum dirancang untuk tim kecil self-organizing. Waterfall tidak cocok karena tidak fleksibel terhadap perubahan regulasi yang sering. Meski regulasi ketat, Agile tetap bisa menghasilkan dokumentasi yang diperlukan dalam sprint definition of done.",
    wrongExplanations: {
      a: "Model Waterfall mengandalkan kebutuhan yang tetap sejak awal, sedangkan perubahan regulasi di tengah proyek justru akan memicu penumpukan beban kerja tanpa akhir.",
      c: "Model Spiral diperuntukkan bagi proyek skala besar dengan tim berpengalaman, sehingga kurang tepat bagi perusahaan perintis dengan waktu yang terbatas.",
      d: "Prototype Model adalah pendekatan, bukan framework manajemen proyek lengkap. Tidak ada struktur tim, sprint, dan delivery yang clear seperti Scrum.",
    },
  },
];
