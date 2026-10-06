import { useState } from "react";

type Status = "done" | "partial" | "missing";

const features: { group: string; items: { name: string; status: Status; note?: string }[] }[] = [
  {
    group: "Çekirdek",
    items: [
      { name: "SAF import (video/foto/ses), depolama izni yok", status: "done" },
      { name: "Çok kanallı timeline (video/overlay/text/FX/2×audio)", status: "done" },
      { name: "Split, trim, move, duplicate, delete, ripple, snap, magnetic, multi-select, undo/redo", status: "done" },
      { name: "Crop, rotate, flip, scale, position, opacity, blur, zoom", status: "done" },
      { name: "Hız 0.1×–8×, speed ramp, freeze frame", status: "done" },
      { name: "Reverse", status: "missing", note: "Transcode edilmiş kopya gerekir" },
    ],
  },
  {
    group: "Render / Export",
    items: [
      { name: "CompositionPlayer GPU preview (Low/Med/High)", status: "done" },
      { name: "Transformer export 720p–4K, 24/30/60 fps, H.264/H.265 + AAC", status: "done" },
      { name: "İlerleme, ETA, iptal, foreground service, MediaStore, paylaşım", status: "done" },
      { name: "25 efekt + 17 geçiş (uber GLSL shader)", status: "done" },
      { name: "Geçişler: çapraz harman değil, kesimde zirve yapan dip geçişler", status: "partial" },
    ],
  },
  {
    group: "Animasyon / Ses",
    items: [
      { name: "Keyframe: 12 özellik, linear/ease/bezier, timeline'da elmaslar", status: "done" },
      { name: "Waveform, beat detection, beat marker", status: "done" },
      { name: "Beat Sync (cut/zoom/shake/flash/transition/random/custom) + Auto Edit", status: "done" },
      { name: "Çoklu ses, volume, fade, trim, split, speed", status: "done" },
    ],
  },
  {
    group: "AI (cihaz üzerinde)",
    items: [
      { name: "Yüz algılama + takip, çoklu yüz seçimi → keyframe", status: "done" },
      { name: "Nesne takibi (ML Kit öneri + SAD patch tracker)", status: "partial", note: "Araba/hayvan etiketi yok" },
      { name: "Background removal", status: "partial", note: "Tek kare kesit; video maskesi GL'ye bağlı değil" },
    ],
  },
];

const tree = `android/
├─ settings.gradle.kts · build.gradle.kts · gradle.properties
└─ app/
   ├─ build.gradle.kts            (Media3 1.9, ML Kit, Compose)
   └─ src/main/
      ├─ AndroidManifest.xml
      └─ java/com/editvibe/app/
         ├─ MainActivity.kt · EditVibeApp.kt
         ├─ model/      Project, Clip, Keyframe, KeyframeMath
         ├─ project/    ProjectStore (JSON, Media Missing)
         ├─ timeline/   TimelineEngine (split/trim/ripple/snap…)
         ├─ media/      MediaImporter (SAF, thumbs, freeze)
         ├─ audio/      AudioAnalyzer (streaming waveform + beats)
         ├─ render/     CompositionBuilder · FxEffect · FxShader
         │              Overlays · GainFadeAudioProcessor
         ├─ effects/    EffectRegistry (modüler efekt/geçiş)
         ├─ tracking/   Face / Object tracker → keyframes
         ├─ ai/         Segmenter (selfie segmentation)
         ├─ auto/       BeatSync · AutoEdit
         ├─ export/     ExportManager · ExportService
         ├─ perf/       MemoryGuard (trim memory, cache)
         ├─ settings/   AppSettings
         └─ ui/         Home · Editor · TimelineView · Panels`;

const badge: Record<Status, string> = {
  done: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  partial: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  missing: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};
const label: Record<Status, string> = { done: "Kodda var", partial: "Kısmi", missing: "Yok" };

const steps = [
  "Android Studio'yu açıp android/ klasörünü Open ile seçin (JDK 17, SDK 36).",
  "Gradle sync bitince Build ▸ Build APK(s) ya da ./gradlew assembleDebug çalıştırın.",
  "app/build/outputs/apk/debug/app-debug.apk dosyasını telefona kurun (minSdk 26).",
  "Release için kendi keystore'unuzu app/build.gradle.kts'deki signingConfig'e bağlayın.",
];

export default function App() {
  const [open, setOpen] = useState(true);
  return (
    <div className="min-h-screen bg-[#0e0e14] text-zinc-200">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Proje rehberi</p>
        <h1 className="mt-2 text-4xl font-black text-white">EditVibe</h1>
        <p className="mt-2 text-zinc-400">Native Android (Kotlin · Compose · Media3) beat-sync video editörü</p>

        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm leading-relaxed text-amber-100">
          <p className="font-bold">Önemli: burada APK yok.</p>
          <p className="mt-2">
            Bu ortam yalnızca web derlemesi (<code>npm run build</code>) çalıştırabiliyor; Android SDK ve Gradle
            bulunmadığı için APK üretilemedi ve Kotlin kodu derlenip test edilemedi. Bu sayfa web editörü değildir, sadece
            projeyi anlatır. Gerçek uygulama <code className="text-white">android/</code> klasöründeki Android Studio
            projesidir; derleyince APK çıkar. İlk derlemede küçük API uyumsuzlukları çıkabilir (bkz.
            <code> android/README.md</code> → “Doğrulanması gerekenler”).
          </p>
        </div>

        <h2 className="mt-10 text-lg font-bold text-white">APK nasıl alınır</h2>
        <ol className="mt-3 space-y-2">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 rounded-xl bg-white/5 p-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>

        <h2 className="mt-10 text-lg font-bold text-white">Özellik durumu</h2>
        <div className="mt-3 space-y-5">
          {features.map((g) => (
            <div key={g.group}>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">{g.group}</h3>
              <ul className="space-y-1.5">
                {g.items.map((it) => (
                  <li key={it.name} className="flex items-start justify-between gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm">
                    <span>
                      {it.name}
                      {it.note && <span className="block text-xs text-zinc-500">{it.note}</span>}
                    </span>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badge[it.status]}`}>
                      {label[it.status]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Proje yapısı</h2>
          <button onClick={() => setOpen(!open)} className="rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20">
            {open ? "Gizle" : "Göster"}
          </button>
        </div>
        {open && (
          <pre className="mt-3 overflow-x-auto rounded-2xl bg-black/50 p-4 text-xs leading-relaxed text-zinc-300">{tree}</pre>
        )}
      </div>
    </div>
  );
}
