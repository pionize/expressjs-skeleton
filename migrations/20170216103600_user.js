
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('user', function(t) {
      t.increments('user_id').primary();
      t.string('name').defaultTo('').notNullable();
      t.string('password').defaultTo('').notNullable();
      t.string('email').unique().nullable();
      t.timestamp('created').nullable().defaultTo(knex.fn.now());
      t.timestamp('updated').nullable().defaultTo();

    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('user')
  ]);
};
