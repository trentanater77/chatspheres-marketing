import Image from "next/image";

export const metadata = {
  title: "Chatspheres — Cat Nap Mode",
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FCE2E5] px-4 text-center text-[#22223B]">
      <div className="glass-panel max-w-xl rounded-[32px] p-10">
        <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">
          maintenance
        </p>
        <h1 className="mt-4 text-4xl font-extrabold">We’re tuning the spheres.</h1>
        <p className="mt-2 text-sm text-[#22223B]/80">
          Chatspheres is in a brief maintenance window. Grab tea, pet a cat, and we’ll be back soon.
        </p>
        <div className="mt-6">
          <Image
            src="https://cataas.com/cat/gif?type=smile"
            alt="Cat gif"
            width={224}
            height={224}
            className="mx-auto h-56 w-56 rounded-[24px] border border-white/60 object-cover shadow-lg"
            unoptimized
          />
        </div>
        <p className="mt-6 text-sm text-[#22223B]/70">
          Status page: <a href="mailto:hello@chatspheres.com">hello@chatspheres.com</a>
        </p>
      </div>
    </div>
  );
}

