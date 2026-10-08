// Sumber data portfolio — fallback offline.
// Repo: live fetch github.com/users/hrihq/repos, file ini fallback jika offline.

const FALLBACK_REPOS = [
  {"name":"D-77-kernel","lang":"C","stars":1,"forks":0,"updated":"2026-10-03","cat":"Kernel","url":"https://github.com/hrihq/D-77-kernel","desc":"Kernel untuk Redmi Note 12 Pro 4G (sweet_k6a). Linux 4.14, basis LineageOS dengan fitur eksotis, KSU, dan opsi performa."},
  {"name":"d-77-kernel1","lang":"C","stars":1,"forks":0,"updated":"2026-09-24","cat":"Kernel","url":"https://github.com/hrihq/d-77-kernel1","desc":"D-77 Kernel1 — varian kernel sweet_k6a, Linux 4.14 basis LineageOS. Eksperimen fitur terpisah dari D-77 utama."},
  {"name":"Glade-Kernel","lang":"C","stars":0,"forks":0,"updated":"2026-10-08","cat":"Kernel","url":"https://github.com/hrihq/Glade-Kernel","desc":"Glade Kernel untuk sweet_k6a. Basis LineageOS 4.14 dengan konfigurasi dan peningkatan sending sendiri."},
  {"name":"Positron-Sweet2","lang":"C","stars":0,"forks":0,"updated":"2026-10-04","cat":"Kernel","url":"https://github.com/hrihq/Positron-Sweet2","desc":"Kernel Positron untuk sweet2 (Redmi Note 12 Pro 4G). Linux 4.14.355-openela, BPF enabled. Build AOSP."},
  {"name":"los_kernel_xiaomi_sm6150","lang":"C","stars":0,"forks":0,"updated":"2026-10-04","cat":"Kernel","url":"https://github.com/hrihq/los_kernel_xiaomi_sm6150","desc":"Kernel LineageOS untuk platform Xiaomi SM6150 (sweet2 family) dengan fitur eksotis."},
  {"name":"Glade-AnyKernel3","lang":"Shell","stars":0,"forks":0,"updated":"2026-10-03","cat":"Kernel","url":"https://github.com/hrihq/Glade-AnyKernel3","desc":"Template flashable AnyKernel3 untuk Glade Kernel sweet_k6a. Zip instan via recovery/KernelSU."},
  {"name":"anykernel3","lang":"Shell","stars":0,"forks":0,"updated":"2026-09-23","cat":"Kernel","url":"https://github.com/hrihq/anykernel3","desc":"Template AnyKernel3 untuk membangun zip flashable dari kernel sweet_k6a."},
  {"name":"kasir-nusantara","lang":"JavaScript","stars":1,"forks":0,"updated":"2026-08-23","cat":"Web","url":"https://github.com/hrihq/kasir-nusantara","desc":"Aplikasi kasir warung — Kasir Nusantara. Web app JavaScript untuk warung dan UMKM."},
  {"name":"kelas-xii-pemesinan-1","lang":"HTML","stars":0,"forks":0,"updated":"2026-10-03","cat":"Web","url":"https://github.com/hrihq/kelas-xii-pemesinan-1","desc":"Website kelas XII Pemesinan 1: informasi tugas, pengumuman, dan dokumen kelas."},
  {"name":"my-absen","lang":"JavaScript","stars":0,"forks":0,"updated":"2026-09-05","cat":"Android","url":"https://github.com/hrihq/my-absen","desc":"My Absen — presensi wajah offline. ML Kit face detection dengan React Native/Expo."},
  {"name":"rasa-nusantara","lang":"HTML","stars":0,"forks":0,"updated":"2026-08-21","cat":"Web","url":"https://github.com/hrihq/rasa-nusantara","desc":"Proyek web resep dan kuliner Nusantara."},
  {"name":"portfolio","lang":"HTML","stars":0,"forks":0,"updated":"2026-09-02","cat":"Web","url":"https://github.com/hrihq/portfolio","desc":"Website portofolio pribadi — versi sebelumnya, tema pixel art retro."},
  {"name":"hrihq","lang":"HTML","stars":0,"forks":0,"updated":"2026-08-21","cat":"Web","url":"https://github.com/hrihq/hrihq","desc":"Repo profil GitHub — berkas README profil."}
];

const STACK = [
  {"t":"Kernel & Build","sub":"linux 4.14 · clang","items":["Linux 4.14","clang toolchain","AnyKernel3","KernelSU","BPF","LineageOS base","OpenELA","AOSP build"]},
  {"t":"Android","sub":"kotlin · compose","items":["Kotlin","Jetpack Compose","Material 3","Room","CameraX","ML Kit","Coil","Coroutines"]},
  {"t":"Web Frontend","sub":"html · css · js","items":["HTML","CSS","JavaScript","TypeScript","React","Node.js","Vite","Grid & Flexbox"]},
  {"t":"Tooling","sub":"git · ci","items":["Git","GitHub Actions","Gradle","ADB","fastboot","Figma","VS Code","Linux"]}
];

const MARQUEE = ["Linux 4.14","clang r450784d","AnyKernel3","KSU-340","BPF enabled","LineageOS 4.14","sweet_k6a","OpenELA","Jetpack Compose","Material 3","Room","ML Kit face","Redmi Note 12 Pro 4G","device fisik · no emulator","AGP 9.1.1"];

const STATS_FALLBACK = [
  ["repoPublik",13,"repo publik"],
  ["tahunKernel",2,"tahun ngulik kernel"],
  ["rilisKernel",7,"rilis kernel"],
  ["deviceFisik",1,"device utama"]
];
