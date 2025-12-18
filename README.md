# 🍲 Congolinaria Receitas  
Aplicativo oficial de receitas afro veganas  desenvolvido em **Expo + React Native**.  
Este app permite que usuários explorem pratos autênticos preparados pelo Chef Pitchou, com navegação simples e conteúdo totalmente offline.

---

## 📱 Funcionalidades

- ✔️ Interface leve e intuitiva  
- ✔️ Lista de receitas veganas baseadas na culinária do Congo  
- ✔️ Imagens de alta qualidade  
- ✔️ Leitura das receitas sem necessidade de internet  
- ✔️ Compatível com Android (Play Store)  
- ✔️ Build de produção via **EAS Build**  

---

## 🧱 Arquitetura do Projeto

recettes-app/
│
├── App.js # Arquivo principal da aplicação
├── app.json # Configurações do Expo
├── eas.json # Perfis de build do EAS
├── package.json # Dependências e scripts
│
├── assets/ # Ícones, imagens e splash screen
│ ├── icon.png
│ ├── splash.png
│ └── ...
│
├── android/ # Arquivos nativos gerados automaticamente
├── dist/ # Builds locais
│
└── node_modules/ # Dependências instaladas


---

## 🚀 Tech Stack

- **React Native**
- **Expo**
- **EAS Build**
- **JavaScript**

---

## 🛠️ Pré-requisitos

Antes de rodar o projeto, instale:

- Node.js (>= 18)
- npm ou yarn
- Expo CLI

---

## 📦 Instalação

Clone o repositório:

```bash
git clone https://github.com/<seu-usuario>/congolinaria-receitas.git
cd congolinaria-receitas


Instale as dependências:

npm install

▶️ Executar em ambiente de desenvolvimento

Iniciar o Expo:

npx expo start


Rodar direto no Android conectado:

npx expo run:android

🏗️ Gerar build para Android (.AAB)

Build de produção:

npx eas build -p android --profile production


Após concluir, o EAS fornecerá um link para download do arquivo .aab para envio ao Google Play Console.

⚙️ Configuração do Expo (app.json)
{
  "expo": {
    "name": "Congolinaria Receitas",
    "slug": "congolinaria-receitas",
    "version": "1.0.1",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },
    "android": {
      "package": "com.congolinaria.receitas",
      "versionCode": 1
    }
  }
}

⚙️ Configuração do EAS (eas.json)
{
  "cli": {
    "version": ">= 6.28.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}

📸 Capturas de Tela

(adicione imagens aqui quando subir no GitHub)

![Tela inicial](./screenshots/home.png)
![Receita](./screenshots/recipe.png)

📤 Publicação no Google Play

Fluxo de publicação:

Criar o app no Google Play Console

Preencher a ficha da loja (ícone, descrição, categoria, imagens, privacidade)

Enviar o .aab via Teste Interno

Resolver pendências

Solicitar acesso à produção

Publicar 🎉

🧪 Testes (opcional)

Sugeridos para versões futuras:

Jest

Testing Library

Detox (E2E)

🧩 Roadmap de Melhorias

🔧 API externa para atualizar receitas sem nova versão

⭐ Favoritar receitas

🔔 Push Notifications

👤 Login com Google/Apple

📋 Lista de compras integrada

👨‍🍳 Autor

Chef Pitchou Luhata – Congolinaria
Culinária vegana afro-congolesa no Brasil.

🛡️ Licença

Copyright © Congolinaria
Todos os direitos reservados.
O código não pode ser utilizado sem autorização.


---



