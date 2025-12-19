import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

function escapeHtml(str = '') {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function nl2br(text = '') {
  return escapeHtml(text).replace(/\n/g, '<br/>');
}
function getCoverImage(recipes, customCover) {
  if (customCover) return customCover;
  const withImage = recipes.find(r => r.imageUri);
  return withImage ? withImage.imageUri : null;
}


export async function exportCongolinariaNotebook({
  title = 'Congolinaria',
  subtitle = 'Caderno Culinário',
  recipes = [],
  customCoverImage = null,
}) {

 const coverImage = getCoverImage(recipes, customCoverImage);

  const today = new Date().toLocaleDateString('pt-BR');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: Georgia, serif;
      margin: 0;
      color: #1E1E1E;
    }

    /* CAPA */
   .cover {
  position: relative;
  height: 100vh;
  page-break-after: always;
}
.recipe-image {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 14px;
  margin-bottom: 24px;
  border: 1px solid #E8E1D8;
}

    .cover h1 {
      font-size: 48px;
      letter-spacing: 0.15em;
      margin: 0;
    }

    .cover h2 {
      font-size: 18px;
      font-weight: normal;
      margin-top: 12px;
      color: #E8D9A8;
    }

    .cover .date {
      margin-top: 40px;
      font-size: 14px;
      color: #F5F1E8;
    }


.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(14, 29, 20, 0.65);
  color: #C9A23F;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.cover-overlay h1 {
  font-size: 46px;
  letter-spacing: 0.15em;
  margin: 0;
}

.cover-overlay h2 {
  font-size: 18px;
  font-weight: normal;
  margin-top: 12px;
  color: #E8D9A8;
}

    /* RECEITAS */
    .recipe {
      padding: 60px;
      page-break-after: always;
    }

    .recipe h1 {
      font-size: 32px;
      margin-bottom: 6px;
    }

    .category {
      font-size: 14px;
      color: #777;
      margin-bottom: 28px;
    }

    h3 {
      margin-top: 32px;
      font-size: 18px;
      border-bottom: 1px solid #DDD;
      padding-bottom: 4px;
    }

    .text {
      font-size: 16px;
      line-height: 1.6;
      margin-top: 10px;
    }
      .toc {
  padding: 50px;
  page-break-after: always;
}

.toc h1 {
  font-size: 32px;
  margin-bottom: 24px;
}

.toc-item {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}

.toc-thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 12px;
  border: 1px solid #DDD;
}

.toc-title {
  font-size: 16px;
  font-weight: bold;
}

.toc-category {
  font-size: 13px;
  color: #777;
}

  </style>
</head>

<body>

  <!-- CAPA -->
 <div class="cover">
  ${
    coverImage
      ? `<img src="${coverImage}" class="cover-image" />`
      : ''
  }
  <div class="cover-overlay">
    <h1>${escapeHtml(title)}</h1>
    <h2>${escapeHtml(subtitle)}</h2>
    <div class="date">${today}</div>
  </div>
</div>

<div class="toc">
  <h1>Sumário</h1>

  ${recipes.map((r, i) => `
    <div class="toc-item">
      ${
        r.imageUri
          ? `<img src="${r.imageUri}" class="toc-thumb" />`
          : ''
      }
      <div>
        <div class="toc-title">${i + 1}. ${escapeHtml(r.title)}</div>
        <div class="toc-category">${escapeHtml(r.category || '')}</div>
      </div>
    </div>
  `).join('')}
</div>



  <!-- RECEITAS -->
 ${recipes
  .map(
    (r) => `
  <div class="recipe">

    ${
      r.imageUri
        ? `<img src="${r.imageUri}" class="recipe-image" />`
        : ''
    }

    <h1>${escapeHtml(r.title)}</h1>
    <div class="category">${escapeHtml(r.category || '')}</div>

    <h3>Ingredientes</h3>
    <div class="text">${nl2br(r.ingredients)}</div>

    <h3>Modo de preparo</h3>
    <div class="text">${nl2br(r.preparation)}</div>

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
