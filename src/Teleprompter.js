import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import stringSimilarity from 'string-similarity'

const StyledTeleprompter = styled.div`
  font-size: 4vw;
  width: 100%;
  height: 20vw;
  overflow: hidden;
  scroll-behavior: smooth;
  display: block;
  margin-bottom: 1rem;
  background: transparent no-repeat;
  background-image: radial-gradient(
      farthest-side at 50% 0,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0)
    ),
    radial-gradient(
      farthest-side at 50% 100%,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0)
    );
  background-position: 0 0, 0 100%;
  background-size: 100% 14px;
`

const Interim = styled.div`
  background: rgb(0, 0, 0, 0.25);
  color: white;
  flex: 0 0 auto;
  padding: 0.5rem;
  border-radius: 1rem;
  display: inline-block;
`

const FocusZone = styled.div`
  height: 5vw;
  position: fixed;
  width: 110%;
  border: 3px solid #73AD21;
  background-color: black;
  opacity: 25%;
  margin-left: -5vw;
  margin-top: -0.1vw;
  `

const cleanWord = word =>
  word
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z]\(\)\[\]\*\+/gi, '')

export default function Teleprompter({
    words,
    progress,
    listening,
    onChange
    }) {
  const recog = useRef(null)
  const scrollRef = useRef(null)
  const [results, setResults] = useState('')

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition
    recog.current = new SpeechRecognition()
    recog.current.continuous = true
    recog.current.interimResults = true
  }, [])

  

  useEffect(() => {
    if (listening) {
      recog.current.start()
    } else {
      recog.current.stop()
    }
  }, [listening])

  useEffect(() => {
    const handleResult = ({
      results
    }) => {
      const interim = Array.from(
        results
      )
        .filter(r => !r.isFinal)
        .map(r => r[0].transcript)
        .join(' ')
      setResults(interim)

      const newIndex = interim
        .split(' ')
        .reduce((memo, word) => {
          if (
            memo >= words.length
          ) {
            return memo
          }
          const similarity = stringSimilarity.compareTwoStrings(
            cleanWord(word),
            cleanWord(words[memo])
          )
          memo +=
            similarity > 0.4
              ? 1
              : 0
          return memo
        }, progress)
      if (
        newIndex > progress &&
        newIndex <= words.length
      ) {
        onChange(newIndex)
      }
    }
    recog.current.addEventListener(
      'result',
      handleResult
    )
    return () => {
      recog.current.removeEventListener(
        'result',
        handleResult
      )
    }
  }, [onChange, progress, words])

  useEffect(() => {
    scrollRef.current
      .querySelector(
        `[data-index='${
          progress + 3
        }']`
      )
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      })
 }, [progress])

  const handleOnWheel = (e) => {
    let newMouseIndex = 0
    let mouseIndexDelta = e.deltaY * 0.01
    newMouseIndex = 
      mouseIndexDelta > 0
      ? progress + 1
      : progress - 1
    if (newMouseIndex <= words.length && newMouseIndex >= 0)
      onChange(newMouseIndex)
    console.log(e.deltaY, mouseIndexDelta)
  }

  const enableScroll = () => {
    document.removeEventListener('wheel', preventDefault, false)
  }

  const disableScroll = () => {
    document.addEventListener('wheel', preventDefault, {
        passive: false,
    })
  }

  const preventDefault = (e) => {
    e = e || window.event
    if (e.preventDefault) {
        e.preventDefault()
    }
    e.returnValue = false
  }

  return (
    <>
      
      <StyledTeleprompter
        ref={scrollRef}
        onWheel={handleOnWheel}
        onMouseEnter={disableScroll}
        onMouseLeave={enableScroll}
      >
        
      {words.map((word, i) => (
          <span
            key={`${word}:${i}`}
            data-index={i}
            style={{
              color:
                i < progress
                  ? '#fff'
                  : '#000',
            }}
          >
            {word}{' '}
          </span>
        ))}
        
      </StyledTeleprompter>
      
      {results && (
        <Interim>
          {results}
        </Interim>
      )}
    </>
  )
}