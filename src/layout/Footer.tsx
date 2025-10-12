import { footerStyles } from './classes';

export default function Footer() {
    return (
        <footer className={footerStyles.footerClass}>
            <div className={footerStyles.containerClass}>
                <p className={footerStyles.textClass}>
                    © {new Date().getFullYear()} SafeStore. All rights reserved.
                </p>
            </div>
        </footer>
    );
}