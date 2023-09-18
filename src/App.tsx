import { useState } from 'react';
import './App.css';

const gridSize = 9;

function App() {
  const [sudokuArray, setSudokuArray] = useState<any[][]>(Array.from({ length: gridSize }, () => Array(gridSize).fill(0)));
  const [isSolved, setIsSolved] = useState(false);


  const handleInputChange = (row: number, col: number, value: number) => {
    const newArray = [...sudokuArray];
    newArray[row][col] = value;
    setSudokuArray(newArray);
  };

  const solveSudoku = async () => {
    const solvedArray = solveSudokuHelper([...sudokuArray]);
    if (solvedArray) {
      setSudokuArray(solvedArray);
      setIsSolved(true); // Puzzle solved
    } else {
      alert("No solution exists for the given Sudoku puzzle.");
    }
  };
  

  const solveSudokuHelper = (board: number[][]): number[][] | null => {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(board, row, col, num)) {
              board[row][col] = num;
              const result = solveSudokuHelper(board);
              if (result) {
                return result; // Puzzle solved
              }
              board[row][col] = 0; // Backtrack
            }
          }
          return null; // No valid number found
        }
      }
    }
    return board; // All cells filled
  };

  const isValidMove = (board: number[][], row: number, col: number, num: number): boolean => {
    for (let i = 0; i < gridSize; i++) {
      if (board[row][i] === num || board[i][col] === num) {
        return false; // Conflict found
      }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) {
          return false; // Conflict found
        }
      }
    }
    return true; // No conflicts found
  };

  const resetBoard = () => {
    const emptyBoard = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    setSudokuArray(emptyBoard);
    setIsSolved(false); // Reset the solved state
  };
  

  
  

  return (
    <div className="App">
      <h1>Sudoku Solver</h1>
      <div className="sudoku-container">
        <table>
          <tbody id="sudoku-grid">
            {sudokuArray.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, colIndex) => (
                  <td key={colIndex}>
                    <input
  type="number"
  className={`cell ${value !== 0 ? 'user-input' : ''} ${isSolved ? 'solved' : ''}`}
  value={value}
  onChange={(e) => handleInputChange(rowIndex, colIndex, parseInt(e.target.value) || 0)}
/>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={solveSudoku}>Solve Puzzle</button>
      <button onClick={resetBoard}>Reset Board</button>
    </div>
  );
}

export default App;
