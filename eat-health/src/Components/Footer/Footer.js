import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div>&copy; 2020 健康食分 EatHealth All Rights Reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
