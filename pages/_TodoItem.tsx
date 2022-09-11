import React, { FC, useRef, useState } from "react";
import { Todo } from "@prisma/client";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

const TodoItem: FC<Todo> = ({ ...todo }) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const patchTodoToAPI = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      formData.set("done", formData.get("done") === "on" ? "true" : "false");
      const data = Object.fromEntries(formData);
      try {
        setIsLoading(true);
        await fetch(`/api/todos/${todo.id} `, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        await router.replace(router.asPath);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form className={styles.card} ref={formRef}>
      <label>
        <input
          type={"checkbox"}
          name={"done"}
          checked={todo.done || false}
          onChange={patchTodoToAPI}
        />
        Done
      </label>
      <label>
        Title
        <input
          name={"title"}
          type={"text"}
          defaultValue={todo.title}
          onBlur={patchTodoToAPI}
          required
        />
      </label>
      <label>
        Description
        <input
          name={"description"}
          type={"text"}
          defaultValue={todo.description || ""}
          onBlur={patchTodoToAPI}
          required
        />
      </label>
      {isLoading ? <div className={styles["loading-overlay"]} /> : null}
    </form>
  );
};

export default TodoItem;
