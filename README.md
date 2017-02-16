### Dev Notes

#### Setup di local environment

- Clone dari repository.
- Install dependency: `npm install`.
- Install global dependency: `npm install -g knex gulp`.
- Bikin config baru `touch .config.js`, lalu edit isinya (template-nya ada di `.config.js.example`).
- Eksekusi migration script `knex --knexfile=.db.js migrate:latest`.
- Bikin migration script baru kalau ada perubahan skema database `knex --knexfile=.db.js migrate:make {NAMA_SCRIPT-NYA}`, lalu edit file-nya.
- Eksekusi migration script-nya lagi `knex --knexfile=.db.js migrate:latest`.
- Test fungsi rollback-nya pake `knex --knexfile=.db.js migrate:rollback` (cek apakah rollback script-nya masih error ato perlu dibenerin).
- Test `npm test`
- Jalanin servernya pake `npm start` atau `DEBUG=gethired-api:* ./bin/start`, atau set environment di file .env

#### Generate Konten DB

- Untuk bikin seed script `knex --knexfile=.db.js seed:make NAMA_SEED-NYA`
- Untuk eksekusi script-nya `knex --knexfile=.db.js seed:run`
