import { useState, useEffect } from 'react';
import { NamazVakitleri } from '../types';
import { getNamazVakitleri } from '../utils/namazVakitleri';
import { yukleSehir } from '../utils/storage';

/**
 * Namaz vakitlerini yükleyen ve yöneten hook
 */
export function useNamazVakitleri() {
  const [vakitler, setVakitler] = useState<NamazVakitleri | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNamazVakitleri.ts:13',message:'useEffect başladı',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    async function yukleVakitler() {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNamazVakitleri.ts:15',message:'yukleVakitler çağrıldı',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      try {
        setYukleniyor(true);
        setHata(null);
        // Şehir bilgisini yükle ve namaz vakitlerini şehre göre çek
        const sehir = await yukleSehir();
        const sehirAdi = sehir?.isim || 'Istanbul';
        const vakitlerData = await getNamazVakitleri(sehirAdi);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNamazVakitleri.ts:19',message:'Vakitler yüklendi',data:{vakitlerData,hasData:!!vakitlerData,sehir:sehirAdi},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        setVakitler(vakitlerData);
      } catch (err) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNamazVakitleri.ts:21',message:'Vakitler yüklenirken hata',data:{error:err instanceof Error ? err.message : 'Bilinmeyen hata'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        setHata(err instanceof Error ? err.message : 'Bilinmeyen hata');
        console.error('Namaz vakitleri yüklenirken hata:', err);
      } finally {
        setYukleniyor(false);
      }
    }

    yukleVakitler();
    
    // Her gün saat 00:00'da güncelle
    const bugun = new Date();
    const yarin = new Date(bugun);
    yarin.setDate(yarin.getDate() + 1);
    yarin.setHours(0, 0, 0, 0);
    
    const gecenSure = yarin.getTime() - bugun.getTime();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNamazVakitleri.ts:37',message:'setTimeout oluşturuldu',data:{gecenSure},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    let intervalId: NodeJS.Timeout | null = null;
    const timer = setTimeout(() => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNamazVakitleri.ts:38',message:'setTimeout callback çalıştı, setInterval oluşturuluyor',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      yukleVakitler();
      // Her 24 saatte bir güncelle
      intervalId = setInterval(yukleVakitler, 24 * 60 * 60 * 1000);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNamazVakitleri.ts:40',message:'setInterval oluşturuldu (CLEANUP EKLENDI)',data:{intervalId:!!intervalId},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    }, gecenSure);

    return () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNamazVakitleri.ts:43',message:'Cleanup çalıştı - timer ve interval temizleniyor',data:{hasInterval:!!intervalId},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      clearTimeout(timer);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return { vakitler, yukleniyor, hata };
}

