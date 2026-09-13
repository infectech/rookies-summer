import Image from "next/image";
import { SITE_CONFIG } from "@/lib/config";
import { BLUR_PLACEHOLDER } from "@/lib/image";

export function Footer() {
  return (
    <footer id="about" className="mt-auto border-t border-black/5 bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Image
              src="/logo white.png"
              alt={SITE_CONFIG.name}
              width={164}
              height={48}
              loading="lazy"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              className="h-12 w-auto object-contain"
              style={{ width: "auto" }}
            />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.facebook.com/rookiesdnmco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold hover:text-gold"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/rookiesdnmco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold hover:text-gold"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">
              Cash on Delivery
            </h4>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              Pay when your order arrives at your doorstep, anywhere in
              Bangladesh. No advance payment required.
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-white/60">
              <a href="#about" className="transition-colors hover:text-gold">
                About
              </a>
              <a href="/faq" className="transition-colors hover:text-gold">
                FAQ
              </a>
            </div>
          </div>

          <div id="contact">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">
              Contact
            </h4>
            <div className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-white/60">
              <p>
                Phone: <a href="tel:01777548390" className="hover:text-gold transition-colors">01777548390</a>,{" "}
                <a href="tel:01400550357" className="hover:text-gold transition-colors">01400550357</a>
              </p>
              <p>
                WhatsApp: <a href="https://wa.me/8801400550357" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">01400550357</a>
              </p>
              <p>
                Email: <a href="mailto:rookiesdnmco@gmail.com" className="hover:text-gold transition-colors">rookiesdnmco@gmail.com</a>
              </p>
              <p>Address: {SITE_CONFIG.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
            reserved.
          </p>
          <p>
            Built by{" "}
            <a
              href="https://infectech.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 underline underline-offset-2 transition-colors hover:text-gold"
            >
              Infectech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}