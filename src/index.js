import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Square from './Square';

class Board extends React.Component {
  renderSquare(i) {
    let sqClass
    if( this.props.winSteps)
    {
      var winStep = this.props.winSteps.some( t=> t===i );
      sqClass = winStep ? 'winsquare':'square';
      console.log( sqClass );
    }
    else
    {
      sqClass = 'square';
    }
    return <Square
            key={i}
            className={sqClass}
            value={this.props.squares[i]}
            onClick={()=> this.props.onClick(i)}
           />;
  }

  render() {
    return (
      <div>
        {
          [1,2,3].map( (r)=>
          {
            //console.log( "row" + r );
            return( 
                  <div key={r} className="board-row">
                    {
                      [1,2,3].map( (c) =>
                        {
                          const squareKey = (r-1)*3 + (c-1);
                          //console.log( 'squareKey:' + squareKey );
                          return this.renderSquare( squareKey);   
                        } )
                    }
                  </div> )
          } )
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) 
  {    
      super(props);    
      this.state = 
      { 
        history: [{
                    squares: Array(9).fill(null),
                    locate:'' 
                  }], 
        stepNumber:0,     
        xIsNext: true,
        asc:true  
      };
  }

  render() {
    //console.log('-------game render-----')
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner( current.squares );
    const moves = history.map( (_step, index )=>
    {
      const desc = index ? 'Go to move #' + index + ', location: ' + _step.locate : 'Go to game start';
      const liClass = index === this.state.stepNumber ? 'hllist' : '';
      return (
        <li key={index} className={liClass}>
          <button className={liClass} onClick={()=>this.jumpTo(index)}>{desc}</button>
        </li>
      );
    });
    let status
    let winSteps
    if( winner )
    {
      status = "Winner is:" + winner;
      winSteps = calculateWinnerLine( current.squares );
    }
    else
    {
      var done = current.squares.every( t => t );
      status = done ? 'No one Win!' : 'Next player:' + ( this.state.xIsNext ? 'X' : 'O');
    }
      
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
                 winSteps={winSteps}
                 onClick={ (i) => this.handleClick(i) } />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>this.sort() } >{this.state.asc ? "sort(asc)" : "sort(des)"}</button>
          <ol>{ this.state.asc ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }

  handleClick(i)
  {
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if( calculateWinner(squares) || squares[i] )
      return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({history:history.concat([{
                                            squares:squares,
                                            locate: '(' + (i%3 + 1) + ',' + ( parseInt(i/3)+ 1 ) + ')'
                                          }]),
                  stepNumber:history.length,
                  xIsNext:!this.state.xIsNext});
  }

  jumpTo( step )
  {
    this.setState
    ( 
      {
        stepNumber : step,
        xIsNext : (step % 2) === 0
      }
     )
  }

  sort()
  {
    this.setState(
      {
        asc : !this.state.asc
      }
    );
  }
}

// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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

function calculateWinnerLine(squares) {
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
      return lines[i];
    }
  }
  return null;
}
