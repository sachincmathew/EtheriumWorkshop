import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { take, tap } from 'rxjs/operators';

export interface Rates {
	[propName: string]: number
}

export interface Ethereum {
	algorithm: string;
	headers: string;
	keyId: string;
	signature: string;
	timestamp: number;
	data: Rates;
}

@Injectable({
	providedIn: 'root'
})
export class EthereumService {

	private cachedResult: Ethereum;

	constructor(private http: HttpClient) { }

	getSGDRate(refresh = false): Promise<Ethereum> {
		return (this.getRate('SGD'));
	}

	getRate(sym: string, refresh = false): Promise<Ethereum> {
		if (!refresh && this.cachedResult)
			return (Promise.resolve(this.cachedResult));

		return (
			this.http.get<Ethereum>(`/api/v1/ethereum/${sym}`)
				.pipe(
					take(1),
					tap(v => { this.cachedResult = v; })
				)
				.toPromise()
		);
	}
}
