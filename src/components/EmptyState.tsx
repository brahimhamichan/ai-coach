import styles from "./EmptyState.module.css";

interface EmptyStateProps {
    title?: string;
    message: string;
    hint?: string;
    icon?: string;
}

export function EmptyState({ title, message, hint, icon }: EmptyStateProps) {
    return (
        <div className={styles.emptyState}>
            {icon && <div className={styles.icon}>{icon}</div>}
            {title && <h4 className={styles.title}>{title}</h4>}
            <p className={styles.message}>{message}</p>
            {hint && <p className={styles.hint}>{hint}</p>}
        </div>
    );
}
