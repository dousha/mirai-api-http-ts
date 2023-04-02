export class NetworkError extends Error {
	constructor(private where: string, private why?: string) {
		super();
	}

	toString(): string {
		return `Unable to connect to ${this.where}: ${this.why || '(no information provided)'}`;
	}
}

export class InvalidDataError extends Error {
	constructor(private what: string) {
		super();
	}

	toString(): string {
		return `Invalid data: ${this.what || '(no information provided)'}`;
	}
}
