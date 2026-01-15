/**
 * Ramazan 2026 tarihleri ve yardımcı fonksiyonlar
 * Ramazan 2026: 27 Şubat 2026 - 28 Mart 2026 (30 gün)
 */

/**
 * Ramazan 2026'nın tüm tarihlerini döndürür
 * @returns Date[] - Ramazan günlerinin tarihleri
 */
export function getRamazan2026Tarihleri(): Date[] {
  const tarihler: Date[] = [];

  // Ramazan 2026 başlangıcı: 27 Şubat 2026
  const baslangic = new Date(2026, 1, 27); // Ay 0-indexed (1 = Şubat)

  // 30 gün Ramazan
  for (let i = 0; i < 30; i++) {
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
 * Belirli bir tarihin Ramazan 2026 içinde olup olmadığını kontrol eder
 * @param tarih - Kontrol edilecek tarih
 * @returns boolean - Ramazan içinde mi?
 */
export function bugunRamazanMi(tarih: Date = new Date()): boolean {
  const ramazanTarihleri = getRamazan2026Tarihleri();
  const kontrolTarihStr = tarih.toISOString().split('T')[0];

  return ramazanTarihleri.some(rt => rt.toISOString().split('T')[0] === kontrolTarihStr);
}

