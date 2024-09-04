import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Welcome to My Dashboard</h1>
      <nav className={styles.nav}>
        <ul>
          <li><a href="/planets">Planets</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li><a href="/calendar">Calendar</a></li>
          <li><a href="/board">The Board</a></li>
        </ul>
      </nav>
    </main>
  );
}
