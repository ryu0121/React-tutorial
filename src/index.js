import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// onClick = {} の中括弧はhtmlにJSを埋め込む時の用法。
// その中には無名関数を渡す。(プレーンJSの知識)
// 今回の場合は、「() => handleClick(i)」という関数が入っている
const Square = (props) => {
  return (
    <button
      className="square"
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}

const Board = (props) => {
  const renderSquare = (i) => {
    return (
      <Square
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

const Game = () => {
  const [history, setHistory] = React.useState([{ squares: Array(9).fill(null) }]);
  const [xIsNext, setXIsNext] = React.useState(true);
  const [stepNumber, setStepNumber] = React.useState(0);

  const copiedHistory = history;
  const current = copiedHistory[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((_step, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    )
  })

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }

  const handleClick = (i) => {
    // そのまま代入すると、同じメモリアドレスを指す配列になってしまう。
    const copiedHistory = history.slice(0, stepNumber + 1);
    const current = copiedHistory[stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    console.log(i);
    // concat だとイミュータブルだから元の配列が壊れない。
    setHistory(copiedHistory.concat([{
      squares: squares,
    }]));
    setStepNumber(copiedHistory.length);
    setXIsNext(!xIsNext);
  }

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

ReactDOM.render(<Game />, document.getElementById("root"));


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}