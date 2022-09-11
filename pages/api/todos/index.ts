import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../prisma/db";
import { Todo } from "@prisma/client";
import { transformBoolean } from "../../../utils";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return listTodos(res);
    case "POST":
      return createTodo(req, res);
    case "PATCH":
      return updateTodo(req, res);
  }
  res.status(200).json({ name: "John Doe" });
}

function listTodos(res: NextApiResponse<Todo[]>) {
  db.todo.findMany().then((todos) => {
    return res.json(todos);
  });
}

function createTodo(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;
  try {
    db.todo.create({ data: JSON.parse(body, transformBoolean) }).then((todo) => {
      return res.status(201).json(todo);
    });
  } catch (e) {
    return res.status(400);
  }
}

function updateTodo(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;
  try {
    const data = JSON.parse(body, transformBoolean);
    db.todo
      .update({
        where: { id: data.id },
        data,
      })
      .then((todo) => {
        return res.status(201).json(todo);
      });
  } catch (e) {
    return res.status(400);
  }
}
