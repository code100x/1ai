import React, { useState, useRef } from 'react';
import { ChatService, ChatRequest } from './chat-service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatExample() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    // Create assistant message that will be updated with streaming content
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: ''
    };

    setMessages(prev => [...prev, assistantMessage]);

    const request: ChatRequest = {
      message: userMessage.content,
      model: 'gpt-3.5-turbo', // or whatever model you want to use
      // conversationId: 'optional-conversation-id' // if you want to continue a conversation
    };

    await ChatService.streamChat(
      request,
      // onChunk - called for each piece of content
      (content: string) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: msg.content + content }
              : msg
          )
        );
      },
      // onDone - called when streaming is complete
      () => {
        setIsLoading(false);
        console.log('Streaming completed');
      },
      // onError - called if an error occurs
      (errorMessage: string) => {
        setError(errorMessage);
        setIsLoading(false);
        // Remove the incomplete assistant message on error
        setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
      },
      // signal - for aborting the request
      abortControllerRef.current.signal
    );
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        {isLoading ? (
          <button
            type="button"
            onClick={handleStop}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}

// Example of using other methods from ChatService:

export async function ExampleUsageOfOtherMethods() {
  try {
    // Get user credits
    const creditsInfo = await ChatService.getUserCredits();
    if (creditsInfo) {
      console.log(`Credits: ${creditsInfo.credits}, Premium: ${creditsInfo.isPremium}`);
    }

    // Get conversations list
    const conversations = await ChatService.getConversations();
    if (conversations) {
      console.log('Conversations:', conversations);
    }

    // Get specific conversation
    if (conversations && conversations.length > 0) {
      const conversation = await ChatService.getConversation(conversations[0].id);
      if (conversation) {
        console.log('Conversation details:', conversation);
      }
    }
  } catch (error) {
    console.error('Error using ChatService methods:', error);
  }
}
