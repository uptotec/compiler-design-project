import { useState } from 'react';
import { Scanner } from './scanner/scanner';
import { Token } from './scanner/types';

function App() {
  const [code, setCode] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const runScanner = () => {
    const { tokens, errors } = Scanner(code);
    setTokens(tokens);
    setErrors(errors);
  };

  return (
    <div className="w-screen h-screen bg-gray-900 p-4">
      <div className="h-full flex gap-4">
        <div className="w-2/5 flex flex-col h-auto overflow-x-auto shadow-md sm:rounded-lg bg-gray-800">
          <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800 flex justify-between items-center">
            TINY Code
            <button
              type="button"
              onClick={runScanner}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Run
            </button>
          </caption>
          <textarea
            className="bg-gray-800 text-white h-full p-4 mx-5 mb-5 border border-white rounded-lg"
            value={code}
            onChange={handleChange}
          ></textarea>
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

export default App;
