# Docusaurus — 호스팅 옵션별 배포 설정

| 플랫폼 | build | output | baseUrl | 301 | 설정 |
|---|---|---|---|---|---|
| **Cloudflare Pages** (권장) | `npm run build` | `build` | `/` | ✅ | 대시보드 |
| **Netlify** | (netlify.toml) | `build` | `/` | ✅ | `netlify.toml` |
| **GitHub Pages** | (자동) | `build` | `/aws-ps-tech-docusaurus/` | ❌ meta | workflow (DEPLOY_BASE_URL=/aws-ps-tech-docusaurus/) |

## Cloudflare Pages (권장)
- Connect to Git → `docusaurus`. Build: `npm run build`, Output: `build`. 환경변수 없음(루트). `static/_redirects` 자동 301.

## Netlify
- Import from Git → `docusaurus`. `netlify.toml` 자동 인식.

## GitHub Pages
- Settings→Pages→Source=GitHub Actions. workflow가 `DEPLOY_BASE_URL=/aws-ps-tech-docusaurus/` 주입.

> 루트 서빙(CF/Netlify)일 때만 `static/_redirects` 108개가 진짜 301로 동작합니다.
