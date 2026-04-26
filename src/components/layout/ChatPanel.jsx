import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

function ChatPanel() {

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputSubmit = async (e) => {
    e.preventDefault();

    const value = inputMessage.trim();
    if (!value || isLoading) return;

    setMessages(prev => [...prev, { text: value, sender: "user" }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/llm/query-chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query: value }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Server error");
      }
      
      const { apiResponse } = await res.json();
      const message = apiResponse.output.find(item => item.type === "message");
      const reply = message.content[0].text;

      setMessages(prev => [...prev, { text: reply, sender: "ai" }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: err.message || "Something went wrong.", sender: "ai" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="flex-1 min-h-0 bg-[#0d1117] border-l border-[#30363d] flex flex-col">

      <div className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-3">

        {messages.length ? (
          messages.map((mssg, index) => (
            <div
              key={index}
              className={`
                max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap break-words
                ${mssg.sender === "ai"
                  ? "bg-blue-600 text-white self-start"
                  : "bg-blue-900 text-white self-end"}
              `}
            >
              {mssg.text}
            </div>
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-xs text-[#8b949e]">
              AI can make mistakes. User discretion is advised.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="bg-blue-600 text-white self-start px-3 py-2 rounded-lg text-sm animate-pulse">
            Thinking...
          </div>
        )}

      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2">
          <form
            onSubmit={handleInputSubmit}
            className="flex items-center gap-2 w-full"
          >
            <input
              type="text"
              value={inputMessage}
              placeholder="Ask AI about these papers..."
              className="flex-1 bg-transparent text-md text-white outline-none"
              onChange={e => setInputMessage(e.target.value)}
              disabled={isLoading}
            />

            <button type="submit" disabled={isLoading || !inputMessage.trim()}>
              <SendHorizontal size={17} />
            </button>
          </form>
        </div>
      </div>

    </aside>
  );
}

export default ChatPanel;