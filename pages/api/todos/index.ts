import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../prisma/db";
import Filter from "bad-words";
import { Todo } from "@prisma/client";
import { transformBoolean } from "../../../utils";

const filter = new Filter();

const cleanData = (validatedData: Omit<Todo, "id"> & { id?: number }) => {
  validatedData.title = filter.clean(validatedData.title);
  if (validatedData.description) {
    validatedData.description = filter.clean(validatedData.description || "");
  }
  return validatedData;
};

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
    db.todo
      .create({ data: cleanData(JSON.parse(body, transformBoolean)) })
      .then((todo) => {
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
        data: cleanData(data),
      })
      .then((todo) => {
        return res.status(201).json(todo);
      });
  } catch (e) {
    return res.status(400);
  }
}
