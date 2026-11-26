# 🚲 PedalBook

Rede social para ciclistas — esqueleto inicial no estilo Facebook.

## Stack
- **client/** — React 18 + Vite + React Router
- **server/** — Node.js + Express, autenticação JWT, banco em memória persistido em `server/data.json` (trocar por banco real depois)

## Como rodar
```bash
npm install
npm run dev
```
- Front: http://localhost:5173
- API: http://localhost:3001/api

Usuários de exemplo (senha `123456`): `ana@pedal.com`, `beto@pedal.com`.
Para resetar os dados, apague `server/data.json`.

## Funcionalidades (equivalência com o Facebook)
| Facebook      | PedalBook                                   |
|---------------|---------------------------------------------|
| Feed          | Feed com posts seus e dos amigos            |
| Curtir        | "Pedalar junto" 🚴                           |
| Comentários   | Comentários nos posts                       |
| Perfil        | Perfil com bio, cidade, amigos e garagem    |
| Amigos        | Adicionar/desfazer amizade                  |
| Grupos        | Grupos com feed próprio                     |
| Eventos       | **Pedais**: data, local, distância, nível   |
| —             | **Garagem**: cadastro das suas bicicletas   |

## Rotas da API
| Método | Rota | Descrição |
|---|---|---|
| POST | /auth/register, /auth/login | Cadastro / login |
| GET | /auth/me | Usuário logado |
| GET | /users?q= , /users/:id | Busca / perfil |
| PATCH | /users/me | Editar perfil |
| POST | /users/:id/friend | Alternar amizade |
| GET/POST | /posts (?authorId=, ?groupId=) | Feed / publicar |
| DELETE | /posts/:id | Excluir post |
| POST | /posts/:id/like, /posts/:id/comments | Curtir / comentar |
| GET/POST | /groups, /groups/:id, /groups/:id/join | Grupos |
| GET/POST | /rides, /rides/:id/join | Pedais (eventos) |
| GET/POST/DELETE | /bikes/mine, /bikes, /bikes/:id | Garagem |

## Próximos passos sugeridos
- Banco de dados real (PostgreSQL + Prisma, por exemplo)
- Upload de fotos
- Solicitações de amizade (pendente/aceita) e notificações
- Chat (Messenger) em tempo real
- Mapa das rotas dos pedais (Leaflet/OpenStreetMap) e integração com Strava
- Marketplace de bikes e peças
