import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src/presentation/pages');
const pages = ['About.tsx', 'Directory.tsx', 'Documents.tsx', 'Home.tsx', 'MapPage.tsx', 'News.tsx', 'Statistics.tsx'];

pages.forEach(page => {
    const filePath = path.join(pagesDir, page);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    // Add import if not exists
    if (!content.includes("import { Header } from '../components/Header';")) {
        // Find the last import statement or the beginning of the file
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const endOfLine = content.indexOf('\n', lastImportIndex);
            content = content.substring(0, endOfLine + 1) + "import { Header } from '../components/Header';\n" + content.substring(endOfLine + 1);
        } else {
            content = "import { Header } from '../components/Header';\n" + content;
        }
    }

    // Replace <header>...</header> with <Header />
    content = content.replace(/<header[\s\S]*?<\/header>/g, '<Header />');

    // Remove old modal imports and components from Home.tsx
    if (page === 'Home.tsx') {
        content = content.replace(/import { RegistrationModal } from '\.\.\/components\/RegistrationModal';\n/, '');
        content = content.replace(/import { LoginModal } from '\.\.\/components\/LoginModal';\n/, '');
        content = content.replace(/const \[isRegisterOpen, setIsRegisterOpen\] = useState\(false\);\n?\s*/, '');
        content = content.replace(/const \[isLoginOpen, setIsLoginOpen\] = useState\(false\);\n?\s*/, '');

        // Remove the rendered modals at the bottom
        content = content.replace(/<LoginModal[\s\S]*?\/>\s*<RegistrationModal[\s\S]*?\/>/, '');
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${page}`);
});
