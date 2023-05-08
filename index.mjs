import env from "dotenv";
env.config();

import fs from "fs";
import { Parser } from "expr-eval";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
const rl = readline.createInterface({ input, output });

const promptTemplate = fs.readFileSync("prompt.txt", "utf8");
const mergeTemplate = fs.readFileSync("merge.txt", "utf8");

// 使用 serpapi 回答问题
const googleSearch = async (question) =>
  await fetch(
    `https://serpapi.com/search?api_key=${process.env.SERPAPI_API_KEY}&q=${question}`
  )
    .then((res) => res.json())
    .then(
      (res) =>
        // 尝试从响应的各个部分中提取答案
        res.answer_box?.answer ||
        res.answer_box?.snippet ||
        res.organic_results?.[0]?.snippet
    );

// 可用于回答问题的工具
const tools = {
  search: {
    description:
      "一个搜索引擎。当你需要回答关于当前事件的问题时非常有用。输入应该是一个搜索查询。",
    execute: googleSearch,
  },
  calculator: {
    description:
      "用于获取数学表达式的结果。此工具的输入应为可由简单计算器执行的有效数学表达式。",
    execute: (input) => Parser.evaluate(input).toString(),
  },
};

// 使用 GPT-3.5 完成给定的提示
const completePrompt = async (prompt) =>
  await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt,
      max_tokens: 256,
      temperature: 0.7,
      stream: false,
      stop: ["Observation:"],
    }),
  })
    .then((res) => res.json())
    .then((res) => res.choices[0].text)
    .then((res) => {
      console.log("\x1b[91m" + prompt + "\x1b[0m");
      console.log("\x1b[92m" + res + "\x1b[0m");
      return res;
    });

const answerQuestion = async (question) => {
  // 用我们的问题和链可以使用的工具构建提示
  let prompt = promptTemplate.replace("${question}", question).replace(
    "${tools}",
    Object.keys(tools)
      .map((toolname) => `${toolname}: ${tools[toolname].description}`)
      .join("\n")
  );

  // 允许 LLM 迭代直到找到最终答案
  while (true) {
    const response = await completePrompt(prompt);

    // 将此添加到提示中
    prompt += response;

    const action = response.match(/Action: (.*)/)?.[1];
    if (action) {
      // 执行 LLM 指定的 action
      const actionInput = response.match(/Action Input: "?(.*)"?/)?.[1];
      const result = await tools[action.trim()].execute(actionInput);
      prompt += `Observation: ${result}\n`;
    } else {
      return response.match(/Final Answer: (.*)/)?.[1];
    }
  }
};

// 将聊天记录与新问题合并
const mergeHistory = async (question, history) => {
  const prompt = mergeTemplate
    .replace("${question}", question)
    .replace("${history}", history);
  return await completePrompt(prompt);
};

// 主循环——回答用户的问题
let history = "";
while (true) {
  let question = await rl.question("我能为您做些什么? ");
  if (history.length > 0) {
    question = await mergeHistory(question, history);
  }
  const answer = await answerQuestion(question);
  console.log(answer);
  history += `Q:${question}\nA:${answer}\n`;
}
