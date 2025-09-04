UPDATE tasks
  SET title = $1,
    description = $2,
    deadlineDate = $3,
    status = $4,
    priority = $5,
    color = $6,
    updatedAt = NOW()
  WHERE id = $7 AND userid = $8
RETURNING *