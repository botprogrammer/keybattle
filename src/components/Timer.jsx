import React from 'react'

const Timer = (props) => {
  return (
    <div className='timer'>
    {props.status === 'enable' && (
      <span className='timerText'>Time left</span>)}
    {(props.status === 'enable' || props.status === 'start') && (
      <>
        <span className='timerCount'>{props.timer}</span>

        <span className='timerText'>seconds</span>
      </>)}
    {props.status === 'disable' && (
      <>
        <span className='Oops'>Oops, Time Up</span>

        <span className='timerText'>Check your results, and hit retry</span>
      </>)}
  </div>
  )
}

export default Timer// edit 25416
// edit 15491
// edit 16726
// edit 25642
// edit 29583
// edit 8417
// edit 10882
// edit 273
// edit 30080
// edit 29838
// edit 31187
// edit 7070
