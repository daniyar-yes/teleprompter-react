import React, { useState } from 'react'

const Teleprompter = () => {
  
  const INITIAL_TEXT = `React is a JavaScript-based UI development library. Facebook and an open-source developer community run it. Although React is a library rather than a language, it is widely used in web development. 
  React offers various extensions for entire application architectural support, such as Flux and React Native, beyond mere UI.
  `
 
  const [ textInput, setTextInput] = useState(INITIAL_TEXT)

  function handleInput(e) {
    setTextInput(e.target.value)
  }
  

  const handleStart = () => {
    let el = document.getElementById('focus');
    el.className = el.className === 'focusStatic' ? `focusMoving` : 'focusStatic';
  }

  const handleStop = () => {
    let el = document.getElementById('focus')
    el.className = el.className === `focusMoving` ? 'focusStatic' : 'focusStatic'
  }
  
  return (
    <>
    <div className="container">
      <div id="focus" className="focusStatic"></div>
      <textarea className="textStatic"
        id='text'
        value={textInput}
        onChange={handleInput}>Text</textarea>
    </div>
            <button onClick={handleStart}>
             Auto Scroll
            </button>
            <button onClick={handleStop}>
              Stop
            </button>
    </>
  )
}

export default Teleprompter
