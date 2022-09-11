import React, { useState } from "react";
import type { NextPage } from "next";
import type { Todo } from "@prisma/client";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import TodoItem from "./_TodoItem";

export async function getServerSideProps() {
  const res = await fetch(`${process.env.API_URL}api/todos`);
  const todos = await res.json();

  return {
    props: { todos }, // will be passed to the page component as props
  };
}

const Home: NextPage<{ todos: Todo[] }> = ({ todos }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.set("done", formData.get("done") === "on" ? "true" : "false");
    const data = Object.fromEntries(formData);
    try {
      setIsLoading(true);
      const response = await fetch(`/api/todos`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      await router.replace(router.asPath);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>NextJS Todo App</title>
        <meta name="description" content="aaaaalalala polly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>NextJS Todo App</h1>

        <div className={styles.grid}>
          <form onSubmit={onSubmit} className={styles.card}>
            <label>
              Title
              <input name={"title"} type={"text"} required />
            </label>
            <label>
              Description
              <input name={"description"} type={"text"} required />
            </label>
            <label>
              <input name={"done"} type={"checkbox"} />
              Done
            </label>
            <button disabled={isLoading} type={"submit"}>Save</button>
          </form>
        </div>

        <div className={styles.grid}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} {...todo} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
