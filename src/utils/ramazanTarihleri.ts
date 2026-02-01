/**
 * Ramazan 2026 tarihleri ve yardımcı fonksiyonlar
 * Ramazan 2026: 19 Şubat 2026 - 19 Mart 2026 (29 gün)
 */

/**
 * Ramazan 2026'nın tüm tarihleri döndürür
 * @returns Date[] - Ramazan günlerinin tarihleri
 */
export function getRamazan2026Tarihleri(): Date[] {
  const tarihler: Date[] = [];

  // Ramazan 2026 başlangıcı: 19 Şubat 2026
  const baslangic = new Date(2026, 1, 19); // Ay 0-indexed (1 = Şubat)

  // 29 gün Ramazan
  for (let i = 0; i < 29; i++) {
    const tarih = new Date(baslangic);
    tarih.setDate(baslangic.getDate() + i);
    tarih.setHours(0, 0, 0, 0);
    tarihler.push(tarih);
  }

  return tarihler;
}

/**
 * Tarihi YYYY-MM-DD formatında string'e çevirir
 * @param tarih - Çevrilecek tarih
 * @returns string - YYYY-MM-DD formatında tarih
 */
export function tarihToString(tarih: Date): string {
  const yil = tarih.getFullYear();
  const ay = String(tarih.getMonth() + 1).padStart(2, '0');
  const gun = String(tarih.getDate()).padStart(2, '0');
  return `${yil}-${ay}-${gun}`;
}

/**
 * String formatındaki tarihi Date objesine çevirir
 * @param tarihString - YYYY-MM-DD formatında tarih string'i
 * @returns Date - Tarih objesi
 */
export function stringToTarih(tarihString: string): Date {
  const [yil, ay, gun] = tarihString.split('-').map(Number);
  return new Date(yil, ay - 1, gun);
}

/**
 * Bayram 2026 tarihlerini döndürür
 * @returns { ramazanBayrami: Date[], kurbanBayrami: Date[] }
 */
export function getBayram2026Tarihleri(): { ramazanBayrami: Date[], kurbanBayrami: Date[] } {
  const ramazanBayrami = [
    new Date(2026, 2, 20),
    new Date(2026, 2, 21),
    new Date(2026, 2, 22),
  ];

  const kurbanBayrami = [
    new Date(2026, 4, 27),
    new Date(2026, 4, 28),
    new Date(2026, 4, 29),
    new Date(2026, 4, 30),
  ];

  // Saatleri sıfırla
  [...ramazanBayrami, ...kurbanBayrami].forEach(d => d.setHours(0, 0, 0, 0));

  return { ramazanBayrami, kurbanBayrami };
}

/**
 * Belirli bir tarihin Bayram olup olmadığını kontrol eder
 * @param tarih - Kontrol edilecek tarih
 * @returns boolean - Bayram mı?
 */
export function isBayram(tarih: Date): boolean {
  const { ramazanBayrami, kurbanBayrami } = getBayram2026Tarihleri();
  const kontrolTarihStr = tarih.toISOString().split('T')[0];

  return [...ramazanBayrami, ...kurbanBayrami].some(bt => bt.toISOString().split('T')[0] === kontrolTarihStr);
}

/**
 * Belirli bir tarihin Ramazan 2026 içinde olup olmadığını kontrol eder
 * @param tarih - Kontrol edilecek tarih
 * @returns boolean - Ramazan içinde mi?
 */
export function bugunRamazanMi(tarih: Date = new Date()): boolean {
  const ramazanTarihleri = getRamazan2026Tarihleri();
  const kontrolTarihStr = tarih.toISOString().split('T')[0];

  return ramazanTarihleri.some(rt => rt.toISOString().split('T')[0] === kontrolTarihStr);
}
