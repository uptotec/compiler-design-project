import { useState } from 'react';
import { Scanner } from './scanner/scanner';
import { ParseNode, Token } from './scanner/types';
import { Parser } from './scanner/parser';
import Tree from 'react-d3-tree';

function App() {
  const [code, setCode] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [parseTree, setParseTree] = useState<ParseNode | null>(null);
  const [view, setView] = useState<'scanner' | 'parser'>('scanner');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const runScannerAndParser = () => {
    const { tokens, errors } = Scanner(code);
    setTokens(tokens);
    setErrors(errors);

    if (errors.length === 0) {
      try {
        const parseTree = Parser(tokens);
        console.log(parseTree);
        setParseTree(parseTree);
      } catch (e) {
        if (e instanceof Error) {
          setErrors([...errors, e.message]);
        }
      }
    } else {
      setParseTree(null);
    }
  };

  const generateLineNumbers = () => {
    const lines = code.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  };

  if (view === 'parser') {
    return (
      <div className="w-screen h-screen relative">
        <button
          type="button"
          onClick={() => setView('scanner')}
          className="absolute top-2 left-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          back
        </button>
        {parseTree && (
          <Tree
            data={parseTree}
            orientation="vertical"
            collapsible={false}
            zoom={0.5}
            translate={{ x: 930, y: 300 }}
          />
        )}
      </div>
    );
  } else {
    return (
      <div className="w-screen h-screen bg-gray-900 p-4">
        <div className="h-full flex gap-4">
          <div className="w-2/5 flex flex-col h-auto overflow-x-auto overflow-y-scroll shadow-md sm:rounded-lg bg-gray-800">
            <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800 flex justify-between items-center">
              TINY Code
              <div>
                <button
                  type="button"
                  onClick={runScannerAndParser}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Run
                </button>
                <button
                  type="button"
                  onClick={() => setView('parser')}
                  disabled={parseTree === null}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-500 disabled:focus:ring-gray-500"
                >
                  view parse Tree
                </button>
              </div>
            </caption>
            <div className="flex h-full px-4">
              <div className="w-16 h-full bg-slate-900 resize-none">
                <pre className="h-full m-0 p-2">{generateLineNumbers()}</pre>
              </div>
              <textarea
                className="flex-grow h-full p-2 resize-none bg-slate-800 focus:outline-none"
                value={code}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="w-2/5 shadow-md sm:rounded-lg overflow-y-scroll bg-gray-800">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                Lexeme to Tokens Table
              </caption>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Lexeme
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Token
                  </th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {token.value}
                    </th>
                    <td className="px-6 py-4">{token.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-1/5 shadow-md sm:rounded-lg overflow-y-scroll bg-gray-800">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                Errors List
              </caption>
              <tbody>
                {errors.map((error, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
