﻿import {useSignal} from '@preact/signals'
import * as React from 'preact/compat'
import {useEffect} from 'preact/compat'
import {RawNumberInput, RawTextInput} from '../core'
import {InputProps as InputP} from "@baizey/styled-preact";

type InputStyleProps = {
    borderHoverColor?: string;
    align?: 'left' | 'center' | 'right';
    placeholder?: string;
    placeholderColor?: string;
}

export type InputProps<T> = InputP & InputStyleProps & {
    onEnter?: (value: T) => void
    onChange?: (value: T) => void
    value?: T
};

export const ReadonlyInput = ({value, onClick, onMouseOver, align, onChange, onEnter, ...props}: InputProps<string>) =>
    <RawTextInput  {...props}
                   value={value}
                   onClick={onClick}
                   onMouseOver={onMouseOver}
                   align={align}
                   readOnly/>

export const NumberInput = ({
                                onEnter = () => {
                                },
                                onChange = () => {
                                },
                                value = 0,
                                ...props
                            }: InputProps<number>) => {
    const currentValue = useSignal<number>(value)
    useEffect(() => {
        currentValue.value = value
    }, [value])

    return <RawNumberInput {...props}
                           value={currentValue.value}
                           onInput={e => {
                               currentValue.value = Number(e.target.value)
                               onChange(currentValue.value)
                           }}
                           onKeyUp={p => p.key === 'Enter' && onEnter(currentValue.value)}
    />
}

export const TextInput = ({
                              onEnter = () => {
                              },
                              onChange = () => {
                              },
                              value = '',
                              ...props
                          }: InputProps<string>) => {
    const currentValue = useSignal(value)
    useEffect(() => {
        currentValue.value = value
    }, [value])

    return <RawTextInput {...props}
                         value={currentValue.value}
                         onInput={e => {
                             currentValue.value = String(e.target.value)
                             onChange(e)
                         }}
                         onKeyUp={p => p.key === 'Enter' && onEnter(currentValue.value)}
    />
}