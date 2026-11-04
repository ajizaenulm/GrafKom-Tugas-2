# Tugas 2 Grafika Komputer

## Nama Kelompok
- Aji Zaenul Musthofa (NRP: 5025241065)
- Raden Kurniawan Agung Fitrianto (NRP: 5025241104)

## Pembagian Tugas

| No | Komponen / Rincian Tugas | Anggota Penanggung Jawab |
| --- | --- | --- |
| 1a | **Pemodelan Objek 3D dan Hirarki:** `RektoratBuilding`, `MainCenterBody`, `LeftWing`, `RightWing`, `LobbyGlass`, `SignBoard`, `LowerTieredRoof`, `AtticWall`, `UpperTieredRoof`, `FlagPoleSystem`, `PoleShaft`, `GoldFinial`, `FlagMesh`, `FountainSystem`, `WaterSurface`, `LeftRim`, `RightRim`, `FrontRim`, `BackRim`, `Rock_${i}`, `WaterJet_${this.waterJets.length}`, `Environment`, `GrassGround`, `Tree`, `Trunk`, `FoliageLower`, `FoliageUpper` | Aji |
| 1b | **Pemodelan Objek 3D dan Hirarki:** `LeftRoof`, `RightRoof`, `FrontPorchRoof`, `PorchCeiling`, `Pillar_${p}_${i}`, `RektoratSign` (porchSign), `RoadSystem`, `FrontPorchRoad`, `OuterPoolRoad`, `SideRoadLeft`, `SideRoadRight`, `RektoratSign`, `RektoratSignOnWalkway`, `SignBaseWall`, `ConnectingWalkway`, `MainWalkway`, `SedanCar`, `BodyLower`, `Cabin`, `Wheel_${i}`, `Tire_${i}` | Agung |
| 2a | **Animasi 3D:** `FlagPoleSystem` (FlagMesh / Bendera Merah Putih), `FountainSystem` (WaterSurface & WaterJet) | Aji |
| 2b | **Animasi 3D:** `SedanCar` | Agung |
| 3a | **Dokumentasi Lapangan Foto:** Mengambil dan menyiapkan foto asli Gedung Rektorat dan kolam refleksi ITS. | Aji |
| 3b | **Dokumentasi Lapangan Video:** Mengambil dan menyiapkan video rekaman observasi asli Gedung Rektorat dan kolam refleksi ITS. | Agung |
| 4 | **Sistem Pencahayaan (Lighting):** Mengembangkan GLSL *vertex & fragment shaders* dengan model pencahayaan *Phong Reflection* (komponen Ambient, Diffuse/Lambertian, dan Specular) serta mode siang dan malam. | Aji |
| 5 | **Pemetaan Tekstur (Texture Mapping):** Menerapkan *multi-texture mapping* pada gedung, air kolam, genteng, dan plang Logo ITS, serta menangani koreksi orientasi UV (`UNPACK_FLIP_Y_WEBGL`). | Aji |
| 6 | **Kamera Interaktif:** Mengembangkan *Orbit Camera Controller* dengan kontrol mouse (drag rotasi 360° dan scroll zoom), serta tombol preset sudut pandang foto asli. | Aji |
| 7 | **Antarmuka Web:** Merancang tata letak web responsif berdampingan (*side-by-side*). | Aji |
| 8 | **Scene Tree:** Membuat diagram pohon hubungan hierarki objek (*Scene Tree*). | Agung |
| 9 | **Keyboard Shortcuts & Kontrol Navigasi:** Mengimplementasikan interaksi kendali kamera tingkat lanjut melalui tombol keyboard meliputi navigasi gerak (`WASD`), rotasi tatapan (`IJKL`), kontrol ketinggian vertikal (`Space`/`Shift`), serta shortcut penyelarasan orientasi sumbu (`X`, `Y`, `Z`). | Agung |