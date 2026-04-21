import Image from "next/image";
import Link from "next/link";

import TypewriterText from "+/TypewriterText/TypewriterText";
import styles from "./Home.module.scss";

export default function Home() {
  return (
    <main className={styles.home}>
      <section className={styles.panel} aria-labelledby="home-heading">
        <nav className={styles.navbar} aria-label="Główna nawigacja">
          <Link href="/wsparcie">wsparcie</Link>
        </nav>

        <Image
          className={styles.logo}
          src="/logo_black.svg"
          alt="Kierunek"
          width={825}
          height={148}
          priority
        />

        <h1 id="home-heading" className={styles.heading}>
          <span>Kochamy</span>
          <span className={styles.word}>
            <TypewriterText
              words={["Boga", "Ludzi", "Życie"]}
              typingSpeed={180}
              deletingSpeed={110}
              pauseMs={1600}
            />
          </span>
        </h1>

        <div className={styles.details} aria-label="Informacje o spotkaniu">
          <p>Każda niedziela 11:00</p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Zakrzowska%2029%2C%20Wroc%C5%82aw"
            target="_blank"
            rel="noreferrer"
          >
            Zakrzowska 29, Wrocław
            <svg
              className={styles.addressIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  );
}
