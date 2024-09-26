"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import { OpenAI } from "openai";
import Markdown from "react-markdown";

export default function Home() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [currentThread, setCurrentThread] = useState<
    | (OpenAI.Beta.Threads.Thread & {
        _request_id?: string | null;
      })
    | null
  >();

  async function generatePrompts(threadId: string, prompt: string) {
    const completion = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: [
        {
          text: prompt,
          type: "text",
        },
      ],
    });
    return completion;
  }

  const handleSend = () => {
    if (input.trim() !== "" && currentThread) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");

      generatePrompts(currentThread.id, input).then(async (response) => {
        const _response = await openai.beta.threads.runs.create(
          currentThread.id,
          {
            assistant_id: process.env.ASSISTANT_ID ?? "",
          }
        );

        const pollingInterval = setInterval(async () => {
          const runObject = await openai.beta.threads.runs.retrieve(
            currentThread.id,
            _response.id
          );

          const status = runObject.status;

          if (status === "completed") {
            clearInterval(pollingInterval);

            const messagesList = await openai.beta.threads.messages.list(
              currentThread.id
            );

            const parsedURL = JSON.parse(
              messagesList.data[0].content[0].text.value
            ) as {
              base: string;
              params: Record<string, string>;
            };

            const combinedURL = `${parsedURL.base}?${new URLSearchParams(
              parsedURL.params
            ).toString()}`;

            console.log(parsedURL, combinedURL);

            const response = await fetch(
              `https://openapi.taptools.io/api/v1${combinedURL}`,
              {
                headers: {
                  "x-api-key": process.env.TAPTOOLS_API_KEY ?? "",
                },
              }
            );
            const data = await response.json();

            console.log(data);
            const completion = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a simple assistant that explains the data in 2 sentences",
                },
                {
                  role: "user",
                  content: `${combinedURL}\n\n${JSON.stringify(data)}`,
                },
              ],
            });

            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: completion.choices[0].message.content as string,
                sender: "bot",
              },
            ]);
          }
        }, 5000);

        console.log(_response);
      });
    }
  };

  useEffect(() => {
    const createThread = async () => {
      const thread = await openai.beta.threads.create();

      setCurrentThread(thread);
    };

    createThread();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient">
      <div className="relative flex flex-col w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <div className="flex-1 overflow-y-auto p-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.sender === "bot" ? "text-left" : "text-right"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  message.sender === "bot" ? "bg-gray-200" : "bg-blue-200"
                }`}
              >
                <div className="text-sm">
                  <Markdown>{message.text}</Markdown>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="w-full mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
        <div className="absolute -right-[105px] top-0">
          <Image src={"/robot.png"} width={150} height={150} alt="Robot" />
        </div>
      </div>
    </div>
  );
}
