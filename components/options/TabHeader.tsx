import styles from './TabHeader.module.css';

interface Props {
  title: string;
  lead: string;
}

export function TabHeader({ title, lead }: Props) {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.h1}>{title}</h1>
      <p className={styles.lead}>{lead}</p>
    </div>
  );
}
