import { MockStrategy, ProviderMock, ServiceCollection, Services } from '@baizey/dependency-injection'
import { _Providable, Providable } from '../provideable'


export type Mockable = MockStrategy | ProviderMock<Providable>

let _services: ServiceCollection<Providable> | undefined
let _proxy: Providable | undefined

export const useServices = (): ServiceCollection<Providable> =>
	_services ?? ( _services = Services().add( _Providable ) )

export const setMockProvider = ( mock?: Mockable, defaultStrategy?: MockStrategy ): Providable =>
	_proxy = useServices().buildMock( mock, defaultStrategy ).proxy

export const useProvider = (): Providable => _proxy ?? ( _proxy = useServices().build().proxy )

export const handleError = ( error: Error, message?: string ): void => useProvider().logger.error( error, message )