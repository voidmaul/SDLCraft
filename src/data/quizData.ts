import type { SdlcPhaseId } from "./sdlcData";

export type QuizPhase = SdlcPhaseId | "Model Selection";

/** Label tampilan untuk badge fase di kuis dan layar ulasan. */
export const quizPhaseLabels: Record<QuizPhase, string> = {
  planning: "Planning",
  analysis: "Analysis",
  design: "Design",
  development: "Development",
  testing: "Testing",
  deployment: "Deployment",
  maintenance: "Maintenance",
  "Model Selection": "Model Selection",
};

export function getQuizPhaseLabel(phase: QuizPhase): string {
  return quizPhaseLabels[phase];
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  phase: QuizPhase;
  scenario: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  wrongExplanations: Record<string, string>;
  /** Petunjuk singkat untuk remediasi sebelum pembahasan lengkap. */
  hint?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    phase: "planning",
    scenario:
      "Anda ditunjuk sebagai Business Analyst untuk proyek pengembangan sistem informasi manajemen aset di sebuah BUMN. Direktur IT meminta Anda segera mulai coding karena anggaran sudah cair.",
    question:
      "Sebagai BA yang profesional, langkah pertama yang harus Anda lakukan adalah...",
    options: [
      { id: "a", text: "Langsung mulai coding karena anggaran sudah cair dan direktur sudah meminta." },
      { id: "b", text: "Koordinasi dengan PM menyusun Project Charter + dukung studi kelayakan sebelum coding." },
      { id: "c", text: "Membuat wireframe UI lebih dulu agar klien cepat memahami gambaran solusi yang ditawarkan." },
      { id: "d", text: "Memilih tech stack dan menyiapkan environment development agar tim segera produktif." },
    ],
    correctOptionId: "b",
    explanation:
      "Project Charter adalah artefak manajemen proyek yang disusun PM; BA berperan menyediakan konteks bisnis, business case, dan kebutuhan awal, lalu bersama PM memastikan studi kelayakan selesai sebelum aktivitas teknis. Tanpa itu, tim berisiko membangun sistem yang salah, melebihi anggaran, atau gagal memenuhi kebutuhan bisnis.",
    wrongExplanations: {
      a: "Memulai coding tanpa perencanaan adalah anti-pattern 'Code and Fix'. Tanpa ruang lingkup yang jelas, kode berpotensi tidak sesuai kebutuhan dan harus dibuang.",
      c: "Wireframe adalah artefak fase Design, bukan fase pertama. Tanpa analisis kebutuhan, wireframe hanya berisi tebakan.",
      d: "Pemilihan tech stack dilakukan di fase Design setelah kebutuhan dipahami. Memilih teknologi terlalu dini dapat menimbulkan technical debt.",
    },
    hint: "Perhatikan kepemilikan artefak: charter adalah ranah PM, sedangkan BA memasok konteks bisnis dan kelayakan.",
  },
  {
    id: 2,
    phase: "planning",
    scenario:
      "Tim Anda sedang melakukan Studi Kelayakan untuk sistem e-procurement senilai Rp 2,4 miliar. CFO mempertanyakan mengapa proyek ini layak dilanjutkan dari sisi finansial.",
    question:
      "Komponen utama apa yang harus ada dalam Studi Kelayakan untuk menjawab pertanyaan CFO tersebut?",
    options: [
      { id: "a", text: "Entity Relationship Diagram (ERD) yang menunjukkan kompleksitas sistem." },
      { id: "b", text: "Analisis ROI, payback period, dan proyeksi penghematan biaya operasional." },
      { id: "c", text: "Mockup tampilan antarmuka sistem yang menarik untuk dipresentasikan." },
      { id: "d", text: "Daftar tech stack tanpa analisis biaya–manfaat dan proyeksi penghematan operasional." },
    ],
    correctOptionId: "b",
    explanation:
      "Feasibility Study dari sisi finansial (Economic Feasibility) harus mencakup Cost-Benefit Analysis (CBA), Return on Investment (ROI), payback period, dan Total Cost of Ownership (TCO). Ini adalah bahasa yang dipahami CFO untuk mengevaluasi kelayakan investasi teknologi.",
    wrongExplanations: {
      a: "ERD adalah artefak fase Design untuk merancang basis data, bukan untuk analisis kelayakan finansial.",
      c: "Mockup UI adalah artefak fase Design. Presentasi visual tidak menjawab pertanyaan kelayakan investasi CFO.",
      d: "Daftar tech stack bukan analisis kelayakan finansial; CFO membutuhkan proyeksi manfaat dan biaya, bukan sekadar daftar teknologi.",
    },
    hint: "CFO berbicara dalam bahasa manfaat vs biaya: ROI, payback period, dan penghematan operasional.",
  },
  {
    id: 3,
    phase: "analysis",
    scenario:
      "Anda adalah System Analyst di proyek pengembangan aplikasi klinik. Saat sesi wawancara dengan dokter dan staf administrasi, Anda menemukan kebutuhan yang saling bertentangan: dokter ingin rekam medis bisa diakses dari mana saja, sementara Kepala Klinik menginginkan akses dibatasi hanya dari jaringan internal untuk alasan keamanan.",
    question:
      "Bagaimana cara terbaik Anda menangani konflik kebutuhan ini sebagai System Analyst?",
    options: [
      { id: "a", text: "Mengikuti keinginan dokter karena dokter pengguna utama dan paling sering memakai sistem." },
      { id: "b", text: "Mengikuti keinginan Kepala Klinik karena beliau pemegang otoritas tertinggi di organisasi." },
      { id: "c", text: "Catat konflik, eskalasi sponsor, sepakati VPN + access control + audit log + sign-off." },
      { id: "d", text: "Mengabaikan konflik dan melanjutkan ke fase berikutnya; developer akan memutuskan nanti." },
    ],
    correctOptionId: "c",
    explanation:
      "Konflik kebutuhan adalah hal normal. SA mendokumentasikan semua kebutuhan (termasuk konflik) di SRS, memfasilitasi resolusi lewat stakeholder berwenang, dan mencari solusi yang memenuhi kedua kepentingan. Akses jarak jauh lewat VPN harus dilengkapi role-based access control, audit log aktivitas, serta sign-off formal agar keputusan dapat dipertanggungjawabkan.",
    wrongExplanations: {
      a: "SA tidak boleh memihak tanpa dasar. Keputusan harus melalui proses formal dengan stakeholder berwenang, bukan berdasarkan hierarki pengguna.",
      b: "Sama seperti opsi A, memihak satu pihak tanpa musyawarah keliru karena kebutuhan dokter juga berdasar pada alasan operasional yang valid.",
      d: "Mengabaikan konflik dan melempar tanggung jawab ke developer adalah kegagalan SA. Developer tidak memiliki konteks bisnis untuk memutuskan.",
    },
    hint: "Solusi 'win-win' tetap harus memenuhi prinsip privasi: siapa boleh mengakses, apa yang tercatat, dan siapa yang menyetujui.",
  },
  {
    id: 4,
    phase: "analysis",
    scenario:
      "Tim proyek sistem informasi logistik sudah masuk minggu ke-3 fase Analysis. Klien baru saja menyampaikan kebutuhan tambahan yang 'terlupakan': integrasi real-time dengan 5 vendor eksternal via API. Ini secara signifikan memperluas ruang lingkup proyek.",
    question:
      "Sebagai Business Analyst, respons yang paling tepat adalah...",
    options: [
      { id: "a", text: "Langsung menambahkan kebutuhan baru ke SRS tanpa catatan karena klien adalah pemilik proyek." },
      { id: "b", text: "Menolak kebutuhan baru karena tidak tercantum dalam Project Charter awal." },
      { id: "c", text: "Catat di CR log, tautkan ke SRS via requirement ID, impact analysis, persetujuan sponsor." },
      { id: "d", text: "Meminta developer mulai integrasi API sambil menunggu persetujuan formal." },
    ],
    correctOptionId: "c",
    explanation:
      "Sejak fase Analysis, setiap perubahan harus terlacak: beri requirement ID, catat di Change Request log, tautkan ke SRS, lakukan impact analysis terhadap scope/timeline/biaya, lalu minta persetujuan sponsor. Traceability mencegah kebutuhan 'hilang' atau berubah tanpa jejak dan memudahkan audit.",
    wrongExplanations: {
      a: "Menambah scope secara diam-diam tanpa catatan dan impact analysis adalah pemicu scope creep yang berbahaya.",
      b: "Menolak mentah-mentah tidak profesional. Kebutuhan bisnis bisa valid dan perlu diakomodasi dengan penyesuaian scope/budget.",
      d: "Memulai implementasi sebelum persetujuan formal melanggar prosedur manajemen proyek dan berisiko pekerjaan sia-sia.",
    },
    hint: "Fokus pada jejak perubahan: requirement ID, CR log, dan tautan ke SRS.",
  },
  {
    id: 5,
    phase: "design",
    scenario:
      "Anda merancang basis data untuk sistem e-commerce. Tabel Orders memiliki kolom: OrderID, CustomerName, CustomerEmail, CustomerPhone, ProductName, ProductPrice, Quantity, TotalPrice. Klien meminta sistem bisa berjalan cepat dan data tidak redundan.",
    question:
      "Apa masalah utama desain tabel tersebut dari perspektif Database Design dan bagaimana solusinya?",
    options: [
      { id: "a", text: "Tidak ada masalah; satu tabel besar lebih mudah di-query dan sudah cukup untuk seluruh data transaksi." },
      { id: "b", text: "Pisahkan Customers & Products, buat junction OrderItems(OrderID, ProductID, Quantity)." },
      { id: "c", text: "Masalahnya hanya penamaan kolom; cukup diubah sesuai naming convention yang konsisten." },
      { id: "d", text: "Tambahkan index pada semua kolom agar query cepat meski data tetap redundan." },
    ],
    correctOptionId: "b",
    explanation:
      "Dengan asumsi OrderID adalah primary key, atribut level order bergantung penuh pada OrderID sehingga 2NF terpenuhi. Namun CustomerName/Email/Phone bergantung pada CustomerID dan ProductName/Price pada ProductID — ketergantungan transitif yang harus dihilangkan untuk 3NF. Karena satu order bisa memuat banyak produk dan satu produk muncul di banyak order, relasi many-to-many dipecah dengan tabel junction OrderItems(OrderID, ProductID, Quantity).",
    wrongExplanations: {
      a: "Satu tabel besar (flat table) menyebabkan redundansi parah, anomali insert/update/delete, dan query tidak efisien saat data besar.",
      c: "Penamaan kolom bukan masalah utama. Masalah struktural (normalisasi) jauh lebih kritis daripada konvensi penamaan.",
      d: "Index pada semua kolom justru memperlambat INSERT/UPDATE dan tidak menyelesaikan masalah redundansi data.",
    },
    hint: "Cari atribut yang bergantung pada entitas lain, lalu pikirkan relasi many-to-many antara Orders dan Products.",
  },
  {
    id: 6,
    phase: "development",
    scenario:
      "Klien meminta penambahan fitur payment gateway baru ketika proses coding proyek Waterfall sudah berjalan 80%. Fitur ini tidak ada dalam SRS yang telah disetujui dan akan mempengaruhi modul checkout, laporan keuangan, dan integrasi bank.",
    question:
      "Sebagai System Analyst, tindakan prosedural apa yang harus Anda lakukan?",
    options: [
      { id: "a", text: "Langsung minta developer menambahkan fitur karena klien adalah pihak yang membayar proyek." },
      { id: "b", text: "Tolak permintaan karena coding sudah 80% dan SRS dianggap final, tanpa evaluasi dampak." },
      { id: "c", text: "Hentikan modul terdampak, buat CR, impact analysis, kontrak tambahan, update SRS & test plan." },
      { id: "d", text: "Masukkan ke backlog pasca-proyek tanpa memberi tahu klien tentang implikasi biaya, jadwal, dan risikonya." },
    ],
    correctOptionId: "c",
    explanation:
      "Meski coding sudah 80%, perubahan besar tidak boleh langsung dieksekusi. Urutan yang benar: (1) stop-the-line pada modul terdampak agar pekerjaan tidak menumpuk di atas asumsi lama, (2) buat Change Request formal, (3) impact analysis scope/timeline/biaya, (4) sepakati kontrak tambahan, (5) perbarui SRS dan test plan setelah disetujui.",
    wrongExplanations: {
      a: "Menerapkan perubahan tanpa analisis dampak berisiko merusak fitur yang sudah berjalan dan menunda jadwal tanpa kompensasi biaya.",
      b: "Menolak mentah-mentah tidak profesional. Kebutuhan bisnis bisa valid; Change Request adalah jalan tengah yang benar.",
      d: "Tidak memberi tahu klien tentang implikasi adalah pelanggaran etika profesional dan dapat berujung pada perselisihan kontrak.",
    },
    hint: "Jangan lanjut coding di modul yang akan berubah; hentikan dulu, baru proses perubahan secara formal.",
  },
  {
    id: 7,
    phase: "testing",
    scenario:
      "Tim QA menemukan 15 bug saat Blackbox Testing pada modul pembayaran. 3 di antaranya adalah bug kritis (sistem crash saat input nominal Rp 0), 7 adalah bug mayor (kalkulasi pajak salah), dan 5 adalah bug minor (typo label UI).",
    question:
      "Sebagai QA Lead, bagaimana Anda memprioritaskan penanganan bug ini?",
    options: [
      { id: "a", text: "Perbaiki semua bug secara berurutan dari yang ditemukan pertama (FIFO)." },
      { id: "b", text: "Perbaiki bug minor dulu karena lebih mudah dan cepat selesai, baru yang besar." },
      { id: "c", text: "Selesaikan bug kritis, lalu fungsional, terakhir tampilan dengan matriks prioritas." },
      { id: "d", text: "Laporkan semua bug ke klien dan biarkan klien yang memutuskan mana yang perlu diperbaiki." },
    ],
    correctOptionId: "c",
    explanation:
      "Bug triage menggunakan severity-priority matrix adalah standar industri. Bug Critical (crash, data loss, security breach) harus diselesaikan sebelum UAT dimulai karena dapat memblokir seluruh proses testing. Bug Mayor (fungsionalitas salah) diperbaiki berikutnya karena mempengaruhi akurasi bisnis. Bug Minor (kosmetik/UI) bisa dijadwalkan kemudian. Pendekatan ini memaksimalkan efektivitas tim dengan fokus pada risiko bisnis tertinggi.",
    wrongExplanations: {
      a: "FIFO tidak mempertimbangkan dampak bisnis. Bug kritis yang ditemukan terakhir bisa memblokir seluruh proyek jika tidak diprioritaskan.",
      b: "'Quick wins' di bug minor terasa memuaskan, tapi meninggalkan bug kritis (crash) adalah risiko bisnis yang tidak dapat diterima.",
      d: "Menentukan urutan penanganan bug adalah kewajiban tim QA; menyerahkan keputusan teknis kepada klien yang awam kurang profesional.",
    },
    hint: "Dampak bisnis dan kemungkinan crash lebih penting daripada kemudahan perbaikan.",
  },
  {
    id: 8,
    phase: "deployment",
    scenario:
      "Sistem informasi keuangan perusahaan siap dirilis ke produksi besok pagi. Tiba-tiba tim DevOps menemukan bahwa server produksi memiliki versi database yang berbeda (PostgreSQL 13) dari environment staging (PostgreSQL 15). Migration script sudah diuji di staging.",
    question:
      "Tindakan yang paling tepat sebagai System Analyst / DevOps Lead adalah...",
    options: [
      { id: "a", text: "Lanjutkan deployment sesuai jadwal; perbedaan versi database minor biasanya tidak menimbulkan masalah." },
      { id: "b", text: "Tunda rilis, samakan versi di staging setara, uji migration script + rollback, lalu deploy terjadwal." },
      { id: "c", text: "Deploy langsung dan pantau; jika muncul error, lakukan rollback secepat mungkin." },
      { id: "d", text: "Batalkan proyek karena environment produksi tidak sesuai spesifikasi yang disepakati." },
    ],
    correctOptionId: "b",
    explanation:
      "Perbedaan versi database adalah risiko tinggi untuk sistem keuangan. Urutan aman: (1) tunda rilis, (2) siapkan environment staging-equivalent dengan versi yang sama seperti target produksi, (3) uji migration script dan rollback plan di sana, (4) baru deploy sesuai jadwal. Upgrade produksi langsung tanpa uji setara justru menambah risiko.",
    wrongExplanations: {
      a: "Perbedaan versi database dapat membuat query gagal atau berperilaku tak terduga, situasi yang sangat berbahaya bagi sistem finansial.",
      c: "'Deploy and pray' adalah anti-pattern berbahaya. Jika terjadi korupsi data, rollback tidak bisa mengembalikan kepercayaan stakeholder.",
      d: "Pembatalan total berlebihan. Masalah ini bisa diselesaikan dengan penyamaan environment dan testing tambahan dalam waktu relatif singkat.",
    },
    hint: "Parity dulu, uji migration + rollback di environment setara, baru deploy.",
  },
  {
    id: 9,
    phase: "maintenance",
    scenario:
      "Enam bulan setelah go-live, pengguna melaporkan bahwa laporan bulanan sistem HRD membutuhkan waktu 45 menit untuk dihasilkan (sebelumnya 3 menit saat UAT). Data karyawan telah berkembang dari 500 menjadi 15.000 orang.",
    question:
      "Sebagai System Analyst yang menangani maintenance, analisis paling tepat untuk akar masalah ini adalah...",
    options: [
      { id: "a", text: "Sistem perlu diganti karena sudah tidak mampu menangani beban kerja data yang nyata." },
      { id: "b", text: "Ini masalah hardware; server perlu segera di-upgrade RAM dan CPU agar performa kembali." },
      { id: "c", text: "Indikasi query lambat; profiling & explain plan dulu sebelum menyimpulkan." },
      { id: "d", text: "Minta pengguna untuk bersabar karena lambatnya laporan adalah perilaku normal sistem." },
    ],
    correctOptionId: "c",
    explanation:
      "Degradasi yang tumbuh seiring volume data adalah indikasi kuat masalah query optimization, bukan kepastian. Karena itu langkah pertama adalah profiling (EXPLAIN ANALYZE), cek full table scan, index yang hilang, dan N+1 query. Setelah data diagnosis ada, baru pertimbangkan indexing, query rewriting, partitioning, atau upgrade hardware bila memang bottleneck-nya non-query.",
    wrongExplanations: {
      a: "Mengganti sistem adalah keputusan ekstrem dan mahal. Masalah performa hampir selalu bisa diselesaikan dengan optimasi teknis.",
      b: "Hardware upgrade tanpa diagnosis adalah pemborosan. Jika root cause-nya query tidak efisien, RAM 10x pun tidak menyelesaikan masalah secara fundamental.",
      d: "Menyuruh pengguna 'bersabar' adalah sikap tidak profesional yang melanggar SLA dan merusak kepercayaan pengguna.",
    },
    hint: "Indikasi kuat bukan diagnosis final; kumpulkan bukti lewat profiling dulu.",
  },
  {
    id: 10,
    phase: "Model Selection",
    scenario:
      "Perusahaan startup fintech ingin membangun aplikasi pinjaman online. Kebutuhan bisnis berubah cepat mengikuti regulasi OJK yang baru, tim developer terdiri dari 8 orang junior, dan investor meminta demo fungsional dalam 3 bulan.",
    question:
      "Model SDLC mana yang paling tepat direkomendasikan untuk situasi ini dan mengapa?",
    options: [
      { id: "a", text: "Waterfall, karena regulasi ketat selalu menuntut dokumentasi lengkap dan perubahan yang mahal." },
      { id: "b", text: "Agile Scrum: kebutuhan berubah cepat, tim kecil, demo 3 bulan; audit lewat DoD & dokumentasi." },
      { id: "c", text: "Spiral Model, karena pengelolaan risiko paling komprehensif untuk sistem keuangan yang kompleks." },
      { id: "d", text: "Prototype Model, karena investor perlu melihat tampilan UI secepat mungkin tanpa menunggu produk final." },
    ],
    correctOptionId: "b",
    explanation:
      "Agile Scrum cocok karena kebutuhan berubah cepat, tim kecil, dan target demo 3 bulan. Regulasi ketat tidak otomatis berarti Waterfall: Agile dapat memenuhi audit bila Definition of Done mencakup dokumentasi, review kepatuhan, dan jejak perubahan yang disepakati sejak awal. Waterfall justru menyulitkan adaptasi terhadap regulasi yang bergerak.",
    wrongExplanations: {
      a: "Regulasi ketat tidak otomatis menuntut Waterfall; yang penting adalah disiplin dokumentasi dan audit trail, bukan modelnya.",
      c: "Model Spiral diperuntukkan bagi proyek skala besar dengan tim berpengalaman, kurang tepat bagi perusahaan perintis dengan waktu terbatas.",
      d: "Prototype Model adalah pendekatan, bukan framework manajemen proyek lengkap. Tidak ada struktur tim, sprint, dan delivery yang jelas seperti Scrum.",
    },
    hint: "Regulasi ketat ≠ Waterfall. Yang menentukan adalah bagaimana kepatuhan dan dokumentasi dijalankan.",
  },
  {
    id: 11,
    phase: "development",
    scenario:
      "Tim 6 developer mengerjakan fitur checkout e-commerce. Beberapa developer ingin commit langsung ke main agar cepat, sementara kualitas rilis mulai menurun karena bug lolos ke staging.",
    question:
      "Praktik development seperti apa yang paling tepat diterapkan?",
    options: [
      { id: "a", text: "Semua developer commit langsung ke main agar cepat dan menghindari merge conflict yang rumit." },
      { id: "b", text: "Feature branch + PR, wajib code review, unit test & CI hijau sebelum merge ke main." },
      { id: "c", text: "Branch per developer tanpa aturan review, lalu merge semuanya di akhir sprint tanpa CI." },
      { id: "d", text: "Tunda semua unit test dan review sampai menjelang rilis agar proses coding terasa lebih cepat." },
    ],
    correctOptionId: "b",
    explanation:
      "Branch strategy yang sehat memisahkan pekerjaan per fitur (feature branch), mewajibkan pull request dan code review, serta menjalankan unit test/lint/build di CI sebelum merge. Main dilindungi dari commit langsung. Ini menurunkan risiko bug lolos ke staging tanpa mengorbankan kecepatan kolaborasi.",
    wrongExplanations: {
      a: "Commit langsung ke main membuat perubahan belum teruji bercampur dan sulit dilacak saat terjadi regresi.",
      c: "Branch tanpa aturan review menunda deteksi masalah sampai akhir sprint dan memicu merge conflict besar.",
      d: "Menunda test dan review justru memperbesar biaya perbaikan karena bug ditemukan saat rilis sudah dekat.",
    },
    hint: "Cari praktik yang menggabungkan isolasi pekerjaan, review manusia, dan verifikasi otomatis.",
  },
];
