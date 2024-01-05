
### 💜 Olá! Aqui está um projeto que desenvolvi para o "Fresh&Fit", um estabelecimento no CidadeAltaRP. O sistema foi criado integralmente por mim:

[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/_gui1/)

#### 📌 Se precisarem de suporte, estou à disposição. Basta me chamar na mensagem direta (DM), Criei um tópico no Imgur explicando cada função do bot por meio de imagens. Acesse pelo LINK: https://imgur.com/a/xNDVptL

#### ⚠️ Como o ```package.json``` está configurado com as bibliotecas basta abrir o console e digitar o comando abaixo:
```npm install```

#### 🔍 Enfrentando problemas com a instalação das bibliotecas ? Use:

```npm install better-sqlite3 discord.js dotenv moment moment-duration-format quick.db```

#### ⚠️ Em alguns casos o pacote ```better-sqlite3``` pode apresentar erro ao tentar instalar, para resolver basta criar uma nova pasta fora do projeto abrir o console e digitar ```npm init``` de enter, tente instalar na pasta apenas o ```better-sqlite3``` se instalar normalmente basta pegar ```node_modules``` e transferir para pasta do projeto.

## 📜 Funções do Bot

 #### **1.** *Ele registra uma tabela de horas de trabalho semanal no banco de dados e realiza a sincronização.*

#### **2.** *Após o usuário acionar o comando "/ponto", inicia-se a contagem. Vale ressaltar que o sistema possui um cronômetro de 8 horas, que, ao ser concluído, encerra automaticamente o registro de ponto, resultando na perda das horas trabalhadas. Essa configuração pode ser modificada no arquivo "util/ponto.js".*

#### **3.** *Ao ser concluído, o sistema envia uma mensagem incorporada (embed) no chat. Isso permite a apresentação eficiente de informações ou resultados relacionados à execução do processo. Personalizações podem ser feitas no arquivo "util/ponto.js".*

#### **4.** *Ao concluir, o sistema envia uma mensagem incorporada (embed) no chat privado. Essa abordagem foi escolhida para permitir que o usuário mantenha registro dos pontos em aberto de maneira mais pessoal e acessível. O arquivo para ajustes relacionados a essa funcionalidade está em "util/ponto.js".*

#### **5.** *Todos têm acesso à visualização de seus próprios perfis!*

#### **6.** *É possível redefinir as cargas horárias semanais de todos os usuários. Importante destacar que apenas as cargas horárias "semanais" são suscetíveis a reset, enquanto a carga horária "total" no perfil permanece inalterada, podendo ser apagada somente mediante a exclusão do banco de dados.*

#### **7.** *Existe a opção de redefinir a carga horária semanal de um indivíduo específico. Importante notar que essa ação se aplica exclusivamente à carga horária "semanal", enquanto a carga horária "total" no perfil permanece inalterada e só pode ser apagada ao excluir o banco de dados.*

#### **8.** *O sistema de perfil permite que os responsáveis monitorem os pontos individualmente, verificando se a pessoa está em serviço ou não. Cada usuário tem acesso ao próprio perfil, enquanto os responsáveis têm a capacidade de visualizar e monitorar os pontos de cada indivíduo de forma separada.*
