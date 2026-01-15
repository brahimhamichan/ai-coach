"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

export function Navigation() {
    const pathname = usePathname();

    return (
        <nav className={styles.nav}>
            <Link href="/" className={styles.brand}>
                ⚡ Coach
            </Link>
            <div className={styles.links}>
                <Link
                    href="/"
                    className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
                >
                    Dashboard
                </Link>
                <Link
                    href="/settings"
                    className={`${styles.link} ${pathname === "/settings" ? styles.active : ""}`}
                >
                    Settings
                </Link>
                <Link
                    href="/debug"
                    className={`${styles.link} ${pathname === "/debug" ? styles.active : ""}`}
                >
                    Debug
                </Link>
            </div>
        </nav>
    );
}
