# 🦜️🔗 LangChain-mini 

这是一个非常简单的重新实现 [LangChain](https://github.com/hwchase17/langchain) 的项目，只用了约100行代码。本质上，它是一款由LLM（GPT-3.5）驱动的聊天应用程序，能够使用工具（Google搜索和计算器）进行对话和回答问题。

这是一个例子：

~~~
Q: 魔方的世界纪录是多少？
目前，由中国选手王怡衡保持的魔方单次还原最快记录为4.69秒。
Q: 机器人能更快地解决它吗？
目前最快的机器人解决魔方的时间是0.637秒。
Q: 谁制造了这个机器人？
英飞凌公司创造了这个能在0.637秒内还原魔方的机器人。
Q: 一个普通人解决魔方需要多长时间？
一般来说，第一次解决魔方平均需要三个小时。
~~~

这并不是要取代LangChain，而是出于娱乐和教育目的而建立的。如果你对LangChain及类似工具的工作原理感兴趣，那么这是一个很好的起点。

有关此项目的更多信息，请阅读附带的博客文章 - [在100行代码中重新实现LangChain](https://blog.scottlogic.com/2023/05/04/langchain-mini.html)

## Running / developing

安装依赖项，并运行（需要 node >= v18）：

~~~
% npm install
~~~

您需要拥有OpenAI和SerpApi密钥。这些可以通过`.env`文件提供给应用程序：

~~~
OPENAI_API_KEY="..."
SERPAPI_API_KEY="..."
~~~

您现在可以运行链：

~~~
% node index.mjs
我能帮忙吗？谁是第一个登上月球的人？
尼尔·阿姆斯特朗。
~~~

详细过程
~~~
我能为您做些什么? 谁是第一个登上月球的人？
请尽力回答以下问题。您可以使用以下工具：

search: 一个搜索引擎。当你需要回答关于当前事件的问题时非常有用。输入应该是一个搜索查询。
calculator: 用于获取数学表达式的结果。此工具的输入应为可由简单计算器执行的有效数学表达式。

请使用以下格式：

Question: 你必须回答的输入问题
Thought: 你应该时刻想着该做什么
Action: 应该采取的行动之一是 [search]
Action Input: action 的输入
Observation: action 的输出结果
... (这个 Thought/Action/Action Input/Observation 可以重复 N 次)
Thought: 我现在知道最终答案了。
Final Answer: 原始输入问题的最终答案

Begin!

Question: 谁是第一个登上月球的人？
Thought:
 这可能是一个关于历史事件的问题，需要通过搜索引擎来获取答案。
Action: search 
Action Input: "Who was the first person to land on the moon?"

请尽力回答以下问题。您可以使用以下工具：

search: 一个搜索引擎。当你需要回答关于当前事件的问题时非常有用。输入应该是一个搜索查询。
calculator: 用于获取数学表达式的结果。此工具的输入应为可由简单计算器执行的有效数学表达式。

请使用以下格式：

Question: 你必须回答的输入问题
Thought: 你应该时刻想着该做什么
Action: 应该采取的行动之一是 [search]
Action Input: action 的输入
Observation: action 的输出结果
... (这个 Thought/Action/Action Input/Observation 可以重复 N 次)
Thought: 我现在知道最终答案了。
Final Answer: 原始输入问题的最终答案

Begin!

Question: 谁是第一个登上月球的人？
Thought: 这可能是一个关于历史事件的问题，需要通过搜索引擎来获取答案。
Action: search 
Action Input: "Who was the first person to land on the moon?"
Observation: On July 20, 1969, Neil Armstrong became the first human to step on the moon. He and Aldrin walked around for three hours.

Thought: 答案是 Neil Armstrong。
Final Answer: Neil Armstrong 是第一个登上月球的人。
Neil Armstrong 是第一个登上月球的人。
我能为您做些什么? 
~~~
