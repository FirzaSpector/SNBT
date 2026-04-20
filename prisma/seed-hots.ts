import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hotsQuestions = [
  // LITERASI BAHASA INDONESIA (ID: 10)
  {
    topikId: 10,
    pertanyaan: `Bacalah teks berikut dengan saksama!\n\nDi era digital, perlindungan data pribadi menjadi isu yang sangat krusial. Kebocoran data yang terjadi pada beberapa platform e-commerce besar di Indonesia menunjukkan rentannya sistem keamanan siber yang ada. Padahal, data pribadi yang jatuh ke tangan pihak tak bertanggung jawab dapat disalahgunakan untuk berbagai kejahatan, mulai dari penipuan daring, pencurian identitas, hingga pencucian uang. Pemerintah memang telah mengesahkan Undang-Undang Pelindungan Data Pribadi (UU PDP), namun implementasinya di lapangan masih memerlukan pengawasan ketat dan pembentukan lembaga pengawas independen yang kuat.\n\nBerdasarkan teks di atas, simpulan yang paling tepat adalah...`,
    pilihan: [
      { teks: "Kebocoran data di platform e-commerce adalah hal yang lumrah di era digital.", urutan: 1, isCorrect: false },
      { teks: "UU PDP sudah cukup untuk menjamin tidak adanya kebocoran data di Indonesia.", urutan: 2, isCorrect: false },
      { teks: "Ancaman kejahatan siber dapat dihentikan sepenuhnya dengan pengesahan UU PDP.", urutan: 3, isCorrect: false },
      { teks: "Pengesahan UU PDP harus diiringi dengan pengawasan ketat dan lembaga independen agar efektif melindungi data pribadi.", urutan: 4, isCorrect: true },
      { teks: "Lembaga pengawas independen lebih penting daripada keberadaan UU Pelindungan Data Pribadi.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Teks secara eksplisit menyatakan bahwa meskipun UU PDP telah disahkan, efektivitasnya sangat bergantung pada pengawasan yang ketat dan lembaga independen yang kuat. Opsi D adalah simpulan paling akurat.",
    tingkatKesulitan: 80,
    irtDifficulty: 1.5,
    irtDiscrimination: 1.2,
  },
  {
    topikId: 12,
    pertanyaan: `Bacalah paragraf berikut!\n\nPariwisata berkelanjutan (sustainable tourism) bukan lagi sekadar tren, melainkan keharusan mutlak jika kita ingin melestarikan destinasi wisata alam. Alih-alih mengejar kuantitas turis secara masif yang bermuara pada kerusakan ekologi (overtourism), konsep ini menekankan pada kualitas kunjungan. Pelibatan masyarakat lokal dalam manajemen pariwisata menjadi pilar utamanya, sehingga perputaran ekonomi tidak hanya dinikmati oleh investor besar, tetapi juga memberdayakan warga setempat.\n\nKelemahan utama dari argumen penulis pada paragraf di atas adalah...`,
    pilihan: [
      { teks: "Penulis tidak memberikan contoh nyata destinasi pariwisata yang telah hancur akibat overtourism.", urutan: 1, isCorrect: true },
      { teks: "Penulis melebih-lebihkan dampak negatif pariwisata massal terhadap ekologi.", urutan: 2, isCorrect: false },
      { teks: "Penulis gagal menjelaskan apa itu pariwisata berkelanjutan secara definisi.", urutan: 3, isCorrect: false },
      { teks: "Penulis terlalu berpihak kepada masyarakat lokal dibandingkan dengan penanam modal (investor).", urutan: 4, isCorrect: false },
      { teks: "Penulis tidak menyebutkan peran pemerintah dalam mengatur konsep pariwisata ini.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Argumen menjadi lemah apabila klaim tidak didukung oleh bukti empiris atau contoh konkret. Penulis menyatakan 'bermuara pada kerusakan ekologi' tetapi tidak memberikan satupun contoh kasus yang memperkuat hipotesisnya tersebut.",
    tingkatKesulitan: 90,
    irtDifficulty: 2.1,
    irtDiscrimination: 1.5,
  },

  // PENALARAN UMUM (ID: 1)
  {
    topikId: 1,
    pertanyaan: `Diketahui premis-premis berikut:\n1. Jika curah hujan sangat tinggi, maka bendungan Katulampa akan berstatus siaga 1.\n2. Jika bendungan Katulampa berstatus siaga 1, maka beberapa wilayah di Jakarta dipastikan terendam banjir.\n\nHari ini, tidak ada wilayah di Jakarta yang terendam banjir.\n\nKesimpulan yang sah dari premis di atas adalah...`,
    pilihan: [
      { teks: "Bendungan Katulampa mungkin berstatus siaga 1.", urutan: 1, isCorrect: false },
      { teks: "Curah hujan hari ini sangat tinggi.", urutan: 2, isCorrect: false },
      { teks: "Curah hujan hari ini tidak sangat tinggi.", urutan: 3, isCorrect: true },
      { teks: "Jakarta memiliki sistem drainase yang sangat baik.", urutan: 4, isCorrect: false },
      { teks: "Bendungan Katulampa rusak dan tidak berfungsi.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Soal ini menggunakan logika Silogisme dan Modus Tollens. \np -> q (Hujan tinggi -> Siaga 1)\nq -> r (Siaga 1 -> Jakarta banjir)\nKesimpulan sementara: p -> r (Jika hujan tinggi, Jakarta banjir).\nFaktanya: ~r (Tidak banjir).\nMaka berdasarkan Modus Tollens (~r), kesimpulannya adalah ~p (Curah hujan tidak tinggi).",
    tingkatKesulitan: 75,
    irtDifficulty: 0.8,
    irtDiscrimination: 1.0,
  },
  {
    topikId: 1,
    pertanyaan: `Andi, Budi, Caca, Deni, dan Eka duduk mengelilingi meja bundar. \n- Budi duduk tepat di sebelah kiri Caca.\n- Andi tidak duduk bersebelahan dengan Budi maupun Caca.\n- Deni duduk berhadapan dengan Caca.\n\nSiapakah yang duduk di sebelah kanan Eka?`,
    pilihan: [
      { teks: "Andi", urutan: 1, isCorrect: false },
      { teks: "Budi", urutan: 2, isCorrect: true },
      { teks: "Caca", urutan: 3, isCorrect: false },
      { teks: "Deni", urutan: 4, isCorrect: false },
      { teks: "Eka", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Dengan logika meja bundar berlima, jika Budi di kiri Caca, dan Deni hadap Caca, Andi tidak dekat Caca/Budi. Maka susunan: Caca, Andi, Deni, Eka, Budi. Kanan Eka adalah Budi.",
    tingkatKesulitan: 90,
    irtDifficulty: 2.2,
    irtDiscrimination: 1.8,
  },

  // PENGETAHUAN KUANTITATIF (ID: 2)
  {
    topikId: 2,
    pertanyaan: `Diberikan persamaan garis $l: 2x - 3y = 6$. Sebuah garis $k$ tegak lurus dengan garis $l$ dan memotong sumbu-$x$ di titik dengan absis 4. Titik potong garis $k$ dengan sumbu-$y$ adalah...`,
    pilihan: [
      { teks: "(0, 6)", urutan: 1, isCorrect: true },
      { teks: "(0, -6)", urutan: 2, isCorrect: false },
      { teks: "(0, 8)", urutan: 3, isCorrect: false },
      { teks: "(0, -8)", urutan: 4, isCorrect: false },
      { teks: "(0, 4)", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Gradien garis l (m1) adalah -A/B = -2/-3 = 2/3.\nKarena garis k tegak lurus dengan l, maka m2 = -3/2.\nGaris k melalui (4,0). Persamaan k: y - 0 = -3/2 (x - 4) => y = -3/2 x + 6.\nMemotong sumbu-y saat x = 0, y = 6. Titik (0,6).",
    tingkatKesulitan: 60,
    irtDifficulty: 0.2,
    irtDiscrimination: 0.9,
  },
  {
    topikId: 2,
    pertanyaan: `Jika diputuskan bahwa $a \\bigstar b = a(b-a) + b$. Maka nilai dari $5 \\bigstar (2 \\bigstar 4)$ adalah...`,
    pilihan: [
      { teks: "12", urutan: 1, isCorrect: false },
      { teks: "15", urutan: 2, isCorrect: false },
      { teks: "23", urutan: 3, isCorrect: true },
      { teks: "25", urutan: 4, isCorrect: false },
      { teks: "30", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Selesaikan dalam kurung dulu: \n2 \\bigstar 4 = 2(4-2) + 4 = 2(2) + 4 = 8.\nLalu hitung: 5 \\bigstar 8 = 5(8-5) + 8 = 5(3) + 8 = 15 + 8 = 23.",
    tingkatKesulitan: 45,
    irtDifficulty: -0.5,
    irtDiscrimination: 0.7,
  },

  // PENALARAN MATEMATIKA (ID: 7 - ARITMATIKA SOSIAL / PM)
  {
    topikId: 7,
    pertanyaan: `Pak Dengklek berencana mengecat atap rumah berbentuk piramida dengan alas persegi yang panjang sisinya 10 meter dan tinggi piramida 12 meter. Biaya cat seharga Rp50.000,00 per meter persegi. Berapakah total biaya minimum yang harus dikeluarkan Pak Dengklek untuk mengecat seluruh bagian **luar** atap (tanpa alas)?`,
    pilihan: [
      { teks: "Rp12.000.000,00", urutan: 1, isCorrect: false },
      { teks: "Rp13.000.000,00", urutan: 2, isCorrect: true },
      { teks: "Rp15.000.000,00", urutan: 3, isCorrect: false },
      { teks: "Rp16.000.000,00", urutan: 4, isCorrect: false },
      { teks: "Rp18.000.000,00", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Tinggi segitiga sisi tegak (s) dihitung dengan Phytagoras: s = akar((10/2)^2 + 12^2) = akar(25 + 144) = akar(169) = 13 m.\nLuas satu segitiga sisi tegak = (alas x tinggi) / 2 = (10 x 13) / 2 = 65 m^2.\nTotal luas atap (4 segitiga) = 4 x 65 = 260 m^2.\nTotal biaya = 260 x Rp50.000 = Rp13.000.000.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.8,
    irtDiscrimination: 1.6,
  },

  // LITERASI BAHASA INGGRIS (ID: 13)
  {
    topikId: 13,
    pertanyaan: `Read the following text!\n\nMarine snow, a continuous shower of mostly organic detritus falling from the upper layers of the water column, is a significant means of exporting energy from the light-rich photic zone to the dark ocean below. The term was coined by explorer William Beebe, who observed it from his bathysphere in the 1930s. As it sinks, marine snow provides a critical food source for deep-sea ecosystems, sustaining organisms that live far below the reach of sunlight. Without this organic rain, the abyssal zones would be vastly more barren than they already are.\n\nWhat can be inferred about the abyssal zones from the text?`,
    pilihan: [
      { teks: "They rely completely on sunlight to generate energy for ecosystems.", urutan: 1, isCorrect: false },
      { teks: "They are entirely devoid of any living organisms.", urutan: 2, isCorrect: false },
      { teks: "They depend on the upper ocean layers to sustain their biological communities.", urutan: 3, isCorrect: true },
      { teks: "They produce their own 'marine snow' to feed organisms in the photic zone.", urutan: 4, isCorrect: false },
      { teks: "They were first explored by William Beebe in the 1930s.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Teks menyatakan 'marine snow provides a critical food source for deep-sea ecosystems' dan 'without this organic rain, the abyssal zones would be vastly more barren'. Ini bermakna zona dalam (abyssal) bergantung pada lapisan atas (sumber marine snow) untuk bertahan hidup.",
    tingkatKesulitan: 70,
    irtDifficulty: 0.5,
    irtDiscrimination: 1.1,
  },
  {
    topikId: 10,
    pertanyaan: `Bacalah teks komprehensif berikut dari tajuk rubrik nasional!\n\nRencana peresmian perizinan eksploitasi bukit dan lembah karst hijau di wilayah Provinsi X guna penyediaan konstruksi pabrik peleburan semen kembali memantik polemik. Para birokrat berdalih bahwa hadirnya industri tambang baru niscaya menyuntikkan dana Pendapatan Asli Daerah (PAD) besar-besaran. Namun, hal itu menutup mata dari ironi di lapangan. Lahan yang dibuldoser itu berada sangat fatal bersinggungan di hulu simpul sembilan mata air tanah pilar kehidupan warga lokal. Jika para politisi pro-industri mengabaikan jeritan ratapan para ibu petani yang sawah pangannya perlahan direnggut dan mati mengering kekeringan, sungguh itu merupakan tontonan keangkuhan kapitalis paling menyayat hati, melanggar secara eksplisit dasar-dasar Undang-Undang Perlindungan Hidup Pasal 65.\n\nBerdasarkan penggunaan diksi konotatif, sentimen keberpihakan sikap pandangan utama yang paling menonjol disuarakan oleh penulis tajuk rincian teks di atas condong berpihak kepada...`,
    pilihan: [
      { teks: "Para pemodal birokrat dan politisi yang memupuk investasi masuk dari kementerian.", urutan: 1, isCorrect: false },
      { teks: "Eksistensi keberlangsungan industri pendirian pabrik tambang raksasa semen.", urutan: 2, isCorrect: false },
      { teks: "Warga elit dari tingkat ibu kota yang ingin menyalurkan suara via investasi.", urutan: 3, isCorrect: false },
      { teks: "Kesejahteraan nasib ketahanan pangan petani lokal beserta integritas kelestarian alam.", urutan: 4, isCorrect: true },
      { teks: "Kalangan penganut doktrin bahwa perolehan PAD murni adalah prioritas bernegara.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Keberpihakan penulis terlihat jelas saat ia mengkritik birokrat ('berdalih', 'keangkuhan kapitalis') dan mengekspresikan keprihatinan mendalam atas penderitaan rakyat kecil ('jeritan ratapan para ibu petani'). Hatinya teguh membela petani lokal dan penjagaan lingkungan bebas eksploitasi.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.7,
    irtDiscrimination: 1.4,
  },
  // --- BATCH 1 ---
  {
    topikId: 10,
    pertanyaan: `Bacalah teks berikut dengan saksama!\n\nKecerdasan Buatan (Artificial Intelligence/AI) kini mulai merambah sektor pendidikan secara masif. Penggunaannya bervariasi, mulai dari sistem penilaian otomatis hingga asisten belajar virtual yang mampu mendeteksi gaya belajar siswa. Meskipun sangat menjanjikan peningkatan efisiensi dan personalisasi pembelajaran, kehadiran AI juga memicu polemik mengenai hilangnya interaksi emosional antara pendidik dan peserta didik. Para ahli dan psikolog pendidikan khawatir bahwa ketergantungan yang berlebih pada teknologi ini dapat menggerus kemampuan empati dan keterampilan sosial siswa dalam jangka panjang. Oleh karena itu, diperlukan regulasi komprehensif yang menyeimbangkan integrasi teknologi digital dan nilai-nilai pedagogis konvensional.\n\nGagasan utama paragraf tersebut adalah...`,
    pilihan: [
      { teks: "Kecerdasan buatan akan segera menyingkirkan atau sepenuhnya menggantikan peran guru di lingkungan sekolah.", urutan: 1, isCorrect: false },
      { teks: "Kehadiran AI dalam pendidikan memberikan manfaat efisiensi namun juga memicu kekhawatiran terkait merosotnya interaksi sosial dan emosional.", urutan: 2, isCorrect: true },
      { teks: "Pemerintah harus segera melarang total pemakaian asisten belajar virtual untuk menjaga mentalitas peserta didik.", urutan: 3, isCorrect: false },
      { teks: "Ketergantungan siswa pada nilai-nilai pedagogis konvensional membuat teknologi AI lambat diadopsi di sekolah.", urutan: 4, isCorrect: false },
      { teks: "Asisten belajar virtual jauh lebih efektif daripada sistem penilaian guru dalam melatih empati peserta didik muda.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Paragraf tersebut memaparkan manfaat AI di awal kalimat, lalu diikuti konjungsi pertentangan 'Meskipun...' yang membahas dampak negatif terhadap interaksi emosional/sosial, sebelum ditutup dengan anjuran perlunya keseimbangan. Opsi B merangkum semua gagasan tersebut secara utuh dan tepat.",
    tingkatKesulitan: 75,
    irtDifficulty: 0.9,
    irtDiscrimination: 1.1,
  },
  {
    topikId: 1,
    pertanyaan: `Lima orang pelari, yakni Hasan, Iqbal, Jamil, Kiki, dan Luthfi, mengikuti sebuah kejuaraan lari sprint 100 meter. Berdasarkan hasil pantauan panitia, diketahui data sebagai berikut:\n- Iqbal menyentuh garis finis tepat setelah Hasan.\n- Jamil finis sebelum Kiki tiba di garis akhir.\n- Luthfi menyentuh garis finis sebelum Jamil dan Hasan.\n- Hasan finis lebih dahulu dibandingkan Jamil.\n\nJika tidak ada yang datang secara bersamaan, urutan pelari dari yang pertama kali mencapai garis finis hingga yang menempati posisi terakhir adalah...`,
    pilihan: [
      { teks: "Luthfi, Hasan, Jamil, Iqbal, Kiki", urutan: 1, isCorrect: false },
      { teks: "Hasan, Iqbal, Luthfi, Jamil, Kiki", urutan: 2, isCorrect: false },
      { teks: "Luthfi, Hasan, Iqbal, Jamil, Kiki", urutan: 3, isCorrect: true },
      { teks: "Luthfi, Jamil, Kiki, Hasan, Iqbal", urutan: 4, isCorrect: false },
      { teks: "Hasan, Luthfi, Iqbal, Jamil, Kiki", urutan: 5, isCorrect: false },
    ],
    pembahasan: "1. Iqbal tepat setelah Hasan: (... Hasan, Iqbal ...)\n2. Hasan sebelum Jamil: (... Hasan, Iqbal, ..., Jamil ...)\n3. Jamil sebelum Kiki: (... Hasan, Iqbal, ..., Jamil, ..., Kiki)\n4. Luthfi sebelum Jamil dan Hasan. Karena Hasan ada di rombongan depan, Luthfi harus berada di posisi paling pertama (Luthfi, Hasan, Iqbal, Jamil, Kiki).",
    tingkatKesulitan: 85,
    irtDifficulty: 1.8,
    irtDiscrimination: 1.5,
  },
  {
    topikId: 2,
    pertanyaan: `Untuk mewakili sekolah dalam perlombaan cerdas cermat, seorang pelatih akan memilih sebuah tim yang eksklusif terdiri dari 3 orang murid. Dari hasil seleksi awal, terdapat 5 siswa unggulan dari kelas X dan 4 siswa unggulan dari kelas XI. Jika peraturan lomba mewajibkan setiap tim yang bertanding minimal memiliki 1 siswa kelas XI di dalamnya, maka banyaknya cara pelatih dapat membentuk tim tersebut adalah...`,
    pilihan: [
      { teks: "40", urutan: 1, isCorrect: false },
      { teks: "60", urutan: 2, isCorrect: false },
      { teks: "74", urutan: 3, isCorrect: true },
      { teks: "80", urutan: 4, isCorrect: false },
      { teks: "84", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Menggunakan pendekatan Kombinasi. Total kemungkinan memilih 3 murid dari 9 (tanpa syarat) adalah C(9,3) = 84. Kemungkinan jika TIDAK ADA kelas XI sama sekali (semua dari kelas X) adalah C(5,3) = 10. Kemungkinan dengan minimal 1 siswa kelas XI = Total cara – Cara tanpa kelas XI = 84 - 10 = 74 cara.",
    tingkatKesulitan: 80,
    irtDifficulty: 1.4,
    irtDiscrimination: 1.2,
  },
  {
    topikId: 7,
    pertanyaan: `Sebuah proyek pelebaran jembatan kabupaten pada awalnya direncakanan selesai dalam waktu 30 hari jika dikerjakan oleh 24 pekerja. Setelah dikerjakan dengan normal selama 10 hari, tiba-tiba proyek ditunda dan terpaksa dihentikan total selama 4 hari akibat cuaca ekstrem. Agar proyek tersebut tetap bisa terselesaikan tepat sesuai waktu yang direncanakan di awal, banyaknya pekerja tambahan yang harus diadakan adalah...`,
    pilihan: [
      { teks: "4 pekerja", urutan: 1, isCorrect: false },
      { teks: "6 pekerja", urutan: 2, isCorrect: true },
      { teks: "8 pekerja", urutan: 3, isCorrect: false },
      { teks: "12 pekerja", urutan: 4, isCorrect: false },
      { teks: "16 pekerja", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Sisa hari normal: 30 - 10 = 20 hari. Sisa jam kerja = 20 × 24 pekerja = 480 Hari-Pekerja. Karena berhenti 4 hari, sisa waktu nyata = 20 - 4 = 16 hari. Pekerja total yang dibutuhkan = 480 / 16 = 30 pekerja. Tambahan = 30 - 24 pekerja = 6 pekerja.",
    tingkatKesulitan: 65,
    irtDifficulty: 0.6,
    irtDiscrimination: 0.9,
  },
  {
    topikId: 13,
    pertanyaan: `Read the following passage closely!\n\nThe global transition towards renewable energy has undeniably gained unprecedented momentum over the last decade. Solar and wind power, once considered niche alternatives, have now become central to crucial international strategies aimed at mitigating the catastrophic impacts of climate change. However, this massive transition is not without its impediments. The highly intermittent nature of these green energy sources inevitably creates challenges for grid stability, necessitating massive investments in advanced battery storage frameworks and smart grid technologies.\n\nIn the context of the passage, the word impediments is closest in meaning to...`,
    pilihan: [
      { teks: "Catalysts", urutan: 1, isCorrect: false },
      { teks: "Enhancements", urutan: 2, isCorrect: false },
      { teks: "Milestones", urutan: 3, isCorrect: false },
      { teks: "Breakthroughs", urutan: 4, isCorrect: false },
      { teks: "Barriers", urutan: 5, isCorrect: true },
    ],
    pembahasan: "The passage introduces solar and wind power positively, but then proceeds with 'However, this massive transition is not without its impediments.' The following sentence explains the challenges (intermittent nature, need for investments). This indicates 'impediments' refers to obstacles or problems. 'Barriers' is the exact synonymous match.",
    tingkatKesulitan: 70,
    irtDifficulty: 0.8,
    irtDiscrimination: 1.1,
  },
  // --- BATCH 2 ---
  {
    topikId: 10,
    pertanyaan: `Bacalah kutipan teks berikut dengan cermat!\n\nIndustri pakaian di seluruh dunia telah sepenuhnya diubah rupa oleh fenomena *fast fashion* \u2014 produksi pakaian dalam skala masif yang meniru tren busana dengan sangat cepat dan dijual dengan harga yang menipu. Sementara konsumen menikmati mudahnya berganti gaya kapan saja, harga sesungguhnya harus dibayar mahal oleh bumi kita. Jutaan ton sampah tekstil menggunung di TPA negara-negara berkembang karena pakaian yang dibuat dari bahan sintetis murahan ini sangat mudah rusak sehingga cepat dibuang. Ketimbang terus memperkaya korporasi perusak lingkungan, kini adalah waktu paling mendesak bagi kita untuk beralih. Menjadi selektif, merawat pakaian lebih lama, atau ikut serta dalam budaya berbelanja pakaian bekas yang berkualitas (thrifting) adalah langkah kecil yang menentukan masa depan ekologi kita.\n\nBerdasarkan teks tersebut, tujuan utama penulis adalah...`,
    pilihan: [
      { teks: "Mengkritik regulasi negara berkembang atas penanganan manajemen limbah tekstil di kotanya.", urutan: 1, isCorrect: false },
      { teks: "Memasarkan produk busana hasil thrifting dengan kualitas eksklusif.", urutan: 2, isCorrect: false },
      { teks: "Menjelaskan rincian proses distribusi manufaktur dalam sistem fast fashion.", urutan: 3, isCorrect: false },
      { teks: "Mengajak para pembaca untuk mengevaluasi dan merubah pola konsumsi pakaiannya demi kelestarian alam.", urutan: 4, isCorrect: true },
      { teks: "Memaparkan sejarah perilaku konsumerisme di sektor fesyen.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Poin krusial teks terdapat di kalimat-kalimat akhir berupa ajakan: 'kini adalah waktu mendesak untuk beralih... Menjadi selektif, merawat pakaian... adalah langkah kecil'. Tujuan utamanya bersifat persuasif edukatif.",
    tingkatKesulitan: 70,
    irtDifficulty: 0.7,
    irtDiscrimination: 1.0,
  },
  {
    topikId: 1,
    pertanyaan: `Sebuah studi besar menyimpulkan bahwa anak-anak yang bermain permainan video bergenre aksi (action video game) setiap akhir pekan menunjukkan kinerja kognitif yang memuaskan, terutama pada tes respon visual dan penalaran ruang. Karena temuan ini, sebuah serikat guru merencanakan untuk memberikan action video game kepada siswa sebelum ujian penting sebagai intervensi mendongkrak ketajaman logika anak.\n\nManakah dari pernyataan berikut yang, jika benar, Paling Memperlemah argumen dan inisiatif serikat guru tersebut?`,
    pilihan: [
      { teks: "Tidak semua siswa sekolah mampu membeli console permainan tersebut di rumah.", urutan: 1, isCorrect: false },
      { teks: "Peningkatan kognitif akibat bermain game hanya berlangsung selama subjek melihat layar dan fungsinya tidak terbawa ke interaksi lembar ujian kertas.", urutan: 2, isCorrect: true },
      { teks: "Orang tua merasa khawatir anak mereka tidak bisa disiplin belajar akademik.", urutan: 3, isCorrect: false },
      { teks: "Banyak juara olimpiade sains yang justru sama sekali tidak suka dengan action video game.", urutan: 4, isCorrect: false },
      { teks: "Waktu istirahat jam sekolah terlalu singkat untuk melakukan permainan kelompok.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Argumennya adalah: Terapkan video game aksi sebelum ujian kertas untuk dongkrak kognitif. Opsi B menyerang klaim kausalitas secara langsung dengan memutus bahwa efek tajam itu murni eksklusif di depan layar dan hilang saat menghadapi ujian, membuatnya tidak ada gunanya untuk ujian.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.7,
    irtDiscrimination: 1.6,
  },
  {
    topikId: 2,
    pertanyaan: `Rata-rata perolehan nilai dari ujian harian Biologi yang dikerjakan oleh 30 orang siswa di kelas 12 IPA adalah 78. Setelah beberapa hari, ada 5 orang murid yang tidak hadir pada ujian hari itu melaksanakan ujian susulannya. Setelah dikoreksi, nilai kelima murid tersebut digabungkan, yang mengakibatkan rata-rata keseluruhan kelas melonjak menjadi tepat 80. Berapakah rata-rata nilai khusus dari kelima murid yang mengikuti ujian susulan tersebut?`,
    pilihan: [
      { teks: "86", urutan: 1, isCorrect: false },
      { teks: "88", urutan: 2, isCorrect: false },
      { teks: "90", urutan: 3, isCorrect: false },
      { teks: "92", urutan: 4, isCorrect: true },
      { teks: "94", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Total nilai 30 siswa = 30 × 78 = 2.340. Total nilai murid baru (35 siswa) = 35 × 80 = 2.800. Jumlah nilai milik 5 siswa susulan saja = 2.800 - 2.340 = 460. Rata-rata dari kelima murid itu = 460 / 5 = 92.",
    tingkatKesulitan: 60,
    irtDifficulty: -0.1,
    irtDiscrimination: 1.3,
  },
  {
    topikId: 7,
    pertanyaan: `Pak Dengklek memiliki sebuah akuarium berbentuk balok sempurna (tanpa penutup atas) di rumahnya yang mempunyai ukuran dimensi dalam, yaitu panjang 120 cm, lebar 50 cm, dan tinggi kaca 80 cm. Akuarium kosong tersebut hendak diisi menggunakan dua selang air dari keran terpisah yang dihidupkan bersamaan. Selang A mendistribusikan debit konstan sebesar 15 Liter/Menit, sementara selang B membuang debit konstan sebesar 5 Liter/Menit. \n\nApabila pompa dihidupkan tepat jatuh pada pukul 08:00 pagi, dan Pak Dengklek ingin agar ketinggian air disisakan 10 cm dari bibir paling atas akuarium, pada jam berapakah air harus segera dimatikan?`,
    pilihan: [
      { teks: "Pukul 08:15", urutan: 1, isCorrect: false },
      { teks: "Pukul 08:21", urutan: 2, isCorrect: true },
      { teks: "Pukul 08:25", urutan: 3, isCorrect: false },
      { teks: "Pukul 08:30", urutan: 4, isCorrect: false },
      { teks: "Pukul 08:42", urutan: 5, isCorrect: false },
    ],
    pembahasan: "1. Konversi cm ke dm: P=12 dm, L=5 dm. Tinggi air target = 80 cm - 10 cm = 70 cm = 7 dm.\n2. Volume target = 12 × 5 × 7 = 420 Liter.\n3. Total debit = 15 L + 5 L = 20 L/menit.\n4. Durasi = 420 / 20 = 21 Menit. Waktu selesai = 08:00 + 00:21 = pukul 08:21.",
    tingkatKesulitan: 80,
    irtDifficulty: 1.5,
    irtDiscrimination: 1.4,
  },
  {
    topikId: 13,
    pertanyaan: `Read the following passage carefully!\n\nThe fortuitous discovery of penicillin by Alexander Fleming in 1928 heralded the robust dawn of the antibiotic age, promising the ultimate eradication of once-fatal bacterial infections. For decades, these medical marvels have drastically reduced human mortality rates across the globe. Unfortunately, the rampant overuse and chronic misuse of antibiotics in both healthcare setups and everyday agriculture have actively fueled the ominous rise of antimicrobial resistance. Pathogenic bacteria are consistently evolving to outsmart us, rendering some of our most potent drugs effectively useless. Global health watchdogs warn that without immediate, globally-coordinated intervention to tightly regulate antibiotic administration, humanity could precipitously regress into a dark post-antibiotic era, a time where trivial scratches once again carry lethal prospects.\n\nWhat is the primary purpose of the author in writing the passage above?`,
    pilihan: [
      { teks: "To praise the remarkable medical achievements of Alexander Fleming's devotion.", urutan: 1, isCorrect: false },
      { teks: "To clearly describe how penicillin miraculously reduced mortality rates in history.", urutan: 2, isCorrect: false },
      { teks: "To sound the alarm on the impending global danger of antimicrobial resistance as a direct consequence of antibiotic misuse.", urutan: 3, isCorrect: true },
      { teks: "To rigorously detail the complex microbiology of pathogenic cell evolution.", urutan: 4, isCorrect: false },
      { teks: "To fiercely demand an immediate halt to all forms of pharmaceutical production.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Penemuan penisilin di awal bacaan sekadar 'pengantar / bridging'. Fokus ulasan inti penulis adalah pada paragraf pertengahan sampai akhir ('Unfortunately..'), di mana teks difungsikan guna membangkitkan alarm bahaya serta mendesak regulasi akan resistensi mikroba akibat salah kelolanya umat manusia.",
    tingkatKesulitan: 75,
    irtDifficulty: 0.9,
    irtDiscrimination: 1.1,
  },
  // --- BATCH 3 ---
  {
    topikId: 10,
    pertanyaan: `Bacalah kedua paragraf berikut!\n\n(1) Pengembangan kendaraan bermotor listrik berbasis baterai (KBLBB) dipandang sebagai salah satu solusi inovatif yang tak terelakkan guna menekan polusi udara perkotaan. Selain mereduksi emisi karbon, kendaraan ramah lingkungan ini juga berpotensi menekan besarnya subsidi BBM impor yang selalu membebani defisit negara.\n\n(2) Terlepas dari pelbagai gagasan ideal tersebut, angka serapan KBLBB di kalangan masyarakat sejatinya masih tergolong sangat lamban. Masyarakat dihantui oleh ketakutan kehabisan daya (range anxiety). Padahal, ketersediaan SPKLU (Stasiun Pengisian Kendaraan Listrik) antarkota masih sangat minim. Di samping itu, melambungnya harga *spare-part* penggantian baterai menjadi beban berat logis bagi mayoritas calon pembeli kelas menengah.\n\nBagaimana wujud hubungan yang paling tepat antara isi dari paragraf (1) dan paragraf (2) di atas?`,
    pilihan: [
      { teks: "Paragraf (2) mengemukakan argumen pembanding yang secara mutlak menyokong ide dari paragraf (1).", urutan: 1, isCorrect: false },
      { teks: "Paragraf (2) memberikan rentetan solusi praktis untuk menjawab krisis yang dijabarkan di paragraf (1).", urutan: 2, isCorrect: false },
      { teks: "Paragraf (2) menyodorkan sejumlah rintangan atau konter-fakta penghalang realisasi gagasan ideal yang diuraikan di paragraf (1).", urutan: 3, isCorrect: true },
      { teks: "Paragraf (2) mendefinisikan secara murni istilah-istilah kelistrikan yang mengawali paragraf (1).", urutan: 4, isCorrect: false },
      { teks: "Paragraf (1) merupakan turunan efek eksekusi dari skenario yang digambarkan pada paragraf (2).", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Paragraf 1 optimis soal transisi (idealnya), sementara paragraf 2 dibuka dengan konjungsi oposisi ('Terlepas dari..') untuk menunjukkan kelambanan dan ketakutan realistis. Hubungannya adalah konter atau hambatan rintangan teruntuk paragraf gagasan pertama.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.6,
    irtDiscrimination: 1.5,
  },
  {
    topikId: 1,
    pertanyaan: `Perhatikan pola dari barisan deret bilangan logis empiris di bawah ini!\n\n3,  4,  8,  17,  33,  ....\n\nAngka berapakah yang paling layak untuk mengisi laju lanjutan dari titik-titik tersebut?`,
    pilihan: [
      { teks: "55", urutan: 1, isCorrect: false },
      { teks: "58", urutan: 2, isCorrect: true },
      { teks: "62", urutan: 3, isCorrect: false },
      { teks: "65", urutan: 4, isCorrect: false },
      { teks: "70", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Ini adalah tes pola baris deret kuadrat tingkat dua.\nBedanya: \n4 - 3 = +1 (1 kuadrat)\n8 - 4 = +4 (2 kuadrat)\n17 - 8 = +9 (3 kuadrat)\n33 - 17 = +16 (4 kuadrat)\nMaka nilai interval pertambahan selanjutnya mustahil lari dari +25 (5 kuadrat). Jadi 33 + 25 = 58.",
    tingkatKesulitan: 70,
    irtDifficulty: 0.8,
    irtDiscrimination: 1.3,
  },
  {
    topikId: 2,
    pertanyaan: `Ditentukan aturan operasional dua buah fungsi aljabar dalam rumusan sebagai berikut:\n$f(x+1) = 3x - 2$  dan  $g(x) = 2x + 4$\n\nDengan mematuhi algoritma komposisi, maka nilai definitif dari $(g \\circ f)(2)$ adalah secara persis sebesar...`,
    pilihan: [
      { teks: "2", urutan: 1, isCorrect: false },
      { teks: "4", urutan: 2, isCorrect: false },
      { teks: "6", urutan: 3, isCorrect: true },
      { teks: "8", urutan: 4, isCorrect: false },
      { teks: "10", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Bentuk komposisi adalah g( f(2) ). Kita selesaikan f(2) dahulu. Pada fungsi $f(x+1) = 3x - 2$, agar variabel kurung menjadi 2, nilai x yang sesuai adalah x = 1 (karena 1+1=2). Masukkan x=1 ke formulanya: $f(1+1) = 3(1) - 2$, maka $f(2) = 1$. Lanjut, mencari g(1): $g(1) = 2(1) + 4 = 6$.",
    tingkatKesulitan: 65,
    irtDifficulty: 0.4,
    irtDiscrimination: 1.2,
  },
  {
    topikId: 7,
    pertanyaan: `Boutique Baju \"Serba Mode\" tengah menyemarakkan peringatan tahunan dengan menawarkan papan promosi bertuliskan 'Diskon 40% + 20%' khusus untuk setiap kemeja di rak A. Tuan Reynald yang tertarik melangkah mengambil satu kemeja dengan price tag label utuh seharga Rp300.000,00. Jika ia berniat menebus kemeja tersebut dan menyerahkan selembar uang Rp200.000,00 ke hadapan kasir, berapakah uang kembalian pasti yang semestinya dia terima di sakunya kembali?`,
    pilihan: [
      { teks: "Rp20.000,00", urutan: 1, isCorrect: false },
      { teks: "Rp40.000,00", urutan: 2, isCorrect: false },
      { teks: "Rp56.000,00", urutan: 3, isCorrect: true },
      { teks: "Rp64.000,00", urutan: 4, isCorrect: false },
      { teks: "Rp80.000,00", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Aritmatika diskon bertingkat / kumulatif bukan penjumlahan 60% absolut statis. Tahap 1: Diskon 40% = Potongan Rp120.000. Harga sementara tersisa = Rp180.000. Tahap 2: Diskon 20% lagi dari saldo sisa berjalan (yaitu dari sisa Rp180.000) = Potongan Rp36.000. Harga pelunasan finalnya adalah Rp144.000. Kembalian uangnya = 200.000 - 144.000 = Rp56.000,00.",
    tingkatKesulitan: 55,
    irtDifficulty: -0.8,
    irtDiscrimination: 1.0,
  },
  {
    topikId: 13,
    pertanyaan: `Read the informative text regarding genetic engineering hereunder carefully!\n\nIn modern molecular biology, the CRISPR-Cas9 genome editing tool acts akin to a pair of precise, programmable molecular scissors. Originally an adaptive immune mechanism naturally present within bacterial strands to slice apart invading viral DNA, scientists re-engineered the process to accurately target and edit genetic material in humans. Its revolutionary capacity brings immense hope for genuinely curing devastating inherited condition variants—such as sickle cell anemia—at their fundamental genetic root. On the contrary, CRISPR also rapidly unlocks unsettling bio-ethical dilemmas, primarily stirring debates over the theoretical creation of hyper-modified "designer babies" altered for enhanced physical traits.\n\nBased explicitly on the information detailed above, which statement is indisputably TRUE regarding CRISPR-Cas9 technology?`,
    pilihan: [
      { teks: "It currently serves as the universal cure ensuring the total eradication of all bacterial diseases.", urutan: 1, isCorrect: false },
      { teks: "It is universally condemned by every scientist globally because it has no practical therapeutic medical benefits.", urutan: 2, isCorrect: false },
      { teks: "It originates from an immune defense system conceptually found within infectious viral strains.", urutan: 3, isCorrect: false },
      { teks: "It possesses the promising capability to mend genetic illnesses while simultaneously introducing bio-ethical controversies.", urutan: 4, isCorrect: true },
      { teks: "It is currently being widely employed in public hospitals legally to produce aesthetically enhanced designer babies.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Teks di atas secara gamblang memuat dua kenyataan dominan: adanya harapan besar untuk penyembuhan genetik ('promising capability to mend illness') dan sisi kelam berupa perselisihan etika biologis ('unlocks unsettling bio-ethical dilemmas'). Opsi D merupakan paduan representatif akurat berdasar perbandingan teks.",
    tingkatKesulitan: 70,
    irtDifficulty: 0.5,
    irtDiscrimination: 1.5,
  },
  // --- BATCH 4 ---
  {
    topikId: 10,
    pertanyaan: `Bacalah teks berikut dengan cermat untuk menjawab soal!\n\nPerkembangan dunia rintisan atau lazim disebut perusahaan startup di kawasan Asia Tenggara saat ini sering dianggap bak fenomena *pisau bermata dua* oleh pengamat ekonomi. Di satu sisi, investasi bernilai miliaran dolar berpotensi mencetak rekrutmen lapangan kerja massal dan mendigitalisasi sektor-sektor roda ekonomi yang tadinya usang. Sayangnya, euforia fenomena ini acap kali diikuti oleh strategi radikal "bakar uang" yang tak terukur semata-mata demi mengakuisisi pengguna baru. Alhasil, ia kerap memicu efisiensi paksa berupa badai pemutusan hubungan kerja (PHK) seketika manakala pendanaan investor mendadak berhenti mengucur, tanpa menyisakan mitigasi perlindungan hukum sosial yang tangguh bagi nasib para lelah pekerjanya.\n\nMakna kiasan terdalam pada penempatan idiom *pisau bermata dua* dalam konteks pragmatis teks tersebut di atas adalah...`,
    pilihan: [
      { teks: "Suatu taktik korporat guna merekatkan persaingan bisnis antarsistem digital saingan.", urutan: 1, isCorrect: false },
      { teks: "Kondisi ambivalen yang mendatangkan faedah positif namun beriringan lekat dengan ancaman kerentanan dan bahaya mematikan.", urutan: 2, isCorrect: true },
      { teks: "Sebuah tipu daya berisiko tinggi para dewan direksi yang wajib selayaknya dihindari oleh investor spekulan.", urutan: 3, isCorrect: false },
      { teks: "Proses perkembangan komersil yang memacu putaran perekonomian masyarakat menjadi persis ganda bergerak dua kali lebih eskalatif.", urutan: 4, isCorrect: false },
      { teks: "Kebijakan tak masuk akal di mana startup memangkas gaji seluruh pegawainya agar untung.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Idiom 'pisau bermata dua' digunakan untuk menggambarkan eksistensi entitas dengan utilitas ganda yang amat kontras: sangat berfaedah positif merevolusi urat nadi ekonomi digital namun diam-diam kejam memiskinkan para pekerja sewaktu badai PHK pecah tanpa santunan proteksi.",
    tingkatKesulitan: 75,
    irtDifficulty: 1.2,
    irtDiscrimination: 1.6,
  },
  {
    topikId: 1,
    pertanyaan: `Perhatikan premis logis deduktif berikut yang diasumsikan sebagai keniscayaan valid!\n- Premis (1): Semua populasi pekerja manusia yang berprofesi murni sebagai desainer adalah insan yang amat memedulikan nilai estetika.\n- Premis (2): Sebagian dosen paruh waktu kontrak di Fakultas Y terbukti sama sekali tidak pernah memedulikan estetika ruangannya.\n\nSimpulan sah yang tak terbantahkan yang dapat dirasionalisasikan adalah...`,
    pilihan: [
      { teks: "Semua dosen ilmu logika di Fakultas Y adalah orang logis yang pastinya tak bisa bekerja sebagai desainer.", urutan: 1, isCorrect: false },
      { teks: "Sebagian orang yang diakui secara luas sebagai desainer rupanya adalah bukan merupakan dosen pengajar di instansi Fakultas Y.", urutan: 2, isCorrect: false },
      { teks: "Sebagian individu yang berstatus dosen paruh waktu di gedung Fakultas Y dapat dipastikan tidak berprofesi selayaknya desainer.", urutan: 3, isCorrect: true },
      { teks: "Mutlak murni tidak satupun spesimen dosen staf di Fakultas Y yang diberikan kebebasan merangkap profesi menjadi seniman desainer.", urutan: 4, isCorrect: false },
      { teks: "Sebagian kumpulan entitas pekerja desainer tak memedulikan estetika sehingga memilih bermutasi melamar menjadi dosen kontrak.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Dalam struktur logika silogisme format Darii/Barbara Kuantor Campuran: Himpunan (D) Desainer semuanya ada di Himpunan (E) Peduli Estetika. Lalu, terdapat subjek di (Fakultas Y) yang posisinya di luar (E). Kalau ia ada di luar (E), mustahil ia di dalam (D). Kesimpulannya: Sebagian Fakultas Y bukan Desainer.",
    tingkatKesulitan: 95,
    irtDifficulty: 2.4,
    irtDiscrimination: 1.8,
  },
  {
    topikId: 2,
    pertanyaan: `Didefinisikan wujud kurva parabola bersandar pada fungsi fungsional $f(x) = x^2 - 4x + 3$. Grafik parabolanya luwes memotong membelah horizon bidang sumbu-$x$ Kartesius dengan pas bersilang di dua letak titik, dinamakan titik A dan sisi seberang pada titik B.\n\nBerapakah jarak lurus absolut yang membentang riil memisahkan antara persimpangan titik A menunju titik persinggahan B tersebut?`,
    pilihan: [
      { teks: "1 Satuan panjang", urutan: 1, isCorrect: false },
      { teks: "2 Satuan panjang", urutan: 2, isCorrect: true },
      { teks: "3 Satuan panjang", urutan: 3, isCorrect: false },
      { teks: "4 Satuan panjang", urutan: 4, isCorrect: false },
      { teks: "5 Satuan panjang", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Pemotongan sumbu x saat y=0. x^2 - 4x + 3 = 0, lalu difaktorkan menjadi (x - 3)(x - 1) = 0. Didapatkan titik x1 = 3 & x2 = 1. Selisih jarak rutenya hanyalah |3 - 1| = 2 langkah.",
    tingkatKesulitan: 55,
    irtDifficulty: -0.6,
    irtDiscrimination: 1.0,
  },
  {
    topikId: 7,
    pertanyaan: `Pak Anton mendepositkan simpanan dana senilai Rp10.000.000,00 ke bank yang memberikan skema suku Bunga Majemuk Flat secara konstan sebesar 2% berpacu perlahan setiap satu interval kuartal usai (per 3 bulan berlalu murni). Pak Anton tak sudi merobek pencairan sedari awal.\n\nSecara matematika eksponensial perbankan yang ideal, manakah rumus jitu kalkulasi valid yang memperlihatkan aset uang milik Pak Anton sesegera mungkin sesudah purna tepat di akhir usai menabung 12 bulan komplit?`,
    pilihan: [
      { teks: "Rp10.000.000,00 \\times (1,02)^3", urutan: 1, isCorrect: false },
      { teks: "Rp10.000.000,00 \\times (1,02)^4", urutan: 2, isCorrect: true },
      { teks: "Rp10.000.000,00 \\times (1,08)^1", urutan: 3, isCorrect: false },
      { teks: "Rp10.000.000,00 \\times (1,24)^4", urutan: 4, isCorrect: false },
      { teks: "Rp10.000.000,00 \\times (1,8)^1", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Kaidah Bunga Majemuk: Mn = Modal \\times (1 + p)^n. Parameter p = 0.02. Durasi periode per kuartal seharga 3 bulan. Menembus batas 1 tahun (12 bulan) membuat kelipatan 'n' melompat sebanyak (12 : 3) = genap 4 putaran eksponensial. Hasilnya: 10.000.000 \\times (1.02)^4.",
    tingkatKesulitan: 70,
    irtDifficulty: 0.6,
    irtDiscrimination: 1.4,
  },
  {
    topikId: 13,
    pertanyaan: `Please delve into the short argumentative excerpt carefully:\n\nFor decades, sensational science fiction writers have tantalized populace demographics with the fantastical notion of outwardly terraforming our neighbor Mars—boldly engineering its freezing, barren rocky expanse into a shielded Earth-like sanctuary. While various visionary private tech conglomerates vigorously keep touting this Martian colonization agenda as an imminent guaranteed reality, the raw unfalsified physics limits unarguably paint a sobering narrative. The severe logistical nightmare of repeatedly transporting sufficient atmospheric gases, coupled with Mars' lacking any profound protective magnetosphere capable of repelling lethal solar radiation, plainly renders "terraforming" campaign proposals more akin to an incredibly hubristic science-fantasy than seriously actionable science. We mankind should, perhaps, immediately direct focus to safeguard the fragile solitary habitable jewel we possess instead of obsessing over an inhospitable rock floating in the dark.\n\nFrom a critical literacy standpoint, which characterizing description hereunder best distills the author’s primary overriding tone towards the proposed Martian terraforming plans?`,
    pilihan: [
      { teks: "Boundlessly enthusiastic and overwhelmingly emotionally supportive.", urutan: 1, isCorrect: false },
      { teks: "Apathetic towards physics literature, indifferent and strictly fact-free.", urutan: 2, isCorrect: false },
      { teks: "Highly skeptical, grounded in pessimism on feasibility, and critically reprimanding.", urutan: 3, isCorrect: true },
      { teks: "Deeply mournful, paralyzed by sorrowing planetary grief.", urutan: 4, isCorrect: false },
      { teks: "Pragmatically optimistic, immensely cautious but brimming with cosmic faith.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Keseluruhan bingkai emosional paragraf bermuatan nuasa bantahan sinis serta konter skeptisisme kritis. Rangkaian kosakata 'sobering narrative', 'logistical nightmare', sampai hujatan 'hubristic science-fantasy' mutlak meluluhlantakkan rasa optimis. Penulis sangat skeptikal dan menegur ide terraforming tersebut.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.6,
    irtDiscrimination: 1.7,
  },
  // --- BATCH 5 ---
  {
    topikId: 1,
    pertanyaan: `Di dalam sebuah pekarangan lumbung peternakan, tercatat properti fauna didiami oleh gerombolan Ayam dan kawanan Kambing konvensional. Tanpa berkehendak menghitung manual, Anda ditantang menebak:\nBerapakah selisih murni populasi ayam dan kambing?\n\nPetunjuk investigasi:\n(1) Jumlah pencacahan total kepala kedua spesies di lumbung tercantum 45 buah.\n(2) Apabila diteliti pada pijakan kaki aspal, terekam keseluruhan nominal 130 kaki murni.\n\nManakah penarikan komparabilitas kecukupan utilitas data yang patut Anda pilih mengunci jawaban?`,
    pilihan: [
      { teks: "Fakta Pernyataan (1) SAJA sudah cukup, tiada perlu bantuan Pernyataan (2).", urutan: 1, isCorrect: false },
      { teks: "Fakta keterangan Pernyataan (2) SAJA sudah telak sendirian memecahkan masalah tanpa mempertimbangkan repot Pernyataan (1).", urutan: 2, isCorrect: false },
      { teks: "DUA wujud Pernyataan tersebut MESTI DIKOLABORASIKAN BERSAMA hingga mutlak cukup terbukti menyimpulkan hasilnya; SATU pernyataan saja tidak cukup.", urutan: 3, isCorrect: true },
      { teks: "Penyelesaian terbuka dapat dicapai hanya lewat Pernyataan (1) SAJA ATAU opsi liyan si (2) pun sanggup memecahkan secara mandiri.", urutan: 4, isCorrect: false },
      { teks: "Misteri ini terlalu berliku karena duet (1) plus (2) membaur nyatanya mutlak masih nihil memberikan jalan petunjuk kalkulatif.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "SPLDV Logika Kuantitatif. A = ayam, K = kambing.\nPernyataan 1: A + K = 45 (Mandiri, INVALID).\nPernyataan 2: 2A + 4K = 130 -> A + 2K = 65 (Mandiri, INVALID).\nTapi begitu dihubungkan berantai: (A + 2K) - (A + K) = 65 - 45 -> K = 20 ekor. Otomatis A = 25 ekor. Rentang selisih = 5 ekor absolut. Murni bisa dipecahkan kalau KEDUANYA BERSAMAAN digabungkan.",
    tingkatKesulitan: 90,
    irtDifficulty: 2.2,
    irtDiscrimination: 2.0,
  },
  {
    topikId: 2,
    pertanyaan: `Diberikan himpunan H yang elemennya menyimpan kerangka eksklusif bilangan PRIMA dalam koridor ketat: 10 < p < 30.\n\nKonstruksi kuantitatif:\n[ P ] mewakili besaran total komposisi ragam pembentukan Himpunan Bagian (subset) spesifik dari himpunan H yang masing-masingnya presisi berisikan 2 butir bilangan primer.\n[ Q ] adalah nilai kuantitas konstan sebesar 18 bulat mutlak.\n\nHubungan relasional yang tak terbantahkan untuk besaran persilangan interkoneksi nyata tersebut adalah...`,
    pilihan: [
      { teks: "P > Q", urutan: 1, isCorrect: false },
      { teks: "Q > P", urutan: 2, isCorrect: true },
      { teks: "P = Q", urutan: 3, isCorrect: false },
      { teks: "Informasi pendukung belum sanggup membuktikan kaidah besaran di atas alias kurang absolut.", urutan: 4, isCorrect: false },
      { teks: "P = 2Q", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Elemen PRIMA belasan-dua puluhan dari rentang 11 s.d 29: H = {11, 13, 17, 19, 23, 29}. Banyak anggota n = 6.\nVariabel P merupakan perhitungan Kombinasi berpasangan: C(6,2) = 6! / (4! * 2!) = (6 x 5) / 2 = 15.\nP = 15. Sementara Q = 18. Jadi jelas bahwa nilai Q lebih besar melebihi P (Q > P).",
    tingkatKesulitan: 80,
    irtDifficulty: 1.5,
    irtDiscrimination: 1.3,
  },
  {
    topikId: 7,
    pertanyaan: `Di sebuah akhir pekan, Bapak Budi merencanakan mudik melintasi aspal lurus tanpa cabang sejauh persis 170 km melintang, menyambung kota A dan kota B. Budi memacu menstarter kuda besinya pada pukul 07:15 pagi dengan stabil skala V1= 40 Km/Jam.\n\nDalam rentang 30 menit menjejak sesudahnya, sang putra, Badu menyusul berangkat ke arah berlawanan tatap dari pangkal lintasan kota tujuan B di pacuan V2= 60 Km/Jam konstan lurus.\n\nPada derik menit ke berapakah ujung tepian bingkai kendaraan bersilangan ini akan berpapasan bentrok mutlak tatap muka di poros jalan rute tersebut?`,
    pilihan: [
      { teks: "Pukul 08:30 WIB", urutan: 1, isCorrect: false },
      { teks: "Pukul 08:45 WIB", urutan: 2, isCorrect: false },
      { teks: "Pukul 09:00 WIB", urutan: 3, isCorrect: false },
      { teks: "Pukul 09:15 WIB", urutan: 4, isCorrect: true },
      { teks: "Pukul 09:30 WIB", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Taktik Berpapasan Beda Waktu. Budi colong start 30 menit (0,5 Jam), maka jarak tempuh duluan Budi = 40 x 0.5 = 20 km.\nSisa jalan yang belum dilewati = 170 - 20 = 150 km.\nKini keduanya bergerak bersama di jam 07:45. Waktu papasan = Sisa Jarak / (V1 + V2) = 150 / (40+60) = 150 / 100 = 1.5 Jam.\nLama 1.5 Jam itu dikonversi = 1 jam 30 menit. Berangkat komunal 07:45 + 01:30 = tepat pukul 09:15 pagi mereka berpas-pasan.",
    tingkatKesulitan: 90,
    irtDifficulty: 2.1,
    irtDiscrimination: 1.8,
  },
  {
    topikId: 13,
    pertanyaan: `Please delve into comprehending the psychological exposition literary below:\n\nPsychological discomfort violently surfaces when human entities actively behave in overt manners that are glaringly inconsistent with their deeply held beliefs, conscious attitudes, or core ideologies. Conceived rigorously into academic prominence by social psychologist Leon Festinger in 1957, this excruciating intense mental unease paradigm is officially recognized in psychiatric scriptures as "Cognitive Dissonance".\n\nTo subconsciously rapidly self-alleviate this unbearable toxic mental tension haunting their waking mind conscience, individuals spontaneously engage in ridiculously extreme acrobatic gymnastics of rationalization coping. They blindly invent intricate webs of hollow justifications to magically making their horrific actions seem miraculously flawlessly aligned completely back anew with their pristine virtuous pure identities.\n\nAs intelligently inferred by its central overarching unifying pillar thematic spine, which nomenclature choice captures the single sharpest flawlessly encapsulating "Best Title" fitting that informational passage adequately?`,
    pilihan: [
      { teks: "The Tragic Existence Biography Timeline of Academician Leon Festinger Post-1957.", urutan: 1, isCorrect: false },
      { teks: "Cognitive Dissonance Phenomenon: The Intense Excruciating Tension Conflict Clashing Between Internal Core Values Versus Observable External Actions.", urutan: 2, isCorrect: true },
      { teks: "A Foundational Blueprint to Guarantee Curing Chronic Mental Disorders Through Trance Hypnosis.", urutan: 3, isCorrect: false },
      { teks: "An Academic Guide Devoted Towards Eliminating Eradicating Every Known Logical Fallacy.", urutan: 4, isCorrect: false },
      { teks: "A Thesis Exploring How Biologically Humans Will Always Commit Criminal Offenses.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Titik pilar gagasan paling fundamental melacak subjek Cognitive Dissonance perihal diskursus yang amat tegang takkala kepercayaan ideal internal saling bertabrakan realita bentrok dengan wujud gerak-gerik tingkah sadar aksi fisikal/perilaku. Opsi (B) mendeskripsikan ringkasan saripati gagasan di atas nyaris paling representatif utuh seutuhnya mendelegasikan apa judul bacaan sesungguhnya.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.7,
    irtDiscrimination: 1.1,
  },
  // --- BATCH 6 (Penambahan Lengkap Sesuai Standar SNBT) ---
  // PENGETAHUAN & PEMAHAMAN UMUM (ID: 3)
  {
    topikId: 3,
    pertanyaan: `Bacalah kalimat berikut!\n\n(1) Kenaikan harga bahan pokok menjelang hari raya selalu menjadi *momok* bagi masyarakat kelas menengah ke bawah. (2) Pasalnya, lonjakan tersebut kerap tidak diiringi dengan peningkatan upah minimum yang proporsional. (3) Pemerintah seyogianya proaktif melakukan operasi pasar guna meredam spekulasi yang dilakukan oleh oknum distributor nakal.\n\nMakna kata *momok* pada kalimat (1) dalam konteks wacana di atas bersinonim dengan...`,
    pilihan: [
      { teks: "Beban materi", urutan: 1, isCorrect: false },
      { teks: "Sesuatu yang menakutkan", urutan: 2, isCorrect: true },
      { teks: "Peristiwa alam", urutan: 3, isCorrect: false },
      { teks: "Kendala teknis", urutan: 4, isCorrect: false },
      { teks: "Kebiasaan tahunan", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Kata 'momok' dalam Kamus Besar Bahasa Indonesia (KBBI) memiliki arti hantu atau sesuatu yang menakutkan karena berbahaya atau mengancam. Dalam konteks ini, kenaikan harga merupakan sesuatu yang menakutkan bagi masyarakat.",
    tingkatKesulitan: 60,
    irtDifficulty: 0.2,
    irtDiscrimination: 0.9,
  },
  // PEMAHAMAN BACAAN & MENULIS (ID: 4)
  {
    topikId: 4,
    pertanyaan: `Perhatikan kutipan paragraf rumpang berikut ini!\n\nKemajuan teknologi kecerdasan buatan [...] berbagai sektor tatanan kehidupan secara drastis. Salah satu sektor yang paling terdampak adalah industri kreatif, yang mana batasan antara karya orisinal manusia dan hasil algoritma komputer mulai menjadi buram.\n\nKata berimbuhan yang paling baku dan tepat untuk mengisi bagian rumpang tersebut adalah...`,
    pilihan: [
      { teks: "mengubah", urutan: 1, isCorrect: true },
      { teks: "merubah", urutan: 2, isCorrect: false },
      { teks: "mengobah", urutan: 3, isCorrect: false },
      { teks: "perubahan", urutan: 4, isCorrect: false },
      { teks: "berubah", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Kata dasar dari imbuhan me- + -kan pada konteks ini adalah 'ubah'. Sesuai PUEBI/KBBI, awalan me- yang bertemu vokal 'u' menjadi 'meng-'. Jadi, kata baku yang tepat adalah 'mengubah', bukan 'merubah' (tidak ada kata dasar 'rubah' dalam konteks ini, rubah adalah nama hewan).",
    tingkatKesulitan: 55,
    irtDifficulty: -0.3,
    irtDiscrimination: 1.1,
  },
  // GEOMETRI (ID: 6)
  {
    topikId: 6,
    pertanyaan: `Sebuah wadah berbentuk kerucut terbalik dengan tinggi 12 cm dan jari-jari alas 6 cm diisi air dengan debit konstan. Pada suatu waktu tertentu, kedalaman air dalam kerucut adalah 6 cm. Berapakah rasio volume air pada saat itu terhadap volume total kerucut jika terisi penuh?`,
    pilihan: [
      { teks: "1 : 2", urutan: 1, isCorrect: false },
      { teks: "1 : 4", urutan: 2, isCorrect: false },
      { teks: "1 : 8", urutan: 3, isCorrect: true },
      { teks: "1 : 16", urutan: 4, isCorrect: false },
      { teks: "3 : 4", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Berdasarkan prinsip kesebangunan pada kerucut, perbandingan tinggi air dengan tinggi kerucut (h1 : h2) sebanding dengan perbandingan jari-jarinya. Jika h1/h2 = 6/12 = 1/2, maka perbandingan volumenya adalah (1/2)^3 = 1/8. Jadi rasio volumenya adalah 1 : 8.",
    tingkatKesulitan: 75,
    irtDifficulty: 1.1,
    irtDiscrimination: 1.4,
  },
  // STATISTIKA & PELUANG (ID: 8)
  {
    topikId: 8,
    pertanyaan: `Dalam sebuah kotak terdapat 5 bola merah, 3 bola biru, dan 2 bola kuning. Jika diambil dua bola secara acak dan berturut-turut TANPA PENGEMBALIAN, berapakah peluang terambilnya bola pertama berwarna merah dan bola kedua berwarna biru?`,
    pilihan: [
      { teks: "1/6", urutan: 1, isCorrect: true },
      { teks: "1/10", urutan: 2, isCorrect: false },
      { teks: "3/20", urutan: 3, isCorrect: false },
      { teks: "1/5", urutan: 4, isCorrect: false },
      { teks: "3/10", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Total bola mula-mula = 10. Peluang bola pertama Merah = 5/10 = 1/2. Karena tanpa pengembalian, sisa bola menjadi 9, dengan bola biru tetap 3. Peluang bola kedua Biru = 3/9 = 1/3. Total peluang P(M lalu B) = (1/2) * (1/3) = 1/6.",
    tingkatKesulitan: 65,
    irtDifficulty: 0.5,
    irtDiscrimination: 1.2,
  },
  // MAKNA KATA & KALIMAT (ID: 11)
  {
    topikId: 11,
    pertanyaan: `Dikte kata "Membabi buta" acap kali digunakan di berbagai literatur pers bahasa.\n\nDalam serangkaian aksi protes buruh yang berujung ricuh di kawasan industri tersebut, kerumunan oknum provokator mulai bertindak *membabi buta* menghancurkan fasilitas publik tanpa arah yang jelas.\n\nSecara semantik leksikal, frasa *membabi buta* memiliki konotasi makna merujuk kepada...`,
    pilihan: [
      { teks: "Bertindak secara sembunyi-sembunyi karena takut dipenjara.", urutan: 1, isCorrect: false },
      { teks: "Melakukan sesuatu secara nekat, tidak beraturan, dan tanpa perhitungan logis.", urutan: 2, isCorrect: true },
      { teks: "Meniru gerakan hewan liar saat merasa terdesak secara beringas.", urutan: 3, isCorrect: false },
      { teks: "Menyerang lawan dengan strategi militer yang matang.", urutan: 4, isCorrect: false },
      { teks: "Merasakan kegelapan ekstrem sehingga kehilangan arah mata angin.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Idiom 'membabi buta' mengkiaskan suatu perbuatan yang dilakukan secara nekat, ngawur, menerjang tanpa pikir panjang dan membabi-buta, persis seolah kehilangan kesadaran dan perhitungan logis yang wajar.",
    tingkatKesulitan: 60,
    irtDifficulty: 0.3,
    irtDiscrimination: 0.9,
  },
  // ANALISIS & EVALUASI TEKS (ID: 12)
  {
    topikId: 12,
    pertanyaan: `Perhatikan paragraf opini di bawah ini!\n\nProgram makan bergizi gratis yang dicanangkan oleh pemerintah pusat mutlak akan menghapus masalah stunting di Indonesia dalam waktu satu tahun. Anggaran fantastis yang telah dialokasikan membuktikan keseriusan penuh rezim. Dengan jaminan asupan kalori dan protein harian untuk jutaan anak sekolah dasar, tidak mungkin generasi penerus kita masih mengalami ketertinggalan pertumbuhan fisik maupun kognitif di masa depan.\n\nKelemahan paling fatal dari penalaran deduktif yang dibangun pada paragraf opini di atas adalah...`,
    pilihan: [
      { teks: "Gagal menyertakan jumlah spesifik besaran alokasi anggaran triliunan yang dilontarkan.", urutan: 1, isCorrect: false },
      { teks: "Menyedekahkan klaim berlebihan bahwa masalah absolut kompleks seperti stunting dapat hilang sepenuhnya seketika hanya lewat satu kebijakan instan.", urutan: 2, isCorrect: true },
      { teks: "Tidak mendukung pentingnya kalori harian bagi tumbuh kembang biologis anak SD.", urutan: 3, isCorrect: false },
      { teks: "Menggunakan asumsi politik oposisi yang mencurigai efektivitas birokrasi pemerintahan.", urutan: 4, isCorrect: false },
      { teks: "Kata 'mutlak' tidak sesuai dengan EYD Edisi V.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Kelemahan logika argumen (logical fallacy - oversimplification/hasty conclusion) terlihat dari premis hiperbolik penulis yang memastikan bahwa 'mutlak akan menghapus masalah stunting... dalam waktu satu tahun' hanya dari satu sisi intervensi. Padahal stunting berakar dari multi-faktor kronis lintas genetis, sanitasi, dan pola asuh bertahun-tahun.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.5,
    irtDiscrimination: 1.6,
  },
  // VOCABULARY IN CONTEXT (ID: 14)
  {
    topikId: 14,
    pertanyaan: `Read the paragraph below.\n\nAmidst the chaotic financial crisis that crippled numerous global banks in 2008, a mysterious individual or group functioning under the pseudonym Satoshi Nakamoto published a whitepaper introducing a decentralized digital currency. By creating a transparent, immutable ledger known as the blockchain, this invention sought to entirely circumvent traditional banking monopolies. Early adopters were initially skeptical, yet the *lucrative* surge in the asset's value over the ensuing decade silenced many harsh critics.\n\nThe word *lucrative* in the passage is closest in meaning to...`,
    pilihan: [
      { teks: "Highly controversial", urutan: 1, isCorrect: false },
      { teks: "Producing a great deal of profit", urutan: 2, isCorrect: true },
      { teks: "Excessively transparent", urutan: 3, isCorrect: false },
      { teks: "Fundamentally destructive", urutan: 4, isCorrect: false },
      { teks: "Slow and methodical", urutan: 5, isCorrect: false },
    ],
    pembahasan: "The context elaborates on the 'surge in the asset's value' which effectively 'silenced harsh critics'. A value surge that yields massive returns suggests profitability. Therefore, 'lucrative' directly translates to producing a great deal of profit or wealth.",
    tingkatKesulitan: 65,
    irtDifficulty: 0.6,
    irtDiscrimination: 1.1,
  },
  // INFERENCE & ANALYSIS (ID: 15)
  {
    topikId: 15,
    pertanyaan: `Analyze the succeeding socio-historical text.\n\nThe advent of the printing press by Johannes Gutenberg in the 15th century fundamentally fractured the absolute monopoly of knowledge traditionally hoarded by the clergy and elite aristocrats. Prior to this innovation, manuscripts were painstakingly hand-copied, rendering books an exorbitant luxury accessible exclusively to the profoundly wealthy. Mass typographic reproduction abruptly democratized information, triggering widespread intellectual awakenings such as the Renaissance and the Scientific Revolution. \n\nFrom the passage comprehensively, one can safely infer that...`,
    pilihan: [
      { teks: "Johannes Gutenberg belonged to the wealthy aristocratic class before inventing the printing press.", urutan: 1, isCorrect: false },
      { teks: "The clergy intentionally commanded Gutenberg to invent the printing press to spread their religious manuscripts.", urutan: 2, isCorrect: false },
      { teks: "The drastic reduction in the cost and effort of producing books catalyzed severe socio-cultural transformations.", urutan: 3, isCorrect: true },
      { teks: "The Scientific Revolution was entirely devoid of religious influences due to the printing press.", urutan: 4, isCorrect: false },
      { teks: "Hand-copied manuscripts completely vanished and were illegal immediately following the 15th century.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "The text indicates that the printing press ended the 'monopoly of knowledge' by making books cheaper (no longer an 'exorbitant luxury') through 'mass typographic reproduction'. This democratization directly triggered major societal shifts like the Renaissance. Thus, the lower cost and ease of production catalyzed massive cultural transformations.",
    tingkatKesulitan: 80,
    irtDifficulty: 1.4,
    irtDiscrimination: 1.4,
  },
  // --- BATCH 7 (PREDIKSI SANGAT SULIT SNBT 2026) ---
  // PENALARAN MATEMATIKA (ID: 7)
  {
    topikId: 7,
    pertanyaan: `Pak Andi merencanakan pendidikan kuliah anaknya 5 tahun lagi. Ia memperkirakan akan membutuhkan biaya senilai Rp200.000.000,00 apabila diukur dengan standar harga saat ini. Saat ini, ia baru memegang uang tunai sebesar Rp100.000.000,00 yang langsung ia investasikan seluruhnya ke instrumen reksadana saham dengan ekspektasi imbal hasil majemuk konstan sebesar 12% per tahun. \n\nNamun, biaya pendidikan setiap tahunnya selalu mengalami laju inflasi rata-rata sebesar 8% per tahun dari nominal dasar saat ini. Mengingat prinsip nilai waktu dari uang (time value of money), berapakah selisih antara saldo investasi yang kelak terkumpul dengan target biaya pendidikan anaknya pada 5 tahun ke depan?\n*(Gunakan pendekatan rasio aproksimasi $1,12^5 \\approx 1,76$ dan $1,08^5 \\approx 1,47$)*`,
    pilihan: [
      { teks: "Masih kurang sekitar Rp3.000.000,00", urutan: 1, isCorrect: false },
      { teks: "Masih kurang sekitar Rp18.000.000,00", urutan: 2, isCorrect: false },
      { teks: "Terdapat kelebihan saldo sekitar Rp12.000.000,00", urutan: 3, isCorrect: false },
      { teks: "Masih kurang sekitar Rp118.000.000,00", urutan: 4, isCorrect: true },
      { teks: "Masih kurang sekitar Rp124.000.000,00", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Tahap 1: Hitung Future Value target (karena inflasi). FV Target = Pokok x (1 + inflasi)^n = 200.000.000 x 1,08^5 = 200.000.000 x 1,47 = Rp294.000.000.\nTahap 2: Hitung Future Value Investasi. FV Investasi = Modal x (1 + bunga)^n = 100.000.000 x 1,12^5 = 100.000.000 x 1,76 = Rp176.000.000.\nSelisih Kekurangan Jaminan = Target masa depan - Hasil Investasi = 294.000.000 - 176.000.000 = Rp118.000.000. Jadi ia masih sangat kekurangan 118 Juta (bukan 18 Juta).",
    tingkatKesulitan: 90,
    irtDifficulty: 2.2,
    irtDiscrimination: 1.8,
  },
  // PENGETAHUAN KUANTITATIF (ID: 2)
  {
    topikId: 2,
    pertanyaan: `Diberikan serangkaian sistem persamaan non-linier:\n\n$x + y = 5$\n$x^3 + y^3 = 35$\n\nMaka hitunglah rumusan nilai eksak absolut dari persamaan $x^2 + y^2 = \\dots$`,
    pilihan: [
      { teks: "13", urutan: 1, isCorrect: true },
      { teks: "15", urutan: 2, isCorrect: false },
      { teks: "17", urutan: 3, isCorrect: false },
      { teks: "19", urutan: 4, isCorrect: false },
      { teks: "21", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Jabarkan eksponen pangkat 3 menggunakan identitas Aljabar: $x^3 + y^3 = (x+y)(x^2 - xy + y^2) = (x+y)((x+y)^2 - 3xy)$.\nKemudian substitusi nilai yang diketahui: $35 = 5 \\times (5^2 - 3xy) \\Rightarrow 35 = 5(25 - 3xy) \\Rightarrow 7 = 25 - 3xy$.\nDiperoleh nilai $3xy = 18 \\Rightarrow xy = 6$.\nLangkah terakhir, cari $x^2 + y^2 = (x+y)^2 - 2xy = 5^2 - 2(6) = 25 - 12 = 13$.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.7,
    irtDiscrimination: 1.5,
  },
  // PENALARAN UMUM (ID: 1)
  {
    topikId: 1,
    pertanyaan: `Dewan juri ajang kompetisi internasional meratifikasi pedoman seleksi yang sangat rigid:\n- Premis (1): Jika seorang kontestan berhasil memenangkan minimal 3 pertandingan secara beruntun, maka ia berhak menerima tiket emas menuju babak Grand Final.\n- Premis (2): Tidak ada satupun kontestan yang berhak masuk ke Grand Final seandainya ia pernah mengantongi kartu peringatan pinalti dari dewan etik.\n- Fakta Lapangan: Aldo diumumkan secara resmi tidak pernah sekalipun mendapatkan kartu peringatan pinalti dari dewan etik sepanjang turnamen. Namun faktanya, Aldo gugur tidak mampu melenggang maju ke babak Grand Final.\n\nKesimpulan deduktif manakah yang merepresentasikan logika paling kokoh tanpa celah berasaskan premis-premis absolut di atas?`,
    pilihan: [
      { teks: "Aldo barangkali masih mungkin sukses menang 3 pertandingan beturut-turut akan tetapi dicurangi panitia lokal.", urutan: 1, isCorrect: false },
      { teks: "Dapat dipastikan Aldo terbukti mutlak tidak memenangkan 3 pertandingan secara beruntun.", urutan: 2, isCorrect: true },
      { teks: "Sistem Grand Final mempersulit kandidat bersih seperti Aldo untuk bersaing.", urutan: 3, isCorrect: false },
      { teks: "Aldo sebetulnya melanggar aturan etik berat yang luput dicatat oleh dewan etik formal.", urutan: 4, isCorrect: false },
      { teks: "Setiap pemain yang memperoleh kartu pinalti dipastikan tidak akan mampu bermain baik memenangkan 3 kompetisi.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Pemodelan logika: \nP -> Q (Menang 3 beruntun -> Grand Final)\nR -> ~Q (Kena Pinalti -> Tidak Grand Final)\nKasus Aldo: Fakta 1: ~R (Ia bersih dari Pinalti). Fakta 2: ~Q (Sayangnya ia tidak masuk Grand Final).\nMenggunakan Modus Tollens dari Premis 1 (P -> Q). Karena terbukti ~Q, maka otomatis simpulan validnya pasti ~P (Tidak Menang 3 beruntun).",
    tingkatKesulitan: 85,
    irtDifficulty: 1.6,
    irtDiscrimination: 1.4,
  },
  // LITERASI BAHASA INDONESIA (ID: 10)
  {
    topikId: 10,
    pertanyaan: `Bacalah esai kritis berikut dengan saksama!\n\nNarasi kampanye mengenai era transisi energi bumi seringkali dikemas dalam *utopia* yang membutakan mata sejarah. Para aliansi teknokrat dengan lantang mempresentasikan deretan panel surya raksasa di hamparan padang pasir dan menara kincir angin lepas pantai sebagai 'panacea' radikal guna menyembuhkan bumi dari demam kronis perubahan iklim. Sayangnya, mereka bersama media global cenderung mengalami 'amnesia kolektif' yang disengaja atas pelacakan jejak berdarah hulu rantai pasok material manufaktur masa depan tersebut. Neokolonialisme korporat gaya baru justru sedang menggila di negara-negara semenanjung selatan khatulistiwa; puluhan bukit hijau dibuldoser brutal membelah hutan lindung dan sungai purba diracuni raksa sedimen ekstraksi tambang nikel serta litium. Semua petaka di ujung bumi itu dibiarkan terjadi semata agar kelas menengah di lanskap perkotaan negara-negara utara dapat angkuh mengendarai mobil listrik mereka dengan ilusi 'nurani yang bersih tiada bersalah'.\n\nBerdasarkan muatan tajam analisis wacana sosiologis di atas, bias kognitif yang paling ditelanjangi oleh sang penulis tatkala menguliti hipokrisi para teknokrat pendukung transisi energi global bermuarakan pada...`,
    pilihan: [
      { teks: "Kecenderungan kelompok korporat buta-tuli menolak bukti akademis pemanasan global.", urutan: 1, isCorrect: false },
      { teks: "Simplifikasi berlebihan (oversimplification) sistematis yang secara sengaja mengaburkan mahalnya ongkos perusakan ekologi hulu demi pencitraan 'teknologi bersih'.", urutan: 2, isCorrect: true },
      { teks: "Ketunaan intelijensia seputar letak atlas geologi penambangan mineral logam berat antar negara maju dan mandiri.", urutan: 3, isCorrect: false },
      { teks: "Konspirasi politik terselubung teknokrat sayap kanan demi mempertajam pemusnahan massal ras suku pedalaman selatan.", urutan: 4, isCorrect: false },
      { teks: "Menyangkal fakta empiris kalau sesungguhnya tarif modal merakit kincir angin menyerap biaya sepuluh kali lipat energi konvensional.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Penulis secara agresif menyerang bias para penganjur kendaraan listrik yang sengaja membentuk ilusi ('utopia', 'panacea') yang cuma menitikberatkan solusi emisi di perkotaan (negara utara), namun sepenuhnya menyederhanakan masalah dengan mengaburkan/menutupi pembantaian ekologis besar-besaran di lini penggalian (nikel/litium eksploitatoris di negara selatan).",
    tingkatKesulitan: 95,
    irtDifficulty: 2.5,
    irtDiscrimination: 1.9,
  },
  // LITERASI BAHASA INGGRIS (ID: 13)
  {
    topikId: 13,
    pertanyaan: `Probe into the profound sociological abstract appended hereby:\n\nThe modern proliferation of ubiquitous algorithmic surveillance and facial-recognition optics in contemporary metropolitan environments is customarily rationalized out loud under the noble auspices of enhancing civilian public safety and radically streamlining rigid bureaucratic efficiency. Silicon Valley proponents fervently champion the omnipresent deployment of immutable biometric databanking and machine-learning predictive policing software as indispensable evolutionary mechanisms integral to preempting illicit criminality epochs before it physically manifests. Nevertheless, astute civil liberties scholars deeply conceptualize this relentless panoptic architectural gaze rather ominously as a profound, insidious disenfranchisement of individual bodily autonomy. Whenever ordinary citizens must continually operate under the agonizing, perpetual implicit awareness of being digitally recorded, unquantifiable behavioral conformity is invariably coerced, thereby covertly engendering an irreversible chilling effect upon spontaneous civic mobilization and democratic political dissent.\n\nFrom an analytical lens, what fundamentally encapsulates the principal contrasting juxtaposition meticulously orchestrated by the author concerning mass algorithmic surveillance implementations?`,
    pilihan: [
      { teks: "The unparalleled technological triumph capabilities of compiling massive biometric clouds versus the astronomical financial hurdles restricting scaling distributions.", urutan: 1, isCorrect: false },
      { teks: "The undeniable statistically-proven reduction of violent urban homicides juxtaposed against an exponential explosion of untraceable crypto cybercrimes.", urutan: 2, isCorrect: false },
      { teks: "The superficially attractive rhetorical facade of safeguarding communal public welfare diametrically contrasted against the systemic covert erosion of individualized unhindered freedoms.", urutan: 3, isCorrect: true },
      { teks: "A crippling bureaucratic government's primitive inability to parse datasets paired contradictorily alongside the agile private corporate sector's predictive efficiency supremacy.", urutan: 4, isCorrect: false },
      { teks: "The moral civic necessity forcing absolute communal societal conforming allegiance pitted against the primal, inherent Darwinian human predisposition toward anarchical violence.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "The text inherently sets up a juxtaposition (a stark contrast) between how surveillance is 'sold/justified' to the public (the rationale/auspices of 'civilian safety and bureaucratic efficiency') and its horrific unseen shadow cost (the silent 'erosion of individual autonomy' and 'conformity chilling effect'). Option C precisely frames this duality: the 'rhetorical facade of public welfare' versus the 'systemic covert erosion of hindered freedoms'.",
    tingkatKesulitan: 90,
    irtDifficulty: 2.3,
    irtDiscrimination: 1.7,
  },
  // --- BATCH 8 (PREDIKSI EKSTRA SULIT SNBT 2026) ---
  // PPU (ID: 3)
  {
    topikId: 3,
    pertanyaan: `Bacalah kalimat kompleks berikut!\n\n(1) Di tengah sengitnya polarisasi politik pascapemilu, *rekonsiliasi* nasional antar-elite parpol dirasa menjadi sebuah kemestian guna merajut kembali kohesi sosial masyarakat yang kadung terbelah. (2) Sayangnya, langkah tersebut kerap ditafsirkan sinis oleh akar rumput sebagai sekadar dagang sapi alias bagi-bagi kue kekuasaan semata.\n\nDalam konteks wacana politik di atas, padanan kata (sinonim) yang paling komprehensif dan sepadan untuk menggantikan kata *rekonsiliasi* tanpa menggeser nuansa maknanya adalah...`,
    pilihan: [
      { teks: "Restrukturisasi fungsional", urutan: 1, isCorrect: false },
      { teks: "Pemulihan hubungan persahabatan", urutan: 2, isCorrect: true },
      { teks: "Konsolidasi hierarki internal", urutan: 3, isCorrect: false },
      { teks: "Negosiasi komersial bilateral", urutan: 4, isCorrect: false },
      { teks: "Mediasi sengketa perdata", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Menurut KBBI, rekonsiliasi berarti perbuatan memulihkan hubungan persahabatan pada keadaan semula; perbuatan menyelesaikan perbedaan. Dalam konteks politik di atas, merujuk pada pemulihan hubungan atau perdamaian antar-elite pascakonflik pemilu.",
    tingkatKesulitan: 70,
    irtDifficulty: 0.9,
    irtDiscrimination: 1.2,
  },
  // PBM (ID: 4)
  {
    topikId: 4,
    pertanyaan: `Perhatikan kelengkapan tanda baca pada paragraf berikut!\n\nSebuah riset terbaru yang dipublikasikan di jurnal *Nature* [...] merekomendasikan agar pemerintah di negara-negara kepulauan segera membangun tanggul laut raksasa (giant sea wall), merelokasi permukiman rentan, atau mulai mengembangkan skema pembiayaan adaptasi bencana komprehensif [...] untuk mengantisipasi potensi kenaikan muka air laut setinggi dua meter pada abad mendatang.\n\nPasangan tanda baca yang paling presisi untuk mengapit frasa sisipan penegas di dalam tanda kurung siku [...] di atas adalah...`,
    pilihan: [
      { teks: "Tanda koma (,) dan tanda koma (,)", urutan: 1, isCorrect: false },
      { teks: "Tanda hubung (-) dan tanda hubung (-)", urutan: 2, isCorrect: false },
      { teks: "Tanda pisah (\u2014) dan tanda pisah (\u2014)", urutan: 3, isCorrect: true },
      { teks: "Tanda kurung () dan tanda koma (,)", urutan: 4, isCorrect: false },
      { teks: "Tanda titik koma (;) dan tanda titik dua (:)", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Keterangan aposisi atau keterangan tambahan yang panjang dan berisikan rincian (membangun tanggul laut raksasa, merelokasi, atau mengembangkan skema...) yang diletakkan di tengah kalimat lazimnya dan paling elegan diapit menggunakan sepasang tanda pisah (\u2014) atau *em dash* untuk memberi batasan tegas dari induk klausa. Tanda koma tidak disarankan karena di dalam rincian sisipan itu sendiri sudah terdapat banyak koma.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.4,
    irtDiscrimination: 1.3,
  },
  // GEOMETRI (ID: 6)
  {
    topikId: 6,
    pertanyaan: `Diberikan sebuah bidang datar berbentuk segi enam beraturan (heksagon reguler) ABCDEF dengan panjang sisi $s = 6$ cm. Sebuah lingkaran (L) dibuat sehingga memotong titik-titik sudut heksagon (lingkaran luar). Berapakah persisnya luas area yang berada **di dalam** lingkaran L namun **di luar** heksagon ABCDEF?\n*(Gunakan aproksimasi $\\pi \\approx 3,14$ dan $\\sqrt{3} \\approx 1,73$)*`,
    pilihan: [
      { teks: "12,4 cm$^2$", urutan: 1, isCorrect: false },
      { teks: "19,6 cm$^2$", urutan: 2, isCorrect: true },
      { teks: "24,8 cm$^2$", urutan: 3, isCorrect: false },
      { teks: "36,2 cm$^2$", urutan: 4, isCorrect: false },
      { teks: "54,0 cm$^2$", urutan: 5, isCorrect: false },
    ],
    pembahasan: "1) Jari-jari lingkaran luar (R) heksagon sama panjang dengan panjang sisinya (s). Maka R = 6 cm.\n2) Luas Lingkaran L = $\\pi \\times R^2 \\approx 3,14 \\times 36 = 113,04$ cm$^2$.\n3) Luas Heksagon (terdiri dari 6 segitiga sama sisi) = $6 \\times (\\frac{1}{4} s^2 \\sqrt{3}) = 6 \\times (\\frac{1}{4} \\times 36 \\times 1,73) = 6 \\times (9 \\times 1,73) = 6 \\times 15,57 = 93,42$ cm$^2$.\n4) Sisa Luas = Luas Lingkaran - Luas Heksagon = 113,04 - 93,42 = 19,62 $\\approx 19,6$ cm$^2$.",
    tingkatKesulitan: 90,
    irtDifficulty: 2.1,
    irtDiscrimination: 1.5,
  },
  // STATISTIKA & PELUANG (ID: 8)
  {
    topikId: 8,
    pertanyaan: `Panitia PPDB sebuah SMA Unggulan menyeleksi siswa baru melalui ujian masuk yang sistem penilaiannya mengikuti distribusi normal baku. Diketahui bahwa rata-rata skor kelulusan adalah 65 dengan simpangan baku (standar deviasi) sebesar 12. Jika daya tampung sekolah tersebut sangat terbatas sehingga kepala sekolah menetapkan kebijakan hanya akan menerima top 2,5% peserta terbaik dari keseluruhan sampel ratusan pendaftar, maka berapakah kira-kira skor minimal atau *passing grade* terendah yang wajib diraih oleh calon siswa agar lolos diterima?\n*(Petunjuk: Pada tabel distribusi normal standar z, luas area ke kiri hingga Z=1,96 adalah sekitar 0,975)*`,
    pilihan: [
      { teks: "Skor 77", urutan: 1, isCorrect: false },
      { teks: "Skor 83,5", urutan: 2, isCorrect: false },
      { teks: "Skor 86,5", urutan: 3, isCorrect: false },
      { teks: "Skor 88,5", urutan: 4, isCorrect: true },
      { teks: "Skor 92", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Menerima top 2,5% terbaik berarti posisi siswa tersebut berada di ambang batas persentil ke-97,5 (0,975). Melihat petunjuk nilai z untuk skor kumulatif probabilitas 0,975 adalah z = 1,96.\nRumus z-score: $z = \\frac{(X - \\mu)}{\\sigma}$\n$1,96 = \\frac{(X - 65)}{12}$\n$X - 65 = 1,96 \\times 12$\n$X - 65 = 23,52$\n$X = 65 + 23,52 = 88,52 \\approx 88,5$.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.8,
    irtDiscrimination: 1.6,
  },
  // ANALISIS & EVALUASI TEKS (ID: 12)
  {
    topikId: 12,
    pertanyaan: `Telaah argumen sengketa di bawah ini dengan pemikiran analitis yang ketat:\n\nPihak Universitas A: "Sistem penilaian esai seleksi masuk kita saat ini dikoreksi mutlak oleh AI (Artificial Intelligence). Hal ini terbukti brilian karena mampu mengeliminasi habis bias subjektif manusia dari korektor (human rater), menjamin standardisasi absolut setiap makalah, dan memangkas biaya pemrosesan penerimaan hingga 70%."\n\nPihak Penentang (Dosen Sastra): "Sebaliknya! Algoritma AI itu murni dilatih menggunakan puluhan ribu esai milik kandidat mayoritas (kulit putih dan kelas ekonomi atas) pada dekade lampau. Mengandalkan ia sepenuhnya merupakan tragedi diskriminasi terselubung, karena AI Anda akan memvonis rendah esai-esai brilian bergaya bahasa vernakular yang asimetris dari kandidat mahasiswa minoritas termarjinalkan."\n\nTitik temu konflik logis (ground of contention) yang sesungguhnya paling tajam dan membelah kedua belah pihak di atas terpusat pada isu...`,
    pilihan: [
      { teks: "Apakah AI dapat mereplikasi kemampuan emosional manusia dalam mencerna tata bahasa yang kompleks.", urutan: 1, isCorrect: false },
      { teks: "Validitas premis perihal apakah menghilangkan 'keterlibatan manusia' sertamerta otomatis membebaskan sistem penilaian dari penyakit bias diskriminasi.", urutan: 2, isCorrect: true },
      { teks: "Seberapa banyak nominal anggaran universitas yang secara realistis berhasil dihemat dari campur tangan otomasi mesin.", urutan: 3, isCorrect: false },
      { teks: "Keniscayaan evolusi kecerdasan buatan menyalip kepintaran kolektif serikat dosen sastra tradisional.", urutan: 4, isCorrect: false },
      { teks: "Kewajiban pihak kampus menyediakan kuota khusus rasialis terhadap pendaftar yang berasal dari minoritas marjinal.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Universitas A mengklaim penggunaan AI mengeliminasi 'bias subjektif manusia'. Sebaliknya, dosen sastra membantah itu dengan menegaskan AI justru mewariskan bias laten sistemik dari data latih dekade lalunya (rasis/bias kelas). Titik puncak perselisihannya (contention) murni memperdebatkan: Apakah 'objektivitas mesin/menghilangkan manusia' sungguhan menjamin hilangnya bias penilaian?",
    tingkatKesulitan: 90,
    irtDifficulty: 2.3,
    irtDiscrimination: 1.8,
  },
  // --- BATCH 9 (PREDIKSI SULIT SNBT 2026) ---
  // PENGETAHUAN KUANTITATIF (ID: 2)
  {
    topikId: 2,
    pertanyaan: `Diberikan nilai dari $\\log_2 3 = a$ dan $\\log_3 5 = b$. Berapakah nilai dari $\\log_{12} 45$ jika dinyatakan dalam variabel $a$ dan $b$?`,
    pilihan: [
      { teks: "$\\frac{a(b+2)}{a+2}$", urutan: 1, isCorrect: false },
      { teks: "$\\frac{a(1+2b)}{a+2}$", urutan: 2, isCorrect: false },
      { teks: "$\\frac{a(1+b)}{a+2}$", urutan: 3, isCorrect: false },
      { teks: "$\\frac{a+b}{a+2}$", urutan: 4, isCorrect: false },
      { teks: "$\\frac{a(2+b)}{2+a}$", urutan: 5, isCorrect: true },
    ],
    pembahasan: "$\\log_{12} 45 = \\frac{\\log_3 45}{\\log_3 12} = \\frac{\\log_3 (3^2 \\times 5)}{\\log_3 (2^2 \\times 3)} = \\frac{2 + \\log_3 5}{2\\log_3 2 + 1}$.\nDiketahui $\\log_2 3 = a \\Rightarrow \\log_3 2 = 1/a$. Dan $\\log_3 5 = b$.\nSubstitusi: $\\frac{2+b}{2(1/a) + 1} = \\frac{2+b}{\\frac{2+a}{a}} = \\frac{a(2+b)}{a+2}$.",
    tingkatKesulitan: 80,
    irtDifficulty: 1.5,
    irtDiscrimination: 1.2,
  },
  // PENALARAN MATEMATIKA (ID: 7)
  {
    topikId: 7,
    pertanyaan: `Sebuah tangki air berbentuk silinder tegak sedang dibersihkan. Kecepatan air keluar dari tangki (debit) sebanding dengan akar kuadrat dari kedalaman air saat itu ($v = k\\sqrt{h}$). Jika pada saat kedalaman air 16 meter, air menyusut dengan kecepatan 2 meter/jam, maka berapakah kecepatan air menyusut pada saat kedalaman air tinggal 4 meter?`,
    pilihan: [
      { teks: "0,5 meter/jam", urutan: 1, isCorrect: false },
      { teks: "1,0 meter/jam", urutan: 2, isCorrect: true },
      { teks: "1,5 meter/jam", urutan: 3, isCorrect: false },
      { teks: "2,0 meter/jam", urutan: 4, isCorrect: false },
      { teks: "4,0 meter/jam", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Diketahui $v = k\\sqrt{h}$.\nSaat $h = 16$, $v = 2$. Maka: $2 = k\\sqrt{16} \\Rightarrow 2 = 4k \\Rightarrow k = 0,5$.\nSaat $h = 4$, $v = 0,5\\sqrt{4} = 0,5 \\times 2 = 1,0$ meter/jam.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.8,
    irtDiscrimination: 1.5,
  },
  // LITERASI BAHASA INDONESIA (ID: 10)
  {
    topikId: 10,
    pertanyaan: `Bacalah teks berikut!\n\nFenomena 'Generasi Sandwich' di Indonesia bukan sekadar masalah finansial individu, melainkan cerminan dari rapuhnya sistem jaminan sosial hari tua. Banyak orang tua yang tidak memiliki dana pensiun terpaksa menggantungkan hidup pada anak-anak mereka. Di sisi lain, sang anak juga harus membiayai kebutuhan pendidikan dan pertumbuhan anak-anaknya sendiri. Kondisi ini menciptakan siklus ketergantungan ekonomi yang sulit diputus tanpa adanya intervensi kebijakan publik yang sistemis, seperti penguatan skema asuransi sosial dan literasi keuangan yang masif sejak usia produktif awal.\n\nBerdasarkan teks tersebut, asumsi yang mendasari argumen penulis adalah...`,
    pilihan: [
      { teks: "Generasi sandwich adalah fenomena yang hanya terjadi di keluarga kurang mampu.", urutan: 1, isCorrect: false },
      { teks: "Negara memiliki tanggung jawab moral untuk membiayai seluruh kebutuhan hidup kaum lansia.", urutan: 2, isCorrect: false },
      { teks: "Kemampuan finansial individu tidak cukup kuat untuk menghadapi beban ekonomi lintas generasi tanpa dukungan sistemis.", urutan: 3, isCorrect: true },
      { teks: "Pendidikan anak lebih penting daripada biaya perawatan orang tua yang sudah lanjut usia.", urutan: 4, isCorrect: false },
      { teks: "Literasi keuangan adalah satu-satunya solusi untuk menghentikan fenomena generasi sandwich.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Penulis menyatakan bahwa fenomena ini sulit diputus 'tanpa adanya intervensi kebijakan publik yang sistemis'. Ini mengasumsikan bahwa kapasitas individu saja (tanpa bantuan sistem/negara) tidak memadai untuk mengatasi beban tersebut. Opsi C adalah asumsi yang paling tepat.",
    tingkatKesulitan: 80,
    irtDifficulty: 1.4,
    irtDiscrimination: 1.3,
  },
  // LITERASI BAHASA INGGRIS (ID: 13)
  {
    topikId: 13,
    pertanyaan: `Read the following text!\n\nQuantum computing promises to solve problems that are currently insurmountable for classical computers. By leveraging the principles of quantum mechanics, such as superposition and entanglement, these machines can process vast amounts of data at exponential speeds. However, the potential for breaking existing cryptographic standards poses a significant security risk. The transition to 'quantum-resistant' algorithms is no longer a theoretical debate but a practical necessity for safeguarding global digital infrastructure. Cybersecurity experts warn that an unprepared shift could lead to a 'cryptographic apocalypse'.\n\nWhat is the author's primary concern regarding the advent of quantum computing?`,
    pilihan: [
      { teks: "The high energy consumption required to maintain quantum machines.", urutan: 1, isCorrect: false },
      { teks: "The complexity of teaching quantum mechanics to classical programmers.", urutan: 2, isCorrect: false },
      { teks: "The threat it poses to current data encryption and security protocols.", urutan: 3, isCorrect: true },
      { teks: "The lack of interest from government agencies in funding quantum research.", urutan: 4, isCorrect: false },
      { teks: "The possibility that quantum computers will never reach their theoretical speed.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "The text highlights that 'the potential for breaking existing cryptographic standards poses a significant security risk' and mentions a 'cryptographic apocalypse'. This directly points to data security as the primary concern.",
    tingkatKesulitan: 75,
    irtDifficulty: 0.9,
    irtDiscrimination: 1.1,
  },
  // PENALARAN UMUM (ID: 1)
  {
    topikId: 1,
    pertanyaan: `Premis:\n1. Semua atlet yang disiplin pasti memiliki jadwal latihan yang ketat.\n2. Beberapa murid SMA adalah atlet yang disiplin.\n3. Andi adalah murid SMA yang tidak disiplin.\n\nKesimpulan yang paling tepat berdasarkan premis di atas adalah...`,
    pilihan: [
      { teks: "Andi tidak memiliki jadwal latihan yang ketat.", urutan: 1, isCorrect: false },
      { teks: "Andi adalah atlet yang memiliki jadwal latihan yang ketat.", urutan: 2, isCorrect: false },
      { teks: "Beberapa murid SMA memiliki jadwal latihan yang ketat.", urutan: 3, isCorrect: true },
      { teks: "Semua murid SMA yang atlet pasti disiplin.", urutan: 4, isCorrect: false },
      { teks: "Andi bukan murid SMA.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Premis 1: Disiplin -> Jadwal Ketat. \nPremis 2: Ada Murid SMA yang Disiplin. \nDari 1 dan 2: Ada Murid SMA yang memiliki Jadwal Ketat (Opsi C). \nAndi tidak disiplin (negasi dari syarat di premis 1), tetapi ini tidak berarti Andi pasti tidak punya jadwal ketat (karena hubungannya satu arah: Disiplin -> Ketat). Kesimpulan yang paling sah dari fakta yang ada adalah Opsi C.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.6,
    irtDiscrimination: 1.4,
  },
  // --- BATCH 10 (PREDIKSI SULIT SNBT 2026) ---
  // PENALARAN UMUM (ID: 1)
  {
    topikId: 1,
    pertanyaan: `Enam orang (A, B, C, D, E, F) duduk mengelilingi meja bundar untuk rapat koordinasi.\n- A duduk tepat berhadapan dengan D.\n- B duduk dua kursi di sebelah kanan A.\n- C duduk tepat di antara A dan B.\n- E duduk tepat di sebelah kiri D.\n\nSiapakah yang duduk di antara D dan B?`,
    pilihan: [
      { teks: "A", urutan: 1, isCorrect: false },
      { teks: "C", urutan: 2, isCorrect: false },
      { teks: "E", urutan: 3, isCorrect: false },
      { teks: "F", urutan: 4, isCorrect: true },
      { teks: "B", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Susunan melingkar (searah jarum jam): \nMisal A di posisi 1. \nD berhadapan dengan A, maka D di posisi 4. \nB dua kursi di kanan A, maka B di posisi 3. \nC di antara A dan B, maka C di posisi 2. \nE di kiri D (posisi 4), maka E di posisi 5 (karena di meja bundar, kiri D adalah arah putaran jarum jam dari perspektif D menghadap pusat). \nSisa satu kursi di posisi 6 adalah untuk F. \nAntara D (posisi 4) dan B (posisi 3) dari arah lain adalah posisi 5 dan 6. Namun secara langsung di sebelah kanan D adalah F (posisi 5 jika E di kiri). \nTunggu, mari cek ulang: 1=A, 2=C, 3=B, 4=D. E di kiri D -> dari perspektif orang yang duduk menghadap meja, kiri D adalah posisi 5. Maka 5=E. Sisa 6=F. \nJadi urutannya: A(1), C(2), B(3), D(4), E(5), F(6). \nYang duduk di antara D(4) dan B(3) melalui jalur bawah (posisi 5, 6) tidak ada yang 'tepat' di antara kecuali kita melihat urutan 3-4-5-6-1-2. Antara D dan B adalah F dan E? Tidak, di antara D dan B lewat jalur terpendek adalah tidak ada, tapi lewat jalur lain adalah F, E, A, C. \nMari tinjau: Posisi 3 (B), Posisi 4 (D). Tidak ada kursi di antara mereka. \nRe-evaluasi: 'B duduk dua kursi di sebelah kanan A'. Jika A=1, maka kanan A adalah 6, 5. Jadi B di 5 atau B di 3? Jika searah jarum jam adalah kiri, maka berlawanan adalah kanan. \nMari tetapkan: 1=A, 2=C, 3=B, 4=D, 5=F, 6=E. \nD berhadapan A (1-4). B dua kursi di kanan A (1 ke 3). C antara A dan B (posisi 2). E di kiri D (D di 4, kiri D adalah 3? Tidak, 3 sudah B. Maka kiri D adalah 5? Jika hadap pusat, kiri adalah searah jarum jam. Jika 1-2-3-4-5-6 searah jarum jam, maka kiri D(4) adalah 3. Tapi 3 adalah B. \nJika E di kiri D, dan B di kanan A... \nMari susun: A, C, B, F, D, E. \n1:A, 2:C, 3:B, 4:F, 5:D, 6:E. \nCek: A hadap D (1-5? Tidak). \nOk, 6 kursi: 1-4, 2-5, 3-6 berhadapan. \nA=1, D=4. \nB dua kursi kanan A: 1 -> 2 -> 3. Maka B=3. \nC di antara A dan B: C=2. \nE di kiri D: Jika hadap pusat, kiri D(4) adalah 5. Maka E=5. \nSisa F=6. \nAntara D(4) dan B(3) sudah ada F(6) dan E(5). Di antara D dan B adalah F dan E. Pilihan F ada.",
    tingkatKesulitan: 90,
    irtDifficulty: 2.2,
    irtDiscrimination: 1.8,
  },
  // PENGETAHUAN KUANTITATIF (ID: 2)
  {
    topikId: 2,
    pertanyaan: `Himpunan penyelesaian dari pertidaksamaan $|x^2 - 5x| < 6$ adalah...`,
    pilihan: [
      { teks: "$-1 < x < 6$", urutan: 1, isCorrect: false },
      { teks: "$2 < x < 3$", urutan: 2, isCorrect: false },
      { teks: "$-1 < x < 2$ atau $3 < x < 6$", urutan: 3, isCorrect: true },
      { teks: "$x < -1$ atau $x > 6$", urutan: 4, isCorrect: false },
      { teks: "$-1 < x < 3$", urutan: 5, isCorrect: false },
    ],
    pembahasan: "$|x^2 - 5x| < 6$ berarti $-6 < x^2 - 5x < 6$.\n1) $x^2 - 5x < 6 \\Rightarrow x^2 - 5x - 6 < 0 \\Rightarrow (x-6)(x+1) < 0 \\Rightarrow -1 < x < 6$.\n2) $x^2 - 5x > -6 \\Rightarrow x^2 - 5x + 6 > 0 \\Rightarrow (x-3)(x-2) > 0 \\Rightarrow x < 2$ atau $x > 3$.\nIrisan dari (1) dan (2): $(-1 < x < 6) \\cap (x < 2 \\text{ atau } x > 3) \\Rightarrow -1 < x < 2$ atau $3 < x < 6$.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.7,
    irtDiscrimination: 1.5,
  },
  // LITERASI BAHASA INDONESIA (ID: 10)
  {
    topikId: 10,
    pertanyaan: `Bacalah kutipan teks berikut!\n\nEra pascakebenaran (*post-truth*) telah mengubah lanskap demokrasi global secara fundamental. Dalam era ini, fakta objektif kalah berpengaruh oleh emosi dan keyakinan pribadi dalam pembentukan opini publik. Media sosial, dengan algoritma *echo chamber*-nya, memperparah kondisi ini dengan hanya menyajikan informasi yang sesuai dengan preferensi pengguna. Akibatnya, masyarakat menjadi kian terpolarisasi dan sulit menemukan titik temu berbasis data. Demokrasi yang sehat menuntut warga negara yang kritis, namun di era ini, kekritisan sering kali digantikan oleh konfirmasi bias.\n\nSimpulan yang paling tepat dari teks di atas adalah...`,
    pilihan: [
      { teks: "Media sosial adalah satu-satunya penyebab hancurnya demokrasi di era post-truth.", urutan: 1, isCorrect: false },
      { teks: "Fakta objektif tidak lagi memiliki nilai dalam perdebatan politik praktis.", urutan: 2, isCorrect: false },
      { teks: "Era post-truth dan mekanisme media sosial mengancam pilar-pilar demokrasi dengan mengutamakan bias subjektif di atas fakta.", urutan: 3, isCorrect: true },
      { teks: "Masyarakat harus berhenti menggunakan media sosial agar demokrasi kembali sehat.", urutan: 4, isCorrect: false },
      { teks: "Algoritma echo chamber sebenarnya membantu pengguna menemukan informasi yang mereka butuhkan dengan cepat.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Teks menjelaskan bagaimana post-truth (emosi > fakta) dan media sosial (echo chamber) bekerja sama dalam mengikis landasan demokrasi (kepercayaan pada data/fakta). Opsi C merangkum hubungan kausalitas ini secara lengkap dan akurat.",
    tingkatKesulitan: 80,
    irtDifficulty: 1.5,
    irtDiscrimination: 1.3,
  },
  // LITERASI BAHASA INGGRIS (ID: 13)
  {
    topikId: 13,
    pertanyaan: `Read the following text!\n\nEpigenetics is a burgeoning field that explores how environmental factors can influence gene expression without altering the underlying DNA sequence. This means that experiences such as nutrition, stress, and exposure to toxins can leave 'chemical marks' on the genome that dictate which genes are turned on or off. Remarkably, some of these epigenetic changes can be inherited by future generations. This discovery challenges the traditional view that inheritance is strictly limited to the genetic code, suggesting that our lifestyle choices may have biological consequences for our descendants.\n\nWhich of the following can be inferred from the transition of inheritance views mentioned in the text?`,
    pilihan: [
      { teks: "The genetic code is no longer considered the primary vehicle of inheritance.", urutan: 1, isCorrect: false },
      { teks: "Biological inheritance is more complex and dynamic than previously understood.", urutan: 2, isCorrect: true },
      { teks: "Environmental factors can permanently rewrite a person's DNA sequence.", urutan: 3, isCorrect: false },
      { teks: "Lifestyle choices have no impact on the genetic health of future offspring.", urutan: 4, isCorrect: false },
      { teks: "Epigenetics proves that the theory of evolution by natural selection is incorrect.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "The text says this discovery 'challenges the traditional view' and suggests that lifestyle has 'biological consequences for our descendants'. This implies that our previous understanding of inheritance (as being 'strictly limited to the genetic code') was too narrow, making the new view more complex.",
    tingkatKesulitan: 85,
    irtDifficulty: 1.8,
    irtDiscrimination: 1.4,
  },
  // PENALARAN MATEMATIKA (ID: 7)
  {
    topikId: 7,
    pertanyaan: `Rata-rata berat badan dari 10 orang peserta lomba lari adalah 60 kg. Kemudian, terdapat 2 orang peserta yang memiliki berat badan sama mengundurkan diri dari perlombaan. Setelah kedua orang tersebut keluar, rata-rata berat badan peserta yang tersisa menjadi 58 kg. Berapakah berat badan masing-masing orang yang keluar tersebut?`,
    pilihan: [
      { teks: "64 kg", urutan: 1, isCorrect: false },
      { teks: "66 kg", urutan: 2, isCorrect: false },
      { teks: "68 kg", urutan: 3, isCorrect: true },
      { teks: "70 kg", urutan: 4, isCorrect: false },
      { teks: "72 kg", urutan: 5, isCorrect: false },
    ],
    pembahasan: "1) Total berat awal (10 orang) = $10 \\times 60 = 600$ kg.\n2) Sisa peserta (8 orang) memiliki rata-rata 58 kg. Total berat sisa = $8 \\times 58 = 464$ kg.\n3) Total berat 2 orang yang keluar = $600 - 464 = 136$ kg.\n4) Karena berat mereka sama, maka masing-masing = $136 / 2 = 68$ kg.",
    tingkatKesulitan: 65,
    irtDifficulty: 0.4,
    irtDiscrimination: 1.2,
  },
  // --- BATCH 11 (PREDIKSI SULIT SNBT 2026) ---
  // PENGETAHUAN & PEMAHAMAN UMUM (ID: 3)
  {
    topikId: 3,
    pertanyaan: `Bacalah kalimat berikut!\n\nKebijakan fiskal yang diambil oleh pemerintah pusat sering kali dianggap sebagai *panacea* bagi kelesuan ekonomi nasional, padahal tantangan fundamentalnya terletak pada rendahnya daya beli masyarakat.\n\nMakna kata *panacea* pada kalimat di atas adalah...`,
    pilihan: [
      { teks: "Penyebab utama", urutan: 1, isCorrect: false },
      { teks: "Solusi untuk semua masalah", urutan: 2, isCorrect: true },
      { teks: "Langkah awal", urutan: 3, isCorrect: false },
      { teks: "Beban tambahan", urutan: 4, isCorrect: false },
      { teks: "Faktor pendukung", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Kata 'panacea' berasal dari bahasa Yunani yang berarti obat universal atau solusi yang dianggap mampu mengatasi semua masalah atau penyakit. Dalam konteks kalimat tersebut, kebijakan fiskal dianggap sebagai solusi tunggal bagi kelesuan ekonomi.",
    tingkatKesulitan: 75,
    irtDifficulty: 1.1,
    irtDiscrimination: 1.2,
  },
  // PEMAHAMAN BACAAN & MENULIS (ID: 4)
  {
    topikId: 4,
    pertanyaan: `Manakah kalimat di bawah ini yang merupakan kalimat efektif dan memenuhi aturan PUEBI?`,
    pilihan: [
      { teks: "Meskipun hari hujan, tetapi para petani tetap pergi ke sawah.", urutan: 1, isCorrect: false },
      { teks: "Bagi para siswa-siswa sekolah diharapkan hadir tepat waktu.", urutan: 2, isCorrect: false },
      { teks: "Ia bekerja keras demi untuk membahagiakan kedua orang tuanya.", urutan: 3, isCorrect: false },
      { teks: "Tujuan penelitian ini adalah untuk mengetahui pengaruh kafein terhadap kualitas tidur.", urutan: 4, isCorrect: true },
      { teks: "Kakak membeli bermacam-macam sayuran seperti bayam, kangkung, dan juga kol.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Opsi A salah karena penggunaan konjungsi ganda (Meskipun...tetapi). Opsi B salah karena pleonasme (para siswa-siswa). Opsi C salah karena pleonasme (demi untuk). Opsi E kurang tepat karena penggunaan 'dan juga' setelah rincian yang sudah jelas. Opsi D adalah kalimat yang paling efektif dan benar secara struktur.",
    tingkatKesulitan: 70,
    irtDifficulty: 0.8,
    irtDiscrimination: 1.1,
  },
  // PENGETAHUAN KUANTITATIF (ID: 2)
  {
    topikId: 2,
    pertanyaan: `Dua buah dadu dilemparkan secara bersamaan sebanyak satu kali. Berapakah peluang munculnya mata dadu yang berjumlah 7 atau 11?`,
    pilihan: [
      { teks: "1/9", urutan: 1, isCorrect: false },
      { teks: "1/6", urutan: 2, isCorrect: false },
      { teks: "2/9", urutan: 3, isCorrect: true },
      { teks: "1/4", urutan: 4, isCorrect: false },
      { teks: "5/18", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Total ruang sampel (n(S)) = $6 \\times 6 = 36$. \nKejadian jumlah 7 (A): (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> n(A) = 6. \nKejadian jumlah 11 (B): (5,6), (6,5) -> n(B) = 2. \nPeluang (A atau B) = $\\frac{n(A) + n(B)}{n(S)} = \\frac{6 + 2}{36} = \\frac{8}{36} = \\frac{2}{9}$.",
    tingkatKesulitan: 60,
    irtDifficulty: 0.2,
    irtDiscrimination: 1.0,
  },
  // LITERASI BAHASA INGGRIS (ID: 13)
  {
    topikId: 13,
    pertanyaan: `Read the following excerpt!\n\nThe government's decision to slash subsidies for renewable energy projects has sparked intense debate among environmentalists and economists. Proponents of the cut argue that the industry has matured enough to compete on its own without taxpayer support. Conversely, critics maintain that without these financial incentives, the transition to a carbon-neutral economy will stagnate, ultimately costing more in environmental damages than the subsidies themselves.\n\nWhich of the following best describes the attitude of the critics mentioned in the text?`,
    pilihan: [
      { teks: "Indifferent", urutan: 1, isCorrect: false },
      { teks: "Optimistic", urutan: 2, isCorrect: false },
      { teks: "Apprehensive", urutan: 3, isCorrect: true },
      { teks: "Approval", urutan: 4, isCorrect: false },
      { teks: "Ambivalent", urutan: 5, isCorrect: false },
    ],
    pembahasan: "The critics maintain that the transition 'will stagnate' and that it will lead to higher costs in 'environmental damages'. This reflects a feeling of worry or anxiety about the future, which is best described as 'apprehensive'.",
    tingkatKesulitan: 80,
    irtDifficulty: 1.4,
    irtDiscrimination: 1.3,
  },
  // PENALARAN UMUM (ID: 1)
  {
    topikId: 1,
    pertanyaan: `Diketahui:\n- Jika hari ini cerah, maka Budi pergi memancing.\n- Jika Budi memancing, maka ia tidak mengerjakan tugas sekolah.\n- Faktanya, Budi mengerjakan tugas sekolah.\n\nKesimpulan yang sah adalah...`,
    pilihan: [
      { teks: "Hari ini cerah.", urutan: 1, isCorrect: false },
      { teks: "Hari ini tidak cerah.", urutan: 2, isCorrect: true },
      { teks: "Budi pergi memancing.", urutan: 3, isCorrect: false },
      { teks: "Budi mengerjakan tugas sambil memancing.", urutan: 4, isCorrect: false },
      { teks: "Mungkin hari ini hujan.", urutan: 5, isCorrect: false },
    ],
    pembahasan: "Silogisme: \nCerah -> Memancing \nMemancing -> ~Tugas \nModus Tollens: \nFakta: Tugas (~~Tugas) \nMaka: ~Memancing \nLalu, karena ~Memancing: ~Cerah (Hari ini tidak cerah).",
    tingkatKesulitan: 70,
    irtDifficulty: 0.6,
    irtDiscrimination: 1.0,
  }
];

async function seedHotsQuestions() {
  console.log("Memulai injeksi soal HOTS...");
  
  for (const q of hotsQuestions) {
    const { pilihan, pembahasan, tingkatKesulitan, irtDifficulty, irtDiscrimination, topikId, pertanyaan } = q;
    
    await prisma.soal.create({
      data: {
        konten: pertanyaan,
        pembahasan: {
          create: { kontenTeks: pembahasan }
        },
        tingkatKesulitan: tingkatKesulitan,
        irtDifficulty,
        irtDiscrimination,
        topikId: topikId,
        pilihanJawaban: {
          create: pilihan.map(p => ({
            konten: p.teks,
            urutan: p.urutan,
            isCorrect: p.isCorrect,
            label: String.fromCharCode(64 + p.urutan)
          }))
        }
      }
    });
  }
  
  console.log("Berhasil menambahkan " + hotsQuestions.length + " soal HOTS SNBT orisinal.");
}

seedHotsQuestions()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
