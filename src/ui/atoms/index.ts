import { EffectCallback, useEffect } from 'react'

export * from './utils'
export * from './Text'
export * from './Button'
export * from './Radiobox'
export * from './Checkbox'
export * from './input'
export * from './Shortcut'
export * from '../molecules/Dropdown'
export * from './contexts'
export * from './Icons'

export function useEffectOnce( effect: EffectCallback ) {
	useEffect( effect, [] )
}

export function useEffectAlways( effect: EffectCallback ) {
	useEffect( effect )
}