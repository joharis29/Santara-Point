# Santara-Point
flowchart TD
    %% Definisi Aktor/Swimlane secara Implisit melalui warna/subgraph
    
    start((Mulai)) --> input["<b>Staf/Pemohon</b><br/>Login & Input Pengajuan Dana"]
    
    input --> data1["Input: Nominal & Deskripsi"]
    input --> data2["Pilih: Akun Belanja (COA) &<br/>Sumber Dana (ISAK 335)"]
    
    %% VALIDASI SISTEM (NOVELTY KAMU)
    data2 --> sys_val{"<b>Sistem Validasi:<br/>Cek Kepatuhan Syariah</b><br/>(Apakah Sumber Dana<br/>Boleh untuk Akun ini?)"}
    
    sys_val -- "<b>TIDAK (Non-Halal/Salah Akad)</b>" --> reject_sys["<b>Ditolak Sistem</b><br/>Muncul Peringatan:<br/>'Dana Wakaf Tidak Boleh<br/>untuk Konsumsi!'"]
    reject_sys --> input
    
    sys_val -- "<b>YA (Sesuai Akad)</b>" --> app_unit{"<b>Persetujuan<br/>Kepala Unit</b>"}
    
    %% APPROVAL JENJANG 1
    app_unit -- Ditolak --> rev_unit["Kembali ke Pemohon<br/>(Revisi)"]
    rev_unit --> input
    app_unit -- Disetujui --> notif_pimp["Notifikasi ke Pimpinan"]
    
    %% APPROVAL JENJANG 2 (PIMPINAN/KYAI)
    notif_pimp --> app_pimp{"<b>Persetujuan<br/>Pimpinan Pondok</b>"}
    
    app_pimp -- Ditolak --> rev_pimp["Kembali ke Pemohon"]
    rev_pimp --> input
    app_pimp -- Disetujui --> status_ready["Status: Siap Dicairkan<br/>(Approved)"]
    
    %% PENCAIRAN OLEH BENDAHARA
    status_ready --> bendahara_cair["<b>Bendahara</b><br/>Melihat Daftar Approved"]
    bendahara_cair --> action_pay["Bendahara Menyerahkan Uang<br/>(Tunai/Transfer)"]
    action_pay --> sys_update["Sistem Update Status:<br/><b>PAID / CAIR</b>"]
    
    %% PROSES BELANJA & UPLOAD BUKTI
    sys_update --> belanja["<b>Staf/Pemohon</b><br/>Membelanjakan Dana"]
    belanja --> upload["<b>Upload Bukti Realisasi</b><br/>(Foto Nota/Kuitansi)"]
    
    %% VERIFIKASI AKHIR
    upload --> verif_bendahara{"<b>Verifikasi<br/>Bendahara</b><br/>(Cek Kesesuaian Nota)"}
    
    verif_bendahara -- Tidak Sesuai --> minta_revisi["Minta Bukti Ulang/Klarifikasi"]
    minta_revisi --> upload
    
    verif_bendahara -- Sesuai --> close["<b>Selesai</b><br/>Transaksi Ditutup &<br/>Jurnal Terbentuk Otomatis"]
    
    close --> finish((Selesai))

    %% Styling Warna agar Cantik
    style start fill:#f9f,stroke:#333,stroke-width:2px
    style finish fill:#f9f,stroke:#333,stroke-width:2px
    style sys_val fill:#ffdddd,stroke:#f66,stroke-width:2px,color:red
    style input fill:#d5e8d4,stroke:#82b366
    style app_unit fill:#fff2cc,stroke:#d6b656
    style app_pimp fill:#fff2cc,stroke:#d6b656
    style upload fill:#dae8fc,stroke:#6c8ebf
