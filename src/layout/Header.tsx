import { Shield } from 'lucide-react';
import { headerStyles } from './styles';

export default function Header() {
    return (
        <header className={headerStyles.headerClass}>
            <div className={headerStyles.containerClass}>
                <div className={headerStyles.flexClass}>
                    <div className={headerStyles.brandClass}>
                        <div className="flex-shrink-0">
                            <Shield className={headerStyles.iconClass} />
                        </div>
                        <h1 className={headerStyles.titleClass}>SafeStore</h1>
                        <h1 className={headerStyles.mobileTitleClass}>SS</h1>
                    </div>
                </div>
            </div>
        </header>
    );
}
