const sqlite3 = require('sqlite3').verbose();

async function getChatHistory(number) {
	return new Promise((resolve, reject) => {
		let db = new sqlite3.Database('./chat.db');

		let sql = `SELECT
			datetime (message.date / 1000000000 + strftime ("%s", "2001-01-01"), "unixepoch", "localtime") AS message_date,
			message.text,
			message.is_from_me,
			chat.chat_identifier
		FROM
			chat
			JOIN chat_message_join ON chat. "ROWID" = chat_message_join.chat_id
			JOIN message ON chat_message_join.message_id = message. "ROWID"
		WHERE
			chat_identifier == '${number}'
		ORDER BY
			message_date ASC
		--LIMIT 10;`;

		db.all(sql, [], (err, rows) => {
			if (err) reject(err);

			resolve(rows);
		});

		db.close();
	});
}

module.exports = { getChatHistory };
