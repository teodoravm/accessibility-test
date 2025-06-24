import { FocusManager, SkipToContent } from "../a11y-content";

type NavBarProps = {
    setShowHelp: (show: boolean) => void;
};

const NavBar: React.FC<NavBarProps> = ({ setShowHelp }) => {
    return (
            <nav className="nav-bar" tabIndex={0}>
                <SkipToContent targetElementId="title" />
                <ul className="nav-list" role="group">
                    <li className="nav-item" role="button" tabIndex={0}>
                        Home
                    </li>
                    <li className="nav-item" role="button" tabIndex={0}>
                        Settings
                    </li>
                    <li className="nav-item" role="button" tabIndex={0}>
                        Exit
                    </li>
                    <li
                        id="helpBtn"
                        className="nav-item"
                        onClick={() => setShowHelp(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setShowHelp(true);
                            }
                        }}
                        role="button"
                        tabIndex={0}
                    >
                        Help
                    </li>
                </ul>
            </nav>
    );
};

export default NavBar;
