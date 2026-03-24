import fs from 'fs/promises';

const routes = ['/', '/cartelas'];

const BASE_OUTPUT = 'dist/bingo-app/browser';

for (const route of routes) {
  const url = `http://localhost:4000${route}`;
  const res = await fetch(url);
  const html = await res.text();

  const filePath =
    route === '/'
      ? `${BASE_OUTPUT}/index.html`
      : `${BASE_OUTPUT}${route}/index.html`;

  await fs.mkdir(filePath.replace('/index.html', ''), { recursive: true });
  await fs.writeFile(filePath, html);

  console.log('Gerado:', filePath);
}