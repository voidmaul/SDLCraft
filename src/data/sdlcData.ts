export interface SdlcArtifact {
  inputs: string[];
  outputs: string[];
}

export interface SdlcCaseStudy {
  projectName: string;
  description: string;
  highlight: string;
}

export interface SdlcPhaseTheme {
  accent: string;
  bg: string;
  border: string;
  badge: string;
  tag: string;
}

export interface SdlcPhase {
  id: string;
  number: number;
  name: string;
  nameId: string;
  icon: string;
  theme: SdlcPhaseTheme;
  objective: string;
  roles: { title: string; description: string }[];
  artifacts: SdlcArtifact;
  caseStudy: SdlcCaseStudy;
  keyActivities: string[];
}

export const sdlcPhases: SdlcPhase[] = [
  {
    id: "planning",
    number: 1,
    name: "Planning",
    nameId: "Perencanaan & Studi Kelayakan Bisnis",
    icon: "ClipboardList",
    theme: {
      accent: "text-violet-700",
      bg: "bg-violet-50",
      border: "border-violet-900",
      badge: "bg-violet-100 text-violet-800",
      tag: "bg-violet-900 text-violet-100",
    },
    objective:
      "Mendefinisikan ruang lingkup proyek, menilai kelayakan teknis, operasional, dan finansial, serta membentuk fondasi manajemen proyek yang solid sebelum pengembangan dimulai.",
    roles: [
      {
        title: "Project Manager (PM)",
        description:
          "Menyusun Project Charter, mengelola timeline Gantt Chart, dan mengalokasikan sumber daya tim.",
      },
      {
        title: "Business Analyst (BA)",
        description:
          "Melakukan preliminary requirements gathering dan mendokumentasikan Business Case untuk stakeholders.",
      },
      {
        title: "System Analyst (SA)",
        description:
          "Menilai kelayakan teknis infrastruktur dan memperkirakan estimasi biaya pengembangan sistem.",
      },
    ],
    artifacts: {
      inputs: [
        "Business Problem Statement",
        "Visi & Misi Organisasi",
        "Anggaran Awal (Budget Proposal)",
        "Data Kompetitor & Pasar",
      ],
      outputs: [
        "Project Charter",
        "Feasibility Study Report (Studi Kelayakan)",
        "Project Management Plan (PMP)",
        "Work Breakdown Structure (WBS)",
        "Gantt Chart / Timeline",
        "Risk Register Awal",
      ],
    },
    keyActivities: [
      "Identifikasi masalah & peluang bisnis",
      "Analisis kelayakan (TELOS Framework)",
      "Pembentukan tim proyek & RACI Matrix",
      "Estimasi biaya & durasi proyek",
      "Penetapan KPI & success criteria",
    ],
    caseStudy: {
      projectName: "Sistem Informasi Rumah Sakit SIMRS di RSU Medika Nusantara",
      description:
        "RSU Medika Nusantara mengidentifikasi antrian rawat jalan yang tidak terkelola sebagai masalah utama. BA melakukan wawancara dengan Direktur RS dan kepala poli untuk menyusun Business Case yang menunjukkan potensi efisiensi 40% waktu tunggu pasien.",
      highlight:
        "Output kunci: Project Charter yang disetujui Direktur RS, Studi Kelayakan menunjukkan ROI positif dalam 18 bulan.",
    },
  },
  {
    id: "analysis",
    number: 2,
    name: "Analysis",
    nameId: "Analisis Kebutuhan Sistem & Pemodelan",
    icon: "Search",
    theme: {
      accent: "text-sky-700",
      bg: "bg-sky-50",
      border: "border-sky-900",
      badge: "bg-sky-100 text-sky-800",
      tag: "bg-sky-900 text-sky-100",
    },
    objective:
      "Menggali, mendokumentasikan, dan memodelkan kebutuhan fungsional & non-fungsional sistem secara komprehensif melalui teknik elicitasi kebutuhan yang terstruktur.",
    roles: [
      {
        title: "Business Analyst (BA)",
        description:
          "Memimpin sesi wawancara, FGD, dan observasi lapangan untuk mengumpulkan kebutuhan bisnis dari semua stakeholder.",
      },
      {
        title: "System Analyst (SA)",
        description:
          "Menerjemahkan kebutuhan bisnis menjadi spesifikasi teknis: menyusun SRS, membuat DFD & Use Case Diagram.",
      },
      {
        title: "Product Owner (PO)",
        description:
          "Memprioritasikan backlog kebutuhan dan memvalidasi bahwa requirements sesuai nilai bisnis yang diharapkan.",
      },
    ],
    artifacts: {
      inputs: [
        "Project Charter (dari fase Planning)",
        "Hasil Wawancara Stakeholder",
        "Dokumen Proses Bisnis As-Is",
        "Regulasi & Standar yang Berlaku",
      ],
      outputs: [
        "Software Requirements Specification (SRS)",
        "Data Flow Diagram (DFD) Level 0, 1, 2",
        "Use Case Diagram & Use Case Specification",
        "Business Process Model (BPMN)",
        "User Stories & Acceptance Criteria",
        "Prototype Kertas (Paper Prototype)",
      ],
    },
    keyActivities: [
      "Elicitasi kebutuhan (wawancara, kuesioner, observasi)",
      "Pemodelan proses bisnis (As-Is vs To-Be)",
      "Pembuatan Use Case & Activity Diagram",
      "Validasi requirements bersama stakeholder",
      "Prioritisasi kebutuhan (MoSCoW Method)",
    ],
    caseStudy: {
      projectName: "Sistem E-Kampus Universitas Digital Nusantara",
      description:
        "SA mewawancarai Kepala BAAK, dosen, dan mahasiswa untuk mendokumentasikan 47 use case pada modul akademik. Ditemukan kebutuhan tersembunyi: integrasi dengan sistem keuangan dan presensi yang awalnya tidak disebutkan klien.",
      highlight:
        "Output kunci: SRS setebal 60 halaman, DFD Level 1 & 2 untuk 5 subsistem, 47 Use Case Specification lengkap.",
    },
  },
  {
    id: "design",
    number: 3,
    name: "Design",
    nameId: "Perancangan UI/UX, Basis Data, & Arsitektur Sistem",
    icon: "Palette",
    theme: {
      accent: "text-cyan-700",
      bg: "bg-cyan-50",
      border: "border-cyan-900",
      badge: "bg-cyan-100 text-cyan-800",
      tag: "bg-cyan-900 text-cyan-100",
    },
    objective:
      "Merancang blueprint lengkap sistem meliputi arsitektur teknis, desain antarmuka pengguna (UI/UX), struktur basis data, dan spesifikasi integrasi komponen sebelum coding dimulai.",
    roles: [
      {
        title: "System Analyst / Solution Architect",
        description:
          "Merancang arsitektur sistem (Monolith/Microservices), memilih tech stack, dan menyusun System Design Document.",
      },
      {
        title: "UI/UX Designer",
        description:
          "Membuat wireframe, mockup Figma, dan prototype interaktif sesuai standar usability dan aksesibilitas.",
      },
      {
        title: "Database Administrator (DBA)",
        description:
          "Merancang Entity Relationship Diagram (ERD), normalisasi tabel, dan strategi indexing basis data.",
      },
    ],
    artifacts: {
      inputs: [
        "SRS (dari fase Analysis)",
        "Use Case Diagram & Spesifikasi",
        "Paper Prototype",
        "Standar UI Organisasi (Design System)",
      ],
      outputs: [
        "System Design Document (SDD)",
        "Entity Relationship Diagram (ERD) / Class Diagram",
        "Sequence Diagram & Collaboration Diagram",
        "Wireframe & Mockup UI (Figma/Adobe XD)",
        "Database Schema & Data Dictionary",
        "API Specification Document (OpenAPI/Swagger)",
        "Deployment Architecture Diagram",
      ],
    },
    keyActivities: [
      "Pemilihan arsitektur sistem & tech stack",
      "Desain ERD & normalisasi database (1NF, 2NF, 3NF)",
      "Pembuatan Sequence & Collaboration Diagram",
      "Desain UI mockup & prototype Figma",
      "Penetapan standar coding & naming convention",
    ],
    caseStudy: {
      projectName: "Platform Belanja Online UMKM Pasar Digital Lokal",
      description:
        "Tim desain merancang ERD dengan 32 entitas untuk mendukung multi-vendor. DBA menerapkan normalisasi 3NF dan merancang strategi partisi tabel untuk mengantisipasi 100.000+ transaksi/hari. UI Designer membuat 80+ screen mockup di Figma.",
      highlight:
        "Output kunci: SDD 120 halaman, ERD 32 entitas, Figma prototype 80 screen dengan design system lengkap.",
    },
  },
  {
    id: "development",
    number: 4,
    name: "Development",
    nameId: "Implementasi, Coding, & Version Control",
    icon: "Code2",
    theme: {
      accent: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-900",
      badge: "bg-emerald-100 text-emerald-800",
      tag: "bg-emerald-900 text-emerald-100",
    },
    objective:
      "Mengimplementasikan seluruh rancangan menjadi kode program yang berfungsi menggunakan standar coding yang telah ditetapkan, dikelola dengan version control, dan diintegrasikan secara berkelanjutan.",
    roles: [
      {
        title: "Software Developer / Programmer",
        description:
          "Mengimplementasikan fitur berdasarkan SRS & SDD, menulis unit test, dan melakukan code review antar anggota tim.",
      },
      {
        title: "System Analyst (SA)",
        description:
          "Memastikan implementasi sesuai spesifikasi, menjawab pertanyaan teknis developer, dan mengelola perubahan kebutuhan.",
      },
      {
        title: "DevOps Engineer",
        description:
          "Menyiapkan CI/CD pipeline, mengelola environment (dev/staging/production), dan memantau kualitas kode otomatis.",
      },
    ],
    artifacts: {
      inputs: [
        "System Design Document (SDD)",
        "Database Schema",
        "API Specification",
        "Wireframe & Mockup UI",
        "Coding Standard Guidelines",
      ],
      outputs: [
        "Source Code (Repository Git/GitHub/GitLab)",
        "Unit Test & Integration Test Code",
        "Build Artifact (Docker Image / APK / JAR)",
        "Technical Documentation (Javadoc/JSDoc)",
        "Sprint Review Demo",
        "Release Notes Draft",
      ],
    },
    keyActivities: [
      "Setup Git repository & branching strategy (Git Flow)",
      "Implementasi frontend & backend sesuai SDD",
      "Penulisan unit test (coverage ≥ 80%)",
      "Code review & peer programming",
      "Integrasi CI/CD pipeline otomatis",
    ],
    caseStudy: {
      projectName: "Aplikasi Presensi Digital Dinas Pendidikan Kota",
      description:
        "Tim 6 developer menggunakan Git Flow dengan branch master/develop/feature. Setiap feature branch wajib melewati code review 2 orang sebelum merge. CI/CD dengan GitHub Actions menjalankan unit test otomatis pada setiap pull request.",
      highlight:
        "Output kunci: 1.200+ commit terstruktur, unit test coverage 85%, CI/CD pipeline fully automated.",
    },
  },
  {
    id: "testing",
    number: 5,
    name: "Testing",
    nameId: "Pengujian Blackbox, Whitebox, & UAT",
    icon: "TestTube2",
    theme: {
      accent: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-900",
      badge: "bg-amber-100 text-amber-800",
      tag: "bg-amber-900 text-amber-100",
    },
    objective:
      "Memastikan sistem bebas dari defect, memenuhi semua acceptance criteria dari SRS, dan diterima oleh pengguna akhir melalui serangkaian pengujian sistematis dan terstruktur.",
    roles: [
      {
        title: "QA Engineer / Software Tester",
        description:
          "Menyusun Test Plan, Test Case, dan menjalankan Blackbox Testing (functional) serta Whitebox Testing (structural/code coverage).",
      },
      {
        title: "Business Analyst (BA)",
        description:
          "Menyusun skenario User Acceptance Testing (UAT) berdasarkan use case dan memimpin sesi UAT bersama klien.",
      },
      {
        title: "End User / Stakeholder",
        description:
          "Berpartisipasi aktif dalam UAT untuk memvalidasi bahwa sistem sesuai kebutuhan operasional bisnis nyata.",
      },
    ],
    artifacts: {
      inputs: [
        "SRS & Use Case Specification",
        "Source Code & Build Artifact",
        "Test Plan Document",
        "Database Schema",
      ],
      outputs: [
        "Test Plan Document",
        "Test Case Specification (per Use Case)",
        "Bug Report & Defect Log",
        "Test Summary Report",
        "UAT Sign-off Document",
        "Performance Test Report",
      ],
    },
    keyActivities: [
      "Penyusunan Test Plan & Test Case dari Use Case",
      "Blackbox Testing: Equivalence Partitioning & BVA",
      "Regression Testing setelah bug fixing",
      "Performance & Load Testing",
      "Pelaksanaan UAT & pengumpulan sign-off klien",
    ],
    caseStudy: {
      projectName: "Sistem Informasi Perpustakaan Universitas Regional",
      description:
        "QA menyusun 185 test case dari 47 use case. Ditemukan 23 bug kritis selama blackbox testing, termasuk kesalahan kalkulasi denda keterlambatan. UAT dilaksanakan 2 iterasi bersama 15 staf perpustakaan sebelum sign-off.",
      highlight:
        "Output kunci: 185 test case, 0 bug kritis tersisa sebelum UAT sign-off, Test Summary Report disetujui stakeholder.",
    },
  },
  {
    id: "deployment",
    number: 6,
    name: "Deployment",
    nameId: "Rilis Produksi, Staging, & CI/CD Pipeline",
    icon: "Rocket",
    theme: {
      accent: "text-orange-700",
      bg: "bg-orange-50",
      border: "border-orange-900",
      badge: "bg-orange-100 text-orange-800",
      tag: "bg-orange-900 text-orange-100",
    },
    objective:
      "Merilis sistem yang telah lulus pengujian ke lingkungan produksi secara aman, terkelola, dan terdokumentasi dengan baik, termasuk pelatihan pengguna dan pengalihan data legacy.",
    roles: [
      {
        title: "DevOps / System Administrator",
        description:
          "Mengeksekusi deployment plan, mengelola server produksi, konfigurasi load balancer, dan memantau stabilitas sistem pasca-rilis.",
      },
      {
        title: "System Analyst (SA)",
        description:
          "Menyiapkan Deployment Checklist, mengkoordinasikan migrasi data, dan memastikan rollback plan tersedia.",
      },
      {
        title: "Business Analyst (BA)",
        description:
          "Mengorganisir pelatihan (training) end user dan menyiapkan user manual serta help documentation.",
      },
    ],
    artifacts: {
      inputs: [
        "UAT Sign-off Document",
        "Build Artifact Final (Tested)",
        "Database Migration Script",
        "Deployment Plan & Rollback Plan",
      ],
      outputs: [
        "Deployment Checklist (Executed)",
        "Production Release Notes",
        "Data Migration Report",
        "User Manual & Training Material",
        "System Monitoring Dashboard Setup",
        "Post-Deployment Verification Report",
      ],
    },
    keyActivities: [
      "Eksekusi Deployment Plan di lingkungan produksi",
      "Migrasi data dari sistem lama (legacy migration)",
      "Smoke testing & sanity check pasca-deployment",
      "Pelatihan end user & distribusi user manual",
      "Aktivasi monitoring & alerting system",
    ],
    caseStudy: {
      projectName: "Portal Layanan Publik Pemerintah Kabupaten X",
      description:
        "Peluncuran sistem dilakukan Sabtu dini hari pukul 00.00 sampai 04.00 untuk meminimalkan gangguan layanan. Tim analis menyiapkan rencana pemulihan dengan data cadangan satu jam sebelumnya. Pelatihan 120 staf kelurahan dilaksanakan dalam 3 sesi selama seminggu.",
      highlight:
        "Output kunci: Zero-downtime deployment, 120 staf terlatih, monitoring aktif dengan alerting via Telegram Bot.",
    },
  },
  {
    id: "maintenance",
    number: 7,
    name: "Maintenance",
    nameId: "Pemeliharaan Sistem, Bug Patching, & Change Request",
    icon: "Wrench",
    theme: {
      accent: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-900",
      badge: "bg-rose-100 text-rose-800",
      tag: "bg-rose-900 text-rose-100",
    },
    objective:
      "Memastikan sistem berjalan optimal pasca-rilis melalui pemantauan berkelanjutan, penanganan bug produksi, pengelolaan change request, dan perencanaan pengembangan versi berikutnya.",
    roles: [
      {
        title: "System Analyst (SA)",
        description:
          "Menganalisis dan mendokumentasikan setiap Change Request (CR) dari pengguna, mengevaluasi dampak teknis, dan memprioritaskan backlog pemeliharaan.",
      },
      {
        title: "Support Engineer / Helpdesk",
        description:
          "Menerima laporan bug dari pengguna, melakukan triage, dan berkoordinasi dengan developer untuk hotfix kritis.",
      },
      {
        title: "Product Owner (PO)",
        description:
          "Mengelola roadmap produk jangka panjang, memprioritaskan enhancement request berdasarkan value bisnis.",
      },
    ],
    artifacts: {
      inputs: [
        "Bug Report dari Pengguna Produksi",
        "Change Request Form",
        "System Monitoring Logs & Metrics",
        "Service Level Agreement (SLA)",
      ],
      outputs: [
        "Patch Release & Hotfix Documentation",
        "Change Request Log & Status Report",
        "System Performance Report (Monthly)",
        "Updated Technical Documentation",
        "Product Roadmap v.Next",
        "Post-Implementation Review Report",
      ],
    },
    keyActivities: [
      "Pemantauan performa sistem (monitoring & alerting)",
      "Triase & penanganan bug produksi (SLA-based)",
      "Pengelolaan Change Request (CR) Process",
      "Security patching & dependency update",
      "Perencanaan versi rilis berikutnya",
    ],
    caseStudy: {
      projectName: "Evaluasi SIMRS RSU Medika Nusantara Enam Bulan Pasca Rilis",
      description:
        "Tim SA mengelola 34 change request dalam 6 bulan pertama: 12 bug kritis ditangani < 4 jam (sesuai SLA), 22 enhancement request diprioritaskan untuk versi 1.1. Ditemukan bottleneck performa di modul pelaporan yang diselesaikan dengan query optimization.",
      highlight:
        "Output kunci: Uptime 99.7%, semua CR dikategori Critical diselesaikan dalam SLA, roadmap v1.1 disetujui.",
    },
  },
];
