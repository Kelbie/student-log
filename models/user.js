exports.create = async function(id) {
  await client.query(
    `
        INSERT INTO users (
            id
        ) VALUES (
            $1
        ) ON CONFLICT
            DO NOTHING
    `,
    [id]
  );
};
