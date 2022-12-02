import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../prisma/db";
import Filter from 'bad-words';
import { Todo } from "@prisma/client";
import { transformBoolean } from "../../../utils";

const filter = new Filter();

const cleanData = (validatedData: Omit<Todo, 'id'> & { id?: number }) => {
  validatedData.title = filter.clean(validatedData.title);
  if (validatedData.description) {
    validatedData.description = filter.clean(validatedData.description || "");
  }
  return validatedData;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getTodo(req, res);
    case "PATCH":
      return updateTodo(req, res);
  }
  res.status(200).json({ name: "John Doe" });
}

function getTodo(req: NextApiRequest, res: NextApiResponse<Todo>) {
  const { id } = req.query;

  try {
    db.todo
      .findFirstOrThrow({ where: { id: parseInt(id ? id[0] : "") } })
      .then((todo) => {
        return res.json(todo);
      });
  } catch {
    return res.status(404);
  }
}

function updateTodo(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;
  const { id } = req.query;
  try {
    const data = JSON.parse(body, transformBoolean);
    data.id = parseInt(id ? id[0] : "");
    db.todo
      .update({
        where: { id: data.id },
        data: cleanData(data),
      })
      .then((todo) => {
        return res.status(200).json(todo);
      });
  } catch (e) {
    return res.status(400);
  }
}
