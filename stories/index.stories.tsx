import React from 'react'
import {storiesOf} from '@storybook/react'
import styled from '@emotion/styled'

import {useRemainingTime} from '../src/time-slot/use-remaining-time'
import {getNextSlot} from '../src/time-slot/get-next-slot'
import {Card} from '../src/ui/Card'

const LargeText = styled.div`
  color: #333;
  font-family: 'FuraCode Nerd Font', 'Sukhumvit Set', sans-serif;
  font-size: 4em;
  padding: 0.5em;
`

const RemainingTimeDisplay = () => {
  const d = new Date()
  const ns = getNextSlot(d.getHours() + ':' + d.getMinutes())
  const remainingTime = useRemainingTime(ns)

  return <LargeText>{remainingTime}</LargeText>
}

storiesOf('Get Remaining Time', module)
  .add('Countdown Clock', () => <RemainingTimeDisplay />, {
    info: {inline: true},
  })
  .add('Countdown Card', () => (
    <Card style={{margin: '3em'}}>
      <RemainingTimeDisplay />
    </Card>
  ))
