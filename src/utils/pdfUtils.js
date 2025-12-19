import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export async function exportCollectionToPDF(collection, recipes) {
  const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Georgia; margin: 40px; color: #1F1F1F; }
        h1 { text-align: center; margin-bottom: 40px; }
        h2 { margin-top: 40px; }
        .recipe { page-break-after: always; }
        .meta { color: #777; font-size: 13px; }
      </style>
    </head>
    <body>
      <h1>${collection.name}</h1>

      ${recipes
        .map(
          (r) => `
        <div class="recipe">
          <h2>${r.title}</h2>
          <div class="meta">${r.category || ''}</div>

          <h3>Ingredientes</h3>
          <p>${r.ingredients.replace(/\n/g, '<br/>')}</p>

          <h3>Modo de preparo</h3>
          <p>${r.preparation.replace(/\n/g, '<br/>')}</p>
        </div>
      `
        )
        .join('')}
    </body>
  </html>
  `;

  const file = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(file.uri);
}
