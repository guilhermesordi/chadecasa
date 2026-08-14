import { getSettings } from "@/lib/settings";
import { saveSettings } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const settings = await getSettings();

  return (
    <main className="space-y-4">
      <h1 className="font-display text-3xl">PIX e textos</h1>
      <form action={saveSettings} className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Título do evento</span>
          <input
            name="eventTitle"
            defaultValue={settings.eventTitle}
            className="w-full rounded-xl border border-line bg-white px-3 py-3"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Seu nome (opcional)</span>
          <input
            name="hostName"
            defaultValue={settings.hostName}
            className="w-full rounded-xl border border-line bg-white px-3 py-3"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Titular do PIX</span>
          <input
            name="pixName"
            defaultValue={settings.pixName}
            className="w-full rounded-xl border border-line bg-white px-3 py-3"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Chave PIX (copia e cola)</span>
          <textarea
            name="pixKey"
            rows={3}
            defaultValue={settings.pixKey}
            className="w-full rounded-xl border border-line bg-white px-3 py-3 font-mono text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Texto da home</span>
          <textarea
            name="welcomeText"
            rows={4}
            defaultValue={settings.welcomeText}
            className="w-full rounded-xl border border-line bg-white px-3 py-3"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-cream"
        >
          Salvar
        </button>
      </form>
    </main>
  );
}
