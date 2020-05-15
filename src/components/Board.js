import React, { Component } from "react";
import Block from "./Block";
const BOARD_SIZE = 9;
export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      solving: false,
      sudoku: [
        [8, 7, 6, 9, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 6, 0, 0, 0],
        [0, 4, 0, 3, 0, 5, 8, 0, 0],
        [4, 0, 0, 0, 0, 0, 2, 1, 0],
        [0, 9, 0, 5, 0, 0, 0, 0, 0],
        [0, 5, 0, 0, 4, 0, 3, 0, 6],
        [0, 2, 9, 0, 0, 0, 0, 0, 8],
        [0, 0, 4, 6, 9, 0, 1, 7, 3],
        [0, 0, 0, 0, 0, 1, 0, 0, 4],

        // [0, 0, 5, 0, 0, 6, 7, 4, 0],
        // [7, 0, 8, 0, 0, 4, 0, 0, 6],
        // [0, 4, 6, 7, 0, 3, 0, 0, 0],
        // [6, 0, 0, 2, 0, 0, 0, 3, 4],
        // [4, 0, 0, 6, 3, 7, 0, 0, 0],
        // [2, 0, 0, 0, 9, 5, 6, 1, 7],
        // [0, 6, 0, 1, 0, 9, 0, 0, 0],
        // [0, 0, 1, 5, 4, 0, 0, 0, 0],
        // [0, 0, 0, 0, 0, 0, 1, 0, 0],
      ],
    };
    this.mutableSudoku = [];
    this.solved = null;
    this.paintInterval = null;
    this.paintIndex = 0;
    this.count = 0;
  }
  componentDidMount() {
    this.mutableSudoku = JSON.parse(JSON.stringify(this.state.sudoku));
  }

  possible = (x, y, n) => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (this.mutableSudoku[x][i] === n) return false;
    }
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (this.mutableSudoku[i][y] === n) return false;
    }

    let sqRoot = Math.sqrt(BOARD_SIZE);
    let isSquare = sqRoot % 1 === 0;

    if (isSquare) {
      let blockX = Math.floor(x / sqRoot) * sqRoot;
      let blockY = Math.floor(y / sqRoot) * sqRoot;

      for (let i = 0; i < sqRoot; i++) {
        for (let j = 0; j < sqRoot; j++) {
          if (this.mutableSudoku[blockX + i][blockY + j] === n) return false;
        }
      }
    }
    return true;
  };

  solve = () => {
    this.setState({ solving: true });
    this.solveSudoku();
    this.paint();
  };

  paint = async () => {
    this.paintInterval = setInterval(() => {
      let { sudoku } = this.state;

      let rowNo = Math.floor(this.paintIndex / BOARD_SIZE);
      let columnNo = this.paintIndex % BOARD_SIZE;

      if (this.paintIndex >= BOARD_SIZE * BOARD_SIZE) {
        clearInterval(this.paintInterval);
        this.paintIndex = 0;
        return;
      }
      sudoku[rowNo][columnNo] = this.solved[rowNo][columnNo];

      this.setState({ sudoku });

      this.paintIndex++;
    }, 50);
  };
  solveSudoku = async () => {
    console.log(this.count++);
    // if (this.solved) return;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (this.mutableSudoku[i][j] === 0) {
          for (let n = 1; n < BOARD_SIZE + 1; n++) {
            if (this.possible(i, j, n)) {
              this.mutableSudoku[i][j] = n;

              this.solveSudoku();
              this.mutableSudoku[i][j] = 0;
            }
          }
          return;
        }
      }
    }

    // if (!this.solved)
    this.solved = JSON.parse(JSON.stringify(this.mutableSudoku));
    return;
  };

  putNumber = (i, j) => {
    // console.log("put ", i, j);
    let { sudoku } = this.state;
    if (sudoku[i][j] === 0) {
      for (let n = 1; n < BOARD_SIZE + 1; n++) {
        // console.log("try ", n);
        if (this.possible(i, j, n)) {
          //   console.log(n);
          sudoku[i][j] = n;
          this.setState({ sudoku });
          return;
        }
      }
    }
  };
  reset = () => {
    clearInterval(this.paintInterval);
    this.paintIndex = 0;
    this.setState({ sudoku: JSON.parse(JSON.stringify(this.mutableSudoku)), solving: false });
  };

  render() {
    let { sudoku } = this.state;
    return (
      <div>
        <div className="row buttons">
          <button className="solve" onClick={this.solve}>
            SOLVE
          </button>
          <button className="reset" onClick={this.reset}>
            RESET
          </button>
        </div>

        <div className="board">
          {sudoku.map((row, index) => {
            return (
              <div key={`row${index}`}>
                {!!index && index % 3 === 0 && <div className="divider horizontal" />}

                <div className="row">
                  {row.map((cell, i) => {
                    return (
                      <React.Fragment key={`cell${i}`}>
                        {!!i && i % 3 === 0 && <div className="divider vertical" />}

                        <div onClick={() => this.putNumber(index, i)}>
                          <Block number={cell} />
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
