import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src/presentation/pages');
const pages = ['About.tsx', 'Directory.tsx', 'Documents.tsx', 'Home.tsx', 'MapPage.tsx', 'News.tsx', 'Statistics.tsx'];

pages.forEach(page => {
    const filePath = path.join(pagesDir, page);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    content = content.replace(/import { ThemeToggle } from '\.\.\/components\/ThemeToggle';\n/g, '');

    if (page === 'Home.tsx') {
        content = content.replace(/import React, { useEffect, useState } from 'react';/, "import React, { useEffect } from 'react';");
    }

    fs.writeFileSync(filePath, content);
    console.log(`Cleaned imports in ${page}`);
});
