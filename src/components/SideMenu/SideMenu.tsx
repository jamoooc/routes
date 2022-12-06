import classes from "./sidemenu.module.css";

export default function SideMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return !open ? (
    <></>
  ) : (
    <>
      <div
        className={classes.backgroundContainer}
        onClick={() => setOpen(false)}
      ></div>
      <div className={classes.menuContainer}>
        <section className={classes.section}>
          <div className={classes.container}>
            <div className={classes.iconContainer}>
              <button
                className={classes.closeButton}
                onClick={() => setOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={classes.svg}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
                  />
                </svg>
              </button>
            </div>
            <div className={classes.headerContainer}>
              <h2 className={classes.aboutHeader}>About</h2>
            </div>
          </div>
          <p className={classes.aboutText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </section>
      </div>
    </>
  );
}
