import * as wh1t from 'axios'
import * as wh2t from 'lodash'
import * as wh3t from 'moment'
import * as wh4t from 'react'
import * as wh5t from 'react-dom'
import * as wh6t from 'uuid'
import * as what from './important'

console.log(
  `{${Object.keys({
    ...wh1t,
    ...wh2t,
    ...wh3t,
    ...what,
    ...wh4t,
    ...wh5t,
    ...wh6t
  }).join('}{')}}`.length
)
