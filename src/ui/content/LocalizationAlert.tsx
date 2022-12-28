import * as React from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useProvider } from '../../di'
import { HeaderText, Pixel, PrimaryButton, Radiobox, Space, Text, ThemeHolder } from '../atoms'
import { Div } from '../atoms/Styled'
import { AlertSection } from './AlertSection'

type Props = { setDismissed: () => void };

export function LocalizationAlert( props: Props ) {
	const [ useDetected, setUseDetected ] = useState( true )
	const {
		activeLocalization,
		tabState,
	} = useProvider()

	useEffect( () => {
		activeLocalization.reset( !useDetected )
	}, [ useDetected ] )

	const kroneConflict = activeLocalization.krone.hasConflict()
	const dollarConflict = activeLocalization.dollar.hasConflict()
	const yenConflict = activeLocalization.yen.hasConflict()

	async function updateLocalization( useDetected: boolean ) {
		setUseDetected( useDetected )
		if ( useDetected ) {
			await activeLocalization.overloadWithDetected()
		} else {
			await activeLocalization.overloadWithDefaults()
		}
		await activeLocalization.save()
		await tabState.updateDisplay()
	}

	return (
		<AlertSection onDismiss={ props.setDismissed } title="Localization alert">
			<OptionWrapper height={ 120 }>
				<Option>
					<Header>Use detected</Header>
					{ kroneConflict ? (
						<Currency>{ activeLocalization.krone.detectedValue }</Currency>
					) : (
						<></>
					) }
					{ dollarConflict ? (
						<Currency>{ activeLocalization.dollar.detectedValue }</Currency>
					) : (
						<></>
					) }
					{ yenConflict ? (
						<Currency>{ activeLocalization.yen.detectedValue }</Currency>
					) : (
						<></>
					) }
					<Space height={ Pixel.of( 5 ) }/>
					<Radiobox
						value={ useDetected }
						onChange={ () => {} }
						onClick={ () => updateLocalization( true ) }
					/>
				</Option>
				<Option>
					<Header>Use your defaults</Header>
					{ kroneConflict ? (
						<Currency>{ activeLocalization.krone.defaultValue }</Currency>
					) : (
						<></>
					) }
					{ dollarConflict ? (
						<Currency>{ activeLocalization.dollar.defaultValue }</Currency>
					) : (
						<></>
					) }
					{ yenConflict ? (
						<Currency>{ activeLocalization.yen.defaultValue }</Currency>
					) : (
						<></>
					) }
					<Space height={ Pixel.of( 5 ) }/>
					<Radiobox
						value={ !useDetected }
						onChange={ () => {} }
						onClick={ () => updateLocalization( false ) }/>
				</Option>
			</OptionWrapper>
			<PrimaryButton
				onClick={ async () => {
					await activeLocalization.setLocked( true )
					props.setDismissed()
				} }
			>
				Save as site default and dont ask again
			</PrimaryButton>
		</AlertSection>
	)
}

const Header = styled( HeaderText )<ThemeHolder>``

const Currency = styled( Text )<ThemeHolder>``

type OptionWrapperType = { height: number };
const OptionWrapper = styled( Div )<OptionWrapperType>`
  width: 100%;
  height: ${ ( props ) => `${ props.height }px` };
  display: flex;
  flex-direction: row;
`

const Option = styled( Div )`
  width: 50%;
`
