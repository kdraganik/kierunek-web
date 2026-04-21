"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./Wsparcie.module.scss";

type PaymentPayload = {
  name: string;
  amount: number;
  email: string;
};

type PaymentResponse = {
  redirectUrl: string;
};

async function requestPayment(payload: PaymentPayload) {
  const response = await fetch("/api/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Payment request failed");
  }

  return (await response.json()) as PaymentResponse;
}

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link href="/" aria-label="Kierunek">
          <Image
            className={styles.navLogo}
            src="/logo_black.svg"
            alt="Kierunek"
            width={825}
            height={148}
            priority
          />
        </Link>
      </div>
    </nav>
  );
}

function SupportForm() {
  const [status, setStatus] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [amount, setAmount] = useState<number | "">(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const numericAmount = Number(amount) || 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setShowLoader(true);
    setStatus("");

    try {
      const { redirectUrl } = await requestPayment({
        name: fullName,
        amount: numericAmount,
        email,
      });

      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      setShowLoader(false);
      setStatus("ERR");
    }
  };

  const handleAmountChange = (value: string) => {
    const sanitized = value.replace(/^0+/, "") || "0";
    const nextAmount = Number(sanitized);

    setAmount(nextAmount < 0 ? 0 : nextAmount);
  };

  return (
    <div className={styles.formWrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputs}>
          <div className={styles.inputBox}>
            <label className={styles.label} htmlFor="amount">
              Kwota
            </label>
            <input
              required
              className={`${styles.input} ${styles.amountInput}`}
              id="amount"
              type="number"
              value={amount}
              onChange={(event) => handleAmountChange(event.currentTarget.value)}
            />
            <span
              className={styles.currency}
              style={{ left: `${amount.toString().length * 0.92 + 0.3}ch` }}
            >
              zł
            </span>
            <div className={styles.amountButtons}>
              <button
                className={styles.decrease}
                type="button"
                aria-label="Zmniejsz kwotę"
                onClick={() => setAmount(numericAmount > 1 ? numericAmount - 1 : 1)}
              />
              <button
                className={styles.increase}
                type="button"
                aria-label="Zwiększ kwotę"
                onClick={() => setAmount(numericAmount + 1)}
              />
            </div>
          </div>

          <div className={styles.inputBox}>
            <label className={styles.label} htmlFor="name">
              Imię i nazwisko
            </label>
            <input
              required
              className={styles.input}
              id="name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.currentTarget.value)}
            />
          </div>

          <div className={styles.inputBox}>
            <label className={styles.label} htmlFor="email">
              E-mail
            </label>
            <input
              required
              className={styles.input}
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
          </div>
        </div>

        <a className={styles.rulesLink} href="/regulamin.html">
          Regulamin darowizn
        </a>

        {showLoader ? (
          <div className={styles.loader} aria-label="Ładowanie">
            <div />
            <div />
            <div />
            <div />
          </div>
        ) : (
          <button className={styles.submit} type="submit">
            wspieram
          </button>
        )}

        {status === "ERR" && (
          <p className={styles.error}>Coś poszło nie tak. Proszę spróbować ponownie.</p>
        )}
      </form>
    </div>
  );
}

function Account() {
  return (
    <div className={styles.account}>
      <h2>Numer konta</h2>
      <div>
        <p>KOŚCIÓŁ ZIELONOŚWIĄTKOWY ZBÓR &quot;KIERUNEK&quot; WE WROCŁAWIU</p>
      </div>
      <p>31 1090 2590 0000 0001 3939 1058</p>
    </div>
  );
}

export default function Wsparcie() {
  return (
    <main className={styles.wsparcie}>
      <Navbar />
      <section className={styles.container} data-position="top">
        <p className={styles.inspiration}>
          Dbamy o to, aby wszystko, co robimy, miało jak najwyższą jakość.
          Jeżeli podobają Ci się nasze działania i chcesz mieć w nich realny
          udział, zachęcamy do wsparcia finansowego.
        </p>
        <Image
          className={styles.bigLogo}
          src="/logo_black.svg"
          alt="Kierunek"
          width={825}
          height={148}
        />
      </section>
      <div className={styles.divider} />
      <section className={styles.container} data-position="bottom">
        <SupportForm />
      </section>
      <Account />
    </main>
  );
}
