INSERT INTO tasks (id, title, description, createdAt, updatedAt, deadlineDate, status, priority, color, userId)
VALUES ($1,$2,$3,$4,NOW(),$5,$6,$7,$8,$9)
RETURNING *;
